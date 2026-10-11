/**
 * Stock management utilities.
 *
 * Alur stok:
 *  1. User mulai checkout → reserveStock() dipanggil → status = 'pending', expiresAt = now + 60 menit
 *  2. Cron setiap menit → releaseExpiredReservations() → release semua pending yang sudah expired
 *  3. Pembayaran berhasil → confirmStockReservation() → status = 'confirmed', inventory dikurangi
 *  4. Pembayaran dibatalkan / expired → releaseReservation() → status = 'released'
 *
 * Stok yang tampil ke user = inventory - jumlah reservasi pending yang belum expired
 *
 * Setiap perubahan stok dicatat ke StockLedger (kartu stok permanen).
 */

import type { BasePayload, PayloadRequest } from 'payload'
import { getNormalizedBundleItems, isBundleProduct } from '@/lib/bundles'

export const RESERVATION_TTL_MINUTES = 60

const isPerUnitDigitalStockProduct = (product: unknown) =>
  Boolean(
    product &&
      typeof product === 'object' &&
      'digitalFulfillmentMode' in product &&
      (product as { digitalFulfillmentMode?: string | null }).digitalFulfillmentMode ===
        'per_unit_stock',
  )

// ---------------------------------------------------------------------------
// Internal helper: tulis satu baris ke StockLedger
// ---------------------------------------------------------------------------
async function writeLedger(
  payload: BasePayload,
  opts: {
    productId: string | number
    variantId?: string | null
    type: 'in' | 'out' | 'reserved' | 'released' | 'adjust'
    qty: number
    stockBefore: number
    stockAfter: number
    referenceId?: string | null
    orderId?: string | number | null
    customerId?: string | number | null
    performedById?: string | number | null
    notes?: string | null
    costPerUnit?: number | null
  },
  req?: PayloadRequest,
): Promise<void> {
  try {
    const costPerUnit = opts.costPerUnit && opts.costPerUnit > 0 ? opts.costPerUnit : undefined
    const totalCost = costPerUnit ? costPerUnit * Math.abs(opts.qty) : undefined
    await payload.create({
      collection: 'stock-ledger',
      data: {
        product: opts.productId as any,
        variant: opts.variantId || undefined,
        type: opts.type,
        qty: opts.qty,
        stockBefore: opts.stockBefore,
        stockAfter: opts.stockAfter,
        referenceId: opts.referenceId || undefined,
        order: opts.orderId as any,
        customer: opts.customerId as any,
        performedBy: opts.performedById as any,
        notes: opts.notes || undefined,
        costPerUnit,
        totalCost,
      } as any,
      overrideAccess: true,
      req,
    })
  } catch (err) {
    // Ledger write failure should never block the main flow
    payload.logger.warn({ err }, '[StockLedger] Gagal menulis ledger entry')
  }
}

/** Hitung stok tersedia = inventory - pending reservations */
export async function getAvailableStock(
  payload: BasePayload,
  productId: string | number,
  variantId?: string | null,
  req?: PayloadRequest,
): Promise<number> {
  // Ambil inventory dari produk
  const product = await payload.findByID({
    collection: 'products',
    id: productId,
    depth: 1,
    overrideAccess: true,
    req,
  })

  let inventory = 0

  if (isBundleProduct(product)) {
    const bundleItems = getNormalizedBundleItems(product)

    if (bundleItems.length === 0) return 0

    let maxBundles = Number.POSITIVE_INFINITY

    for (const item of bundleItems) {
      const childAvailable = await getAvailableStock(payload, item.productId, null, req)
      maxBundles = Math.min(maxBundles, Math.floor(childAvailable / item.quantity))
    }

    inventory = Number.isFinite(maxBundles) ? Math.max(0, maxBundles) : 0
  } else if (isPerUnitDigitalStockProduct(product)) {
    const availableUnits = await payload.count({
      collection: 'digital-stock-units',
      overrideAccess: true,
      req,
      where: {
        and: [
          { product: { equals: productId } },
          variantId ? { variant: { equals: String(variantId) } } : { variant: { exists: false } },
          { status: { equals: 'available' } },
          {
            or: [
              { redeemEnabled: { exists: false } },
              { redeemEnabled: { equals: false } },
            ],
          },
        ],
      } as any,
    })

    inventory = availableUnits.totalDocs
  } else if (variantId) {
    const variants = (product as any)?.variants?.docs || []
    const variant = variants.find((v: any) => typeof v === 'object' && v.id === variantId)
    inventory = variant?.inventory ?? 0
  } else {
    inventory = (product as any)?.inventory ?? 0
  }

  // Hitung total pending reservations yang belum expired
  const now = new Date().toISOString()
  let reserved = 0
  let page = 1
  let hasNextPage = true
  while (hasNextPage) {
    const pendingRes = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [
          { product: { equals: productId } },
          { variant: variantId ? { equals: variantId } : { exists: false } },
          { status: { equals: 'pending' } },
          { expiresAt: { greater_than: now } },
        ],
      },
      limit: 500,
      page,
      overrideAccess: true,
      req,
    })
    reserved += pendingRes.docs.reduce(
      (sum: number, reservation: any) => sum + Number(reservation.quantity || 0),
      0,
    )
    hasNextPage = pendingRes.hasNextPage
    page += 1
  }

  return Math.max(0, inventory - reserved)
}

