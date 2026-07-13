import { pakasirAdapterClient } from '@/payments/pakasir/client'
import { nowpaymentsAdapterClient } from '@/payments/nowpayments/client'
import { CurrencyInitializer } from '@/components/CurrencyInitializer'
import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import React from 'react'

import { SonnerProvider } from '@/providers/Sonner'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  initialCurrencyCode: 'IDR' | 'USD'
  usdEnabled: boolean
}> = ({ children, initialCurrencyCode, usdEnabled }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <EcommerceProvider
            enableVariants={true}
            currenciesConfig={{
              defaultCurrency: 'IDR',
              supportedCurrencies: [
                {
                  code: 'IDR',
                  decimals: 0,
                  label: 'Rupiah',
                  symbol: 'Rp',
                },
                {
                  code: 'USD',
                  decimals: 2,
                  label: 'US Dollar',
                  symbol: '$',
                },
              ],
            }}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    gallery: true,
                    inventory: true,
                    priceInIDR: true,
                    priceInUSD: true,
                  },
                  variants: {
                    title: true,
                    inventory: true,
                    priceInIDR: true,
                    priceInUSD: true,
                  },
                },
              },
            }}
            paymentMethods={[
              pakasirAdapterClient(),
              nowpaymentsAdapterClient(),
            ]}
          >
            <CurrencyInitializer currencyCode={initialCurrencyCode} usdEnabled={usdEnabled} />
            {children}
          </EcommerceProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
