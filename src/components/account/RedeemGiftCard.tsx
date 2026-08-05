'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gift, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

export const RedeemGiftCard: React.FC = () => {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRedeem = async () => {
    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode) {
      toast.error('Masukkan kode redeem dulu.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/redeem/digital-stock', {
        body: JSON.stringify({ code: normalizedCode }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || 'Redeem gagal diproses.')
      }

      toast.success(`Redeem berhasil. Produk ${data.productTitle || ''} sudah masuk ke order kamu.`)
      setCode('')
      router.push(`/orders/${data.orderId}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Redeem gagal diproses.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-w-0 rounded-[2rem] border bg-card/70 p-5 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-500">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Redeem hadiah</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Punya kode redeem? Masukkan di sini. Jika valid, produk langsung masuk ke order kamu dengan status gift redeem.
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border bg-background p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="redeem-code">Kode redeem</Label>
            <Input
              id="redeem-code"
              placeholder="Contoh: GIFT-GEMINI-2026"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleRedeem()
                }
              }}
            />
          </div>

          <Button
            type="button"
            className="w-full md:w-auto"
            onClick={() => void handleRedeem()}
            disabled={submitting || !code.trim()}
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Redeem sekarang
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
          Kode redeem hanya bisa dipakai <span className="font-semibold text-foreground">1 kali</span>. Setelah berhasil, unit stok langsung terkunci dan tidak bisa diredeem ulang.
        </div>
      </div>
    </section>
  )
}
