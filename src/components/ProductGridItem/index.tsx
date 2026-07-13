import type { Product } from '@/payload-types'

import { LocalizedPrice } from '@/components/LocalizedPrice'
import { Media } from '@/components/Media'
import { ProductCardActions } from '@/components/ProductCardActions'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { badge, gallery, priceInUSD, priceInIDR, shortDescription, title } = product

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
        ) : badge ? (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-foreground px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-background md:left-4 md:top-4 md:px-3 md:py-1 md:text-xs">
            {badge.replace('_', ' ')}
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
              <LocalizedPrice priceInIDR={priceIDR} priceInUSD={price} />
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
