import configPromise from '@payload-config'
import { awardSignupVoucherForUser } from '@/lib/signupVoucherCampaign'
import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload, type PayloadRequest } from 'payload'

const formatRewardResponse = (voucher: any) =>
  NextResponse.json({
    reward: {
      amount: Number(voucher.amount) || 0,
      code: voucher.code,
      discountType: voucher.discountType,
      expiresAt: voucher.expiresAt || null,
      title: voucher.title,
      benefitSummary: voucher.benefitSummary || null,
    },
  })

const isRecentlyCreatedUser = (user: any) => {
  const createdAt = user?.createdAt || user?.memberSince
  if (!createdAt) return false

  const createdAtTime = new Date(createdAt).getTime()
  if (!Number.isFinite(createdAtTime)) return false

  return Date.now() - createdAtTime <= 15 * 60 * 1000
}

export async function GET() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return NextResponse.json({ reward: null }, { status: 401 })

  if (isRecentlyCreatedUser(user)) {
    try {
      await awardSignupVoucherForUser({
        req: { payload } as PayloadRequest,
        user,
      })
    } catch (error) {
      payload.logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          userID: user.id,
        },
        '[SignupVoucherWelcome] Failed to award signup voucher on demand',
      )
    }
  }

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

  if (reward && voucher) return formatRewardResponse(voucher)

  const assignedCoupons = await payload.find({
    collection: 'coupons',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { assignedUser: { equals: user.id } },
        { signupVoucherCampaign: { exists: true } },
        { status: { equals: 'active' } },
      ],
    } as any,
  })

  const assignedCoupon = assignedCoupons.docs[0] as any
  if (assignedCoupon) return formatRewardResponse(assignedCoupon)

  return NextResponse.json({ reward: null })
}
