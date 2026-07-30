import type { Product } from '@/payload-types'

import { DiscountedPrice } from '@/components/DiscountedPrice'
import { Media } from '@/components/Media'
import { ProductCardActions } from '@/components/ProductCardActions'
import { getProductBadgeLabel } from '@/utilities/productBadge'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, priceInIDR, shortDescription, title } = product
  const soldCount = (product as any).soldCount as number | undefined
  const badgeLabel = getProductBadgeLabel(product as any)

  let price = priceInUSD
  let priceIDR = priceInIDR

  const variants = product.variants?.docs

  let isOutOfStock = false
  if (product.enableVariants && variants && variants.length > 0) {
    isOutOfStock = variants.every((variant) => typeof variant === 'object' && (variant.inventory ?? 0) <= 0)
  } else {
    isOutOfStock = (product.inventory ?? 0) <= 0
  }

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (variant && typeof variant === 'object') {
      if ('priceInUSD' in variant && typeof variant.priceInUSD === 'number') {
        price = variant.priceInUSD
      }

      if ('priceInIDR' in variant && typeof variant.priceInIDR === 'number') {
        priceIDR = variant.priceInIDR
      }
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:rounded-3xl">
      <div className="relative m-1.5 overflow-hidden rounded-xl bg-muted md:m-3 md:rounded-2xl">
        {isOutOfStock ? (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white md:left-4 md:top-4 md:px-3 md:py-1 md:text-xs">
            Habis Terjual
          </span>
        ) : badgeLabel ? (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-foreground px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-background md:left-4 md:top-4 md:px-3 md:py-1 md:text-xs">
            {badgeLabel}
          </span>
        ) : null}

        <Link href={`/products/${product.slug}`}>
          {image ? (
            <Media
              className={clsx('relative aspect-square object-cover md:aspect-[4/3]')}
              height={360}
              imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              resource={image}
              width={480}
            />
          ) : (
            <div className="aspect-square bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 md:aspect-[4/3]" />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2 pb-2.5 pt-0.5 md:gap-4 md:p-6 md:pt-3">
        <div className="flex flex-col gap-1.5 md:flex-row md:items-start md:justify-between md:gap-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight group-hover:underline group-hover:underline-offset-4 md:text-xl">
              {title}
            </h3>
          </Link>

          {typeof price === 'number' && (
            <div className="shrink-0 text-[10px] font-semibold md:text-base">
              <DiscountedPrice 
                productId={product.id || 0}
                priceInIDR={priceIDR ?? undefined} 
                priceInUSD={price ?? undefined}
                showDiscountBadge={true}
              />
            </div>
          )}
        </div>

        {shortDescription ? (
          <p className="hidden line-clamp-2 text-sm leading-6 text-muted-foreground md:block">
            {shortDescription}
          </p>
        ) : (
          <p className="hidden line-clamp-2 text-sm leading-6 text-muted-foreground md:block">
            Produk digital siap pakai dengan akses download aman setelah pembayaran.
          </p>
        )}

        {typeof soldCount === 'number' && soldCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400 md:gap-1 md:px-2.5 md:py-1 md:text-xs">
              <svg className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 16.96 19.32C18.73 17.65 19.38 15.11 18.43 12.84L18.28 12.54C18.12 12.2 17.91 11.68 17.66 11.2ZM14.5 17.7C14.22 17.95 13.76 18.22 13.4 18.34C12.5 18.68 11.64 18.32 11.13 17.82C12.26 17.53 12.97 16.8 13.26 15.82C13.53 14.88 13.14 14.04 12.9 13.18C12.68 12.38 12.7 11.69 13.1 11C13.42 11.55 13.78 12.09 14.12 12.56C15.16 13.98 15.63 15.76 14.5 17.7Z"/></svg>
              {soldCount.toLocaleString('id-ID')} terjual
            </span>
          </div>
        )}

        <div className="mt-auto pt-1 md:pt-2">
          <ProductCardActions
            compact
            enableVariants={product.enableVariants}
            inventory={product.inventory}
            productId={product.id || 0}
            variants={variants
              ?.filter((variant) => typeof variant === 'object' && variant !== null)
              .map((variant) => ({
                id: variant.id,
                inventory: variant.inventory,
              }))}
          />
        </div>
      </div>
    </article>
  )
}
