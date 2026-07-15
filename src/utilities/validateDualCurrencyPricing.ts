import { CollectionBeforeChangeHook } from 'payload'
import { normalizeStoredUSDToBaseUnits } from '@/utilities/currencyUnits'

export const validateDualCurrencyPricing = (
  args: Parameters<CollectionBeforeChangeHook>[0],
  label: string,
) => {
  const { data, req, originalDoc } = args
  if (!data) return data

  const nextData = { ...data }

  nextData.priceInIDREnabled = true
  nextData.priceInUSDEnabled = true

  // Skip validation for drafts
  if (nextData._status === 'draft') {
    if (typeof nextData.priceInUSD === 'number') {
      nextData.priceInUSD = normalizeStoredUSDToBaseUnits(nextData.priceInUSD)
    }
    return nextData
  }

  const hasIDR = typeof nextData.priceInIDR === 'number' && Number.isFinite(nextData.priceInIDR)
  const hasUSD = typeof nextData.priceInUSD === 'number' && Number.isFinite(nextData.priceInUSD)

  if (!hasIDR || !hasUSD) {
    throw new Error(`${label} wajib mengisi harga IDR dan USD.`)
  }

  nextData.priceInUSD = normalizeStoredUSDToBaseUnits(nextData.priceInUSD)

  return nextData
}
