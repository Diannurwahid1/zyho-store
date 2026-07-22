import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { getEligibleVouchers } from '@/lib/vouchers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Checkout({ searchParams }: Props) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // No redirect — checkout handles auth inline
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
