import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  BRAND_LOGO_DARK_URL,
  BRAND_LOGO_LIGHT_URL,
  BRAND_LOGO_URL,
  BRAND_NAME,
} from '@/utilities/brand'

type Props = {
  className?: string
  href?: string
  logoAlt?: string
  logoUrl?: string | null
  size?: 'sm' | 'md'
  storeName?: string
}

export function SiteBrand({
  className,
  href = '/',
  logoAlt,
  logoUrl = BRAND_LOGO_URL,
  size = 'md',
  storeName = BRAND_NAME,
}: Props) {
  const logoWidth = size === 'sm' ? 120 : 96
  const logoHeight = size === 'sm' ? 32 : 28
  const textSize = size === 'sm' ? 'text-base' : 'text-lg'
  const logoClassName =
    size === 'sm'
      ? 'h-auto w-[72px] object-contain md:w-[104px]'
      : 'h-auto w-[76px] object-contain md:w-[96px]'
  const useThemeLogos = !logoUrl || logoUrl === BRAND_LOGO_URL

  const content = (
    <span className={`inline-flex items-center gap-1.5 md:gap-2 ${className || ''}`.trim()}>
      {logoUrl ? (
        <span className="site-brand-mark">
          {useThemeLogos ? (
            <>
              <Image
                alt={logoAlt || `${storeName} logo`}
                className={`${logoClassName} dark:hidden`}
                height={logoHeight}
                src={BRAND_LOGO_LIGHT_URL}
                width={logoWidth}
              />
              <Image
                alt={logoAlt || `${storeName} logo`}
                className={`hidden ${logoClassName} dark:block`}
                height={logoHeight}
                src={BRAND_LOGO_DARK_URL}
                width={logoWidth}
              />
            </>
          ) : (
            <Image
              alt={logoAlt || `${storeName} logo`}
              className={logoClassName}
              height={logoHeight}
              src={logoUrl}
              width={logoWidth}
            />
          )}
        </span>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
          {storeName.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className={`${textSize} relative -top-[0.08em] hidden font-semibold tracking-tight text-current lg:inline`}>
        {storeName}
      </span>
    </span>
  )

  return (
    <Link className="inline-flex items-center" href={href}>
      {content}
    </Link>
  )
}
