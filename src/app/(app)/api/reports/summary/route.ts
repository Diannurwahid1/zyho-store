/**
 * GET /api/reports/summary
 *
 * Laporan ringkasan keuangan & operasional.
 * Query params:
 *   - from  : ISO date string (default: awal bulan ini)
 *   - to    : ISO date string (default: sekarang)
 *   - period: 'today' | 'week' | 'month' | 'year' | 'custom'
 *
 * Returns:
 *   - cashflow    : total pemasukan, pengeluaran (refund), net
 *   - orders      : total, pending, paid, cancelled, refunded
 *   - transactions: breakdown per status
 *   - avgOrderValue
 *   - dailySeries : array [{date, revenue, orders}] untuk chart
 */

import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

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
    const rateLimited = enforceRateLimit({
      limit: 30,
      request: req,
      responseMessage: 'Too many report requests',
      windowMs: 60_000,
    })
    if (rateLimited) return rateLimited

    const payload = await getPayload({ config: configPromise })

    // Auth check — hanya staff
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const roles: string[] = (user as any).roles || []
    const isStaff = roles.some((r) => ['admin', 'manager', 'finance'].includes(r))
    if (!isStaff) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] Forbidden reports summary access',
        meta: buildAuditMeta(req, { userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'
    const fromParam = searchParams.get('from') || undefined
    const toParam = searchParams.get('to') || undefined

    auditLog({
      logger: payload.logger,
      message: '[Audit] Reports summary accessed',
      meta: buildAuditMeta(req, { period, userID: user.id }),
    })

    const { start, end } = getPeriodRange(period, fromParam, toParam)
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    // -----------------------------------------------------------------------
    // 1. Orders dalam periode
    // -----------------------------------------------------------------------
    const allOrders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    })

    const orders = allOrders.docs as any[]

    const orderStats = {
      total: orders.length,
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
    }

    let totalRevenue = 0
    let totalRefund = 0
    let revenueOrderCount = 0

    for (const o of orders) {
      // orders table uses 'amount' column (confirmed from DB schema)
      const status: string = o.status || 'pending'
      if (status in orderStats) {
        ;(orderStats as any)[status]++
      }

      const amount = o.amount ?? o.total ?? o.totalPrice ?? 0

      if (['paid', 'processing', 'shipped', 'completed'].includes(status)) {
        totalRevenue += amount
        revenueOrderCount++
      }
      if (status === 'refunded') {
        totalRefund += amount
      }
    }

    const netRevenue = totalRevenue - totalRefund
    const avgOrderValue = revenueOrderCount > 0 ? totalRevenue / revenueOrderCount : 0

    // -----------------------------------------------------------------------
    // 2. Payment Transactions breakdown
    // -----------------------------------------------------------------------
    const allTx = await payload.find({
      collection: 'payment-transactions',
      where: {
        and: [
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    })

    const txByStatus: Record<string, { count: number; amount: number }> = {}
    let txTotalAmount = 0

    for (const tx of allTx.docs as any[]) {
      const s = tx.status || 'unknown'
      if (!txByStatus[s]) txByStatus[s] = { count: 0, amount: 0 }
      txByStatus[s]!.count++
      txByStatus[s]!.amount += tx.amount ?? 0
      if (['settlement', 'capture'].includes(s)) {
        txTotalAmount += tx.amount ?? 0
      }
    }

    // -----------------------------------------------------------------------
    // 3. Daily series untuk chart — fill all dates in range with zeros
    // -----------------------------------------------------------------------
    const dailyMap: Record<string, { date: string; revenue: number; orders: number; refund: number }> = {}

    // Pre-fill every date in the range
    const cursor = new Date(start)
    cursor.setHours(0, 0, 0, 0)
    const rangeEnd = new Date(end)
    while (cursor <= rangeEnd) {
      const key = cursor.toISOString().slice(0, 10)
      dailyMap[key] = { date: key, revenue: 0, orders: 0, refund: 0 }
      cursor.setDate(cursor.getDate() + 1)
    }

    for (const o of orders) {
      const dateKey = (o.createdAt as string).slice(0, 10)
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, revenue: 0, orders: 0, refund: 0 }
      }
      dailyMap[dateKey]!.orders++
      const amount = o.amount ?? o.total ?? o.totalPrice ?? 0
      const status: string = o.status || ''
      if (['paid', 'processing', 'shipped', 'completed'].includes(status)) {
        dailyMap[dateKey]!.revenue += amount
      }
      if (status === 'refunded') {
        dailyMap[dateKey]!.refund += amount
      }
    }

    const dailySeries = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date))

    // -----------------------------------------------------------------------
    // 4. Stock Ledger summary — sum actual qty values (not just count docs)
    // -----------------------------------------------------------------------
    const ledgerIn = await payload.find({
      collection: 'stock-ledger',
      where: {
        and: [
          { type: { in: ['in', 'adjust'] } },
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      overrideAccess: true,
    })

    const ledgerOut = await payload.find({
      collection: 'stock-ledger',
      where: {
        and: [
          { type: { equals: 'out' } },
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 5000,
      overrideAccess: true,
    })

    const unitsRestocked = (ledgerIn.docs as any[]).reduce((sum, e) => sum + Math.abs(e.qty ?? 0), 0)
    const unitsSold = (ledgerOut.docs as any[]).reduce((sum, e) => sum + Math.abs(e.qty ?? 0), 0)

    // -----------------------------------------------------------------------
    // 5. New customers dalam periode
    // -----------------------------------------------------------------------
    const newCustomers = await payload.find({
      collection: 'users',
      where: {
        and: [
          { createdAt: { greater_than_equal: startISO } },
          { createdAt: { less_than_equal: endISO } },
        ],
      },
      limit: 0,
      overrideAccess: true,
    })

    return NextResponse.json({
      period: { from: startISO, to: endISO, label: period },
      cashflow: {
        revenue: totalRevenue,
        refund: totalRefund,
        net: netRevenue,
        txConfirmed: txTotalAmount,
      },
      orders: orderStats,
      avgOrderValue,
      transactions: {
        total: allTx.totalDocs,
        byStatus: txByStatus,
      },
      stock: {
        unitsSold,
        unitsRestocked,
      },
      customers: {
        new: newCustomers.totalDocs,
      },
      dailySeries,
    })
  } catch (err: any) {
    console.error('[Reports/Summary]', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
