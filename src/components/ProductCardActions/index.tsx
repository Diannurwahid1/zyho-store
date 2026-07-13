'use client'

import { useActiveCheckout } from '@/hooks/useActiveCheckout'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

type ListingVariant = {
  id: number
  inventory?: number | null
}

type Props = {
  productId: number
  inventory?: number | null
  enableVariants?: boolean | null
  variants?: (ListingVariant | null | undefined)[]
  language?: 'id' | 'en'
  compact?: boolean
}

export function ProductCardActions({
  productId,
  inventory,
  enableVariants,
  variants,
  language = 'id',
  compact = false,
}: Props) {
  const { addItem, cart, isLoading } = useCart()
  const { hasActiveCheckout, isChecking: isCheckingCheckout } = useActiveCheckout()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedVariant = useMemo(() => {
    if (!enableVariants) return undefined

    const normalizedVariants = (variants ?? []).filter(
      (variant): variant is ListingVariant =>
        typeof variant === 'object' && variant !== null && 'id' in variant,
    )

    return (
      normalizedVariants.find((variant) => (variant.inventory ?? 0) > 0) ?? normalizedVariants[0]
    )
  }, [enableVariants, variants])

  const availableStock = useMemo(() => {
    if (enableVariants) {
      return selectedVariant?.inventory ?? 0
    }

    return inventory ?? 0
  }, [enableVariants, inventory, selectedVariant?.inventory])

  const existingQuantity = useMemo(() => {
    const existingItem = cart?.items?.find((item) => {
      const existingProductId = typeof item.product === 'object' ? item.product?.id : item.product
      const existingVariantId =
        item.variant && typeof item.variant === 'object' ? item.variant?.id : item.variant

      if (String(existingProductId) !== String(productId)) return false
      if (enableVariants) return String(existingVariantId) === String(selectedVariant?.id)
      return true
    })

    return existingItem?.quantity ?? 0
  }, [cart?.items, enableVariants, productId, selectedVariant?.id])

  const isOutOfStock = availableStock <= 0
  const hasReachedLimit = availableStock > 0 && existingQuantity >= availableStock
  const disabled = isLoading || isSubmitting || isCheckingCheckout || hasActiveCheckout || isOutOfStock || hasReachedLimit

  const labels =
    language === 'id'
      ? {
          add: 'Tambah Keranjang',
          buy: 'Beli Sekarang',
          added: 'Produk ditambahkan ke keranjang.',
          buying: 'Mengarahkan ke checkout...',
          soldOut: 'Habis Terjual',
          checkoutActive: 'Checkout Aktif',
        }
      : {
          add: 'Add to Cart',
          buy: 'Buy Now',
          added: 'Product added to cart.',
          buying: 'Redirecting to checkout...',
          soldOut: 'Out of Stock',
          checkoutActive: 'Checkout Active',
        }

  const addSelectedItem = async () => {
    await addItem({
      product: productId,
      variant: selectedVariant?.id,
    })
  }

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (disabled) return

    setIsSubmitting(true)
    try {
      const sessionResponse = await fetch('/api/checkout/session', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (sessionResponse.ok) {
        const { session } = await sessionResponse.json()
        if (session) {
          toast.info('Selesaikan pembayaran yang aktif sebelum membuat checkout baru.')
          router.push('/checkout')
          return
        }
      }
      await addSelectedItem()
      toast.success(labels.added)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuyNow = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (disabled) return

    setIsSubmitting(true)
    try {
      // Check for active checkout session first
      const sessionResponse = await fetch('/api/checkout/session', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (sessionResponse.ok) {
        const { session } = await sessionResponse.json()
        if (session) {
          toast.info('Selesaikan pembayaran yang aktif sebelum membuat checkout baru.')
          router.push('/checkout')
          return
        }
      }
      
      await addSelectedItem()
      toast.success(labels.buying)
      const params = new URLSearchParams({
        buyNow: '1',
        previousQuantity: String(existingQuantity),
        productId: String(productId),
        quantity: '1',
      })

      if (selectedVariant?.id) {
        params.set('variantId', String(selectedVariant.id))
      }

      router.push(`/checkout?${params.toString()}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={compact ? 'grid grid-cols-1 gap-2 md:grid-cols-2' : 'grid grid-cols-2 gap-2'}>
      <button
        className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        disabled={disabled}
        onClick={handleBuyNow}
        type="button"
      >
        {hasActiveCheckout ? labels.checkoutActive : isOutOfStock ? labels.soldOut : labels.buy}
      </button>
      <button
        className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        disabled={disabled}
        onClick={handleAddToCart}
        type="button"
      >
        {hasActiveCheckout ? labels.checkoutActive : isOutOfStock ? labels.soldOut : labels.add}
      </button>
    </div>
  )
}