export async function hydrateProductAvailableInventory<T extends Record<string, any>>(
  payload: BasePayload,
  product: T,
  req?: PayloadRequest,
): Promise<T> {
  if (!product.id) return product
  if (isBundleProduct(product)) {
    return {
      ...product,
      inventory: await getAvailableStock(payload, product.id, null, req),
    }
  }
  if (!isPerUnitDigitalStockProduct(product)) return product

  const variantsContainer = product.variants
  const variants = Array.isArray(variantsContainer)
    ? variantsContainer
    : Array.isArray(variantsContainer?.docs)
      ? variantsContainer.docs
      : []
  const hydratedVariants = await Promise.all(
    variants.map(async (variant: unknown) => {
      if (!variant || typeof variant !== 'object' || !('id' in variant)) return variant
      const variantID = (variant as { id?: number | string }).id
      if (!variantID) return variant
      return {
        ...variant,
        inventory: await getAvailableStock(payload, product.id, String(variantID), req),
      }
    }),
  )
  const baseInventory = await getAvailableStock(payload, product.id, null, req)
  const totalInventory =
    hydratedVariants.length > 0
      ? hydratedVariants.reduce(
          (sum, variant) =>
            sum +
            (variant && typeof variant === 'object' && 'inventory' in variant
              ? Number(variant.inventory || 0)
              : 0),
          baseInventory,
        )
      : baseInventory

  return {
    ...product,
    inventory: totalInventory,
    ...(Array.isArray(variantsContainer)
      ? { variants: hydratedVariants }
      : variantsContainer && typeof variantsContainer === 'object'
        ? { variants: { ...variantsContainer, docs: hydratedVariants } }
        : {}),
  }
}

/** Buat reservasi stok baru */
export async function reserveStock(
  payload: BasePayload,
  opts: {
    reservationId: string
    productId: string | number
    variantId?: string | null
    quantity: number
    customerId?: string | number | null
    cartId?: string | null
  },
): Promise<{ success: boolean; error?: string; reservationDocId?: string | number }> {
  const { reservationId, productId, variantId, quantity, customerId, cartId } = opts

  if (
    !reservationId ||
    reservationId.length > 200 ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {
    return { success: false, error: 'Data reservasi stok tidak valid.' }
  }

  const transactionID = await payload.db.beginTransaction({
    accessMode: 'read write',
    isolationLevel: 'serializable',
  })
  const req = transactionID ? ({ payload, transactionID } as PayloadRequest) : undefined

  try {
    const existing = await payload.find({
      collection: 'stock-reservations',
      where: { reservationId: { equals: reservationId } },
      limit: 1,
      overrideAccess: true,
      req,
    })
    if (existing.docs.length > 0) {
      const existingReservation = existing.docs[0] as any
      if (
        existingReservation.status === 'pending' &&
        String(existingReservation.product?.id || existingReservation.product) === String(productId) &&
        String(existingReservation.variant || '') === String(variantId || '') &&
        Number(existingReservation.quantity) === quantity
      ) {
        if (transactionID) await payload.db.commitTransaction(transactionID)
        return { success: true, reservationDocId: existingReservation.id }
      }
      throw new Error('Reservation ID sudah digunakan untuk data yang berbeda.')
    }

    const available = await getAvailableStock(payload, productId, variantId, req)
    if (available < quantity) {
      if (transactionID) await payload.db.rollbackTransaction(transactionID)
      return { success: false, error: `Stok tidak cukup. Tersedia: ${available}` }
    }

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000).toISOString()
    const reservation = await payload.create({
      collection: 'stock-reservations',
      data: {
        reservationId,
        product: productId as any,
        variant: variantId || undefined,
        quantity,
        status: 'pending',
        expiresAt,
        customer: customerId as any,
        cartId: cartId || undefined,
      } as any,
      overrideAccess: true,
      req,
    })

    const currentStock = await getAvailableStock(payload, productId, variantId, req)
    await writeLedger(
      payload,
      {
        productId,
        variantId,
        type: 'reserved',
        qty: -quantity,
        stockBefore: currentStock + quantity,
        stockAfter: currentStock,
        referenceId: reservationId,
        customerId,
        notes: `Stok dipesan sementara (cart: ${cartId || '-'})`,
      },
      req,
    )

    if (transactionID) await payload.db.commitTransaction(transactionID)
    return { success: true, reservationDocId: reservation.id }
  } catch (error) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID).catch(() => undefined)
    const message = error instanceof Error ? error.message : String(error)
    if (/unique|duplicate|serialization|40001/i.test(message)) {
      return { success: false, error: 'Stok sedang diproses. Silakan coba lagi.' }
    }
    throw error
  }
}

