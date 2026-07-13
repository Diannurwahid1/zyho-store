'use client'

import { BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * AdminReportsNavLink — link ke halaman laporan di sidebar admin.
 * Dipasang via afterNavLinks di payload.config.ts.
 */
export const AdminReportsNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname?.startsWith('/mlebu/reports')

  return (
    <div style={{ padding: '0 16px', marginTop: 4 }}>
      <Link
        href="/mlebu/reports"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          borderRadius: 6,
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: isActive ? 700 : 400,
          background: isActive ? 'var(--theme-elevation-150)' : 'transparent',
          color: 'var(--theme-text)',
          transition: 'background 0.15s',
        }}
      >
        <BarChart2 size={16} strokeWidth={1.75} />
        <span>Laporan</span>
      </Link>
    </div>
  )
}
