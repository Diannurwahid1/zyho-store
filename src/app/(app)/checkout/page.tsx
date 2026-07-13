import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { getEligibleVouchers } from '@/lib/vouchers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Checkout({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (Array.isArray(value)) {
        value.forEach((entry) => query.append(key, entry))
      } else if (typeof value === 'string') {
        query.set(key, value)
      }
    }

    const checkoutPath = query.toString() ? `/checkout?${query.toString()}` : '/checkout'

    redirect(`/login?redirect=${encodeURIComponent(checkoutPath)}`)
  }

  const vouchers = user
    ? await getEligibleVouchers({
        payload,
        user: {
          id: user.id,
          memberTier: user.memberTier,
          totalSpentIDR: user.totalSpentIDR,
        },
      })
    : []

  return (
    <div className="container min-h-[90vh] flex">
      <h1 className="sr-only">Checkout</h1>
      <CheckoutPage initialEligibleVouchers={vouchers} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
