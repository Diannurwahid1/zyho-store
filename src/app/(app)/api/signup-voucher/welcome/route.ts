import configPromise from '@payload-config'
import { awardSignupVoucherForUser } from '@/lib/signupVoucherCampaign'
import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload, type Payload, type PayloadRequest } from 'payload'

const getProductHref = async (payload: Payload, voucher: any) => {
  if (voucher?.appliesTo !== 'specific' || !Array.isArray(voucher.products)) return '/shop'

  const firstProduct = voucher.products[0]
  if (!firstProduct) return '/shop'

  if (typeof firstProduct === 'object' && firstProduct?.slug) {
    return `/products/${firstProduct.slug}`
  }

  try {
    const product = await payload.findByID({
      collection: 'products',
      depth: 0,
      id: firstProduct,
      overrideAccess: true,
    })

    return product?.slug ? `/products/${product.slug}` : '/shop'
  } catch {
    return '/shop'
  }
}

const formatRewardResponse = async (payload: Payload, voucher: any) =>
  NextResponse.json({
    reward: {
      amount: Number(voucher.amount) || 0,
      code: voucher.code,
      discountType: voucher.discountType,
      expiresAt: voucher.expiresAt || null,
      productHref: await getProductHref(payload, voucher),
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
    depth: 2,
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

  if (reward && voucher) return formatRewardResponse(payload, voucher)

  const assignedCoupons = await payload.find({
    collection: 'coupons',
    depth: 1,
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
  if (assignedCoupon) return formatRewardResponse(payload, assignedCoupon)

  return NextResponse.json({ reward: null })
}