/** Konfirmasi reservasi setelah pembayaran berhasil — kurangi inventory */
export async function confirmStockReservation(
  payload: BasePayload,
  reservationId: string,
  orderId: string | number,
  req?: PayloadRequest,
): Promise<{ success: boolean; error?: string }> {
  const res = await payload.find({
    collection: 'stock-reservations',
    where: {
      and: [
        { reservationId: { equals: reservationId } },
        { status: { equals: 'pending' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
    req,
  })

  if (res.docs.length === 0) {
    // Mungkin sudah dikonfirmasi sebelumnya (idempotent)
    const confirmed = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [
          { reservationId: { equals: reservationId } },
          { status: { equals: 'confirmed' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
      req,
    })
    if (confirmed.docs.length > 0) return { success: true }
    return { success: false, error: 'Reservasi tidak ditemukan atau sudah expired.' }
  }

  const reservation = res.docs[0] as any
  const productId = typeof reservation.product === 'object' ? reservation.product.id : reservation.product
  const variantId = reservation.variant || null
  const quantity = reservation.quantity

  const claimedReservation = await payload.db.updateOne({
    collection: 'stock-reservations' as any,
    data: {
      status: 'confirmed',
      order: orderId as any,
    } as any,
    req,
    where: {
      and: [{ id: { equals: reservation.id } }, { status: { equals: 'pending' } }],
    } as any,
  })
  if (!claimedReservation) {
    return { success: false, error: 'Reservasi sedang diproses atau sudah tidak aktif.' }
  }

  const customerId = reservation.customer
    ? typeof reservation.customer === 'object'
      ? reservation.customer.id
      : reservation.customer
    : null

  let product = reservation.product
  if (!product || typeof product !== 'object') {
    product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 0,
      overrideAccess: true,
      req,
    })
  }

  if (!isPerUnitDigitalStockProduct(product)) {
    const inventoryCollection = variantId ? 'variants' : 'products'
    const inventoryID = variantId || productId
    const updatedInventory = await payload.db.updateOne({
      collection: inventoryCollection as any,
      data: { inventory: { $inc: quantity * -1 } },
      req,
      where: {
        and: [
          { id: { equals: inventoryID } },
          { inventory: { greater_than_equal: quantity } },
        ],
      } as any,
    })

    if (!updatedInventory) {
      return { success: false, error: 'Stok berubah dan tidak lagi mencukupi.' }
    }

    const stockAfter = Number((updatedInventory as any).inventory || 0)
    await writeLedger(
      payload,
      {
        productId,
        variantId,
        type: 'out',
        qty: -quantity,
        stockBefore: stockAfter + quantity,
        stockAfter,
        referenceId: reservationId,
        orderId,
        customerId,
        notes: `Stok keluar (terjual) - order #${orderId}`,
      },
      req,
    )
  }

  return { success: true }
}

/** Release reservasi (expired / dibatalkan) */
export async function releaseReservation(
  payload: BasePayload,
  reservationId: string,
  reason?: string,
): Promise<{ success: boolean; released: number }> {
  const res = await payload.find({
    collection: 'stock-reservations',
    where: {
      and: [
        { reservationId: { equals: reservationId } },
        { status: { equals: 'pending' } },
      ],
    },
    limit: 10,
    overrideAccess: true,
  })

  let released = 0
  for (const doc of res.docs) {
    const docProductId =
      typeof (doc as any).product === 'object' ? (doc as any).product.id : (doc as any).product
    const docVariantId = (doc as any).variant || null
    const docQty = (doc as any).quantity || 0

    const releasedReservation = await payload.db.updateOne({
      collection: 'stock-reservations' as any,
      data: {
        status: 'released',
        notes: reason || 'Released',
      } as any,
      where: {
        and: [{ id: { equals: doc.id } }, { status: { equals: 'pending' } }],
      } as any,
    })
    if (!releasedReservation) continue

    // Catat ke ledger — stok kembali ke pool
    const stockNow = await getAvailableStock(payload, docProductId, docVariantId)
    await writeLedger(payload, {
      productId: docProductId,
      variantId: docVariantId,
      type: 'released',
      qty: docQty,
      stockBefore: stockNow - docQty,
      stockAfter: stockNow,
      referenceId: reservationId,
      notes: reason || 'Reservasi dilepas',
    })

    released++
  }

  return { success: true, released }
}

/** Cron: release semua reservasi pending yang sudah expired */
export async function releaseExpiredReservations(
  payload: BasePayload,
): Promise<{ released: number }> {
  const now = new Date().toISOString()

  const expired = await payload.find({
    collection: 'stock-reservations',
    where: {
      and: [
        { status: { equals: 'pending' } },
        { expiresAt: { less_than: now } },
      ],
    },
    limit: 200,
    overrideAccess: true,
  })

  let released = 0
  for (const doc of expired.docs) {
    const docProductId =
      typeof (doc as any).product === 'object' ? (doc as any).product.id : (doc as any).product
    const docVariantId = (doc as any).variant || null
    const docQty = (doc as any).quantity || 0

    const releasedReservation = await payload.db.updateOne({
      collection: 'stock-reservations' as any,
      data: {
        status: 'released',
        notes: 'Auto-released: payment timeout (60 menit)',
      } as any,
      where: {
        and: [{ id: { equals: doc.id } }, { status: { equals: 'pending' } }],
      } as any,
    })
    if (!releasedReservation) continue

    // Catat ke ledger
    const stockNow = await getAvailableStock(payload, docProductId, docVariantId)
    await writeLedger(payload, {
      productId: docProductId,
      variantId: docVariantId,
      type: 'released',
      qty: docQty,
      stockBefore: stockNow - docQty,
      stockAfter: stockNow,
      referenceId: (doc as any).reservationId,
      notes: 'Auto-released: payment timeout (60 menit)',
    })

    released++
  }

  if (released > 0) {
    payload.logger.info({ released }, '[Stock] Auto-released expired reservations')
  }

  return { released }
}

/**
 * Tambah stok (restock / penyesuaian manual).
 * Dipanggil dari admin atau endpoint restock.
 */
export async function addStock(
  payload: BasePayload,
  opts: {
    productId: string | number
    variantId?: string | null
    quantity: number
    type?: 'in' | 'adjust' | 'out'
    referenceId?: string | null
    performedById?: string | number | null
    notes?: string | null
    costPerUnit?: number | null
  },
  req?: PayloadRequest,
): Promise<{ success: boolean; newInventory: number; error?: string }> {
  const { productId, variantId, quantity, type = 'in', referenceId, performedById, notes, costPerUnit } = opts

  if (quantity === 0) return { success: false, newInventory: 0, error: 'Quantity tidak boleh 0' }

  if (variantId) {
    try {
      const conditions: Record<string, any>[] = [{ id: { equals: variantId } }]
      if (quantity < 0) conditions.push({ inventory: { greater_than_equal: Math.abs(quantity) } })
      const variantDoc = await payload.db.updateOne({
        collection: 'variants' as any,
        data: { inventory: { $inc: quantity } },
        req,
        where: { and: conditions },
      })
      if (!variantDoc) {
        return { success: false, newInventory: 0, error: 'Stok variant tidak mencukupi.' }
      }
      const newInventory = Number((variantDoc as any).inventory || 0)
      await writeLedger(
        payload,
        {
          productId,
          variantId,
          type,
          qty: quantity,
          stockBefore: newInventory - quantity,
          stockAfter: newInventory,
          referenceId,
          performedById,
          notes:
            notes ||
            (type === 'in' ? 'Restock' : type === 'out' ? 'Stok keluar' : 'Penyesuaian manual'),
          costPerUnit,
        },
        req,
      )
      return { success: true, newInventory }
    } catch (err) {
      return { success: false, newInventory: 0, error: String(err) }
    }
  } else {
    const conditions: Record<string, any>[] = [{ id: { equals: productId } }]
    if (quantity < 0) conditions.push({ inventory: { greater_than_equal: Math.abs(quantity) } })
    const product = await payload.db.updateOne({
      collection: 'products',
      data: { inventory: { $inc: quantity } },
      req,
      where: { and: conditions },
    })
    if (!product) return { success: false, newInventory: 0, error: 'Stok produk tidak mencukupi.' }
    const newInventory = Number((product as any).inventory || 0)
    await writeLedger(
      payload,
      {
        productId,
        variantId: null,
        type,
        qty: quantity,
        stockBefore: newInventory - quantity,
        stockAfter: newInventory,
        referenceId,
        performedById,
        notes:
          notes ||
          (type === 'in' ? 'Restock' : type === 'out' ? 'Stok keluar' : 'Penyesuaian manual'),
        costPerUnit,
      },
      req,
    )
    return { success: true, newInventory }
  }
}
