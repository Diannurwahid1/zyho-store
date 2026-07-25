import { generateVoucherCode } from '@/lib/vouchers'
import type { PayloadRequest } from 'payload'

type CampaignDoc = Record<string, any>
type RewardBucket = Record<string, any>
type UserDoc = Record<string, any>

const isDateActive = (startsAt?: string | null, endsAt?: string | null) => {
  const now = Date.now()
  const start = startsAt ? new Date(startsAt).getTime() : null
  const end = endsAt ? new Date(endsAt).getTime() : null

  if (start && start > now) return false
  if (end && end < now) return false

  return true
}

const getActiveBuckets = (campaign: CampaignDoc): RewardBucket[] =>
  Array.isArray(campaign?.rewardBuckets)
    ? campaign.rewardBuckets.filter(
        (bucket) =>
          bucket &&
          bucket.isActive !== false &&
          typeof bucket.probabilityWeight === 'number' &&
          bucket.probabilityWeight > 0,
      )
    : []

const normalizeBucketId = (bucket: RewardBucket, index: number) =>
  String(bucket?.id || bucket?.blockName || `bucket-${index}`)

const getAssignedUserId = (coupon: any) => {
  const assignedUser = coupon?.assignedUser
  if (typeof assignedUser === 'number' || typeof assignedUser === 'string') return assignedUser
  if (assignedUser && typeof assignedUser === 'object' && 'id' in assignedUser) {
    return (assignedUser as any).id
  }
  return null
}

export const getHighestPrioritySignupCampaign = async (req: PayloadRequest) => {
  const result = await req.payload.find({
    collection: 'signup-voucher-campaigns' as any,
    depth: 0,
    limit: 20,
    overrideAccess: true,
    req,
    sort: '-priority',
    where: {
      status: {
        equals: 'active',
      },
    } as any,
  })

  return (
    result.docs.find((campaign: any) => isDateActive(campaign.startsAt, campaign.endsAt)) || null
  )
}

const buildUserCampaignKey = (userID: string | number, campaignID: string | number) =>
  `${userID}:${campaignID}`

const createRewardLog = async ({
  bucket,
  bucketID,
  campaign,
  claimKey,
  reason,
  req,
  result,
  user,
  voucher,
}: {
  bucket?: RewardBucket | null
  bucketID?: string | null
  campaign: CampaignDoc
  claimKey?: string | null
  reason?: string | null
  req: PayloadRequest
  result: 'lost' | 'pending' | 'skipped' | 'won'
  user: UserDoc
  voucher?: number | string | null
}) => {
  return req.payload.create({
    collection: 'signup-campaign-rewards' as any,
    data: {
      bucketID: bucketID || undefined,
      bucketLabel: bucket?.label || undefined,
      campaign: campaign.id,
      claimKey: claimKey || undefined,
      reason: reason || undefined,
      result,
      user: user.id,
      userCampaignKey: buildUserCampaignKey(user.id, campaign.id),
      voucher: voucher || undefined,
    } as any,
    overrideAccess: true,
    req,
  })
}

