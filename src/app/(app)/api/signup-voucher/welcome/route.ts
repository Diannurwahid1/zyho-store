import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return NextResponse.json({ reward: null }, { status: 401 })

  const rewards = await payload.find({
    collection: 'signup-campaign-rewards' as any,
    depth: 1,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { user: { equals: user.id } },
        { result: { equals: 'won' } },
      ],
    } as any,
  })

  const reward = rewards.docs[0] as any
  const voucher = reward?.voucher && typeof reward.voucher === 'object' ? reward.voucher : null

  if (!reward || !voucher) return NextResponse.json({ reward: null })

  return NextResponse.json({
    reward: {
      amount: Number(voucher.amount) || 0,
      code: voucher.code,
      discountType: voucher.discountType,
      expiresAt: voucher.expiresAt || null,
      title: voucher.title,
      benefitSummary: voucher.benefitSummary || null,
    },
  })
}
