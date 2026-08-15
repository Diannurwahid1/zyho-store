import type { Media, Order, Product, User } from '@/payload-types'
import type { BasePayload, PayloadRequest } from 'payload'
import { expandBundleCartItems } from '@/lib/bundles'

type DigitalStockInput = {
  accountEmail?: string
  accountPassword?: string
  accountUsername?: string
  content?: string
  deliveryType?: 'credentials' | 'file' | 'text'
  fileId?: number | string | null
  label?: string
  loginUrl?: string
  notes?: string
  referenceCode?: string
}

const toNumericID = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return Number(value)
  }
  return value
}

const normalizeRelationID = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const relationID = (value as { id?: string | number }).id
    if (typeof relationID === 'number' || typeof relationID === 'string') {
      return relationID
    }
  }

  return null
}

const isPerUnitDigitalStockProduct = (product: unknown) =>
  Boolean(
    product &&
    typeof product === 'object' &&
    'digitalFulfillmentMode' in product &&
    (product as { digitalFulfillmentMode?: string | null }).digitalFulfillmentMode ===
      'per_unit_stock',
  )

const buildDigitalUnitSnapshot = (unit: Record<string, any>) => ({
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

export const createDigitalStockUnits = async ({
  entries,
  payload,
  productId,
  variantId,
}: {
  entries: DigitalStockInput[]
  payload: BasePayload
  productId: number | string
  variantId?: string | null
}) => {
  const created = []

  for (const entry of entries) {
    const deliveryType = entry.deliveryType || 'credentials'

    const createdUnit = await payload.create({
      collection: 'digital-stock-units',
      data: {
        accountEmail: entry.accountEmail?.trim() || undefined,
        accountPassword: entry.accountPassword?.trim() || undefined,
        accountUsername: entry.accountUsername?.trim() || undefined,
        content: entry.content?.trim() || undefined,
        deliveryType,
        file: toNumericID(entry.fileId) || undefined,
        label: entry.label?.trim() || undefined,
        loginUrl: entry.loginUrl?.trim() || undefined,
        notes: entry.notes?.trim() || undefined,
        product: toNumericID(productId) as any,
        referenceCode: entry.referenceCode?.trim() || undefined,
        status: 'available',
        variant: variantId || undefined,
      } as any,
      overrideAccess: true,
    })

    created.push(createdUnit)
  }

  return created
}

const isStandardDigitalProduct = (product: unknown) =>
  Boolean(
    product &&
    typeof product === 'object' &&
    'productType' in product &&
    (product as { productType?: string | null }).productType &&
    (!(product as { digitalFulfillmentMode?: string | null }).digitalFulfillmentMode ||
      (product as { digitalFulfillmentMode?: string | null }).digitalFulfillmentMode === 'standard'),
  )

export const assignDigitalStockToOrder = async ({
  cartItems,
  customer,
  order,
  req,
}: {
  cartItems: any[]
  customer?: number | string | User | null
  order: Order | Record<string, any>
  req: PayloadRequest
}) => {
  const orderID = normalizeRelationID(order)
  if (!orderID) {
    throw new Error('Order ID tidak ditemukan untuk assignment stok digital.')
  }

  const customerID = normalizeRelationID(customer) || normalizeRelationID((order as Order).customer)
  const deliveries: Record<string, any>[] = []
  const expandedCartItems = expandBundleCartItems(cartItems)

  for (const item of expandedCartItems) {
    const product = item.product as Product | number | string | null | undefined
    const productID = normalizeRelationID(product)
    if (!productID) continue

    const variantID = normalizeRelationID(item.variant)
    const quantity = Math.max(0, Number(item.quantity || 0))
    if (!quantity) continue

    // === Mode 1: Per-unit digital stock ===
    if (isPerUnitDigitalStockProduct(product)) {
      const availableUnits = await req.payload.find({
        collection: 'digital-stock-units',
        depth: 1,
        limit: quantity,
        overrideAccess: true,
        pagination: false,
        req,
        sort: 'createdAt',
        where: {
          and: [
            { product: { equals: productID } },
            variantID ? { variant: { equals: String(variantID) } } : { variant: { exists: false } },
            { status: { equals: 'available' } },
            {
              or: [
                { redeemEnabled: { exists: false } },
                { redeemEnabled: { equals: false } },
              ],
            },
          ],
        },
      })

      if (availableUnits.docs.length < quantity) {
        throw new Error(
          `Stok unit digital untuk produk "${typeof product === 'object' && product ? product.title : productID}" kurang dari quantity order.`,
        )
      }

      const assignedUnits = []

      for (const unit of availableUnits.docs as Record<string, any>[]) {
        const updatedUnit = await req.payload.update({
          collection: 'digital-stock-units',
          id: unit.id,
          data: {
            assignedAt: new Date().toISOString(),
            customer: customerID || undefined,
            order: orderID as any,
            reservationId: `order:${orderID}`,
            status: 'assigned',
          } as any,
          overrideAccess: true,
          req,
        })

        assignedUnits.push(buildDigitalUnitSnapshot(updatedUnit as Record<string, any>))
      }

      deliveries.push({
        product: productID,
        productTitle: typeof product === 'object' && product ? product.title : undefined,
        quantity,
        units: assignedUnits,
        variant: variantID || undefined,
        variantTitle:
          item.variant && typeof item.variant === 'object' && 'title' in item.variant
            ? item.variant.title
            : undefined,
      })

      continue
    }

    // === Mode 2: Standard digital delivery (DigitalAssets) ===
    if (isStandardDigitalProduct(product)) {
      const digitalAssets = await req.payload.find({
        collection: 'digital-assets',
        depth: 1,
        limit: 50,
        overrideAccess: true,
        pagination: false,
        req,
        where: {
          and: [
            { product: { equals: productID } },
            { status: { equals: 'active' } },
          ],
        },
      })

      if (digitalAssets.docs.length === 0) continue

      const units: Record<string, any>[] = []

      for (const asset of digitalAssets.docs as Record<string, any>[]) {
        // Buat download-access record untuk customer
        if (customerID) {
          try {
            await req.payload.create({
              collection: 'download-access',
              data: {
                customer: customerID,
                product: productID,
                order: orderID,
                asset: asset.id,
                status: 'active',
                maxDownloads: 10,
                downloadCount: 0,
              } as any,
              overrideAccess: true,
              req,
            })
          } catch (err) {
            req.payload.logger.warn(
              { err, assetId: asset.id },
              '[DigitalStock] Gagal buat download-access',
            )
          }
        }

        // Tambahkan ke units snapshot untuk ditampilkan di order page
        units.push({
          deliveryType: 'file',
          label: asset.fileName || 'Digital File',
          file: asset.file || undefined,
          referenceCode: asset.version ? `v${asset.version}` : undefined,
        })
      }

      if (units.length > 0) {
        deliveries.push({
          product: productID,
          productTitle: typeof product === 'object' && product ? product.title : undefined,
          quantity,
          units,
          variant: variantID || undefined,
          variantTitle:
            item.variant && typeof item.variant === 'object' && 'title' in item.variant
              ? item.variant.title
              : undefined,
        })
      }

      continue
    }
  }

  if (deliveries.length === 0) {
    return []
  }

  await req.payload.update({
    collection: 'orders',
    id: orderID,
    data: {
      digitalDeliveries: deliveries,
    } as any,
    overrideAccess: true,
    req,
  })

  return deliveries
}

export const getOrderDigitalDeliveryMedia = (deliveryUnit: Record<string, any>) => {
  const file = deliveryUnit.file as Media | number | string | null | undefined
  if (!file || typeof file !== 'object') return null
  return file
}
