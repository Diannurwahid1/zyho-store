import type { Product, Variant } from '@/payload-types'

export type SupportedCurrencyCode = 'IDR' | 'USD'
export const CURRENCY_PREFERENCE_COOKIE = 'preferred_currency'

type PriceSource = {
  priceInIDR?: null | number
  priceInUSD?: null | number
}

export const DEFAULT_CURRENCY_CODE: SupportedCurrencyCode = 'IDR'

export const normalizeCurrencyCode = (
  value: null | string | undefined,
): SupportedCurrencyCode | null => {
  const normalized = value?.toUpperCase()

  if (normalized === 'IDR' || normalized === 'USD') {
    return normalized
  }

  return null
}

export const getCurrencyCodeFromLanguage = (
  language: 'en' | 'id',
): SupportedCurrencyCode => {
  return language === 'id' ? 'IDR' : 'USD'
}

export const resolveEnabledCurrencyCode = ({
  fallbackCurrency,
  requestedCurrency,
  usdEnabled,
}: {
  fallbackCurrency: SupportedCurrencyCode
  requestedCurrency: null | SupportedCurrencyCode
  usdEnabled: boolean
}): SupportedCurrencyCode => {
  if (requestedCurrency === 'USD' && !usdEnabled) {
    return 'IDR'
  }

  if (fallbackCurrency === 'USD' && !usdEnabled) {
    return 'IDR'
  }

  return requestedCurrency || fallbackCurrency
}

export const getLocaleForCurrency = (currencyCode?: null | string): string => {
  return currencyCode?.toUpperCase() === 'IDR' ? 'id-ID' : 'en-US'
}

export const resolveDisplayPrice = (
  source: PriceSource,
  currencyCode: null | string | undefined,
): { amount: null | number; currencyCode: SupportedCurrencyCode } => {
  const normalizedCurrency = currencyCode?.toUpperCase()

  if (normalizedCurrency === 'IDR' && typeof source.priceInIDR === 'number') {
    return { amount: source.priceInIDR, currencyCode: 'IDR' }
  }

  if (normalizedCurrency === 'USD' && typeof source.priceInUSD === 'number') {
    return { amount: source.priceInUSD, currencyCode: 'USD' }
  }

  if (typeof source.priceInIDR === 'number') {
    return { amount: source.priceInIDR, currencyCode: 'IDR' }
  }

  if (typeof source.priceInUSD === 'number') {
    return { amount: source.priceInUSD, currencyCode: 'USD' }
  }

  return { amount: null, currencyCode: DEFAULT_CURRENCY_CODE }
}

export const resolveProductPrice = (
  product: Pick<Product, 'priceInIDR' | 'priceInUSD'>,
  currencyCode: null | string | undefined,
): { amount: null | number; currencyCode: SupportedCurrencyCode } => {
  return resolveDisplayPrice(product, currencyCode)
}

export const resolveVariantPrice = (
  variant: Pick<Variant, 'priceInIDR' | 'priceInUSD'>,
  currencyCode: null | string | undefined,
): { amount: null | number; currencyCode: SupportedCurrencyCode } => {
  return resolveDisplayPrice(variant, currencyCode)
}
