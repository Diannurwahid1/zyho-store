'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'
import { gaAddToCart } from '@/utilities/googleAnalytics'

import { WaitlistDialog } from '@/components/WaitlistDialog'
import { useActiveCheckout } from '@/hooks/useActiveCheckout'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
type Props = {
  product: Product
  externallyDisabled?: boolean
  disabledLabel?: string
}

export function AddToCart({
  product,
  externallyDisabled = false,
  disabledLabel = 'Checklist policy dulu',
}: Props) {
  const { addItem, cart, isLoading } = useCart()
  const { currency } = useCurrency()
  const { hasActiveCheckout, isChecking: isCheckingCheckout } = useActiveCheckout()
  const searchParams = useSearchParams()

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const [availableStock, setAvailableStock] = React.useState<number | null>(null)
  const [isCheckingStock, setIsCheckingStock] = React.useState(false)

  React.useEffect(() => {
    if (!product.id) return

    const variantId = selectedVariant?.id
    const url = new URL('/api/stock/check', window.location.origin)
    url.searchParams.set('productId', String(product.id))
    if (variantId) {
      url.searchParams.set('variantId', String(variantId))
    }

    setIsCheckingStock(true)
    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.available === 'number') {
          setAvailableStock(data.available)
        }
      })
      .catch((err) => console.error('Failed to fetch stock', err))
      .finally(() => setIsCheckingStock(false))
  }, [product.id, selectedVariant?.id])

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).then(() => {
        gaAddToCart({
          currency: currency.code,
          product,
          quantity: 1,
          variant: selectedVariant,
        })
        toast.success('Item added to cart.')
      })
    },
    [addItem, currency.code, product, selectedVariant],
  )

  const disabled = useMemo<boolean>(() => {
    if (externallyDisabled) {
      return true
    }

    // Disable jika ada active checkout session
    if (hasActiveCheckout) {
      return true
    }

    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (availableStock !== null) {
        return existingQuantity >= availableStock
      }

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (availableStock !== null) {
      return availableStock <= 0
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, cart?.items, product, availableStock, hasActiveCheckout, externallyDisabled])

  const isOutOfStock = useMemo<boolean>(() => {
    if (availableStock !== null) {
      return availableStock <= 0
    }

    if (product.enableVariants) {
      if (!selectedVariant) return false // variant not selected yet
      return (selectedVariant.inventory ?? 0) <= 0
    }
    return (product.inventory ?? 0) <= 0
  }, [selectedVariant, product, availableStock])

  if (isOutOfStock) {
    return (
      <WaitlistDialog 
        productId={product.id} 
        productTitle={product.title}
        trigger={
          <Button
            aria-label="Join Waiting List"
            variant={'outline'}
            className="w-full hover:opacity-90"
            type="button"
          >
            Join Waiting List
          </Button>
        }
      />
    )
  }

  return (
    <Button
      aria-label="Add to cart"
      variant={'outline'}
      className={clsx({
        'hover:opacity-90': true,
        'opacity-60 cursor-not-allowed': disabled || isLoading || isCheckingCheckout || isCheckingStock,
      })}
      disabled={disabled || isLoading || isCheckingCheckout || isCheckingStock}
      onClick={addToCart}
      type="submit"
    >
      {isCheckingCheckout
        ? 'Checking...'
        : hasActiveCheckout
          ? 'Checkout Aktif'
          : externallyDisabled
            ? disabledLabel
          : isCheckingStock
            ? 'Checking Stock...'
            : 'Add To Cart'}
    </Button>
  )
}
