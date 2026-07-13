import type { User } from '@/payload-types'
import type { PayloadRequest } from 'payload'

export type MemberTier = 'bronze' | 'silver' | 'gold' | 'diamond'

type TierConfig = {
  accent: string
  background: string
  benefitTitle: string
  benefits: string[]
  label: string
  minSpent: number
}

export const MEMBER_TIER_ORDER: MemberTier[] = ['bronze', 'silver', 'gold', 'diamond']

export const MEMBER_TIER_CONFIG: Record<MemberTier, TierConfig> = {
  bronze: {
    accent: '#c98b62',
    background:
      'radial-gradient(circle at top right, rgba(201,139,98,0.26), rgba(15,23,42,0.92) 48%, rgba(3,7,18,1) 100%)',
    benefitTitle: 'Bronze benefits',
    benefits: [
      'Akses promo member yang aktif.',
      'Mulai kumpulkan histori transaksi untuk naik tier.',
      'Voucher member akan langsung muncul saat checkout.',
    ],
    label: 'Bronze Member',
    minSpent: 0,
  },
  silver: {
    accent: '#9aa6b2',
    background:
      'radial-gradient(circle at top right, rgba(203,213,225,0.28), rgba(15,23,42,0.9) 52%, rgba(2,6,23,1) 100%)',
    benefitTitle: 'Silver benefits',
    benefits: [
      'Akses promo Silver dan tier di bawahnya.',
      'Prioritas lebih tinggi untuk voucher terbatas.',
      'Tampilan halaman member mengikuti warna Silver.',
    ],
    label: 'Silver Member',
    minSpent: 200001,
  },
  gold: {
    accent: '#f0c24c',
    background:
      'radial-gradient(circle at top right, rgba(240,194,76,0.3), rgba(24,24,27,0.92) 50%, rgba(9,9,11,1) 100%)',
    benefitTitle: 'Gold benefits',
    benefits: [
      'Akses promo Gold, Silver, dan Bronze.',
      'Nilai transaksi makin cepat mendorong tier puncak.',
      'Voucher member tampil menonjol dengan tema Gold.',
    ],
    label: 'Gold Member',
    minSpent: 600001,
  },
  diamond: {
    accent: '#d8dde6',
    background:
      'radial-gradient(circle at top right, rgba(216,221,230,0.32), rgba(31,41,55,0.92) 54%, rgba(3,7,18,1) 100%)',
    benefitTitle: 'Diamond benefits',
    benefits: [
      'Akses semua promo member yang tersedia.',
      'Level tertinggi berdasarkan total transaksi tervalidasi.',
      'Tema halaman paling terang untuk status tertinggi.',
    ],
    label: 'Diamond Member',
    minSpent: 1000001,
  },
}

export const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)

export const getMemberTier = (totalSpentIDR: number): MemberTier => {
  if (totalSpentIDR > 1000000) return 'diamond'
  if (totalSpentIDR > 600000) return 'gold'
  if (totalSpentIDR > 200000) return 'silver'

  return 'bronze'
}

export const getMemberTierConfig = (tier: MemberTier) => MEMBER_TIER_CONFIG[tier]

export const getNextTier = (tier: MemberTier): MemberTier | null => {
  const currentIndex = MEMBER_TIER_ORDER.indexOf(tier)

  return MEMBER_TIER_ORDER[currentIndex + 1] ?? null
}

export const getAmountToNextTier = (totalSpentIDR: number): number => {
  const nextTier = getNextTier(getMemberTier(totalSpentIDR))

  if (!nextTier) return 0

  return Math.max(MEMBER_TIER_CONFIG[nextTier].minSpent - totalSpentIDR, 0)
}

export const buildMemberSnapshot = (
  user: Pick<User, 'createdAt' | 'memberSince' | 'memberTier' | 'totalSpentIDR'>,
) => {
  const totalSpentIDR = typeof user.totalSpentIDR === 'number' ? user.totalSpentIDR : 0
  const tier = getMemberTier(totalSpentIDR)
  const tierConfig = getMemberTierConfig(tier)

  return {
    accent: tierConfig.accent,
    benefits: tierConfig.benefits,
    benefitTitle: tierConfig.benefitTitle,
    background: tierConfig.background,
    memberSince: user.memberSince || user.createdAt,
    nextTier: getNextTier(tier),
    spentToNextTier: getAmountToNextTier(totalSpentIDR),
    tier,
    tierLabel: tierConfig.label,
    totalSpentIDR,
  }
}

export const recalculateUserMembership = async (req: PayloadRequest, userID: number) => {
  const { docs: orders } = await req.payload.find({
    collection: 'orders',
    depth: 0,
    limit: 500,
    pagination: false,
    req,
    where: {
      and: [
        {
          customer: {
            equals: userID,
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

  const totalSpentIDR = orders.reduce((sum, order) => {
    if (order.currency === 'IDR' && typeof order.amount === 'number') {
      return sum + order.amount
    }

    return sum
  }, 0)
  const membershipPoints = orders.reduce(
    (sum, order) =>
      sum + (typeof (order as any).pointsEarned === 'number' ? (order as any).pointsEarned : 0),
    0,
  )

  await req.payload.update({
    collection: 'users',
    data: {
      memberTier: getMemberTier(totalSpentIDR),
      membershipPoints,
      totalSpentIDR,
    } as any,
    id: userID,
    req,
  })
}
