import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { MicrosoftClarity } from '@/components/Analytics/MicrosoftClarity'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MobileBottomNav } from '@/components/Header/MobileBottomNav'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PendingPaymentBubble } from '@/components/PendingPaymentBubble'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { BRAND_LOGO_URL, BRAND_NAME } from '@/utilities/brand'
import { getCachedCurrencySettings } from '@/utilities/currencySettings'
import { getClientLanguage } from '@/utilities/getClientLanguage'
import {
    CURRENCY_PREFERENCE_COOKIE,
    getCurrencyCodeFromLanguage,
    normalizeCurrencyCode,
    resolveEnabledCurrencyCode,
} from '@/utilities/pricing'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const iconUrl = BRAND_LOGO_URL
  const logoUrl = BRAND_LOGO_URL

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: BRAND_NAME,
      template: `%s | ${BRAND_NAME}`,
    },
    description: `${BRAND_NAME} digital storefront.`,
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      siteName: BRAND_NAME,
      title: BRAND_NAME,
      images: logoUrl ? [{ url: logoUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: logoUrl ? [logoUrl] : undefined,
      title: BRAND_NAME,
    },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = await getClientLanguage()
  const { usdEnabled } = await getCachedCurrencySettings()
  const cookieStore = await cookies()
  const preferredCurrency = normalizeCurrencyCode(
    cookieStore.get(CURRENCY_PREFERENCE_COOKIE)?.value,
  )
  const initialCurrencyCode = resolveEnabledCurrencyCode({
    fallbackCurrency: getCurrencyCodeFromLanguage(language),
    requestedCurrency: preferredCurrency,
    usdEnabled,
  })
  const faviconUrl = BRAND_LOGO_URL

  return (
    <html
      className={inter.className}
      lang={language}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href={faviconUrl} rel="icon" sizes="32x32" />
        <link href={faviconUrl} rel="icon" />
      </head>
      <body>
        <Providers initialCurrencyCode={initialCurrencyCode} usdEnabled={usdEnabled}>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main className="w-full max-w-full overflow-x-hidden pb-32 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <PendingPaymentBubble />
          <GoogleAnalytics />
          <MicrosoftClarity />
        </Providers>
      </body>
    </html>
  )
}
