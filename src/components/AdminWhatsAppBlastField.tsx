'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircleMore, RefreshCw, Send, ShieldCheck } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const panelStyle: React.CSSProperties = {
  background:
    'linear-gradient(180deg, color-mix(in srgb, var(--theme-elevation-100) 92%, #111827 8%) 0%, var(--theme-elevation-50) 100%)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '18px',
  boxShadow: '0 18px 48px rgba(0, 0, 0, 0.18)',
}

const badgeStyle = (tone: 'danger' | 'neutral' | 'success'): React.CSSProperties => ({
  alignItems: 'center',
  background:
    tone === 'success'
      ? 'color-mix(in srgb, var(--theme-success-500) 12%, transparent)'
      : tone === 'danger'
        ? 'color-mix(in srgb, var(--theme-error-500) 12%, transparent)'
        : 'var(--theme-elevation-150)',
  border:
    tone === 'success'
      ? '1px solid color-mix(in srgb, var(--theme-success-500) 32%, transparent)'
      : tone === 'danger'
        ? '1px solid color-mix(in srgb, var(--theme-error-500) 32%, transparent)'
        : '1px solid var(--theme-elevation-200)',
  borderRadius: '999px',
  color:
    tone === 'success'
      ? 'var(--theme-success-600)'
      : tone === 'danger'
        ? 'var(--theme-error-500)'
        : 'var(--theme-text-dimmed)',
  display: 'inline-flex',
  fontSize: '0.72rem',
  fontWeight: 700,
  gap: '0.35rem',
  letterSpacing: '0.08em',
  padding: '0.35rem 0.7rem',
  textTransform: 'uppercase',
})

type SessionStatusPayload = {
  error?: string
  isConnected?: boolean
  raw?: Record<string, unknown>
  status?: string
  success: boolean
}

export const AdminWhatsAppBlastField: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [sessionStatus, setSessionStatus] = useState<SessionStatusPayload | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const hiddenElements = new Map<HTMLElement, string>()
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>('button, a, input[type="submit"]'),
    )

    for (const element of candidates) {
      if (root.contains(element)) continue

      const buttonText =
        element instanceof HTMLInputElement
          ? (element.value || '').trim().toLowerCase()
          : (element.textContent || '').trim().toLowerCase()

      if (buttonText !== 'save') continue

      hiddenElements.set(element, element.style.display)
      element.style.display = 'none'
    }

    return () => {
      for (const [element, previousDisplay] of hiddenElements.entries()) {
        element.style.display = previousDisplay
      }
    }
  }, [])

  const fetchStatus = async () => {
    setIsLoadingStatus(true)

    try {
      const response = await fetch('/api/whatsapp/test', {
        cache: 'no-store',
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat status WhatsApp.')
      }

      setSessionStatus(data.status)
    } catch (error) {
      const nextStatus: SessionStatusPayload = {
        error: error instanceof Error ? error.message : 'Gagal memuat status WhatsApp.',
        success: false,
      }
      setSessionStatus(nextStatus)
    } finally {
      setIsLoadingStatus(false)
    }
  }

  useEffect(() => {
    void fetchStatus()
  }, [])

  const handleSend = async () => {
    if (!phone.trim()) {
      toast.error('Nomor WhatsApp wajib diisi.')
      return
    }

    if (!message.trim()) {
      toast.error('Pesan WhatsApp wajib diisi.')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch('/api/whatsapp/test', {
        body: JSON.stringify({
          message,
          phone,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim WhatsApp test.')
      }

      toast.success(data.message || 'Pesan WhatsApp test berhasil dikirim.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim WhatsApp test.')
    } finally {
      setIsSending(false)
      void fetchStatus()
    }
  }

  const statusTone =
    sessionStatus?.success && sessionStatus?.isConnected
      ? 'success'
      : sessionStatus?.success
        ? 'neutral'
        : 'danger'

  return (
    <div className="field-type" ref={rootRef}>
      <div style={{ ...panelStyle, marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.9rem',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>Manual WhatsApp Blast Test</div>
            <p
              style={{
                color: 'var(--theme-text-dimmed)',
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}
            >
              Kirim pesan test ke nomor tertentu untuk cek integrasi checkout dan session WA.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={badgeStyle(statusTone)}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {isLoadingStatus
                ? 'Checking session'
                : sessionStatus?.status || (sessionStatus?.success ? 'Unknown' : 'Error')}
            </span>
            <Button type="button" variant="outline" onClick={() => void fetchStatus()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>
        </div>

        <div
          style={{
            background: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '16px',
            marginTop: '1rem',
            padding: '1rem',
          }}
        >
          <div
            style={{
              color: 'var(--theme-text-dimmed)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.45rem',
            }}
          >
            Status Session
          </div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {sessionStatus?.success
              ? sessionStatus?.isConnected
                ? 'Session WA aktif dan siap dipakai kirim pesan.'
                : 'Session WA terdeteksi tetapi belum terkoneksi. Scan ulang atau hidupkan session dulu.'
              : sessionStatus?.error || 'Status session belum tersedia.'}
          </p>
        </div>
      </div>

      <div style={{ ...panelStyle, padding: '1.25rem' }}>
        <div
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              background: 'color-mix(in srgb, var(--theme-success-500) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--theme-success-500) 28%, transparent)',
              borderRadius: '14px',
              display: 'flex',
              height: '44px',
              justifyContent: 'center',
              minWidth: '44px',
            }}
          >
            <MessageCircleMore className="h-5 w-5" />
          </div>

          <div>
            <div
              style={{
                color: 'var(--theme-text-dimmed)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Test Form
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>
              Kirim pesan manual
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <Label htmlFor="wa-test-phone">Nomor WhatsApp</Label>
            <Input
              id="wa-test-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 089512345678 atau 6289512345678"
              style={{ marginTop: '0.35rem' }}
            />
          </div>

          <div>
            <Label htmlFor="wa-test-message">Isi Pesan</Label>
            <Textarea
              id="wa-test-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan test untuk cek WA blast checkout..."
              rows={8}
              style={{ marginTop: '0.35rem' }}
            />
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--theme-elevation-150)',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1.25rem',
            paddingTop: '1rem',
          }}
        >
          <Button type="button" disabled={isSending} onClick={() => void handleSend()}>
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Mengirim...' : 'Kirim Test WhatsApp'}
          </Button>
        </div>
      </div>
    </div>
  )
}
