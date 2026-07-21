'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

interface FlashSaleHeroProps {
  richText?: Page['hero']['richText']
  language?: 'id' | 'en'
}

interface FlashSaleProduct {
  id: string
  title: string
  slug: string
  priceInUSD: number
  priceInIDR?: number
  soldCount?: number
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

export const FlashSaleHero: React.FC<FlashSaleHeroProps> = ({ language = 'en' }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [products, setProducts] = useState<FlashSaleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  const isIndonesian = language === 'id'

  const formatPrice = (amount: number) => {
    if (isIndonesian) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

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

  // Countdown timer logic based on the first product's end date
  useEffect(() => {
    if (products.length === 0) return

    const firstProduct = products.find(p => p.promo?.flashSaleEndDate)
    if (!firstProduct?.promo?.flashSaleEndDate) return

    const endDate = new Date(firstProduct.promo.flashSaleEndDate).getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endDate - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [products])

  return (
    <div
      className="relative pt-24 pb-16 flex items-center text-white overflow-hidden bg-neutral-950"
      data-theme="dark"
      style={{ minHeight: '500px' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
              <Tag className="w-4 h-4" />
              {isIndonesian ? 'Promo Spesial' : 'Special Promo'}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Flash Sale
            </h1>
            
            <p className="text-lg text-neutral-400 max-w-md">
              {isIndonesian 
                ? 'Dapatkan produk digital premium dengan harga diskon terbatas. Jangan sampai kehabisan!' 
                : 'Get premium digital products at limited discounted prices. Don\'t miss out!'}
            </p>

            {timeLeft && (
              <div className="pt-4">
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
                  <Clock className="w-4 h-4" />
                  {isIndonesian ? 'Berakhir dalam:' : 'Ends in:'}
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg text-2xl font-bold text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-neutral-500 mt-2">Hours</span>
                  </div>
                  <div className="text-2xl font-bold text-neutral-600 mt-4">:</div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg text-2xl font-bold text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-neutral-500 mt-2">Mins</span>
                  </div>
                  <div className="text-2xl font-bold text-neutral-600 mt-4">:</div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg text-2xl font-bold text-white">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <span className="text-xs text-neutral-500 mt-2">Secs</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Products Grid */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-[300px] bg-neutral-900/50 animate-pulse rounded-xl border border-neutral-800" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => {
                  const imageUrl = product.gallery?.[0]?.image?.url
                  const discountPercent = product.promo?.discountPercent || 0
                  const originalPrice = isIndonesian ? (product.priceInIDR || product.priceInUSD) : product.priceInUSD
                  const discountedPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice

                  return (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.slug}`}
                      className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col"
                    >
                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 right-3 z-20 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          -{discountPercent}%
                        </div>
                      )}
                      
                      {/* Image */}
                      <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {product.title}
                        </h3>

                        {typeof (product as any).soldCount === 'number' && (product as any).soldCount > 0 && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 16.96 19.32C18.73 17.65 19.38 15.11 18.43 12.84L18.28 12.54C18.12 12.2 17.91 11.68 17.66 11.2ZM14.5 17.7C14.22 17.95 13.76 18.22 13.4 18.34C12.5 18.68 11.64 18.32 11.13 17.82C12.26 17.53 12.97 16.8 13.26 15.82C13.53 14.88 13.14 14.04 12.9 13.18C12.68 12.38 12.7 11.69 13.1 11C13.42 11.55 13.78 12.09 14.12 12.56C15.16 13.98 15.63 15.76 14.5 17.7Z"/></svg>
                              {(product as any).soldCount.toLocaleString('id-ID')} terjual
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-auto flex items-end justify-between">
                          <div>
                            {discountPercent > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-neutral-500 line-through">
                                  {formatPrice(originalPrice)}
                                </span>
                                <span className="text-xl font-bold text-white">
                                  {formatPrice(discountedPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-white">
                                {formatPrice(originalPrice)}
                              </span>
                            )}
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <ArrowRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-neutral-900/30 rounded-xl border border-neutral-800 border-dashed">
                <Tag className="w-12 h-12 text-neutral-600 mb-4" />
                <p className="text-neutral-400 text-center">
                  {isIndonesian 
                    ? 'Belum ada produk flash sale saat ini.' 
                    : 'No flash sale products available right now.'}
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}