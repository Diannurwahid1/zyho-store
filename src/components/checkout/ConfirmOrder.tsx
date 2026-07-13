'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { PartyPopper, Sparkles, Trophy } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const ConfirmOrder: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isConfirming = useRef(false)
  const [successResult, setSuccessResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const paymentIntentID = searchParams.get('payment_intent')

    // If there's a payment intent, process it regardless of cart state
    if (paymentIntentID) {
      if (!isConfirming.current) {
        isConfirming.current = true

        // Use fetch API directly instead of hook
        fetch('/api/payments/pakasir/confirm-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentID,
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return response.json()
          })
          .then((result) => {
            console.log('[ConfirmOrder] API result:', result)
            setIsLoading(false)

            if (result && typeof result === 'object' && 'orderID' in result && result.orderID) {
              const nextURL = new URL(`/orders/${result.orderID}`, window.location.origin)
              if ('accessToken' in result && result.accessToken) {
                nextURL.searchParams.set('accessToken', String(result.accessToken))
              }

              console.log('[ConfirmOrder] Setting successResult:', {
                orderID: result.orderID,
                pointsEarned: result.pointsEarned || 0,
                accessToken: result.accessToken,
                nextURL: `${nextURL.pathname}${nextURL.search}`,
              })

              // Show success popup
              setSuccessResult({
                orderID: result.orderID,
                pointsEarned: result.pointsEarned || 0,
                accessToken: result.accessToken,
                nextURL: `${nextURL.pathname}${nextURL.search}`,
              })
            } else {
              console.error('[ConfirmOrder] Invalid result structure:', result)
              router.push('/')
            }
          })
          .catch((err) => {
            console.error('[ConfirmOrder] Error confirming order:', err)
            setIsLoading(false)
            router.push('/')
          })
      }
    } else {
      // If no payment intent ID is found, redirect to the home
      router.push('/')
    }
  }, [router, searchParams])

  if (successResult) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card p-7 text-center shadow-2xl">
          <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl" />
          <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl" />
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600">
            <PartyPopper className="h-10 w-10" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Pembayaran berhasil
          </p>
          <h3 className="mt-2 text-2xl font-bold">Selamat, pesananmu sudah aman!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Order #{successResult.orderID} berhasil dibuat dan sedang kami proses.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border bg-muted/50 p-4">
            <Trophy className="h-7 w-7 text-amber-500" />
            <div className="text-left">
              <p className="flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Reward membership
              </p>
              <p className="text-xl font-bold">+{successResult.pointsEarned} poin</p>
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => router.push(successResult.nextURL)}
            size="lg"
          >
            Lihat Pesanan Saya
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center w-full flex flex-col items-center justify-start gap-4">
      <h1 className="text-2xl">Confirming Order</h1>

      <LoadingSpinner className="w-12 h-6" />
    </div>
  )
}
