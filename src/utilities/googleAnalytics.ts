import type { Product, Variant } from '@/payload-types'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const measurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const enabledInDevelopment = process.env.NEXT_PUBLIC_GA_ENABLE_IN_DEV === 'true'

const canTrack = () =>
  typeof window !== 'undefined' &&
  Boolean(measurementID) &&
  typeof window.gtag === 'function' &&
  (process.env.NODE_ENV === 'production' || enabledInDevelopment)

export const pageview = (url: string) => {
  if (!canTrack() || !measurementID) return

  window.gtag?.('config', measurementID, {
    page_location: window.location.origin + url,
    page_path: url,
    page_title: document.title,
  })
}

export const gaEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (!canTrack()) return
  window.gtag?.('event', name, params)
}

export const gaLogin = (method: string) => {
  gaEvent('login', { method })
}

export const gaSignUp = (method: string) => {
  gaEvent('sign_up', { method })
}

export const gaBeginCheckout = ({
  currency,
  value,
}: {
  currency: string
  value: number
}) => {
  gaEvent('begin_checkout', {
    currency,
    value,
  })
}

export type AnalyticsItem = {
  item_id: string
  item_name: string
  item_variant?: string
  price?: number
  quantity?: number
}

const normalizeCurrency = (currency?: string) => currency?.toUpperCase()

const getVariantLabel = (variant?: Variant | null) => {
  if (!variant?.options?.length) return undefined

  const labels = variant.options
    .map((option) => (typeof option === 'object' ? option.label : null))
    .filter(Boolean)

  return labels.length ? labels.join(', ') : undefined
}

const getPriceByCurrency = ({
  currency,
  product,
  variant,
}: {
  currency?: string
  product?: Product | null
  variant?: Variant | null
}) => {
  const normalizedCurrency = normalizeCurrency(currency)

  if (normalizedCurrency === 'IDR') {
    return variant?.priceInIDR ?? product?.priceInIDR ?? undefined
  }

  if (normalizedCurrency === 'USD') {
    return variant?.priceInUSD ?? product?.priceInUSD ?? undefined
  }

  return undefined
}

type ProductAnalyticsInput = {
  currency?: string
  product: Product
  quantity?: number
  variant?: Variant | null
}

export const buildAnalyticsItem = ({
  currency,
  product,
  quantity = 1,
  variant,
}: ProductAnalyticsInput): AnalyticsItem => ({
  item_id: String(variant?.id || product.id),
  item_name: product.title,
  item_variant: getVariantLabel(variant),
  price: getPriceByCurrency({ currency, product, variant }),
  quantity,
})

export const gaViewItem = ({
  currency,
  product,
  variant,
}: Omit<ProductAnalyticsInput, 'quantity'>) => {
  const item = buildAnalyticsItem({ currency, product, variant })

  gaEvent('view_item', {
    currency: normalizeCurrency(currency),
    value: item.price,
    items: [item],
  })
}

export const gaAddToCart = ({
  currency,
  product,
  quantity = 1,
  variant,
}: ProductAnalyticsInput) => {
  const item = buildAnalyticsItem({ currency, product, quantity, variant })

  gaEvent('add_to_cart', {
    currency: normalizeCurrency(currency),
    value: typeof item.price === 'number' ? item.price * quantity : undefined,
    items: [item],
  })
}

export const gaRemoveFromCart = ({
  currency,
  product,
  quantity = 1,
  variant,
}: ProductAnalyticsInput) => {
  const item = buildAnalyticsItem({ currency, product, quantity, variant })

  gaEvent('remove_from_cart', {
    currency: normalizeCurrency(currency),
    value: typeof item.price === 'number' ? item.price * quantity : undefined,
    items: [item],
  })
}

export const gaPurchase = ({
  currency,
  transactionID,
  value,
  voucher,
  items,
}: {
  currency: string
  transactionID: string
  value?: number
  voucher?: string
  items: AnalyticsItem[]
}) => {
  gaEvent('purchase', {
    currency: normalizeCurrency(currency),
    transaction_id: transactionID,
    value,
    coupon: voucher,
    items,
  })
}
