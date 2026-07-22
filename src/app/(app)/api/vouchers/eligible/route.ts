import { getEligibleVouchers } from '@/lib/vouchers'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return NextResponse.json({ vouchers: [] })
  }

  const vouchers = await getEligibleVouchers({
    payload,
    user: {
      id: user.id,
      memberTier: user.memberTier,
      totalSpentIDR: user.totalSpentIDR,
    },
  })

  return NextResponse.json({ vouchers })
}
