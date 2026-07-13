'use client'

import { LocalizedPrice } from '@/components/LocalizedPrice'
import { Price } from '@/components/Price'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { AlertTriangle, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

// Per-item stock status fetched from server
type StockMap = Record<string, number> // key: `${productId}:${variantId|'base'}` → current inventory

export function CartModal({ trigger }: { trigger?: React.ReactNode }) {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [stockMap, setStockMap] = useState<StockMap>({})
  const [checkingStock, setCheckingStock] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Re-check stock every time the cart opens
  useEffect(() => {
    if (!isOpen || !cart?.items?.length) return

    const items = cart.items
      .filter((item) => typeof item.product === 'object' && item.product)
      .map((item) => ({
        productId: (item.product as Product).id,
        variantId:
          item.variant && typeof item.variant === 'object'
            ? (item.variant as { id: string }).id
            : undefined,
      }))

    if (!items.length) return

    setCheckingStock(true)
    fetch('/api/stock/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
      .then((r) => r.json())
      .then((data: { stocks: { productId: string; variantId?: string; inventory: number }[] }) => {
        const map: StockMap = {}
        for (const s of data.stocks ?? []) {
          const key = `${s.productId}:${s.variantId ?? 'base'}`
          map[key] = s.inventory
        }
        setStockMap(map)
      })
      .catch(() => {})
      .finally(() => setCheckingStock(false))
  }, [isOpen])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  // Derive per-item out-of-stock key and whether any item is out of stock
  const hasOutOfStock = useMemo(() => {
    if (!cart?.items?.length || Object.keys(stockMap).length === 0) return false
    return cart.items.some((item) => {
      if (typeof item.product !== 'object' || !item.product) return false
      const productId = (item.product as Product).id
      const variantId =
        item.variant && typeof item.variant === 'object'
          ? (item.variant as { id: string }).id
          : undefined
      const key = `${productId}:${variantId ?? 'base'}`
      return (stockMap[key] ?? 1) <= 0
    })
  }, [cart?.items, stockMap])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>{trigger || <OpenCartButton quantity={totalQuantity} />}</SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>

          <SheetDescription>Manage your cart here, add items to view the total.</SheetDescription>
        </SheetHeader>

        {!cart || cart?.items?.length === 0 ? (
          <div className="text-center flex flex-col items-center gap-2">
            <ShoppingCart className="h-16" />
            <p className="text-center text-2xl font-bold">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grow flex px-4">
            <div className="flex flex-col justify-between w-full">
              <ul className="grow overflow-auto py-4">
                {cart?.items?.map((item, i) => {
                  const product = item.product
                  const variant = item.variant

                  if (typeof product !== 'object' || !item || !product || !product.slug)
                    return <React.Fragment key={i} />

                  const metaImage =
                    product.meta?.image && typeof product.meta?.image === 'object'
                      ? product.meta.image
                      : undefined

                  const firstGalleryImage =
                    typeof product.gallery?.[0]?.image === 'object'
                      ? product.gallery?.[0]?.image
                      : undefined

                  let image = firstGalleryImage || metaImage
                  let price = product.priceInUSD
                  let priceInIDR = product.priceInIDR

                  const isVariant = Boolean(variant) && typeof variant === 'object'

                  if (isVariant) {
                    price = variant?.priceInUSD
                    priceInIDR = variant?.priceInIDR ?? priceInIDR

                    const imageVariant = product.gallery?.find((item: any) => {
                      if (!item.variantOption) return false
                      const variantOptionID =
                        typeof item.variantOption === 'object'
                          ? item.variantOption.id
                          : item.variantOption

                      const hasMatch = variant?.options?.some((option: any) => {
                        if (typeof option === 'object') return option.id === variantOptionID
                        else return option === variantOptionID
                      })

                      return hasMatch
                    })

                    if (imageVariant && typeof imageVariant.image === 'object') {
                      image = imageVariant.image
                    }
                  }

                  // Determine stock status for this item
                  const itemProductId = (item.product as Product).id
                  const itemVariantId =
                    isVariant && variant && typeof variant === 'object'
                      ? (variant as { id: string }).id
                      : undefined
                  const stockKey = `${itemProductId}:${itemVariantId ?? 'base'}`
                  const itemStock = stockMap[stockKey]
                  const itemOutOfStock = itemStock !== undefined && itemStock <= 0

                  return (
                    <li className="flex w-full flex-col" key={i}>
                      {itemOutOfStock && (
                        <div className="flex items-center gap-1.5 px-1 pt-2 pb-0">
                          <AlertTriangle size={13} className="text-red-500 shrink-0" />
                          <span className="text-xs font-semibold text-red-500">Stok habis — hapus item ini sebelum checkout</span>
                        </div>
                      )}
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <div className="absolute z-40 -mt-2 ml-[55px]">
                          <DeleteItemButton item={item} />
                        </div>
                        <Link
                          className="z-30 flex flex-row space-x-4"
                          href={`/products/${(item.product as Product)?.slug}`}
                        >
                          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            {image?.url && (
                              <Image
                                alt={image?.alt || product?.title || ''}
                                className="h-full w-full object-cover"
                                height={94}
                                src={image.url}
                                width={94}
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col text-base">
                            <span className="leading-tight">{product?.title}</span>
                            {isVariant && variant ? (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                                {variant.options
                                  ?.map((option: any) => {
                                    if (typeof option === 'object') return option.label
                                    return null
                                  })
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                        <div className="flex h-16 flex-col justify-between">
                          {typeof price === 'number' && (
                            <LocalizedPrice
                              className="flex justify-end space-y-2 text-right text-sm"
                              priceInIDR={priceInIDR}
                              priceInUSD={price}
                            />
                          )}
                          <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="px-4">
                <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {typeof cart?.subtotal === 'number' && (
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        amount={cart?.subtotal}
                        className="text-right text-base text-black dark:text-white"
                      />
                    </div>
                  )}

                  {hasOutOfStock && (
                    <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Hapus item yang stoknya habis sebelum checkout.
                    </p>
                  )}
                  <Button asChild disabled={hasOutOfStock} className={hasOutOfStock ? 'opacity-50 pointer-events-none' : ''}>
                    <Link className="w-full" href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
