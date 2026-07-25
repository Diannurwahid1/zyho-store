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
import Link from 'next/link'
import { useEffect, useState } from 'react'

type WelcomeReward = {
  amount: number
  benefitSummary: null | string
  code: string
  discountType: 'fixed' | 'percentage'
  expiresAt: null | string
  productHref: string
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
  const [imageError, setImageError] = useState(false)
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
          setImageError(false)
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-[2rem] border-amber-300/30 bg-[#090704] p-0 shadow-[0_24px_90px_rgba(245,158,11,0.28)]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                className={`absolute h-2 w-2 rounded-full ${
                  index % 3 === 0
                    ? 'animate-bounce bg-amber-300'
                    : index % 3 === 1
                      ? 'animate-pulse bg-emerald-300'
                      : 'animate-ping bg-rose-300'
                }`}
                key={index}
                style={{
                  left: `${8 + ((index * 17) % 84)}%`,
                  top: `${7 + ((index * 29) % 58)}%`,
                  animationDelay: `${index * 90}ms`,
                  animationDuration: `${900 + (index % 5) * 180}ms`,
                }}
              />
            ))}
          </div>

          <div className="relative aspect-[1.65] w-full overflow-hidden bg-[radial-gradient(circle_at_top,#facc15_0%,#92400e_36%,#16120b_72%)]">
            {!imageError ? (
              <Image
                alt="Welcome voucher"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 640px) calc(100vw - 2rem), 448px"
                src="/media/welcome-voucher.png"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
                <div className="mb-4 rounded-full border border-amber-200/50 bg-white/10 px-4 py-1 text-xs font-bold uppercase">
                  Welcome voucher
                </div>
                <p className="text-5xl font-black">{totalValue || 'Voucher'}</p>
                <p className="mt-3 text-sm text-amber-100">Hadiah member baru Zyho</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090704] to-transparent" />
          </div>

          <div className="relative px-6 pb-6 pt-5 text-center text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-black">
                Voucher selamat datang!
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-300">
                Akun kamu sudah aktif. Ini hadiah khusus untuk pembelian pertamamu.
              </DialogDescription>
            </DialogHeader>
            {reward && (
              <div className="mt-5 rounded-2xl border border-amber-300/25 bg-white/[0.06] p-4 shadow-inner">
                <p className="text-sm font-medium text-zinc-300">{reward.title}</p>
                <p className="mt-1 font-mono text-xl font-bold tracking-wide text-white">
                  {reward.code}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-amber-200">
                  Total nilai voucher
                </p>
                <p className="mt-1 text-4xl font-black text-amber-300">{totalValue}</p>
                {reward.benefitSummary && (
                  <p className="mt-2 text-sm text-zinc-300">{reward.benefitSummary}</p>
                )}
              </div>
            )}
            <DialogFooter className="mt-5 gap-2 sm:justify-center">
              {reward && (
                <Button asChild className="w-full bg-amber-300 text-black hover:bg-amber-200" size="lg">
                  <Link href={reward.productHref} onClick={() => setOpen(false)}>
                    Pakai sekarang
                  </Link>
                </Button>
              )}
              <Button
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
                size="lg"
                variant="outline"
              >
                Gunakan nanti
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {reward && !open && (
        <Link
          className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-amber-300/40 bg-[#120d05]/95 px-4 py-3 text-white shadow-[0_12px_40px_rgba(245,158,11,0.35)] backdrop-blur transition-transform hover:scale-[1.03] md:bottom-6 md:right-6"
          href={reward.productHref}
        >
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-amber-300/30 bg-amber-300">
            <Image
              alt="Welcome voucher"
              className="object-cover"
              fill
              sizes="44px"
              src="/media/welcome-voucher.png"
              unoptimized
            />
          </span>
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.16em] text-amber-200">
              Voucher aktif
            </span>
            <span className="block truncate text-sm font-bold">
              {totalValue} - klik untuk pakai
            </span>
          </span>
        </Link>
      )}
    </>
  )
}
