'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  productId: number
  productTitle?: string
  trigger?: React.ReactNode
  compact?: boolean
}

export function WaitlistDialog({ productId, productTitle, trigger, compact }: Props) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phone, setPhone] = useState(user?.phone || '')
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone) {
      toast.error('Nomor WhatsApp wajib diisi')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          phone,
          quantity,
          name: user?.name || 'Guest',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal bergabung dengan waiting list')
      }

      toast.success('Berhasil bergabung dengan waiting list! Kami akan menghubungi Anda saat stok tersedia.')
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className={`rounded-lg bg-foreground px-3 py-2 font-semibold text-background transition hover:opacity-90 ${
              compact ? 'text-xs md:text-sm w-full' : 'text-sm w-full'
            }`}
            type="button"
          >
            Join Waiting List
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Waiting List</DialogTitle>
            <DialogDescription>
              Stok {productTitle ? `"${productTitle}"` : 'produk ini'} sedang habis. Masukkan nomor WhatsApp Anda untuk mendapatkan notifikasi dan penawaran spesial saat stok tersedia kembali.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input
                id="phone"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Jumlah yang diinginkan</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Join Waiting List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
