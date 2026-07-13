/**
 * GET /api/reports/products
 *
 * Laporan produk: top sellers, stok rendah, revenue per produk.
 * Query params:
 *   - from   : ISO date
 *   - to     : ISO date
 *   - period : 'today' | 'week' | 'month' | 'year' | 'custom'
 *   - limit  : jumlah top products (default 10)
 */

import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

function getPeriodRange(period: string, from?: string, to?: string) {
  const now = new Date()
  let start: Date
  let end: Date = now

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      break
    case 'week': {
      const day = now.getDay()
      start = new Date(now)
      start.setDate(now.getDate() - day)
      start.setHours(0, 0, 0, 0)
      break
    }
    case 'year':
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0)
      break
    case 'custom':
      start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1)
      end = to ? new Date(to) : now
      break
    case 'month':
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
      break
  }

  return { start, end }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const roles: string[] = (user as any).roles || []
    if (!roles.some((r) => ['admin', 'manager', 'finance'].includes(r))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'
    const fromParam = searchParams.get('from') || undefined
    const toParam = searchParams.get('to') || undefined
    const topLimit = parseInt(searchParams.get('limit') || '10', 10)

    const { start, end } = getPeriodRange(period, fromParam, toParam)
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    // -----------------------------------------------------------------------
    // 1. Stock Ledger — unit terjual per produk dalam periode
    // -----------------------------------------------------------------------
    const soldEntries = await payload.find({
      collection: 'stock-ledger',
      where: {
        and: [
          { type: { equals: 'out' } },
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      depth: 1,
      overrideAccess: true,
    })

    // Aggregate unit terjual per produk
    const soldMap: Record<string, { productId: string; title: string; unitsSold: number }> = {}
    for (const entry of soldEntries.docs as any[]) {
      const product = entry.product
      if (!product) continue
      const pid = typeof product === 'object' ? String(product.id) : String(product)
      const title = typeof product === 'object' ? (product.title || pid) : pid
      if (!soldMap[pid]) soldMap[pid] = { productId: pid, title, unitsSold: 0 }
      soldMap[pid]!.unitsSold += Math.abs(entry.qty ?? 0)
    }

    const topSellers = Object.values(soldMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, topLimit)

    // -----------------------------------------------------------------------
    // 2. Produk stok rendah (< 5) — semua waktu
    // -----------------------------------------------------------------------
    const lowStock = await payload.find({
      collection: 'products',
      where: {
        and: [
          { inventory: { less_than: 5 } },
          { inventory: { greater_than_equal: 0 } },
        ],
      },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })

    // -----------------------------------------------------------------------
    // 3. Produk stok habis
    // -----------------------------------------------------------------------
    const outOfStock = await payload.find({
      collection: 'products',
      where: { inventory: { equals: 0 } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })

    // -----------------------------------------------------------------------
    // 4. Restock dalam periode
    // -----------------------------------------------------------------------
    const restockEntries = await payload.find({
      collection: 'stock-ledger',
      where: {
        and: [
          { type: { in: ['in', 'adjust'] } },
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      depth: 1,
      overrideAccess: true,
    })

    const restockMap: Record<string, { productId: string; title: string; unitsAdded: number }> = {}
    for (const entry of restockEntries.docs as any[]) {
      const product = entry.product
      if (!product) continue
      const pid = typeof product === 'object' ? String(product.id) : String(product)
      const title = typeof product === 'object' ? (product.title || pid) : pid
      if (!restockMap[pid]) restockMap[pid] = { productId: pid, title, unitsAdded: 0 }
      restockMap[pid]!.unitsAdded += Math.abs(entry.qty ?? 0)
    }

    const restockList = Object.values(restockMap).sort((a, b) => b.unitsAdded - a.unitsAdded)

    return NextResponse.json({
      period: { from: startISO, to: endISO, label: period },
      topSellers,
      lowStock: {
        total: lowStock.totalDocs,
        products: lowStock.docs.map((p: any) => ({
          id: p.id,
          title: p.title,
          inventory: p.inventory,
          slug: p.slug,
        })),
      },
      outOfStock: {
        total: outOfStock.totalDocs,
        products: outOfStock.docs.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        })),
      },
      restock: restockList,
    })
  } catch (err: any) {
    console.error('[Reports/Products]', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