const reserveBucketSlot = async ({
  bucket,
  bucketID,
  campaign,
  req,
  user,
}: {
  bucket: RewardBucket
  bucketID: string
  campaign: CampaignDoc
  req: PayloadRequest
  user: UserDoc
}) => {
  const maxTotalWinners =
    typeof bucket.maxTotalWinners === 'number' && bucket.maxTotalWinners > 0
      ? Math.floor(bucket.maxTotalWinners)
      : null

  if (!maxTotalWinners) {
    return createRewardLog({
      bucket,
      bucketID,
      campaign,
      req,
      result: 'pending',
      user,
    })
  }

  for (let slot = 1; slot <= maxTotalWinners; slot += 1) {
    try {
      return await createRewardLog({
        bucket,
        bucketID,
        campaign,
        claimKey: `${campaign.id}:${bucketID}:${slot}`,
        req,
        result: 'pending',
        user,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (/duplicate|unique|exists|already/i.test(message)) {
        continue
      }
      throw error
    }
  }

  return null
}

const pickBucket = (campaign: CampaignDoc, excludedBucketIDs: Set<string> = new Set()) => {
  const buckets = getActiveBuckets(campaign).map((bucket, index) => ({
    bucket,
    bucketID: normalizeBucketId(bucket, index),
  })).filter((entry) => !excludedBucketIDs.has(entry.bucketID))
  const totalWeight = buckets.reduce(
    (sum, entry) => sum + Math.max(0, Number(entry.bucket.probabilityWeight) || 0),
    0,
  )

  if (totalWeight <= 0) return null

  // We always award a voucher; weights only determine the relative odds.
  const roll = Math.random() * totalWeight

  let cursor = 0
  for (const entry of buckets) {
    cursor += Math.max(0, Number(entry.bucket.probabilityWeight) || 0)
    if (roll < cursor) {
      return entry
    }
  }

  return null
}

const buildBenefitSummary = (bucket: RewardBucket) => {
  if (bucket.benefitSummary) return String(bucket.benefitSummary)
  if (bucket.discountType === 'percentage') return `Diskon ${bucket.amount}% untuk member baru`
  return `Potongan Rp ${Number(bucket.amount || 0).toLocaleString('id-ID')} untuk member baru`
}

const createPersonalCoupon = async ({
  bucket,
  campaign,
  req,
  user,
}: {
  bucket: RewardBucket
  campaign: CampaignDoc
  req: PayloadRequest
  user: UserDoc
}) => {
  const codePrefix = bucket.codePrefix || campaign.codePrefix || 'WELCOME'
  const startsAt = new Date().toISOString()

  const coupon = await req.payload.create({
    collection: 'coupons',
    data: {
      allowedTiers: [],
      amount: Number(bucket.amount) || 0,
      appliesTo: campaign.appliesTo === 'specific' ? 'specific' : 'all',
      assignedUser: user.id,
      benefitSummary: buildBenefitSummary(bucket),
      code: generateVoucherCode(String(codePrefix)),
      codeMode: 'manual',
      description:
        bucket.description ||
        campaign.description ||
        'Voucher campaign otomatis untuk member baru.',
      discountType: bucket.discountType,
      minimumSpend: Number(bucket.minimumSpend) || 0,
      perUserLimit:
        typeof bucket.perUserLimit === 'number' && bucket.perUserLimit > 0 ? bucket.perUserLimit : 1,
      products:
        campaign.appliesTo === 'specific' && Array.isArray(campaign.products)
          ? campaign.products.map((product: any) =>
              typeof product === 'object' ? product?.id : product,
            )
          : [],
      signupVoucherCampaign: campaign.id,
      startsAt,
      status: 'active',
      title: bucket.voucherTitle || `${campaign.title} - ${bucket.label || 'Voucher'}`,
      ttlHours:
        typeof bucket.ttlHours === 'number' && bucket.ttlHours > 0 ? bucket.ttlHours : undefined,
      usageLimit:
        typeof bucket.usageLimit === 'number' && bucket.usageLimit > 0 ? bucket.usageLimit : 1,
      expiresAt: bucket.expiresAt || undefined,
    } as any,
    overrideAccess: true,
    req,
  })

  return coupon as any
}

export const awardSignupVoucherForUser = async ({
  req,
  user,
}: {
  req: PayloadRequest
  user: UserDoc
}) => {
  const roles = Array.isArray(user?.roles) ? user.roles : []
  if (!roles.includes('customer')) return null

  const existingReward = await req.payload.find({
    collection: 'signup-campaign-rewards' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      user: {
        equals: user.id,
      },
    } as any,
  })

  if (existingReward.docs.length > 0) {
    return existingReward.docs[0]
  }

  const existingAssignedCoupon = await req.payload.find({
    collection: 'coupons',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      assignedUser: {
        equals: user.id,
      },
    } as any,
  })

  if (existingAssignedCoupon.docs.length > 0) {
    return null
  }

  const campaign = await getHighestPrioritySignupCampaign(req)
  if (!campaign) return null

  const excludedBucketIDs = new Set<string>()
  let selected: { bucket: RewardBucket; bucketID: string } | null = null
  let reservedReward: any = null

  while (true) {
    selected = pickBucket(campaign, excludedBucketIDs)
    if (!selected) break

    reservedReward = await reserveBucketSlot({
      bucket: selected.bucket,
      bucketID: selected.bucketID,
      campaign,
      req,
      user,
    })

    if (reservedReward) break
    excludedBucketIDs.add(selected.bucketID)
  }

  if (!selected || !reservedReward) {
    return createRewardLog({
      campaign,
      reason: 'no_available_bucket',
      req,
      result: 'skipped',
      user,
    })
  }

  try {
    const coupon = await createPersonalCoupon({
      bucket: selected.bucket,
      campaign,
      req,
      user,
    })

    return await req.payload.update({
      collection: 'signup-campaign-rewards' as any,
      id: reservedReward.id,
      data: {
        result: 'won',
        voucher: coupon.id,
      } as any,
      overrideAccess: true,
      req,
    })
  } catch (error) {
    try {
      await req.payload.delete({
        collection: 'signup-campaign-rewards' as any,
        id: reservedReward.id,
        overrideAccess: true,
        req,
      })
    } catch (cleanupError) {
      req.payload.logger.warn(
        { cleanupError, rewardID: reservedReward.id },
        '[SignupVoucherCampaign] Failed to cleanup reserved reward slot',
      )
    }

    throw error
  }
}
