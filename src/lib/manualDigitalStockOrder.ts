import { addStock } from '@/lib/stock'
import type { PayloadRequest } from 'payload'

type ManualOrderInput = {
  digitalStockUnitId: number | string
  email: string
  phone: string
}

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

const normalizeEmail = (value: string) => value.trim().toLowerCase()
const normalizePhone = (value: string) => value.trim()

const getUserDisplayName = (email: string) => email.split('@')[0] || email

const buildManualSnapshotUnit = (unit: Record<string, any>) => ({
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

const resolveManualOrderPrice = ({
  product,
  variant,
}: {
  product: Record<string, any>
  variant: Record<string, any> | null
}) => {
  const idrPrice = typeof variant?.priceInIDR === 'number' ? variant.priceInIDR : product.priceInIDR
  if (typeof idrPrice === 'number' && idrPrice > 0) {
    return { amount: idrPrice, currency: 'IDR' as const, paymentMethod: 'pakasir' as const }
  }

  const usdPrice = typeof variant?.priceInUSD === 'number' ? variant.priceInUSD : product.priceInUSD
  if (typeof usdPrice === 'number' && usdPrice > 0) {
    return { amount: usdPrice, currency: 'USD' as const, paymentMethod: 'nowpayments' as const }
  }

  throw new Error('Produk ini belum punya harga yang valid untuk dibuat order manual.')
}

const findOrCreateManualOrderUser = async ({
  email,
  phone,
  req,
}: {
  email: string
  phone: string
  req: PayloadRequest
}) => {
  const existingUsers = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      email: {
        equals: email,
      },
    },
  })

  const existingUser = existingUsers.docs[0] as any
  if (existingUser) {
    const currentPhone = typeof existingUser.phone === 'string' ? existingUser.phone.trim() : ''
    if (phone && currentPhone !== phone) {
      return req.payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          phone,
        } as any,
        overrideAccess: true,
        req,
      })
    }

    return existingUser
  }

  return req.payload.create({
    collection: 'users',
    context: {
      skipSignupVoucherCampaign: true,
    },
    data: {
      email,
      name: getUserDisplayName(email),
      password: `Manual-${crypto.randomUUID()}`,
      phone,
      roles: ['customer'],
      status: 'active',
    } as any,
    overrideAccess: true,
    req,
  })
}

const assignSpecificDigitalStockUnitToOrder = async ({
  customerID,
  order,
  product,
  req,
  unit,
  variantDoc,
}: {
  customerID: number | string | null
  order: Record<string, any>
  product: Record<string, any>
  req: PayloadRequest
  unit: Record<string, any>
  variantDoc: Record<string, any> | null
}) => {
  if (unit.status !== 'available') {
    throw new Error('Digital stock unit ini sudah tidak available.')
  }

  const updatedUnit = await req.payload.update({
    collection: 'digital-stock-units',
    id: unit.id,
    data: {
      assignedAt: new Date().toISOString(),
      customer: customerID || undefined,
      order: order.id,
      reservationId: `manual-order:${order.id}`,
      status: 'assigned',
    } as any,
    overrideAccess: true,
    req,
  })

  await req.payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      digitalDeliveries: [
        {
          product: product.id,
          productTitle: product.title,
          quantity: 1,
          units: [buildManualSnapshotUnit(updatedUnit as Record<string, any>)],
          variant: variantDoc ? String(variantDoc.id) : undefined,
          variantTitle: variantDoc?.title || undefined,
        },
      ],
    } as any,
    overrideAccess: true,
    req,
  })
}

