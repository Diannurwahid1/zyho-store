import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedCurrencySettings } from '@/utilities/currencySettings'
import { BRAND_LOGO_URL, BRAND_NAME } from '@/utilities/brand'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const { usdEnabled } = await getCachedCurrencySettings()

  return (
    <HeaderClient
      header={header}
      storeName={BRAND_NAME}
      logoAlt={BRAND_NAME}
      logoUrl={BRAND_LOGO_URL}
      usdEnabled={usdEnabled}
    />
  )
}
