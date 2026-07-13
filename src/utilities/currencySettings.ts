import type { PayloadRequest } from 'payload'

import { getCachedGlobal } from '@/utilities/getGlobals'

type SettingsLike = {
  commerce?: {
    enableUSD?: boolean | null
  } | null
} | null

export const isUSDEnabledInSettings = (settings: SettingsLike | undefined): boolean => {
  return settings?.commerce?.enableUSD === true
}

export const getCachedCurrencySettings = async () => {
  const settings = await getCachedGlobal('settings', 0)()

  return {
    settings,
    usdEnabled: isUSDEnabledInSettings(settings),
  }
}

export const assertCurrencyEnabled = async ({
  currencyCode,
  req,
}: {
  currencyCode: 'IDR' | 'USD'
  req: PayloadRequest
}) => {
  if (currencyCode !== 'USD') return

  const settings = (await req.payload.findGlobal({
    slug: 'settings',
    depth: 0,
    req,
  })) as SettingsLike

  if (!isUSDEnabledInSettings(settings)) {
    throw new Error('Pembayaran USD sedang dinonaktifkan untuk sementara.')
  }
}
