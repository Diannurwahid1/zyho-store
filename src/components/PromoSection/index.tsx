'use client'

import ElectricBorder from '@/components/ElectricBorder'
import { LocalizedPrice } from '@/components/LocalizedPrice'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PromoProduct {
  id: string
  title: string
  slug: string
  priceInUSD: number
  priceInIDR?: number
  promo?: {
    isFlashSale?: boolean
    discountPercent?: number
    flashSaleEndDate?: string
  }
  gallery?: Array<{
    image?: {
      alt?: string
      url?: string
    }
  }>
}

interface PromoSectionProps {
  language?: 'id' | 'en'
}

const FlameIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 md:h-6 md:w-6"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.72 2.58c.31 2.2-.37 3.9-2.05 5.63-1.45 1.48-2.16 2.83-2.16 4.54 0 2.46 1.94 4.45 4.36 4.45 2.58 0 4.65-2.17 4.44-4.81-.13-1.52-.9-2.83-2.2-4.22-1.05-1.12-1.78-2.24-2.39-5.59Z"
      fill="#ef4444"
    />
    <path
      d="M11.91 10.4c.15 1.05-.18 1.82-.98 2.64-.67.68-.98 1.3-.98 2.05 0 1.16.91 2.1 2.05 2.1 1.21 0 2.18-1.02 2.08-2.26-.06-.71-.42-1.33-1.03-1.98-.49-.52-.83-1.06-1.14-2.55Z"
      fill="#fb7185"
    />
  </svg>
)

export function PromoSection({ language = 'en' }: PromoSectionProps) {
  const [products, setProducts] = useState<PromoProduct[]>([])
  const [loading, setLoading] = useState(true)

  const isIndonesian = language === 'id'

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const res = await fetch('/api/products?where[promo.isFlashSale][equals]=true&limit=8')
        const data = await res.json()
        if (data.docs) {
          setProducts(data.docs)
        }
      } catch (error) {
        console.error('Failed to fetch promo products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromoProducts()
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-background px-4 py-7 md:py-12">
      <div className="container mx-auto">
        <div className="mb-4 flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(90deg,#7f1d1d,#ef4444)] px-3 py-1.5 text-white shadow-[0_8px_30px_rgba(239,68,68,0.22)]">
            <FlameIcon />
            <h2 className="text-base font-semibold tracking-tight md:text-2xl">
              Flash Sale
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground">
            {isIndonesian
              ? 'Pilih penawaran yang lagi aktif sebelum waktunya habis.'
              : 'Pick the active offers before the timer runs out.'}
          </p>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[218px] w-[168px] shrink-0 animate-pulse rounded-[1rem] border border-border bg-card md:h-[320px] md:w-auto"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-4">
            {products.map((product) => {
              const imageUrl = product.gallery?.[0]?.image?.url
              const imageAlt = product.gallery?.[0]?.image?.alt || product.title
              const discountPercent = product.promo?.discountPercent ?? 0
              const discountedPriceInUSD =
                discountPercent > 0 ? Math.round(product.priceInUSD * (1 - discountPercent / 100)) : product.priceInUSD
              const discountedPriceInIDR =
                discountPercent > 0 && typeof product.priceInIDR === 'number'
                  ? Math.round(product.priceInIDR * (1 - discountPercent / 100))
                  : product.priceInIDR

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="block h-[218px] w-[168px] shrink-0 md:h-full md:w-auto"
                >
                  <ElectricBorder
                    className="h-full"
                    color="#1e3a8a"
                    speed={1}
                    chaos={0.12}
                    thickness={2}
                    style={{ borderRadius: 16 }}
                  >
                    <div className="group flex h-full flex-col overflow-hidden rounded-[1rem] border border-border bg-card text-card-foreground">
                      <div className="relative h-[108px] overflow-hidden bg-[linear-gradient(180deg,#f8fafc,#e2e8f0)] dark:bg-[linear-gradient(180deg,#0b0f19,#04050a)] md:aspect-[4/3] md:h-auto">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,#f8fafc,#e2e8f0)] dark:bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.18),transparent_45%),linear-gradient(180deg,#0b0f19,#04050a)]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent dark:from-[#030712] dark:via-[#030712]/30" />
                        {discountPercent > 0 ? (
                          <div className="absolute left-3 top-3 rounded-full bg-[linear-gradient(90deg,#7c3aed,#a855f7)] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.35)]">
                            {discountPercent}% OFF
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-1 flex-col p-3 md:p-4">
                        <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-card-foreground md:text-base">
                          {product.title}
                        </h3>

                        <div className="mt-auto pt-4">
                          {discountPercent > 0 ? (
                            <div className="mb-2">
                              <LocalizedPrice
                                as="span"
                                className="text-sm text-muted-foreground line-through"
                                priceInIDR={product.priceInIDR}
                                priceInUSD={product.priceInUSD}
                              />
                            </div>
                          ) : null}

                          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                            <LocalizedPrice
                              as="span"
                              className="text-sm font-semibold text-card-foreground md:text-lg"
                              priceInIDR={discountedPriceInIDR}
                              priceInUSD={discountedPriceInUSD}
                            />
                            <span className="hidden text-xs font-medium text-muted-foreground transition group-hover:text-card-foreground md:inline md:text-sm">
                              {isIndonesian ? 'Ambil harga ini' : 'Get this price'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ElectricBorder>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
