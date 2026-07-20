'use client'

import {
    AlertTriangle,
    ArrowDownLeft,
    ArrowUpRight,
    BarChart2,
    Box,
    ChevronRight,
    CreditCard,
    ExternalLink,
    Minus,
    Package,
    RefreshCw,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
    Wallet,
    XCircle,
} from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = 'today' | 'week' | 'month' | 'year' | 'custom'

interface SummaryData {
  period: string
  cashflow: { revenue: number; refund: number; net: number; txConfirmed: number }
  orders: {
    total: number
    pending: number
    paid: number
    processing: number
    shipped: number
    completed: number
    cancelled: number
    refunded: number
  }
  avgOrderValue: number
  transactions: { total: number; byStatus: Record<string, number> }
  stock: { unitsSold: number; unitsRestocked: number; totalModalKeluar: number }
  customers: { new: number }
  dailySeries: { date: string; revenue: number; orders: number }[]
}

interface ProductsData {
  period: string
  topSellers: { productId: string; title: string; unitsSold: number }[]
  lowStock: { total: number; products: { id: string; title: string; stock: number }[] }
  outOfStock: { total: number; products: { id: string; title: string }[] }
  restock: { productId: string; title: string; unitsAdded: number }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const fmtNum = (n: number) => new Intl.NumberFormat('id-ID').format(n)

function getPeriodRange(period: Period): { from?: string; to?: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  if (period === 'today') {
    const s = ymd(now)
    return { from: `${s}T00:00:00.000Z`, to: `${s}T23:59:59.999Z` }
  }
  if (period === 'week') {
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    return { from: `${ymd(start)}T00:00:00.000Z`, to: `${ymd(now)}T23:59:59.999Z` }
  }
  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from: `${ymd(start)}T00:00:00.000Z`, to: `${ymd(now)}T23:59:59.999Z` }
  }
  if (period === 'year') {
    const start = new Date(now.getFullYear(), 0, 1)
    return { from: `${ymd(start)}T00:00:00.000Z`, to: `${ymd(now)}T23:59:59.999Z` }
  }
  return {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
  iconColor?: string
}> = ({ label, value, sub, icon: Icon, trend, iconColor = 'var(--theme-text)' }) => (
  <div
    style={{
      background: 'var(--theme-elevation-50)',
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: 10,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <Icon size={16} color={iconColor} strokeWidth={1.75} />
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--theme-text)', lineHeight: 1.2 }}>{value}</div>
    {sub && (
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {trend === 'up' && <TrendingUp size={12} color="#22c55e" />}
        {trend === 'down' && <TrendingDown size={12} color="#ef4444" />}
        {trend === 'neutral' && <Minus size={12} color="var(--theme-elevation-400)" />}
        {sub}
      </div>
    )}
  </div>
)

const SectionTitle: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <Icon size={16} strokeWidth={1.75} color="var(--theme-elevation-500)" />
    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </span>
  </div>
)

