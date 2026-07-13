import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

/**
 * StockSummary — server component untuk admin dashboard.
 * Menampilkan produk dengan stok rendah (< 5) dan reservasi pending aktif.
 */
export const StockSummary: React.FC = async () => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Ambil produk dengan inventory rendah
    const lowStockProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          { inventory: { less_than: 5 } },
          { inventory: { greater_than: -1 } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 10,
      depth: 0,
      overrideAccess: true,
    })

    // Hitung reservasi pending aktif
    const now = new Date().toISOString()
    const pendingReservations = await payload.find({
      collection: 'stock-reservations',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { expiresAt: { greater_than: now } },
        ],
      },
      limit: 0,
      overrideAccess: true,
    })

    const pendingCount = pendingReservations.totalDocs

    return (
      <div
        style={{
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
          background: 'var(--theme-elevation-50)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--theme-elevation-500)' }}>
            📦 Ringkasan Stok
          </h4>
          <Link
            href="/mlebu/collections/stock-reservations"
            style={{ fontSize: '12px', color: 'var(--theme-text)', textDecoration: 'underline' }}
          >
            Lihat semua reservasi →
          </Link>
          <Link
            href="/mlebu/collections/stock-ledger"
            style={{ fontSize: '12px', color: 'var(--theme-text)', textDecoration: 'underline' }}
          >
            History stok →
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px',
              borderRadius: '6px',
              background: pendingCount > 0 ? 'var(--theme-warning-50, #fffbeb)' : 'var(--theme-elevation-100)',
              border: `1px solid ${pendingCount > 0 ? 'var(--theme-warning-300, #fcd34d)' : 'var(--theme-elevation-200)'}`,
            }}
          >
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{pendingCount}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--theme-elevation-500)' }}>Reservasi Pending</p>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px',
              borderRadius: '6px',
              background: lowStockProducts.totalDocs > 0 ? 'var(--theme-error-50, #fef2f2)' : 'var(--theme-elevation-100)',
              border: `1px solid ${lowStockProducts.totalDocs > 0 ? 'var(--theme-error-300, #fca5a5)' : 'var(--theme-elevation-200)'}`,
            }}
          >
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{lowStockProducts.totalDocs}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--theme-elevation-500)' }}>Produk Stok Rendah (&lt;5)</p>
          </div>
        </div>

        {lowStockProducts.docs.length > 0 && (
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: 'var(--theme-elevation-500)' }}>
              PRODUK PERLU RESTOCK:
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {lowStockProducts.docs.map((product: any) => (
                <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '4px', background: 'var(--theme-elevation-100)' }}>
                  <Link
                    href={`/mlebu/collections/products/${product.id}`}
                    style={{ fontSize: '13px', color: 'var(--theme-text)', textDecoration: 'none' }}
                  >
                    {product.title}
                  </Link>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: product.inventory === 0 ? '#fee2e2' : '#fef3c7',
                      color: product.inventory === 0 ? '#dc2626' : '#d97706',
                    }}
                  >
                    {product.inventory === 0 ? 'HABIS' : `${product.inventory} sisa`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  } catch {
    return null
  }
}
