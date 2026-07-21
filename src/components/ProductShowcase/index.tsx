'use client'

import { DiscountedPrice } from '@/components/DiscountedPrice'
import { ProductCardActions } from '@/components/ProductCardActions'
import { cn } from '@/utilities/cn'
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
          {displayProducts.map((product) => (
            <article
              key={product.id}
              className="group relative h-[254px] w-[164px] shrink-0 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-muted transition-all duration-300 hover:border-foreground/30 md:h-auto md:w-auto"
            >
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
                  <p className="mb-2 text-[10px] text-muted-foreground">
                    <span className="font-medium text-card-foreground">{product.soldCount.toLocaleString('id-ID')}</span> terjual
                  </p>
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
          ))}
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
