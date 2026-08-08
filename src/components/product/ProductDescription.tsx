'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { DiscountedPrice } from '@/components/DiscountedPrice'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getNormalizedBundleItems } from '@/lib/bundles'
import { gaViewItem } from '@/utilities/googleAnalytics'
import { getProductBadgeLabel } from '@/utilities/productBadge'
import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { VariantSelector } from './VariantSelector'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  const badgeLabel = getProductBadgeLabel(product as any)
  const normalizedUpdatePolicy =
    typeof product.updatePolicy === 'string' ? product.updatePolicy.trim() : ''
  const normalizedRefundPolicy =
    typeof product.refundPolicy === 'string' ? product.refundPolicy.trim() : ''
  const hasUpdatePolicy = normalizedUpdatePolicy.length > 0
  const hasRefundPolicy = normalizedRefundPolicy.length > 0
  const requiresPolicyConsent = hasUpdatePolicy || hasRefundPolicy
  const [policyChecked, setPolicyChecked] = useState(!requiresPolicyConsent)
  const bundleItems = useMemo(() => getNormalizedBundleItems(product as any), [product])
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

  useEffect(() => {
    setPolicyChecked(!requiresPolicyConsent)
  }, [product.id, requiresPolicyConsent])

  const policyConsentComplete = useMemo(() => {
    if (!requiresPolicyConsent) return true
    return policyChecked
  }, [policyChecked, requiresPolicyConsent])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {badgeLabel ? (
            <span className="w-fit rounded-full bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-wide text-background">
              {badgeLabel}
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
        {bundleItems.length > 0 ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Bundle termasuk
            </p>
            <div className="mt-3 grid gap-2">
              {bundleItems.map((item) => (
                <div
                  key={`${item.productId}-${item.quantity}-${item.discountPercent}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.product?.title || `Produk #${String(item.productId)}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600">
                    -{item.discountPercent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="text-3xl font-semibold">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <DiscountedPrice 
              productId={product.id}
              priceInIDR={product.priceInIDR ?? undefined}
              priceInUSD={product.priceInUSD ?? undefined}
              showDiscountBadge={true}
            />
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
        {requiresPolicyConsent ? (
          <div className="mb-4 flex flex-col gap-3">
            <div className="rounded-2xl border border-border/70 bg-background p-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`policy-check-${product.id}`}
                  checked={policyChecked}
                  onCheckedChange={(checked) => setPolicyChecked(Boolean(checked))}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`policy-check-${product.id}`}
                    className="block text-sm font-medium leading-6"
                  >
                    Saya sudah baca policy produk ini
                  </label>
                  <div className="mt-1 flex flex-col items-start gap-1">
                    {hasUpdatePolicy ? (
                      <Button
                        asChild
                        variant="link"
                        className="h-auto justify-start p-0 text-sm text-blue-700 hover:text-blue-600"
                      >
                        <Link href="#update-policy">Buka Update Policy</Link>
                      </Button>
                    ) : null}
                    {hasRefundPolicy ? (
                      <Button
                        asChild
                        variant="link"
                        className="h-auto justify-start p-0 text-sm text-blue-700 hover:text-blue-600"
                      >
                        <Link href="#refund-policy">Buka Refund Policy</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
            Produk ini belum punya `Update Policy` atau `Refund Policy`, jadi checklist policy tidak diperlukan.
          </div>
        )}

        <Suspense fallback={null}>
          <AddToCart
            product={product}
            externallyDisabled={!policyConsentComplete}
            disabledLabel="Centang policy dulu"
          />
        </Suspense>
      </div>

      <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="rounded-2xl border p-4">Akses download via akun</div>
        <div className="rounded-2xl border p-4">Support setelah pembelian</div>
      </div>
    </div>
  )
}
