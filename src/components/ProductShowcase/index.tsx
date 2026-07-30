'use client'

import { DiscountedPrice } from '@/components/DiscountedPrice'
import { ProductCardActions } from '@/components/ProductCardActions'
import { cn } from '@/utilities/cn'
import { getProductBadgeLabel } from '@/utilities/productBadge'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

interface ShowcaseProduct {
  id: number
  title: string
  slug: string
  priceInUSD?: number
  priceInIDR?: number
  image: string
  description: string
  badge?: string
  customBadge?: string
  inventory?: number
  soldCount?: number
  enableVariants?: boolean
  variants?: {
    id: number
    inventory?: number | null
  }[]
}

interface ProductShowcaseProps {
  language?: 'id' | 'en'
  products?: ShowcaseProduct[]
}

const products: ShowcaseProduct[] = [
  {
    id: 1,
    title: 'ChatGPT Plus',
    slug: 'chatgpt-plus',
    description: 'Access to ChatGPT Pro with various premium features',
    priceInUSD: 39,
    priceInIDR: 600000,
    image: '',
    inventory: 10,
    enableVariants: false,
  },
  {
    id: 2,
    title: 'Claude Pro',
    slug: 'claude-pro',
    description: 'Latest Claude AI with deep analysis capabilities',
    priceInUSD: 49,
    priceInIDR: 750000,
    image: '',
    inventory: 10,
    enableVariants: false,
  },
  {
    id: 3,
    title: 'Midjourney',
    slug: 'midjourney',
    description: 'Create high-quality AI images with Midjourney',
    priceInUSD: 49,
    priceInIDR: 750000,
    image: '',
    inventory: 10,
    enableVariants: false,
  },
]

const tabs = [
  { id: 'all', labelId: 'Semua Produk', labelEn: 'All Products' },
  { id: 'popular', labelId: 'Populer', labelEn: 'Popular' },
  { id: 'ai-tools', labelId: 'AI Tools', labelEn: 'AI Tools' },
]

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  language = 'en',
  products: realProducts,
}) => {
  const { currency } = useCurrency()
  const [activeTab, setActiveTab] = useState('all')
  const isIndonesian = language === 'id'

  const displayProducts = realProducts || products

  return (
    <section className="bg-background px-4 py-7 md:py-12">
      <div className="container mx-auto">
        <div className="mb-5 text-center md:mb-8">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {isIndonesian ? 'PRODUK POPULER' : 'POPULAR PRODUCTS'}
          </p>
          <h2 className="mb-2 text-lg font-bold text-foreground md:text-3xl">
            {isIndonesian ? 'Produk AI Premium Pilihan' : 'Featured Premium AI Products'}
          </h2>
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2 md:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {isIndonesian ? tab.labelId : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="mb-5 flex gap-3 overflow-x-auto pb-2 md:mb-8 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible lg:grid-cols-3">
          {displayProducts.map((product) => {
            const badgeLabel = getProductBadgeLabel(product)

            return (
              <article
                key={product.id}
                className="group relative h-[254px] w-[164px] shrink-0 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-muted transition-all duration-300 hover:border-foreground/30 md:h-auto md:w-auto"
              >
                {badgeLabel ? (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-foreground px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-background md:left-3 md:top-3 md:text-[10px]">
                    {badgeLabel}
                  </span>
                ) : null}
                <Link href={`/products/${product.slug}`}>
                  {product.image && (
                    <div className="relative h-[104px] w-full bg-muted md:h-48">
                      <Image src={product.image} alt={product.title} fill className="object-cover" />
                    </div>
                  )}
                </Link>

                <div className="p-3 md:p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mb-2 line-clamp-2 text-[13px] font-bold text-card-foreground md:text-base">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

                  {typeof product.soldCount === 'number' && product.soldCount > 0 && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 md:px-2.5 md:py-1 md:text-xs">
                        <svg className="h-3 w-3 md:h-3.5 md:w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 16.96 19.32C18.73 17.65 19.38 15.11 18.43 12.84L18.28 12.54C18.12 12.2 17.91 11.68 17.66 11.2ZM14.5 17.7C14.22 17.95 13.76 18.22 13.4 18.34C12.5 18.68 11.64 18.32 11.13 17.82C12.26 17.53 12.97 16.8 13.26 15.82C13.53 14.88 13.14 14.04 12.9 13.18C12.68 12.38 12.7 11.69 13.1 11C13.42 11.55 13.78 12.09 14.12 12.56C15.16 13.98 15.63 15.76 14.5 17.7Z"/></svg>
                        {product.soldCount.toLocaleString('id-ID')} terjual
                      </span>
                    </div>
                  )}

                  <div className="mb-3 flex items-center justify-between">
                    <DiscountedPrice
                      as="span"
                      className="text-sm font-bold text-card-foreground md:text-lg"
                      productId={product.id}
                      priceInIDR={product.priceInIDR}
                      priceInUSD={product.priceInUSD}
                      showDiscountBadge={true}
                    />
                  </div>

                  <ProductCardActions
                    compact
                    enableVariants={product.enableVariants}
                    inventory={product.inventory}
                    language={language}
                    productId={product.id}
                    variants={product.variants}
                  />
                </div>
              </article>
            )
          })}
        </div>

        <div className="text-center">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-card-foreground transition-all hover:bg-accent"
          >
            {isIndonesian ? 'Lihat Semua Produk' : 'View All Products'}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 7l5 5m0 0l-5 5m5-5H6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
