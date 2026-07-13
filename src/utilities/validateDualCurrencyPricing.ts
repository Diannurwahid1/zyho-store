import { normalizeStoredUSDToBaseUnits } from '@/utilities/currencyUnits'

export const validateDualCurrencyPricing = (
  data: Record<string, any> | null | undefined,
  label: string,
) => {
  if (!data) return data

  const nextData = { ...data }

  nextData.priceInIDREnabled = true
  nextData.priceInUSDEnabled = true

  const hasIDR = typeof nextData.priceInIDR === 'number' && Number.isFinite(nextData.priceInIDR)
  const hasUSD = typeof nextData.priceInUSD === 'number' && Number.isFinite(nextData.priceInUSD)

  if (!hasIDR || !hasUSD) {
    throw new Error(`${label} wajib mengisi harga IDR dan USD.`)
  }

  nextData.priceInUSD = normalizeStoredUSDToBaseUnits(nextData.priceInUSD)

  return nextData
}
