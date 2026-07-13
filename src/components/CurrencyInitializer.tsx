'use client'

import {
  CURRENCY_PREFERENCE_COOKIE,
  normalizeCurrencyCode,
  resolveEnabledCurrencyCode,
  type SupportedCurrencyCode,
} from '@/utilities/pricing'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect, useRef } from 'react'

type Props = {
  currencyCode: SupportedCurrencyCode
  usdEnabled: boolean
}

export function CurrencyInitializer({ currencyCode, usdEnabled }: Props) {
  const { currency, setCurrency } = useCurrency()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }

    hasInitialized.current = true

    const storedCurrency = normalizeCurrencyCode(
      typeof window !== 'undefined' ? window.localStorage.getItem(CURRENCY_PREFERENCE_COOKIE) : null,
    )

    const cookieCurrency = normalizeCurrencyCode(
      typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find((entry) => entry.startsWith(`${CURRENCY_PREFERENCE_COOKIE}=`))
            ?.split('=')[1]
        : null,
    )

    const nextCurrency = resolveEnabledCurrencyCode({
      fallbackCurrency: currencyCode,
      requestedCurrency: storedCurrency || cookieCurrency,
      usdEnabled,
    })

    if (currency.code !== nextCurrency) {
      setCurrency(nextCurrency)
    }
  }, [currency.code, currencyCode, setCurrency, usdEnabled])

  useEffect(() => {
    if (!usdEnabled && currency.code === 'USD') {
      setCurrency('IDR')
    }
  }, [currency.code, setCurrency, usdEnabled])

  return null
}
