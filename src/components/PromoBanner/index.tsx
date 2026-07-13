'use client'

import { BRAND_LOGO_URL, BRAND_NAME } from '@/utilities/brand'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PromoBannerData {
  id: string
  title: string
  image: {
    url: string
    alt?: string
  }
  link?: string
}

interface PromoBannerProps {
  banners?: PromoBannerData[]
}

export function PromoBanner({ banners }: PromoBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Placeholder banners if none provided
  const defaultBanners: PromoBannerData[] = [
    {
      id: '1',
      title: `${BRAND_NAME} Banner 1`,
      image: {
        url: BRAND_LOGO_URL,
        alt: `${BRAND_NAME} banner 1`,
      },
    },
    {
      id: '2',
      title: `${BRAND_NAME} Banner 2`,
      image: {
        url: BRAND_LOGO_URL,
        alt: `${BRAND_NAME} banner 2`,
      },
    },
    {
      id: '3',
      title: `${BRAND_NAME} Banner 3`,
      image: {
        url: BRAND_LOGO_URL,
        alt: `${BRAND_NAME} banner 3`,
      },
    },
  ]

  const filteredBanners =
    banners?.filter((banner) => typeof banner.image?.url === 'string' && banner.image.url.length > 0) ||
    []

  const displayBanners = filteredBanners.length > 0 ? filteredBanners : defaultBanners

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || displayBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, displayBanners.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  if (displayBanners.length === 0) return null

  const currentBanner = displayBanners[currentIndex] || displayBanners[0]

  if (!currentBanner) return null
  const BannerContent = (
    <div className="relative h-[150px] w-full overflow-hidden bg-background sm:h-[220px] md:h-[400px]">
      <Image
        src={currentBanner.image.url}
        alt={currentBanner.image.alt || currentBanner.title}
        fill
        className="object-contain object-center md:object-cover"
        priority={currentIndex === 0}
      />
    </div>
  )

  return (
    <div className="relative w-full bg-background">
      {/* Main Banner */}
      {currentBanner.link ? (
        <Link href={currentBanner.link} className="block">
          {BannerContent}
        </Link>
      ) : (
        BannerContent
      )}

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm transition-all hover:bg-background"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm transition-all hover:bg-background"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 banner */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {displayBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
