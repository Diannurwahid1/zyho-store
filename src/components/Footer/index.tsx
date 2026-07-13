import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { FooterPaymentMethods } from '@/components/Footer/payment-methods'
import { SiteBrand } from '@/components/SiteBrand'
import { WhatsAppSupportCard } from '@/components/WhatsAppSupportCard'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { APP_RELEASE_VERSION } from '@/utilities/appVersion'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { BRAND_DOMAIN, BRAND_LOGO_URL, BRAND_NAME } from '@/utilities/brand'
import React, { Suspense } from 'react'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'
  const copyrightName = BRAND_NAME

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="container">
        <div className="pb-6 pt-8">
          <WhatsAppSupportCard
            compact
            description="Ada kendala checkout atau butuh produk cepat diproses? Langsung chat admin kami lewat WhatsApp."
            title="Admin WhatsApp Siap Bantu"
          />
        </div>
        <div className="flex w-full flex-col gap-6 border-t border-neutral-200 py-12 text-sm md:flex-row md:gap-12 dark:border-neutral-700">
          <div>
            <div className="text-black md:pt-1 dark:text-white">
              <SiteBrand
                logoAlt={copyrightName}
                logoUrl={BRAND_LOGO_URL}
                size="sm"
                storeName={copyrightName}
              />
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
          <FooterPaymentMethods />
          <div className="md:ml-auto flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-neutral-400 md:inline-block" />
          <p>Created by {BRAND_DOMAIN}</p>
          <hr className="mx-4 hidden h-4 w-px border-l border-neutral-400 md:inline-block" />
          <p>Release {APP_RELEASE_VERSION}</p>
          <p className="md:ml-auto">
            <a className="text-black dark:text-white" href={`https://${BRAND_DOMAIN}`}>
              {BRAND_DOMAIN}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