const MiniBar: React.FC<{ value: number; max: number; color?: string }> = ({
  value,
  max,
  color = 'var(--theme-success-500, #22c55e)',
}) => (
  <div style={{ height: 4, background: 'var(--theme-elevation-150)', borderRadius: 2, overflow: 'hidden', flex: 1 }}>
    <div
      style={{
        height: '100%',
        width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%`,
        background: color,
        borderRadius: 2,
        transition: 'width 0.4s ease',
      }}
    />
  </div>
)

const StatusBadge: React.FC<{ status: string; count: number }> = ({ status, count }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    paid: { bg: '#d1fae5', text: '#065f46' },
    processing: { bg: '#dbeafe', text: '#1e40af' },
    shipped: { bg: '#ede9fe', text: '#5b21b6' },
    completed: { bg: '#d1fae5', text: '#065f46' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
    refunded: { bg: '#fce7f3', text: '#9d174d' },
  }
  const c = colors[status] ?? { bg: 'var(--theme-elevation-100)', text: 'var(--theme-text)' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
      }}
    >
      {status} <span style={{ fontWeight: 700 }}>{fmtNum(count)}</span>
    </span>
  )
}

const DailyChart: React.FC<{ series: SummaryData['dailySeries'] }> = ({ series }) => {
  if (!series || series.length === 0) return null
  const maxRev = Math.max(...series.map((d) => d.revenue), 1)
  const maxOrd = Math.max(...series.map((d) => d.orders), 1)

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minWidth: series.length * 36, height: 120 }}>
        {series.map((d) => (
          <div
            key={d.date}
            title={`${d.date}\nRevenue: ${fmt(d.revenue)}\nOrders: ${d.orders}`}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 100 }}>
              <div
                style={{
                  width: 10,
                  height: `${(d.revenue / maxRev) * 100}%`,
                  background: 'var(--theme-success-500, #22c55e)',
                  borderRadius: '2px 2px 0 0',
                  minHeight: 2,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: `${(d.orders / maxOrd) * 100}%`,
                  background: 'var(--theme-elevation-400)',
                  borderRadius: '2px 2px 0 0',
                  minHeight: 2,
                  opacity: 0.7,
                }}
              />
            </div>
            <span style={{ fontSize: 9, color: 'var(--theme-elevation-400)', whiteSpace: 'nowrap' }}>
              {d.date.slice(5)}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: 'var(--theme-success-500, #22c55e)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>Revenue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: 'var(--theme-elevation-400)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>Orders</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [activeTab, setActiveTab] = useState<'cashflow' | 'orders' | 'produk' | 'stock'>('cashflow')
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [products, setProducts] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams({ period })
    if (period === 'custom') {
      if (customFrom) params.set('from', `${customFrom}T00:00:00.000Z`)
      if (customTo) params.set('to', `${customTo}T23:59:59.999Z`)
    } else {
      const range = getPeriodRange(period)
      if (range.from) params.set('from', range.from)
      if (range.to) params.set('to', range.to)
    }
    return params
  }, [period, customFrom, customTo])

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    setLoading(true)
    setSpinning(true)
    setError(null)

    try {
      const q = buildQuery()
      const [sumRes, prodRes] = await Promise.all([
        fetch(`/api/reports/summary?${q}`, { signal }),
        fetch(`/api/reports/products?${q}`, { signal }),
      ])

      if (!sumRes.ok) throw new Error(`Summary: ${sumRes.status}`)
      if (!prodRes.ok) throw new Error(`Products: ${prodRes.status}`)

      const [sumData, prodData] = await Promise.all([sumRes.json(), prodRes.json()])
      setSummary(sumData)
      setProducts(prodData)
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setError(e.message)
    } finally {
      setLoading(false)
      setTimeout(() => setSpinning(false), 400)
    }
  }, [buildQuery])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const periodLabels: Record<Period, string> = {
    today: 'Hari Ini',
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
    custom: 'Kustom',
  }

  const tabs = [
    { key: 'cashflow', label: 'Cashflow', icon: Wallet },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'produk', label: 'Produk', icon: Package },
    { key: 'stock', label: 'Stok', icon: Box },
  ] as const

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BarChart2 size={24} strokeWidth={1.75} color="var(--theme-text)" />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--theme-text)' }}>Laporan</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--theme-elevation-500)' }}>
              Ringkasan performa toko Anda
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--theme-elevation-200)',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
            fontSize: 13,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw
            size={14}
            strokeWidth={2}
            style={{
              animation: spinning ? 'spin 0.7s linear infinite' : 'none',
            }}
          />
          Refresh
        </button>
      </div>

      {/* Period Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.keys(periodLabels) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: period === p ? 'var(--theme-text)' : 'var(--theme-elevation-200)',
              background: period === p ? 'var(--theme-text)' : 'transparent',
              color: period === p ? 'var(--theme-bg)' : 'var(--theme-text)',
              fontSize: 12,
              fontWeight: period === p ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {periodLabels[p]}
          </button>
        ))}
        {period === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-200)',
                background: 'var(--theme-elevation-50)',
                color: 'var(--theme-text)',
                fontSize: 12,
              }}
            />
            <Minus size={12} color="var(--theme-elevation-400)" />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-200)',
                background: 'var(--theme-elevation-50)',
                color: 'var(--theme-text)',
                fontSize: 12,
              }}
            />
            <button
              onClick={fetchData}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: '1px solid var(--theme-elevation-300)',
                background: 'var(--theme-elevation-100)',
                color: 'var(--theme-text)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Terapkan
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 8,
            background: '#fee2e2',
            color: '#991b1b',
            marginBottom: 20,
            fontSize: 13,
          }}
        >
          <XCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 100,
                borderRadius: 10,
                background: 'var(--theme-elevation-100)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {summary && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
            <StatCard
              label="Revenue"
              value={fmt(summary.cashflow.revenue)}
              sub={`${fmtNum(summary.orders.total)} transaksi`}
              icon={ArrowUpRight}
              trend="up"
              iconColor="#22c55e"
            />
            <StatCard
              label="Net Cashflow"
              value={fmt(summary.cashflow.net)}
              sub={`Refund: ${fmt(summary.cashflow.refund)}`}
              icon={Wallet}
              trend={summary.cashflow.net >= 0 ? 'up' : 'down'}
            />
            <StatCard
              label="Avg Order Value"
              value={fmt(summary.avgOrderValue)}
              sub="per order berbayar"
              icon={CreditCard}
              trend="neutral"
            />
            <StatCard
              label="Pelanggan Baru"
              value={fmtNum(summary.customers.new)}
              sub="dalam periode ini"
              icon={Users}
              trend="up"
              iconColor="#6366f1"
            />
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid var(--theme-elevation-150)',
              marginBottom: 24,
            }}
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: activeTab === key ? '2px solid var(--theme-text)' : '2px solid transparent',
                  background: 'transparent',
                  color: activeTab === key ? 'var(--theme-text)' : 'var(--theme-elevation-500)',
                  fontSize: 13,
                  fontWeight: activeTab === key ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginBottom: -1,
                }}
              >
                <Icon size={14} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Cashflow */}
          {activeTab === 'cashflow' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <StatCard label="Pemasukan" value={fmt(summary.cashflow.revenue)} icon={ArrowUpRight} iconColor="#22c55e" />
                <StatCard label="Refund / Keluar" value={fmt(summary.cashflow.refund)} icon={ArrowDownLeft} iconColor="#ef4444" />
                <StatCard label="Net" value={fmt(summary.cashflow.net)} icon={Wallet} trend={summary.cashflow.net >= 0 ? 'up' : 'down'} />
                <StatCard label="Tx Terkonfirmasi" value={fmtNum(summary.cashflow.txConfirmed)} icon={CreditCard} />
                <StatCard
                  label="Modal Restock"
                  value={fmt(summary.stock.totalModalKeluar ?? 0)}
                  sub="pengeluaran beli stok"
                  icon={Package}
                  trend="down"
                  iconColor="#f59e0b"
                />
                <StatCard
                  label="Laba Kotor"
                  value={fmt(summary.cashflow.net - (summary.stock.totalModalKeluar ?? 0))}
                  sub={`Revenue − Refund − Modal`}
                  icon={TrendingUp}
                  trend={(summary.cashflow.net - (summary.stock.totalModalKeluar ?? 0)) >= 0 ? 'up' : 'down'}
                  iconColor={(summary.cashflow.net - (summary.stock.totalModalKeluar ?? 0)) >= 0 ? '#22c55e' : '#ef4444'}
                />
              </div>

              {/* Daily Chart */}
              {summary.dailySeries && summary.dailySeries.length > 1 && (
                <div
                  style={{
                    background: 'var(--theme-elevation-50)',
                    border: '1px solid var(--theme-elevation-150)',
                    borderRadius: 10,
                    padding: '18px 20px',
                  }}
                >
                  <SectionTitle icon={BarChart2}>Tren Harian</SectionTitle>
                  <DailyChart series={summary.dailySeries} />
                </div>
              )}

              {/* Transactions by status */}
              {summary.transactions.byStatus && Object.keys(summary.transactions.byStatus).length > 0 && (
                <div
                  style={{
                    background: 'var(--theme-elevation-50)',
                    border: '1px solid var(--theme-elevation-150)',
                    borderRadius: 10,
                    padding: '18px 20px',
                  }}
                >
                  <SectionTitle icon={CreditCard}>Status Transaksi</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {Object.entries(summary.transactions.byStatus).map(([status, count]) => (
                      <StatusBadge key={status} status={status} count={count} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Orders */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                <StatCard label="Total Orders" value={fmtNum(summary.orders.total)} icon={ShoppingCart} />
                <StatCard label="Pending" value={fmtNum(summary.orders.pending)} icon={AlertTriangle} iconColor="#f59e0b" />
                <StatCard label="Paid" value={fmtNum(summary.orders.paid)} icon={CreditCard} iconColor="#22c55e" />
                <StatCard label="Processing" value={fmtNum(summary.orders.processing)} icon={RefreshCw} iconColor="#6366f1" />
                <StatCard label="Shipped" value={fmtNum(summary.orders.shipped)} icon={Package} iconColor="#3b82f6" />
                <StatCard label="Completed" value={fmtNum(summary.orders.completed)} icon={TrendingUp} iconColor="#22c55e" />
                <StatCard label="Cancelled" value={fmtNum(summary.orders.cancelled)} icon={XCircle} iconColor="#ef4444" />
                <StatCard label="Refunded" value={fmtNum(summary.orders.refunded)} icon={ArrowDownLeft} iconColor="#f43f5e" />
              </div>

              <div
                style={{
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 10,
                  padding: '18px 20px',
                }}
              >
                <SectionTitle icon={ShoppingCart}>Distribusi Status</SectionTitle>
                {[
                  { key: 'completed', label: 'Completed', color: '#22c55e' },
                  { key: 'shipped', label: 'Shipped', color: '#3b82f6' },
                  { key: 'processing', label: 'Processing', color: '#6366f1' },
                  { key: 'paid', label: 'Paid', color: '#10b981' },
                  { key: 'pending', label: 'Pending', color: '#f59e0b' },
                  { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
                  { key: 'refunded', label: 'Refunded', color: '#f43f5e' },
                ].map(({ key, label, color }) => {
                  const val = summary.orders[key as keyof typeof summary.orders] as number
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ width: 80, fontSize: 12, color: 'var(--theme-elevation-500)' }}>{label}</span>
                      <MiniBar value={val} max={summary.orders.total} color={color} />
                      <span style={{ width: 40, fontSize: 12, fontWeight: 600, color: 'var(--theme-text)', textAlign: 'right' }}>
                        {fmtNum(val)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div style={{ textAlign: 'right' }}>
                <Link
                  href="/mlebu/collections/orders"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--theme-elevation-500)',
                    textDecoration: 'none',
                  }}
                >
                  Lihat semua orders
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          )}

          {/* Tab: Produk */}
          {activeTab === 'produk' && products && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Top Sellers */}
              <div
                style={{
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 10,
                  padding: '18px 20px',
                }}
              >
                <SectionTitle icon={TrendingUp}>Top Produk Terlaris</SectionTitle>
                {products.topSellers.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--theme-elevation-400)', margin: 0 }}>Belum ada data penjualan.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {products.topSellers.map((p, i) => (
                      <div key={p.productId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: i < 3 ? 'var(--theme-text)' : 'var(--theme-elevation-150)',
                            color: i < 3 ? 'var(--theme-bg)' : 'var(--theme-elevation-500)',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--theme-text)' }}>{p.title}</span>
                        <MiniBar value={p.unitsSold} max={products.topSellers[0]?.unitsSold ?? 1} color="#22c55e" />
                        <span style={{ width: 60, fontSize: 12, fontWeight: 600, color: 'var(--theme-text)', textAlign: 'right' }}>
                          {fmtNum(p.unitsSold)} unit
                        </span>
                        <Link href={`/mlebu/collections/products/${p.productId}`} style={{ color: 'var(--theme-elevation-400)' }}>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Stock */}
              <div
                style={{
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 10,
                  padding: '18px 20px',
                }}
              >
                <SectionTitle icon={AlertTriangle}>Stok Menipis</SectionTitle>
                {products.lowStock.total === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--theme-elevation-400)', margin: 0 }}>Semua stok aman.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.lowStock.products.map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertTriangle size={14} color="#f59e0b" strokeWidth={2} />
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--theme-text)' }}>{p.title}</span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {p.stock} tersisa
                        </span>
                        <Link href={`/mlebu/collections/products/${p.id}`} style={{ color: 'var(--theme-elevation-400)' }}>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Out of Stock */}
              {products.outOfStock.total > 0 && (
                <div
                  style={{
                    background: 'var(--theme-elevation-50)',
                    border: '1px solid var(--theme-elevation-150)',
                    borderRadius: 10,
                    padding: '18px 20px',
                  }}
                >
                  <SectionTitle icon={XCircle}>Stok Habis</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.outOfStock.products.map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <XCircle size={14} color="#ef4444" strokeWidth={2} />
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--theme-text)' }}>{p.title}</span>
                        <Link href={`/mlebu/collections/products/${p.id}`} style={{ color: 'var(--theme-elevation-400)' }}>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Stock */}
          {activeTab === 'stock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <StatCard
                  label="Unit Terjual"
                  value={fmtNum(summary.stock.unitsSold)}
                  sub="dari stock ledger"
                  icon={TrendingDown}
                  iconColor="#ef4444"
                />
                <StatCard
                  label="Unit Direstok"
                  value={fmtNum(summary.stock.unitsRestocked)}
                  sub="restock & adjustment"
                  icon={TrendingUp}
                  iconColor="#22c55e"
                />
                <StatCard
                  label="Total Modal Restock"
                  value={fmt(summary.stock.totalModalKeluar ?? 0)}
                  sub="dari costPerUnit × qty"
                  icon={Package}
                  trend="down"
                  iconColor="#f59e0b"
                />
              </div>

              {products && products.restock.length > 0 && (
                <div
                  style={{
                    background: 'var(--theme-elevation-50)',
                    border: '1px solid var(--theme-elevation-150)',
                    borderRadius: 10,
                    padding: '18px 20px',
                  }}
                >
                  <SectionTitle icon={Package}>Riwayat Restock</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.restock.map((r) => (
                      <div key={r.productId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Package size={14} color="#22c55e" strokeWidth={1.75} />
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--theme-text)' }}>{r.title}</span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: '#d1fae5',
                            color: '#065f46',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          +{fmtNum(r.unitsAdded)} unit
                        </span>
                        <Link href={`/mlebu/collections/products/${r.productId}`} style={{ color: 'var(--theme-elevation-400)' }}>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <Link
                  href="/mlebu/collections/stock-ledger"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--theme-elevation-200)',
                    background: 'var(--theme-elevation-50)',
                    color: 'var(--theme-text)',
                    fontSize: 12,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={12} />
                  Lihat Stock Ledger
                </Link>
                <Link
                  href="/mlebu/collections/stock-reservations"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--theme-elevation-200)',
                    background: 'var(--theme-elevation-50)',
                    color: 'var(--theme-text)',
                    fontSize: 12,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={12} />
                  Lihat Reservasi
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
