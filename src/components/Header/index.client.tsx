'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CurrencySwitch } from '@/components/CurrencySwitch'
import { MemberQuickMenu } from '@/components/member/MemberQuickMenu'
import { Search } from '@/components/Search'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { SiteBrand } from '@/components/SiteBrand'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'

import type { Header } from 'src/payload-types'

import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
  logoAlt?: string
  logoUrl?: string | null
  storeName?: string
  usdEnabled: boolean
}

export function HeaderClient({ header, logoAlt, logoUrl, storeName, usdEnabled }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const { authReady, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const showHeaderSearch = pathname === '/' || pathname.startsWith('/shop')
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container flex min-h-[72px] items-center justify-between py-2 md:min-h-[86px]">
        <div className="flex flex-none md:hidden">
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:bg-black dark:text-white"
              onClick={toggleTheme}
              type="button"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
              ) : (
                <span aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
            <div className="hidden sm:block">
              {usdEnabled ? <CurrencySwitch /> : null}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 w-full items-center justify-between gap-4 md:gap-8">
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-7">
            <div className="flex w-full items-center justify-center md:w-auto md:flex-none">
              <SiteBrand logoAlt={logoAlt} logoUrl={logoUrl} size="sm" storeName={storeName} />
            </div>
            {menu.length ? (
              <ul className="hidden items-center gap-5 text-sm md:flex lg:gap-6">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink', {
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                      appearance="nav"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-none items-center justify-end gap-3 md:gap-4">
            <div className="hidden md:block">
              {usdEnabled ? <CurrencySwitch /> : null}
            </div>
            {showHeaderSearch ? (
              <div className="hidden md:block md:w-[280px] lg:w-[340px]">
                <Search placeholder="Cari produk digital..." />
              </div>
            ) : null}
            <div className="hidden md:flex md:translate-y-[3%] md:items-center">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
            <div className="flex items-center gap-3">
              {!authReady ? (
                <div aria-label="Memuat status login" className="h-11 w-[150px] animate-pulse rounded-xl bg-muted md:h-10" />
              ) : user ? (
                <MemberQuickMenu
                  user={{
                    avatar: user.avatar,
                    email: user.email,
                    googleAvatarURL: user.googleAvatarURL,
                    name: user.name,
                  }}
                />
              ) : (
                <Button
                  asChild
                  className="h-11 rounded-xl px-4 md:h-10 md:px-5"
                  variant="outline"
                >
                  <Link href="/login?redirect=%2Faccount">Login Customer</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showHeaderSearch ? (
        <div className="container space-y-3 pb-3 md:hidden">
          <div className="sm:hidden">
            {usdEnabled ? <CurrencySwitch /> : null}
          </div>
          <Search placeholder="Cari produk digital..." />
        </div>
      ) : null}
    </div>
  )
}
