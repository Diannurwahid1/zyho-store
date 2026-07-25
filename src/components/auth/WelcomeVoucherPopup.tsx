'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/providers/Auth'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type WelcomeReward = {
  amount: number
  benefitSummary: null | string
  code: string
  discountType: 'fixed' | 'percentage'
  expiresAt: null | string
  title: string
}

const formatIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)

const fetchWelcomeReward = async () => {
  const response = await fetch('/api/signup-voucher/welcome', {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) return null

  const data = await response.json()
  return (data?.reward || null) as WelcomeReward | null
}

export const WelcomeVoucherPopup = () => {
  const { status } = useAuth()
  const [open, setOpen] = useState(false)
  const [reward, setReward] = useState<WelcomeReward | null>(null)

  useEffect(() => {
    if (status !== 'loggedIn' || typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const fromGoogle = params.get('welcome') === '1'
    const pending = window.sessionStorage.getItem('welcome-voucher-pending') === '1'
    if (!fromGoogle && !pending) return

    if (fromGoogle) {
      params.delete('welcome')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    }

    let cancelled = false

    const loadReward = async () => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const nextReward = await fetchWelcomeReward().catch(() => null)
        if (cancelled) return

        if (nextReward) {
          window.sessionStorage.removeItem('welcome-voucher-pending')
          setReward(nextReward)
          setOpen(true)
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 400))
      }

      window.sessionStorage.removeItem('welcome-voucher-pending')
    }

    void loadReward()

    return () => {
      cancelled = true
    }
  }, [status])

  const totalValue = reward
    ? reward.discountType === 'percentage'
      ? `Diskon ${reward.amount}%`
      : formatIDR(reward.amount)
    : ''

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md overflow-hidden rounded-[2rem] p-0">
        <div className="relative aspect-[1.65] w-full bg-muted">
          <Image
            alt="Welcome voucher"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 640px) calc(100vw - 2rem), 448px"
            src="/media/welcome-voucher.png"
          />
        </div>
        <div className="px-6 pb-6 pt-5 text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Voucher selamat datang!</DialogTitle>
            <DialogDescription className="text-center">
              Akun kamu sudah aktif. Ini hadiah khusus untuk pembelian pertamamu.
            </DialogDescription>
          </DialogHeader>
          {reward && (
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-muted-foreground">{reward.title}</p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wide">{reward.code}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Total nilai voucher
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">{totalValue}</p>
              {reward.benefitSummary && (
                <p className="mt-2 text-sm text-muted-foreground">{reward.benefitSummary}</p>
              )}
            </div>
          )}
          <DialogFooter className="mt-5 sm:justify-center">
            <Button className="w-full sm:w-auto" onClick={() => setOpen(false)} size="lg">
              Gunakan nanti di checkout
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
