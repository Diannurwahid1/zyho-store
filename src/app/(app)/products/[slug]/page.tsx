import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductArtwork } from '@/components/product/ProductArtwork'
import { PolicyCard } from '@/components/product/PolicyCard'
import { ProductDescription } from '@/components/product/ProductDescription'
import { getNormalizedBundleItems } from '@/lib/bundles'
import { getProductArtworkImages } from '@/lib/productArtwork'
import { Button } from '@/components/ui/button'
import { getCachedCurrencySettings } from '@/utilities/currencySettings'
import { getClientLanguage } from '@/utilities/getClientLanguage'
import {
    CURRENCY_PREFERENCE_COOKIE,
    getCurrencyCodeFromLanguage,
    normalizeCurrencyCode,
    resolveEnabledCurrencyCode,
    resolveProductPrice,
    resolveVariantPrice,
} from '@/utilities/pricing'
import { safeJsonForScript } from '@/utilities/safeJsonForScript'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import { cookies, draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })
  const language = await getClientLanguage()
  const { usdEnabled } = await getCachedCurrencySettings()
  const cookieStore = await cookies()
  const currencyCode = resolveEnabledCurrencyCode({
    fallbackCurrency: getCurrencyCodeFromLanguage(language),
    requestedCurrency: normalizeCurrencyCode(cookieStore.get(CURRENCY_PREFERENCE_COOKIE)?.value),
    usdEnabled,
  })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []
  const bundleArtworkImages = getProductArtworkImages(product as any, 4)
  const bundleItems = getNormalizedBundleItems(product as any)

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : product.inventory! > 0

  let price = resolveProductPrice(product, currencyCode).amount

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object') {
        const variantPrice = resolveVariantPrice(variant, currencyCode).amount

        if (typeof variantPrice === 'number' && typeof acc === 'number' && variantPrice > acc) {
          return variantPrice
        }
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: currencyCode,
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonForScript(productJsonLd),
        }}
      />
      <div className="container pt-8 pb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/shop">
            <ChevronLeftIcon />
            Semua produk
          </Link>
        </Button>
        <div className="flex flex-col gap-12 rounded-[2rem] border bg-card p-6 shadow-sm md:p-10 lg:flex-row lg:gap-10">
          <div className="h-full w-full basis-full lg:basis-1/2">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {bundleArtworkImages.length > 1 ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] border bg-card shadow-sm">
                    <ProductArtwork
                      alt={product.title}
                      className="h-full w-full"
                      images={bundleArtworkImages}
                      isBundle={bundleItems.length > 0}
                      mediaFallback={metaImage || null}
                      priority
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {bundleItems.map((item) => {
                      const childImages = getProductArtworkImages(item.product, 1)
                      const childImage = childImages[0]

                      return (
                        <div
                          key={`${item.productId}-${item.quantity}-${item.discountPercent}`}
                          className="rounded-2xl border bg-background p-3"
                        >
                          <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                            <ProductArtwork
                              alt={item.product?.title || product.title}
                              className="h-full w-full"
                              images={childImages}
                              priority={false}
                            />
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {item.product?.title || `Produk #${String(item.productId)}`}
                              </p>
                              <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                              -{item.discountPercent}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : Boolean(gallery?.length) ? (
                <Gallery gallery={gallery} />
              ) : (
                <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] border bg-card shadow-sm">
                  <ProductArtwork
                    alt={product.title}
                    className="h-full w-full"
                    images={bundleArtworkImages}
                    isBundle={bundleItems.length > 0}
                    mediaFallback={metaImage || null}
                    priority
                  />
                </div>
              )}
            </Suspense>
          </div>

          <div className="basis-full lg:basis-1/2">
            <ProductDescription product={product} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border bg-background p-6">
            <p className="text-sm text-muted-foreground">Akses</p>
            <p className="mt-2 font-semibold">Download aman setelah pembayaran</p>
          </div>
          <div className="rounded-3xl border bg-background p-6">
            <p className="text-sm text-muted-foreground">Versi</p>
            <p className="mt-2 font-semibold">{product.version || '1.0.0'}</p>
          </div>
          {product.updatePolicy && (
            <PolicyCard id="update-policy" title="Update Policy" content={product.updatePolicy} />
          )}
          {product.refundPolicy && (
            <PolicyCard id="refund-policy" title="Refund Policy" content={product.refundPolicy} />
          )}
        </div>
      </div>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

      {relatedProducts.length ? (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Produk terkait</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link className="relative h-full w-full" href={`/products/${product.slug}`}>
              <GridTileImage
                label={{
                  priceInIDR: product.priceInIDR || undefined,
                  priceInUSD: product.priceInUSD!,
                  title: product.title,
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInIDR: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