export const createManualOrderFromDigitalStockUnit = async ({
  digitalStockUnitId,
  email,
  phone,
  req,
}: ManualOrderInput & { req: PayloadRequest }) => {
  const normalizedEmail = normalizeEmail(email)
  const normalizedPhone = normalizePhone(phone)

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Email customer tidak valid.')
  }

  if (!normalizedPhone || normalizedPhone.length < 8) {
    throw new Error('Nomor HP customer tidak valid.')
  }

  const unitID = toNumericID(digitalStockUnitId)
  if (!unitID) {
    throw new Error('Digital stock unit tidak valid.')
  }

  const unit = (await req.payload.findByID({
    collection: 'digital-stock-units',
    depth: 1,
    id: unitID,
    overrideAccess: true,
    req,
  })) as Record<string, any>

  if (!unit) {
    throw new Error('Digital stock unit tidak ditemukan.')
  }

  if (unit.status !== 'available') {
    throw new Error('Digital stock unit ini sudah bukan status available.')
  }

  const productID = normalizeRelationID(unit.product)
  if (!productID) {
    throw new Error('Produk pada digital stock unit tidak valid.')
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
  const { amount, currency, paymentMethod } = resolveManualOrderPrice({
    product,
    variant: variantDoc,
  })

  const customer = (await findOrCreateManualOrderUser({
    email: normalizedEmail,
    phone: normalizedPhone,
    req,
  })) as Record<string, any>

  const customerID = normalizeRelationID(customer)
  const variantID = variantDoc ? normalizeRelationID(variantDoc) : null
  const paymentReference = `MANUAL-${Date.now()}-${unit.id}`

  let createdOrder: Record<string, any> | null = null
  let createdTransaction: Record<string, any> | null = null
  let createdPaymentTransaction: Record<string, any> | null = null
  let unitAssigned = false
  let inventoryReduced = false

  try {
    createdOrder = (await req.payload.create({
      collection: 'orders',
      data: {
        accessToken: crypto.randomUUID(),
        amount,
        currency,
        customer: customerID,
        customerEmail: normalizedEmail,
        items: [
          {
            product: product.id,
            quantity: 1,
            ...(variantID ? { variant: variantID } : {}),
          },
        ],
        memberTierSnapshot: customer.memberTier || 'bronze',
        paymentReference,
        pointsEarned: currency === 'IDR' ? Math.max(1, Math.floor(amount / 1000)) : Math.max(1, Math.floor(amount / 100) * 10),
        shippingAddress: {
          phone: normalizedPhone,
        },
        status: 'completed',
        subtotalBeforeDiscount: amount,
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>

    await assignSpecificDigitalStockUnitToOrder({
      customerID,
      order: createdOrder,
      product,
      req,
      unit,
      variantDoc,
    })
    unitAssigned = true

    const stockResult = await addStock(req.payload, {
      notes: `Manual order dari digital stock unit ${unit.unitCode || unit.id}`,
      performedById: req.user?.id || null,
      productId: product.id,
      quantity: -1,
      referenceId: paymentReference,
      type: 'out',
      variantId: variantDoc ? String(variantDoc.id) : null,
    })

    if (!stockResult.success) {
      throw new Error(stockResult.error || 'Gagal mengurangi stok produk.')
    }
    inventoryReduced = true

    createdPaymentTransaction = (await req.payload.create({
      collection: 'payment-transactions',
      context: {
        skipPaymentTransactionNotifications: true,
      },
      data: {
        amount,
        currency,
        customer: customerID,
        order: createdOrder.id,
        provider: 'manual',
        providerTransactionId: paymentReference,
        rawPayload: {
          digitalStockUnitId: unit.id,
          source: 'digital-stock-unit-manual-order',
        },
        status: 'settlement',
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>

    createdTransaction = (await req.payload.create({
      collection: 'transactions',
      data: {
        amount,
        billingAddress: {
          phone: normalizedPhone,
        },
        currency,
        customer: customerID,
        customerEmail: normalizedEmail,
        items: [
          {
            product: product.id,
            quantity: 1,
            ...(variantID ? { variant: variantID } : {}),
          },
        ],
        order: createdOrder.id,
        paymentMethod,
        status: 'succeeded',
        ...(paymentMethod === 'pakasir'
          ? {
              pakasir: {
                pakasirOrderID: paymentReference,
              },
            }
          : {
              nowpayments: {
                nowpaymentsPaymentID: paymentReference,
                payCurrency: currency,
              },
            }),
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>

    await req.payload.update({
      collection: 'orders',
      id: createdOrder.id,
      data: {
        transactions: [createdTransaction.id],
      } as any,
      overrideAccess: true,
      req,
    })

    return {
      amount,
      currency,
      customerEmail: normalizedEmail,
      orderId: createdOrder.id,
      paymentReference,
      transactionId: createdTransaction.id,
      unitCode: unit.unitCode || String(unit.id),
      userId: customerID,
    }
  } catch (error) {
    if (inventoryReduced) {
      await addStock(req.payload, {
        notes: `Rollback manual order ${paymentReference}`,
        performedById: req.user?.id || null,
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
          reservationId: null,
          status: 'available',
        } as any,
        overrideAccess: true,
        req,
      }).catch(() => null)
    }

    if (createdTransaction?.id) {
      await req.payload.delete({
        collection: 'transactions',
        id: createdTransaction.id,
        overrideAccess: true,
        req,
      }).catch(() => null)
    }

    if (createdPaymentTransaction?.id) {
      await req.payload.delete({
        collection: 'payment-transactions',
        id: createdPaymentTransaction.id,
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
