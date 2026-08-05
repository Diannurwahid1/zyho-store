import { addStock } from '@/lib/stock'
import type { PayloadRequest } from 'payload'

type RedeemInput = {
  code: string
  req: PayloadRequest
  user: Record<string, any>
}

const normalizeRedeemCode = (value: string) => value.trim().toUpperCase()

const toNumericID = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value.trim())
  return null
}

const normalizeRelationID = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const relationID = (value as { id?: number | string }).id
    if (typeof relationID === 'number' || typeof relationID === 'string') {
      return relationID
    }
  }

  return null
}

const hashRedeemCode = async (value: string) => {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(value).digest('hex')
}

const buildSnapshotUnit = (unit: Record<string, any>) => ({
  accountEmail: unit.accountEmail || undefined,
  accountPassword: unit.accountPassword || undefined,
  accountUsername: unit.accountUsername || undefined,
  content: unit.content || undefined,
  deliveryType: unit.deliveryType || 'credentials',
  file: unit.file || undefined,
  label: unit.label || undefined,
  loginUrl: unit.loginUrl || undefined,
  referenceCode: unit.referenceCode || undefined,
  unitCode: unit.unitCode || undefined,
})

const resolveVariantDoc = async (req: PayloadRequest, variantId: string | null) => {
  const numericVariantID = toNumericID(variantId)
  if (!numericVariantID) return null

  try {
    return await req.payload.findByID({
      collection: 'variants' as any,
      depth: 0,
      id: numericVariantID,
      overrideAccess: true,
      req,
    })
  } catch {
    return null
  }
}

export const redeemDigitalStockUnit = async ({ code, req, user }: RedeemInput) => {
  const normalizedCode = normalizeRedeemCode(code)
  if (!normalizedCode) {
    throw new Error('Kode redeem wajib diisi.')
  }

  const userID = normalizeRelationID(user)
  if (!userID) {
    throw new Error('User redeem tidak valid.')
  }

  const lookup = await hashRedeemCode(normalizedCode)

  const matchedUnits = await req.payload.find({
    collection: 'digital-stock-units',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      redeemCodeLookup: {
        equals: lookup,
      },
    } as any,
  })

  const unit = matchedUnits.docs[0] as Record<string, any> | undefined
  if (!unit) {
    throw new Error('Kode redeem tidak ditemukan.')
  }

  if (!unit.redeemEnabled) {
    throw new Error('Kode redeem ini sedang tidak aktif.')
  }

  if (unit.redeemedAt || unit.redeemedBy || unit.redeemOrder) {
    throw new Error('Kode redeem ini sudah pernah digunakan.')
  }

  if (unit.status !== 'available') {
    throw new Error('Unit redeem ini sudah tidak tersedia.')
  }

  const productID = normalizeRelationID(unit.product)
  if (!productID) {
    throw new Error('Produk pada redeem ini tidak valid.')
  }

  const product = (typeof unit.product === 'object' && unit.product
    ? unit.product
    : await req.payload.findByID({
        collection: 'products',
        depth: 0,
        id: productID,
        overrideAccess: true,
        req,
      })) as Record<string, any>

  const variantDoc = await resolveVariantDoc(
    req,
    typeof unit.variant === 'string' ? unit.variant : null,
  )
  const variantID = variantDoc ? normalizeRelationID(variantDoc) : null
  const paymentReference = `REDEEM-${Date.now()}-${unit.id}`
  const phone =
    typeof user.phone === 'string' && user.phone.trim().length > 0 ? user.phone.trim() : undefined

  let createdOrder: Record<string, any> | null = null
  let inventoryReduced = false
  let unitAssigned = false

  try {
    createdOrder = (await req.payload.create({
      collection: 'orders',
      data: {
        accessToken: crypto.randomUUID(),
        amount: 0,
        currency: 'IDR',
        customer: userID,
        customerEmail: String(user.email || '').toLowerCase(),
        items: [
          {
            product: product.id,
            quantity: 1,
            ...(variantID ? { variant: variantID } : {}),
          },
        ],
        memberTierSnapshot: user.memberTier || 'bronze',
        orderChannel: 'gift_redeem',
        paymentReference,
        pointsEarned: 0,
        shippingAddress: phone ? { phone } : undefined,
        status: 'completed',
        subtotalBeforeDiscount: 0,
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>

    const updatedUnit = (await req.payload.update({
      collection: 'digital-stock-units',
      id: unit.id,
      data: {
        assignedAt: new Date().toISOString(),
        customer: userID,
        order: createdOrder.id,
        redeemCode: null,
        redeemCodeLookup: null,
        redeemEnabled: false,
        redeemOrder: createdOrder.id,
        redeemedAt: new Date().toISOString(),
        redeemedBy: userID,
        reservationId: `gift-redeem:${createdOrder.id}`,
        status: 'assigned',
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>
    unitAssigned = true

    await req.payload.update({
      collection: 'orders',
      id: createdOrder.id,
      data: {
        digitalDeliveries: [
          {
            product: product.id,
            productTitle: product.title,
            quantity: 1,
            units: [buildSnapshotUnit(updatedUnit)],
            variant: variantDoc ? String(variantDoc.id) : undefined,
            variantTitle: variantDoc?.title || undefined,
          },
        ],
      } as any,
      overrideAccess: true,
      req,
    })

    const stockResult = await addStock(req.payload, {
      notes: `Gift redeem dari kode ${normalizedCode}`,
      performedById: userID,
      productId: product.id,
      quantity: -1,
      referenceId: paymentReference,
      type: 'out',
      variantId: variantDoc ? String(variantDoc.id) : null,
    })

    if (!stockResult.success) {
      throw new Error(stockResult.error || 'Gagal mengurangi stok produk redeem.')
    }
    inventoryReduced = true

    return {
      orderId: createdOrder.id,
      productTitle: product.title || 'Produk redeem',
      unitCode: updatedUnit.unitCode || String(updatedUnit.id),
    }
  } catch (error) {
    if (inventoryReduced) {
      await addStock(req.payload, {
        notes: `Rollback gift redeem ${paymentReference}`,
        performedById: userID,
        productId: product.id,
        quantity: 1,
        referenceId: `rollback:${paymentReference}`,
        type: 'adjust',
        variantId: variantDoc ? String(variantDoc.id) : null,
      }).catch(() => null)
    }

    if (unitAssigned) {
      await req.payload.update({
        collection: 'digital-stock-units',
        id: unit.id,
        data: {
          assignedAt: null,
          customer: null,
          order: null,
          redeemCode: unit.redeemCode || null,
          redeemCodeLookup: unit.redeemCodeLookup || null,
          redeemEnabled: true,
          redeemOrder: null,
          redeemedAt: null,
          redeemedBy: null,
          reservationId: null,
          status: 'available',
        } as any,
        overrideAccess: true,
        req,
      }).catch(() => null)
    }

    if (createdOrder?.id) {
      await req.payload.delete({
        collection: 'orders',
        id: createdOrder.id,
        overrideAccess: true,
        req,
      }).catch(() => null)
    }

    throw error
  }
}
