'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { gaViewItem } from '@/utilities/googleAnalytics'
import { Suspense, useEffect } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { VariantSelector } from './VariantSelector'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  useEffect(() => {
    gaViewItem({
      currency: currency.code,
      product,
    })
  }, [currency.code, product])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {product.badge ? (
            <span className="w-fit rounded-full bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-wide text-background">
              {product.badge.replace('_', ' ')}
            </span>
          ) : null}
          <span className="w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Produk Digital
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{product.title}</h1>
        {product.shortDescription ? (
          <p className="text-lg leading-8 text-muted-foreground">{product.shortDescription}</p>
        ) : null}
        <div className="text-3xl font-semibold">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>
      {product.description ? (
        <RichText className="" data={product.description} enableGutter={false} />
      ) : null}
      <hr />
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>

          <hr />
        </>
      )}
      <div className="rounded-2xl border bg-muted/30 p-4">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      <div className="rounded-2xl border bg-background p-4">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>

      <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="rounded-2xl border p-4">Akses download via akun</div>
        <div className="rounded-2xl border p-4">Support setelah pembelian</div>
      </div>
    </div>
  )
}
