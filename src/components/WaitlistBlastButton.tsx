'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

interface WaitlistBlastButtonProps {
  waitlistId: string | number
}

export const WaitlistBlastButton: React.FC<WaitlistBlastButtonProps> = ({ waitlistId }) => {
  const [loading, setLoading] = useState(false)

  const handleBlast = async () => {
    if (!confirm('Kirim notifikasi WhatsApp ke semua member waitlist ini?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/waitlist/blast/${waitlistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success(result.message || 'WhatsApp blast berhasil dikirim!')
        // Reload to see updated entry statuses
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.error(result.error || 'Gagal mengirim WhatsApp blast')
      }
    } catch (error) {
      console.error('Error sending blast:', error)
      toast.error('Terjadi kesalahan saat mengirim blast')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="field-type">
      <div className="label">
        <label>Notifikasi WhatsApp</label>
      </div>
      <div className="input-wrapper">
        <button
          type="button"
          onClick={handleBlast}
          disabled={loading}
          className="btn btn--style-primary btn--icon-style-without-border btn--size-medium"
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Mengirim...' : '📱 Kirim Blast WhatsApp'}
        </button>
        <div className="field-description" style={{ marginTop: '8px' }}>
          Kirim notifikasi ke semua member waitlist bahwa produk sudah tersedia.
          {' '}Jika ada voucher yang di-assign, akan otomatis disebutkan dalam pesan.
        </div>
      </div>
    </div>
  )
}
