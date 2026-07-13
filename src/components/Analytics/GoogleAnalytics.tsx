'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { pageview } from '@/utilities/googleAnalytics'

const measurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const enabledInDevelopment = process.env.NEXT_PUBLIC_GA_ENABLE_IN_DEV === 'true'

const shouldLoadGoogleAnalytics = () =>
  Boolean(measurementID) && (process.env.NODE_ENV === 'production' || enabledInDevelopment)

export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!shouldLoadGoogleAnalytics() || !measurementID || !pathname) return

    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname
    pageview(url)
  }, [pathname, searchParams])

  if (!shouldLoadGoogleAnalytics() || !measurementID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementID}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}
