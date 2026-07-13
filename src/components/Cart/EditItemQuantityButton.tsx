'use client'

import { CartItem } from '@/components/Cart'
import { gaAddToCart, gaRemoveFromCart } from '@/utilities/googleAnalytics'
import type { Product, Variant } from '@/payload-types'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useMemo } from 'react'

export function EditItemQuantityButton({ type, item }: { item: CartItem; type: 'minus' | 'plus' }) {
  const { decrementItem, incrementItem, isLoading } = useCart()
  const { currency } = useCurrency()
  const [availableStock, setAvailableStock] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!item.product) return

    const productId = typeof item.product === 'object' ? item.product.id : item.product
    const variantId = typeof item.variant === 'object' ? item.variant?.id : item.variant

    const url = new URL('/api/stock/check', window.location.origin)
    url.searchParams.set('productId', String(productId))
    if (variantId) {
      url.searchParams.set('variantId', String(variantId))
    }

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.available === 'number') {
          setAvailableStock(data.available)
        }
      })
      .catch((err) => console.error('Failed to fetch stock', err))
  }, [item.product, item.variant])

  const disabled = useMemo(() => {
    if (!item.id) return true

    const target =
      item.variant && typeof item.variant === 'object'
        ? item.variant
        : item.product && typeof item.product === 'object'
          ? item.product
          : null

    if (
      target &&
      typeof target === 'object' &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
        if (availableStock !== null) {
          return item.quantity >= availableStock
        }
        return item.quantity >= target.inventory
      }
    }

    return false
  }, [item, type, availableStock])

  return (
    <form>
      <button
        disabled={disabled || isLoading}
        aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
        className={clsx(
          'ease hover:cursor-pointer flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
          {
            'cursor-not-allowed': disabled || isLoading,
            'ml-auto': type === 'minus',
          },
        )}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()

          if (item.id && item.product && typeof item.product === 'object' && item.product.title) {
            const product = item.product as Product
            const variant =
              item.variant && typeof item.variant === 'object' ? (item.variant as Variant) : null

            if (type === 'plus') {
              gaAddToCart({ currency: currency.code, product, quantity: 1, variant })
              incrementItem(item.id)
            } else {
              gaRemoveFromCart({ currency: currency.code, product, quantity: 1, variant })
              decrementItem(item.id)
            }
          }
        }}
        type="button"
      >
        {type === 'plus' ? (
          <PlusIcon className="h-4 w-4 dark:text-neutral-500 hover:text-blue-300" />
        ) : (
          <MinusIcon className="h-4 w-4 dark:text-neutral-500 hover:text-blue-300" />
        )}
      </button>
    </form>
  )
}
