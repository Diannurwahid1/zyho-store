'use client'

import type { CartItem } from '@/components/Cart'
import { gaRemoveFromCart } from '@/utilities/googleAnalytics'
import type { Product, Variant } from '@/payload-types'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const { currency } = useCurrency()
  const itemId = item.id

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          'ease hover:cursor-pointer flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
          {
            'cursor-not-allowed px-0': !itemId || isLoading,
          },
        )}
        disabled={!itemId || isLoading}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          if (itemId) {
            if (item.product && typeof item.product === 'object' && item.product.title) {
              gaRemoveFromCart({
                currency: currency.code,
                product: item.product as Product,
                quantity: item.quantity || 1,
                variant:
                  item.variant && typeof item.variant === 'object'
                    ? (item.variant as Variant)
                    : null,
              })
            }

            removeItem(itemId)
          }
        }}
        type="button"
      >
        <XIcon className="hover:text-accent-3 mx-px h-4 w-4 text-white dark:text-black" />
      </button>
    </form>
  )
}
