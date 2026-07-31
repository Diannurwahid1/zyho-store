'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDocumentInfo } from '@payloadcms/ui'
import { CheckCircle2, Loader2, PackageCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type UnitDoc = {
  id: number | string
  order?: { id?: number | string } | number | null
  product?: { title?: string } | number | null
  status?: string | null
  unitCode?: string | null
}

export const ManualOrderField: React.FC = () => {
  const { id } = useDocumentInfo()
  const [unit, setUnit] = useState<UnitDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const fetchUnit = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/digital-stock-units/${id}?depth=1`, {
          credentials: 'include',
        })
        const data = await response.json()
        setUnit(data?.doc || data || null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void fetchUnit()
  }, [id])

  const handleSubmit = async () => {
    if (!id) {
      toast.error('Simpan digital stock unit ini dulu.')
      return
    }

    if (!email.trim() || !phone.trim()) {
      toast.error('Email dan nomor HP wajib diisi.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/manual-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          digitalStockUnitId: id,
          email,
          phone,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data?.error || 'Gagal membuat order manual.')
        return
      }

      toast.success(`Order manual berhasil dibuat: #${data.orderId}`)
      setUnit((prev) =>
        prev
          ? {
              ...prev,
              order: { id: data.orderId },
              status: 'assigned',
            }
          : prev,
      )
      setEmail('')
      setPhone('')
    } catch (error) {
      console.error(error)
      toast.error('Gagal membuat order manual.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '0.75rem 0' }}>
        <div style={{ color: 'var(--theme-text-dimmed)', fontSize: '0.875rem' }}>
          Memuat manual order...
        </div>
      </div>
    )
  }

  if (!id) {
    return (
      <div style={{ padding: '0.75rem 0' }}>
        <div style={{ color: 'var(--theme-text-dimmed)', fontSize: '0.875rem' }}>
          Simpan digital stock unit dulu untuk membuka fitur order manual.
        </div>
      </div>
    )
  }

  const assignedOrderId =
    typeof unit?.order === 'object' && unit?.order
      ? unit.order.id || null
      : typeof unit?.order === 'number' || typeof unit?.order === 'string'
        ? unit.order
        : null
  const isAvailable = unit?.status === 'available'

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '14px',
        padding: '1rem',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <PackageCheck className="h-4 w-4" />
        <strong>Order Manual</strong>
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--theme-text-dimmed)', lineHeight: 1.6, marginBottom: '0.9rem' }}>
        Buat order langsung dari unit stok ini tanpa lewat checkout web. Sistem akan otomatis buat
        customer, order, transaksi, payment transaction, assign unit ini, dan masukkan ke report.
      </p>

      {assignedOrderId ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--theme-success-600)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 className="h-4 w-4" />
          Sudah terpakai di order #{assignedOrderId}
        </div>
      ) : !isAvailable ? (
        <div style={{ color: 'var(--theme-warning-600)', fontSize: '0.875rem', fontWeight: 600 }}>
          Unit ini tidak bisa dipakai untuk order manual karena statusnya `{unit?.status || '-'}`
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          <div>
            <Label htmlFor="manual-order-email">Email customer</Label>
            <Input
              id="manual-order-email"
              placeholder="customer@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: '0.35rem' }}
            />
          </div>

          <div>
            <Label htmlFor="manual-order-phone">Nomor HP</Label>
            <Input
              id="manual-order-phone"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ marginTop: '0.35rem' }}
            />
          </div>

          <Button type="button" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Buat Order Manual
          </Button>
        </div>
      )}
    </div>
  )
}
