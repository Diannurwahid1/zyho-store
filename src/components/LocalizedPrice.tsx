'use client'

import { Price } from '@/components/Price'
import { resolveDisplayPrice } from '@/utilities/pricing'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'

type Props = {
  as?: 'p' | 'span'
  className?: string
  currencyCode?: 'IDR' | 'USD'
  priceInIDR?: null | number
  priceInUSD?: null | number
}

export function LocalizedPrice({
  as,
  className,
  currencyCode,
  priceInIDR,
  priceInUSD,
}: Props) {
  const { currency } = useCurrency()
  const resolvedPrice = resolveDisplayPrice(
    { priceInIDR, priceInUSD },
    currencyCode || currency.code,
  )

  if (typeof resolvedPrice.amount !== 'number') {
    return null
  }

  return (
    <Price
      amount={resolvedPrice.amount}
      as={as}
      className={className}
      currencyCode={resolvedPrice.currencyCode}
    />
  )
}
