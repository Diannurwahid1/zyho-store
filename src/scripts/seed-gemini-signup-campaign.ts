import configPromise from '@payload-config'
import 'dotenv/config'
import { getPayload } from 'payload'

const campaignTitle = 'Welcome Voucher Gemini Pro'

const rewardBuckets = [
  {
    label: 'Diskon 80%',
    voucherTitle: 'Welcome Voucher Diskon 80%',
    benefitSummary: 'Diskon 80% untuk produk Gemini Pro',
    discountType: 'percentage',
    amount: 80,
    probabilityWeight: 50,
    usageLimit: 1,
    perUserLimit: 1,
  },
  {
    label: 'Diskon 82%',
    voucherTitle: 'Welcome Voucher Diskon 82%',
    benefitSummary: 'Diskon 82% untuk produk Gemini Pro',
    discountType: 'percentage',
    amount: 82,
    probabilityWeight: 25,
    maxTotalWinners: 4,
    usageLimit: 1,
    perUserLimit: 1,
  },
  {
    label: 'Diskon 85%',
    voucherTitle: 'Welcome Voucher Diskon 85%',
    benefitSummary: 'Diskon 85% untuk produk Gemini Pro',
    discountType: 'percentage',
    amount: 85,
    probabilityWeight: 10,
    maxTotalWinners: 2,
    usageLimit: 1,
    perUserLimit: 1,
  },
  {
    label: 'Diskon 87%',
    voucherTitle: 'Welcome Voucher Diskon 87%',
    benefitSummary: 'Diskon 87% untuk produk Gemini Pro',
    discountType: 'percentage',
    amount: 87,
    probabilityWeight: 8,
    maxTotalWinners: 2,
    usageLimit: 1,
    perUserLimit: 1,
  },
  {
    label: 'Diskon 90%',
    voucherTitle: 'Welcome Voucher Diskon 90%',
    benefitSummary: 'Diskon 90% untuk produk Gemini Pro',
    discountType: 'percentage',
    amount: 90,
    probabilityWeight: 6,
    maxTotalWinners: 2,
    usageLimit: 1,
    perUserLimit: 1,
  },
  {
    label: 'Diskon 100%',
    voucherTitle: 'Welcome Voucher Diskon 100%',
    benefitSummary: 'Gratis 1 produk Gemini Pro',
    discountType: 'percentage',
    amount: 100,
    probabilityWeight: 1,
    maxTotalWinners: 1,
    usageLimit: 1,
    perUserLimit: 1,
  },
]

async function seed() {
  const payload = await getPayload({ config: configPromise })
  const product = await payload.findByID({
    collection: 'products',
    depth: 0,
    id: 9,
  })

  if (!product || !String((product as any).title || '').toLowerCase().includes('gemini')) {
    throw new Error('Produk Gemini Pro dengan ID 9 tidak ditemukan atau judulnya berubah.')
  }

  const existing = await payload.find({
    collection: 'signup-voucher-campaigns' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: campaignTitle } } as any,
  })

  const data = {
    appliesTo: 'specific',
    codePrefix: 'GEMINI',
    description:
      'Campaign welcome voucher untuk user baru yang mendaftar. Semua user selalu mendapat voucher; bobot hanya menentukan jenis diskonnya.',
    endsAt: undefined,
    priority: 100,
    products: [product.id],
    rewardBuckets,
    startsAt: undefined,
    status: 'active',
    title: campaignTitle,
  } as any

  const campaign = existing.docs[0]
    ? await payload.update({
        collection: 'signup-voucher-campaigns' as any,
        data,
        id: existing.docs[0].id,
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'signup-voucher-campaigns' as any,
        data,
        overrideAccess: true,
      })

  payload.logger.info({
    campaignID: campaign.id,
    productID: product.id,
    weights: rewardBuckets.map(({ label, probabilityWeight, maxTotalWinners }) => ({
      label,
      probabilityWeight,
      maxTotalWinners: maxTotalWinners || 'unlimited',
    })),
  }, '[SignupVoucherSeed] Gemini campaign ready')
}

seed().catch((error) => {
  console.error('[SignupVoucherSeed] Failed:', error)
  process.exit(1)
})
