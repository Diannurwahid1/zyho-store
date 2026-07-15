/**
 * Stock management utilities.
 *
 * Alur stok:
 *  1. User mulai checkout → reserveStock() dipanggil → status = 'pending', expiresAt = now + 10 menit
 *  2. Cron setiap menit → releaseExpiredReservations() → release semua pending yang sudah expired
 *  3. Pembayaran berhasil → confirmStockReservation() → status = 'confirmed', inventory dikurangi
 *  4. Pembayaran dibatalkan / expired → releaseReservation() → status = 'released'
 *
 * Stok yang tampil ke user = inventory - jumlah reservasi pending yang belum expired
 *
 * Setiap perubahan stok dicatat ke StockLedger (kartu stok permanen).
 */

import type { BasePayload } from 'payload'

export const RESERVATION_TTL_MINUTES = 10

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
  },
): Promise<void> {
  try {
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
      } as any,
      overrideAccess: true,
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
): Promise<number> {
  // Ambil inventory dari produk
  const product = await payload.findByID({
    collection: 'products',
    id: productId,
    depth: 1,
    overrideAccess: true,
  })

  let inventory = 0

  if (variantId) {
    // Cari variant
    const variants = (product as any)?.variants?.docs || []
    const variant = variants.find(
      (v: any) => typeof v === 'object' && v.id === variantId,
    )
    inventory = variant?.inventory ?? 0
  } else {
    inventory = (product as any)?.inventory ?? 0
  }

  // Hitung total pending reservations yang belum expired
  const now = new Date().toISOString()
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
    limit: 1000,
    overrideAccess: true,
  })

  const reserved = pendingRes.docs.reduce((sum: number, r: any) => sum + (r.quantity || 0), 0)

  return Math.max(0, inventory - reserved)
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

  // Cek apakah reservasi dengan ID ini sudah ada
  const existing = await payload.find({
    collection: 'stock-reservations',
    where: {
      and: [
        { reservationId: { equals: reservationId } },
        { status: { equals: 'pending' } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    // Sudah ada reservasi aktif, return existing
    return { success: true, reservationDocId: existing.docs[0]!.id }
  }

  // Cek stok tersedia
  const available = await getAvailableStock(payload, productId, variantId)
  if (available < quantity) {
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
  })

  // Catat ke ledger
  const currentStock = await getAvailableStock(payload, productId, variantId)
  await writeLedger(payload, {
    productId,
    variantId,
    type: 'reserved',
    qty: -quantity,
    stockBefore: currentStock + quantity,
    stockAfter: currentStock,
    referenceId: reservationId,
    customerId,
    notes: `Stok dipesan sementara (cart: ${cartId || '-'})`,
  })

  return { success: true, reservationDocId: reservation.id }
}

/** Konfirmasi reservasi setelah pembayaran berhasil — kurangi inventory */
export async function confirmStockReservation(
  payload: BasePayload,
  reservationId: string,
  orderId: string | number,
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
    })
    if (confirmed.docs.length > 0) return { success: true }
    return { success: false, error: 'Reservasi tidak ditemukan atau sudah expired.' }
  }

  const reservation = res.docs[0] as any
  const productId = typeof reservation.product === 'object' ? reservation.product.id : reservation.product
  const variantId = reservation.variant || null
  const quantity = reservation.quantity

  // Update status reservasi
  await payload.update({
    collection: 'stock-reservations',
    id: reservation.id,
    data: {
      status: 'confirmed',
      order: orderId as any,
    } as any,
    overrideAccess: true,
  })

  // NOTE: Inventory decrement sudah di-handle oleh @payloadcms/plugin-ecommerce
  // di confirmOrder endpoint (via $inc). Kita TIDAK mengurangi inventory di sini
  // untuk menghindari double deduction. Cukup tulis ledger saja.
  const customerId = reservation.customer
    ? typeof reservation.customer === 'object'
      ? reservation.customer.id
      : reservation.customer
    : null

  if (variantId) {
    try {
      const variantDoc = await payload.findByID({
        collection: 'variants' as any,
        id: variantId,
        overrideAccess: true,
      })
      const currentInventory = (variantDoc as any)?.inventory ?? 0
      await writeLedger(payload, {
        productId,
        variantId,
        type: 'out',
        qty: -quantity,
        stockBefore: currentInventory,
        stockAfter: Math.max(0, currentInventory - quantity),
        referenceId: reservationId,
        orderId,
        customerId,
        notes: `Stok keluar (terjual) — order #${orderId}`,
      })
    } catch (err) {
      payload.logger.warn({ err, variantId }, '[Stock] Gagal tulis ledger variant')
    }
  } else {
    try {
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
        overrideAccess: true,
      })
      const currentInventory = (product as any)?.inventory ?? 0
      await writeLedger(payload, {
        productId,
        variantId: null,
        type: 'out',
        qty: -quantity,
        stockBefore: currentInventory,
        stockAfter: Math.max(0, currentInventory - quantity),
        referenceId: reservationId,
        orderId,
        customerId,
        notes: `Stok keluar (terjual) — order #${orderId}`,
      })
    } catch (err) {
      payload.logger.warn({ err, productId }, '[Stock] Gagal tulis ledger product')
    }
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

    await payload.update({
      collection: 'stock-reservations',
      id: doc.id,
      data: {
        status: 'released',
        notes: reason || 'Released',
      } as any,
      overrideAccess: true,
    })

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

    await payload.update({
      collection: 'stock-reservations',
      id: doc.id,
      data: {
        status: 'released',
        notes: 'Auto-released: payment timeout (10 menit)',
      } as any,
      overrideAccess: true,
    })

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
      notes: 'Auto-released: payment timeout (10 menit)',
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
    type?: 'in' | 'adjust'
    referenceId?: string | null
    performedById?: string | number | null
    notes?: string | null
  },
): Promise<{ success: boolean; newInventory: number; error?: string }> {
  const { productId, variantId, quantity, type = 'in', referenceId, performedById, notes } = opts

  if (quantity === 0) return { success: false, newInventory: 0, error: 'Quantity tidak boleh 0' }

  if (variantId) {
    try {
      const variantDoc = await payload.findByID({
        collection: 'variants' as any,
        id: variantId,
        overrideAccess: true,
      })
      const currentInventory = (variantDoc as any)?.inventory ?? 0
      const newInventory = Math.max(0, currentInventory + quantity)
      await payload.update({
        collection: 'variants' as any,
        id: variantId,
        data: { inventory: newInventory } as any,
        overrideAccess: true,
      })
      await writeLedger(payload, {
        productId,
        variantId,
        type,
        qty: quantity,
        stockBefore: currentInventory,
        stockAfter: newInventory,
        referenceId,
        performedById,
        notes: notes || (type === 'in' ? 'Restock' : 'Penyesuaian manual'),
      })
      return { success: true, newInventory }
    } catch (err) {
      return { success: false, newInventory: 0, error: String(err) }
    }
  } else {
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      overrideAccess: true,
    })
    const currentInventory = (product as any)?.inventory ?? 0
    const newInventory = Math.max(0, currentInventory + quantity)
    await payload.update({
      collection: 'products',
      id: productId,
      data: { inventory: newInventory } as any,
      overrideAccess: true,
    })
    await writeLedger(payload, {
      productId,
      variantId: null,
      type,
      qty: quantity,
      stockBefore: currentInventory,
      stockAfter: newInventory,
      referenceId,
      performedById,
      notes: notes || (type === 'in' ? 'Restock' : 'Penyesuaian manual'),
    })
    return { success: true, newInventory }
  }
}
