'use client'

import { Cart } from '@/components/Cart'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { ClipboardList, Home, ShoppingBag, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const dockItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/shop', icon: ShoppingBag, label: 'Produk' },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const accountHref = '/account'
  const accountActive = pathname.startsWith('/account')
  const orderHref = user ? '/orders' : '/login'
  const orderActive = pathname.startsWith('/orders')

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="relative pt-6">
          <div className="pointer-events-none absolute inset-x-0 top-[10%] z-20 flex justify-center">
            <Cart
              trigger={
                <button
                  aria-label="Keranjang"
                  className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_10px_28px_rgba(15,23,42,0.26)] ring-4 ring-background transition-transform active:scale-95"
                  type="button"
                >
                  <ShoppingBag className="h-6 w-6" />
                </button>
              }
            />
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#d4d4d8_0%,#737373_16%,#171717_42%,#0a0a0a_100%)] p-[1px] shadow-[0_18px_48px_rgba(15,23,42,0.24)]">
            <nav className="rounded-t-[1.95rem] rounded-b-[1.6rem] border border-white/70 bg-background/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-neutral-950/92">
          <div className="grid grid-cols-5 items-end gap-2">
            {dockItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div aria-hidden className="h-10" />

            <Link
              href={orderHref}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition-colors',
                orderActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Order</span>
            </Link>

            <Link
              href={accountHref}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition-colors',
                accountActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <User className="h-5 w-5" />
              <span>Member</span>
            </Link>
          </div>
          </nav>

          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left text-white"
            onClick={() => toast('Tanya AI akan segera hadir.')}
            type="button"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 shrink-0 text-neutral-200" />
              <span className="truncate">Tanya AI segera hadir</span>
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              Coming Soon
            </span>
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
