'use client'

import { LocalizedPrice } from '@/components/LocalizedPrice'
import { useActiveVouchers } from '@/providers/ActiveVouchers'
import { cn } from '@/utilities/cn'
import React from 'react'

interface DiscountedPriceProps {
  productId: string | number
  priceInUSD?: number
  priceInIDR?: number
  className?: string
  as?: 'span' | 'p'
  showDiscountBadge?: boolean
}

export const DiscountedPrice: React.FC<DiscountedPriceProps> = ({
  productId,
  priceInUSD,
  priceInIDR,
  className,
  as = 'p',
  showDiscountBadge = false,
}) => {
  const { getProductDiscount } = useActiveVouchers()
  const discount = getProductDiscount(productId)

  // Kalau tidak ada diskon, tampilkan harga normal
  if (!discount) {
    return (
      <LocalizedPrice
        as={as}
        className={className}
        priceInIDR={priceInIDR}
        priceInUSD={priceInUSD}
      />
    )
  }

  // Hitung harga setelah diskon
  const calculateDiscountedPrice = (originalPrice?: number): number | undefined => {
    if (!originalPrice) return undefined

    if (discount.discountType === 'percentage') {
      return originalPrice * (1 - discount.amount / 100)
    } else {
      // Fixed discount
      return Math.max(0, originalPrice - discount.amount)
    }
  }

  const discountedPriceInUSD = calculateDiscountedPrice(priceInUSD)
  const discountedPriceInIDR = calculateDiscountedPrice(priceInIDR)

  // Hitung persentase diskon untuk badge
  const getDiscountPercentage = (): number => {
    if (discount.discountType === 'percentage') {
      return discount.amount
    } else {
      // Untuk fixed discount, hitung persentasenya
      const basePrice = priceInIDR || priceInUSD || 0
      if (basePrice === 0) return 0
      return Math.round((discount.amount / basePrice) * 100)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {showDiscountBadge && discount.isWelcomeVoucher && (
        <span className="w-fit rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-200">
          Promo pengguna baru
        </span>
      )}
      <div className="flex items-center gap-2">
        {/* Harga original dengan garis coret */}
        <LocalizedPrice
          as={as}
          className={cn('text-sm text-muted-foreground line-through', className)}
          priceInIDR={priceInIDR}
          priceInUSD={priceInUSD}
        />
        {/* Badge diskon */}
        {showDiscountBadge && !discount.isWelcomeVoucher && (
          <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{getDiscountPercentage()}%
          </span>
        )}
        {showDiscountBadge && discount.isWelcomeVoucher && (
          <span className="rounded-md bg-amber-300 px-2 py-0.5 text-xs font-black text-black">
            -{getDiscountPercentage()}%
          </span>
        )}
      </div>
      {/* Harga setelah diskon */}
      <LocalizedPrice
        as={as}
        className={cn('font-bold text-red-600', className)}
        priceInIDR={discountedPriceInIDR}
        priceInUSD={discountedPriceInUSD}
      />
    </div>
  )
}
