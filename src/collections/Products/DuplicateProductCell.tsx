'use client'

import { useConfig } from '@payloadcms/ui'
import { Copy, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export const DuplicateProductCell: React.FC<{ rowData: any }> = ({ rowData }) => {
  const { config } = useConfig()
  const adminRoute = config?.routes?.admin || '/admin'
  const [submitting, setSubmitting] = useState(false)

  if (!rowData?.id) return null

  const handleDuplicate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (submitting) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/products/duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: rowData.id,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.error(data?.error || 'Gagal menduplikat produk.')
        return
      }

      toast.success('Produk berhasil diduplikat.')
      const nextId = data?.product?.id

      if (nextId) {
        window.location.href = `${adminRoute}/collections/products/${nextId}`
        return
      }

      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error('Gagal menduplikat produk.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => void handleDuplicate(event)}
      disabled={submitting}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.42rem 0.7rem',
        borderRadius: '999px',
        border: '1px solid var(--theme-elevation-200)',
        background: 'var(--theme-elevation-50)',
        color: 'var(--theme-text)',
        cursor: submitting ? 'not-allowed' : 'pointer',
        fontSize: '0.8rem',
        fontWeight: 600,
        opacity: submitting ? 0.75 : 1,
      }}
      aria-label={`Duplikat produk ${rowData?.title || ''}`}
      title="Duplikat produk"
    >
      {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
      {submitting ? 'Memproses...' : 'Duplikat'}
    </button>
  )
}
