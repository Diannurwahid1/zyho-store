'use client'

import { Price } from '@/components/Price'
import type { SupportedCurrencyCode } from '@/utilities/pricing'
import { ArrowRight, Clock, Flame, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect, useState } from 'react'

interface FlashSaleProduct {
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
      url?: string
      alt?: string
    }
  }>
}

interface FlashSaleSectionProps {
  language?: 'id' | 'en'
}

export function FlashSaleSection({ language = 'en' }: FlashSaleSectionProps) {
  const { currency } = useCurrency()
  const [products, setProducts] = useState<FlashSaleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  const isIndonesian = language === 'id'
  const activeCurrencyCode: SupportedCurrencyCode = currency.code === 'USD' ? 'USD' : 'IDR'

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const res = await fetch('/api/products?where[promo.isFlashSale][equals]=true&limit=4')
        const data = await res.json()
        if (data.docs) {
          setProducts(data.docs)
        }
      } catch (error) {
        console.error('Failed to fetch flash sale products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashSaleProducts()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (products.length === 0) return

    const endDate = products[0]?.promo?.flashSaleEndDate
    if (!endDate) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [products])

  // Don't render if no flash sale products
  if (!loading && products.length === 0) return null

  return (
    <section className="relative py-16 bg-gradient-to-b from-neutral-950 via-red-950/10 to-neutral-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                {isIndonesian ? 'Flash Sale' : 'Flash Sale'}
                <Zap className="w-6 h-6 text-yellow-400" />
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                {isIndonesian
                  ? 'Penawaran terbatas, jangan sampai kehabisan!'
                  : 'Limited time offers, don\'t miss out!'}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          {products.length > 0 && products[0]?.promo?.flashSaleEndDate && (
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-red-500/30 rounded-lg px-4 py-2">
              <Clock className="w-4 h-4 text-red-400" />
              <div className="flex items-center gap-1 font-mono text-white">
                <span className="bg-red-500/20 px-2 py-1 rounded text-sm font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-red-400">:</span>
                <span className="bg-red-500/20 px-2 py-1 rounded text-sm font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-red-400">:</span>
                <span className="bg-red-500/20 px-2 py-1 rounded text-sm font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[320px] bg-neutral-900/50 animate-pulse rounded-xl border border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const imageUrl = product.gallery?.[0]?.image?.url
              const discountPercent = product.promo?.discountPercent ?? 0
              const originalPrice =
                activeCurrencyCode === 'IDR'
                  ? (product.priceInIDR ?? product.priceInUSD)
                  : product.priceInUSD
              const discountedPrice = discountPercent > 0 
                ? originalPrice * (1 - discountPercent / 100) 
                : originalPrice

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700">
                        <Flame className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {product.title}
                    </h3>

                    <div className="mt-auto pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <div>
                        {discountPercent > 0 ? (
                          <div className="flex flex-col">
                            <Price
                              as="span"
                              amount={originalPrice}
                              className="text-xs text-neutral-500 line-through"
                              currencyCode={activeCurrencyCode}
                            />
                            <Price
                              as="span"
                              amount={discountedPrice}
                              className="text-lg font-bold text-white"
                              currencyCode={activeCurrencyCode}
                            />
                          </div>
                        ) : (
                          <Price
                            as="span"
                            amount={originalPrice}
                            className="text-lg font-bold text-white"
                            currencyCode={activeCurrencyCode}
                          />
                        )}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* View All Link */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 group"
          >
            {isIndonesian ? 'Lihat Semua Flash Sale' : 'View All Flash Sales'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
