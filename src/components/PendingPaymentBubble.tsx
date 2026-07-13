'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Clock3, Sparkles, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type PendingSession = {
  expiresAt: number
  paymentData: { orderID: string } | null
  sessionId: string
}

const formatCountdown = (expiresAt: number) => {
  const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export const PendingPaymentBubble: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<PendingSession | null>(null)
  const [countdown, setCountdown] = useState('00:00')
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/checkout/session', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (response.status === 401) {
        setSession(null)
        return
      }
      const data = await response.json()
      setSession(data.session || null)
      if (data.session) setCountdown(formatCountdown(data.session.expiresAt))
    } catch {
      // A temporary network failure must not erase a known pending payment.
    }
  }, [])

  useEffect(() => {
    void refreshSession()
    const refresh = window.setInterval(() => void refreshSession(), 10_000)
    return () => window.clearInterval(refresh)
  }, [pathname, refreshSession])

  useEffect(() => {
    if (!session) return
    const timer = window.setInterval(() => {
      setCountdown(formatCountdown(session.expiresAt))
      if (session.expiresAt <= Date.now()) void refreshSession()
    }, 1000)
    return () => window.clearInterval(timer)
  }, [refreshSession, session])

  const handleCancel = useCallback(async () => {
    if (!session || isCancelling) return
    setIsCancelling(true)
    try {
      const response = await fetch('/api/checkout/session', {
        body: JSON.stringify({ sessionId: session.sessionId }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })
      if (!response.ok && response.status !== 409) throw new Error()
      localStorage.removeItem('checkout_session')
      setSession(null)
      toast.success('Pembayaran dibatalkan. Stok sudah kembali tersedia.')
    } catch {
      toast.error('Pembayaran belum berhasil dibatalkan. Silakan coba lagi.')
    } finally {
      setIsCancelling(false)
    }
  }, [isCancelling, session])

  if (!session || isDismissed || pathname === '/checkout') return null

  const urgent = session.expiresAt - Date.now() < 2 * 60 * 1000

  return (
    <aside className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-[390px] md:bottom-6 md:right-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 p-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${urgent ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}`}
          >
            <Clock3 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {urgent ? 'Waktu hampir habis' : 'Pembayaran menunggumu'}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="truncate text-sm font-medium">
                {session.paymentData?.orderID
                  ? `#${session.paymentData.orderID}`
                  : 'Menyiapkan pembayaran'}
              </span>
              <span
                className={`font-mono text-sm font-bold ${urgent ? 'text-destructive' : 'text-foreground'}`}
              >
                {countdown}
              </span>
            </div>
          </div>
          <button
            aria-label={isExpanded ? 'Tutup detail' : 'Buka detail'}
            className="rounded-lg p-2 hover:bg-muted"
            onClick={() => setIsExpanded((value) => !value)}
            type="button"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            aria-label="Sembunyikan pengingat"
            className="rounded-lg p-2 hover:bg-muted"
            onClick={() => setIsDismissed(true)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isExpanded ? (
          <div className="border-t border-border px-4 pb-4 pt-3">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              Ayo lanjutkan pembayaran sebelum stok habis. Sedikit lagi pesananmu aman!
            </p>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={() => router.push('/checkout')}>
                Lanjutkan Pembayaran
              </Button>
              <Button disabled={isCancelling} onClick={() => void handleCancel()} variant="outline">
                {isCancelling ? 'Membatalkan...' : 'Batalkan'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
