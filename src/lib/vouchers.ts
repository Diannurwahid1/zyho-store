import type { Coupon, User } from '@/payload-types'
import type { Payload } from 'payload'

import type { MemberTier } from '@/lib/member'

type EligibleVoucherArgs = {
  cartItems?: any[]
  cartSubtotal?: number
  payload: Payload
  user: Pick<User, 'id' | 'memberTier' | 'totalSpentIDR'>
}

export type EligibleVoucher = {
  allowedTiers: MemberTier[]
  amount: number
  appliesTo?: 'all' | 'specific'
  benefitSummary: string
  code: string
  description: string
  discountLabel: string
  discountType: Coupon['discountType']
  expiresAt?: string | null
  id: number
  minimumSpend: number
  perUserLimit: number
  products?: number[]
  remainingGlobalUses: number | null
}

const toDate = (value?: null | string) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export const normalizeCouponCode = (value?: null | string) =>
  value?.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '') || ''

export const generateVoucherCode = (prefix = 'ZYHO') => {
  const cleanPrefix = normalizeCouponCode(prefix).slice(0, 8) || 'ZYHO'
  const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()

  return `${cleanPrefix}-${randomPart}`
}

export const resolveCouponExpiry = (args: {
  createdAt?: null | string
  existingExpiresAt?: null | string
  expiresAt?: null | string
  startsAt?: null | string
  ttlHours?: null | number
}) => {
  if (args.expiresAt) return args.expiresAt
  if (!args.ttlHours || args.ttlHours <= 0) return args.existingExpiresAt || null

  const baseDate =
    toDate(args.startsAt) || toDate(args.createdAt) || new Date()

  return new Date(baseDate.getTime() + args.ttlHours * 60 * 60 * 1000).toISOString()
}

const couponSupportsTier = (coupon: Coupon, tier: MemberTier) => {
  const allowedTiers = Array.isArray(coupon.allowedTiers) ? coupon.allowedTiers : []

  if (allowedTiers.length === 0) return true

  return allowedTiers.includes(tier)
}

const isCouponWindowActive = (coupon: Coupon, now = new Date()) => {
  const startsAt = toDate(coupon.startsAt)
  const expiresAt = toDate(coupon.expiresAt)

  if (coupon.status !== 'active') return false
  if (startsAt && startsAt > now) return false
  if (expiresAt && expiresAt < now) return false

  return true
}

export const calculateVoucherDiscount = (
  coupon: Pick<Coupon, 'amount' | 'discountType'>,
  subtotal: number,
) => {
  if (coupon.discountType === 'percentage') {
    return Math.min(Math.round((subtotal * coupon.amount) / 100), subtotal)
  }

  return Math.min(coupon.amount, subtotal)
}

export const getUserVoucherUsageCount = async (payload: Payload, userID: number, code: string) => {
  const { docs } = await payload.find({
    collection: 'orders',
    depth: 0,
    limit: 200,
    pagination: false,
    where: {
      and: [
        {
          customer: {
            equals: userID,
          },
        },
        {
          voucherCode: {
            equals: code,
          },
        },
        {
          status: {
            equals: 'completed',
          },
        },
      ],
    },
  })

  return docs.length
}

export const getEligibleVouchers = async ({ cartItems, cartSubtotal, payload, user }: EligibleVoucherArgs) => {
  const memberTier = (user.memberTier as MemberTier | null) || 'bronze'
  const { docs } = await payload.find({
    collection: 'coupons',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: '-createdAt',
  })

  const now = new Date()
  const eligibleVouchers: EligibleVoucher[] = []

  for (const coupon of docs) {
    const code = normalizeCouponCode(coupon.code)

    if (!code) continue
    if (!isCouponWindowActive(coupon, now)) continue
    if (!couponSupportsTier(coupon, memberTier)) continue
    if (typeof coupon.usageLimit === 'number' && (coupon.usedCount || 0) >= coupon.usageLimit) continue

    const usageCount = await getUserVoucherUsageCount(payload, user.id, code)

    if (typeof coupon.perUserLimit === 'number' && usageCount >= coupon.perUserLimit) continue
    if (typeof cartSubtotal === 'number' && typeof coupon.minimumSpend === 'number' && cartSubtotal < coupon.minimumSpend) {
      continue
    }

    if (coupon.appliesTo === 'specific' && Array.isArray(coupon.products) && coupon.products.length > 0) {
      if (cartItems) {
        if (cartItems.length === 0) continue

        const hasEligibleProduct = cartItems.some((item) => {
          const productId = typeof item.product === 'object' ? item.product?.id : item.product
          return productId && coupon.products?.includes(productId as number)
        })

        if (!hasEligibleProduct) continue
      }
    }

    const allowedTiers = Array.isArray(coupon.allowedTiers) ? coupon.allowedTiers : []
    const minimumSpend = coupon.minimumSpend || 0

    eligibleVouchers.push({
      allowedTiers: allowedTiers as MemberTier[],
      amount: coupon.amount,
      appliesTo: coupon.appliesTo,
      benefitSummary: coupon.benefitSummary || 'Voucher member aktif untuk akun Anda.',
      code,
      description:
        coupon.description ||
        `Gunakan voucher ${code} untuk potongan ${
          coupon.discountType === 'percentage' ? `${coupon.amount}%` : `${coupon.amount}`
        }.`,
      discountLabel:
        coupon.discountType === 'percentage'
          ? `${coupon.amount}%`
          : new Intl.NumberFormat('id-ID', {
              currency: 'IDR',
              maximumFractionDigits: 0,
              style: 'currency',
            }).format(coupon.amount),
      discountType: coupon.discountType,
      expiresAt: coupon.expiresAt,
      id: coupon.id,
      minimumSpend,
      perUserLimit: coupon.perUserLimit || 1,
      products: Array.isArray(coupon.products) ? (coupon.products as number[]) : undefined,
      remainingGlobalUses:
        typeof coupon.usageLimit === 'number'
          ? Math.max(coupon.usageLimit - (coupon.usedCount || 0), 0)
          : null,
    })
  }

  return eligibleVouchers
}

export const getVoucherByCodeForUser = async ({
  cartItems,
  code,
  payload,
  subtotal,
  user,
}: {
  cartItems?: any[]
  code: string
  payload: Payload
  subtotal: number
  user?: Pick<User, 'id' | 'memberTier' | 'totalSpentIDR'> | null
}) => {
  const normalizedCode = normalizeCouponCode(code)

  if (!normalizedCode || !user) {
    return null
  }

  const eligibleVouchers = await getEligibleVouchers({
    cartItems,
    cartSubtotal: subtotal,
    payload,
    user,
  })

  return eligibleVouchers.find((voucher) => voucher.code === normalizedCode) || null
}
