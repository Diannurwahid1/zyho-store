import crypto from 'crypto'

import { getAvailableStock } from '@/lib/stock'
import type { BasePayload } from 'payload'

const SCHEMA_VERSION = '1'
const TIMEZONE = 'Asia/Jakarta'
const RATE_LIMIT_MAX_REQUESTS = 60
const RATE_LIMIT_WINDOW_MS = 60_000

type RateLimitEntry = {
  count: number
  resetAt: number
}

type CreatorProduct = {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  url: string
  categories: string[]
  price: {
    IDR: number | null
    USD: number | null
  }
  availability: {
    status: 'in_stock' | 'low_stock' | 'out_of_stock'
    available: number
    label: string
  }
  badge: string | null
  isFeatured: boolean
  soldCount: number
  flashSale?: {
    active: boolean
    discountPercent: number
    endsAt: string
  }
  variantsSummary?: {
    total: number
    inStock: number
    priceMinIDR: number | null
    priceMaxIDR: number | null
  }
  creatorPromotion: {
    priority: number
    allowedAngles: string[]
    claimNotes: string | null
    ctaLabel: string | null
  }
  imageUrl: string | null
  updatedAt: string | null
}

type CreatorVoucher = {
  id: string
  title: string
  description: string | null
  benefitSummary: string | null
  code?: string
  discountType: string
  amount: number
  minimumSpend: number
  appliesTo: string
  productIds: string[]
  allowedTiers: string[]
  remainingUses: number | null
  startsAt: string | null
  expiresAt: string | null
  marketingNotes: string | null
}

type CreatorPromo = {
  id: string
  title: string
  link: string | null
  imageUrl: string | null
  startsAt: string | null
  endsAt: string | null
  priority: number
}

export type CreatorCatalogSnapshot = {
  schemaVersion: '1'
  generatedAt: string
  timezone: 'Asia/Jakarta'
  store: {
    name: 'Zyho Store'
    baseUrl: string
  }
  products: CreatorProduct[]
  vouchers: CreatorVoucher[]
  promos: CreatorPromo[]
}

export type CreatorCatalogSnapshotResult = {
  snapshot: CreatorCatalogSnapshot
  etag: string
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function isAuthorizedCreatorRequest(authorizationHeader: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 32) return false
  if (!authorizationHeader?.startsWith('Bearer ')) return false

  const token = authorizationHeader.slice('Bearer '.length).trim()
  if (!token) return false

  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)

  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(expected, actual)
}

export function checkCreatorCatalogRateLimit(ip: string, now = Date.now()): boolean {
  const existing = rateLimitStore.get(ip)

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) return false

  existing.count += 1
  return true
}

export function createCreatorCatalogETag(snapshot: CreatorCatalogSnapshot): string {
  const normalized = JSON.stringify({
    ...snapshot,
    generatedAt: undefined,
  })
  return `"${crypto.createHash('sha256').update(normalized).digest('hex')}"`
}

export async function buildCreatorCatalogSnapshot(
  payload: BasePayload,
  opts: { generatedAt?: Date; baseUrl?: string } = {},
): Promise<CreatorCatalogSnapshotResult> {
  const generatedAt = opts.generatedAt ?? new Date()
  const baseUrl = normalizeBaseUrl(opts.baseUrl || process.env.NEXT_PUBLIC_STORE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://zyho.store')
  const nowISO = generatedAt.toISOString()

  const [productsResult, couponsResult, promoBannersResult] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 2,
      limit: 100,
      overrideAccess: true,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        categories: true,
        gallery: true,
        priceInIDR: true,
        priceInUSD: true,
        inventory: true,
        enableVariants: true,
        variants: true,
        isFeatured: true,
        badge: true,
        soldCount: true,
        promo: true,
        creatorPromotion: true,
        updatedAt: true,
      } as any,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { 'creatorPromotion.enabled': { equals: true } },
        ],
      },
    }),
    payload.find({
      collection: 'coupons',
      depth: 1,
      limit: 50,
      overrideAccess: true,
      select: {
        id: true,
        title: true,
        description: true,
        benefitSummary: true,
        code: true,
        discountType: true,
        amount: true,
        appliesTo: true,
        products: true,
        allowedTiers: true,
        minimumSpend: true,
        usageLimit: true,
        usedCount: true,
        startsAt: true,
        expiresAt: true,
        status: true,
        assignedUser: true,
        signupVoucherCampaign: true,
        publicPromotion: true,
      } as any,
      where: {
        and: [
          { status: { equals: 'active' } },
          { 'publicPromotion.enabled': { equals: true } },
        ],
      },
    }),
    payload.find({
      collection: 'promo-banners',
      depth: 1,
      limit: 25,
      overrideAccess: true,
      select: {
        id: true,
        title: true,
        image: true,
        link: true,
        status: true,
        priority: true,
        startDate: true,
        endDate: true,
      } as any,
      where: {
        status: { equals: 'published' },
      },
    }),
  ])

  const products = (
    await Promise.all(
      productsResult.docs.map((product: any) => serializeProduct(payload, product, baseUrl, generatedAt)),
    )
  )
    .filter((product): product is CreatorProduct => Boolean(product))
    .sort(sortCreatorProducts)
    .slice(0, 50)

  const vouchers = couponsResult.docs
    .filter((coupon: any) => isPublicCouponActive(coupon, generatedAt))
    .sort((a: any, b: any) => (new Date(a.expiresAt || 0).getTime() || 0) - (new Date(b.expiresAt || 0).getTime() || 0))
    .slice(0, 20)
    .map((coupon: any) => serializeCoupon(coupon))

  const promos = promoBannersResult.docs
    .filter((promo: any) => isPromoBannerActive(promo, generatedAt))
    .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 10)
    .map((promo: any) => serializePromoBanner(promo, baseUrl))

  const snapshot: CreatorCatalogSnapshot = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: nowISO,
    timezone: TIMEZONE,
    store: {
      name: 'Zyho Store',
      baseUrl,
    },
    products,
    vouchers,
    promos,
  }

  return {
    snapshot,
    etag: createCreatorCatalogETag(snapshot),
  }
}

async function serializeProduct(
  payload: BasePayload,
  product: any,
  baseUrl: string,
  now: Date,
): Promise<CreatorProduct | null> {
  const slug = typeof product.slug === 'string' ? product.slug : ''
  if (!slug) return null

  const variants = normalizeRelationshipDocs(product.variants?.docs)
  const hasVariants = product.enableVariants === true && variants.length > 0
  const available = hasVariants
    ? await getVariantAvailableStock(payload, product.id, variants)
    : await getAvailableStock(payload, product.id)

  const availability = createAvailability(available)
  const flashSale = createFlashSale(product, now, available)
  const imageUrl = getProductImageUrl(product, baseUrl)

  return {
    id: String(product.id),
    slug,
    title: product.title,
    shortDescription: product.shortDescription || null,
    url: `${baseUrl}/products/${slug}`,
    categories: normalizeRelationshipDocs(product.categories)
      .map((category: any) => category.title)
      .filter((title: unknown): title is string => typeof title === 'string' && title.length > 0),
    price: {
      IDR: numberOrNull(product.priceInIDR),
      USD: numberOrNull(product.priceInUSD),
    },
    availability,
    badge: product.badge || null,
    isFeatured: product.isFeatured === true,
    soldCount: typeof product.soldCount === 'number' ? product.soldCount : 0,
    ...(flashSale ? { flashSale } : {}),
    ...(hasVariants ? { variantsSummary: createVariantsSummary(variants) } : {}),
    creatorPromotion: {
      priority: typeof product.creatorPromotion?.priority === 'number' ? product.creatorPromotion.priority : 0,
      allowedAngles: Array.isArray(product.creatorPromotion?.allowedAngles) ? product.creatorPromotion.allowedAngles : [],
      claimNotes: product.creatorPromotion?.claimNotes || null,
      ctaLabel: product.creatorPromotion?.ctaLabel || null,
    },
    imageUrl,
    updatedAt: product.updatedAt || null,
  }
}

async function getVariantAvailableStock(payload: BasePayload, productId: string | number, variants: any[]): Promise<number> {
  const variantStocks = await Promise.all(
    variants.map((variant) => getAvailableStock(payload, productId, String(variant.id))),
  )

  return variantStocks.reduce((sum, available) => sum + available, 0)
}

function createAvailability(available: number): CreatorProduct['availability'] {
  if (available > 5) {
    return { status: 'in_stock', available, label: 'Tersedia' }
  }

  if (available > 0) {
    return { status: 'low_stock', available, label: 'Stok terbatas' }
  }

  return { status: 'out_of_stock', available: 0, label: 'Stok habis' }
}

function createFlashSale(product: any, now: Date, available: number): CreatorProduct['flashSale'] | undefined {
  const discountPercent = product.promo?.discountPercent
  const endsAt = product.promo?.flashSaleEndDate
  if (product.promo?.isFlashSale !== true) return undefined
  if (typeof discountPercent !== 'number' || discountPercent <= 0) return undefined
  if (!endsAt || new Date(endsAt).getTime() <= now.getTime()) return undefined
  if (available <= 0) return undefined

  return {
    active: true,
    discountPercent,
    endsAt,
  }
}

function createVariantsSummary(variants: any[]): CreatorProduct['variantsSummary'] {
  const pricesIDR = variants
    .map((variant) => numberOrNull(variant.priceInIDR))
    .filter((price): price is number => typeof price === 'number')

  return {
    total: variants.length,
    inStock: variants.filter((variant) => (variant.inventory || 0) > 0).length,
    priceMinIDR: pricesIDR.length ? Math.min(...pricesIDR) : null,
    priceMaxIDR: pricesIDR.length ? Math.max(...pricesIDR) : null,
  }
}

function isPublicCouponActive(coupon: any, now: Date): boolean {
  if (coupon.status !== 'active') return false
  if (coupon.publicPromotion?.enabled !== true) return false
  if (coupon.assignedUser) return false
  if (coupon.signupVoucherCampaign) return false
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now.getTime()) return false
  if (!coupon.expiresAt || new Date(coupon.expiresAt).getTime() <= now.getTime()) return false

  if (typeof coupon.usageLimit === 'number' && coupon.usageLimit > 0) {
    const usedCount = typeof coupon.usedCount === 'number' ? coupon.usedCount : 0
    if (usedCount >= coupon.usageLimit) return false
  }

  return true
}

function serializeCoupon(coupon: any): CreatorVoucher {
  const usageLimit = typeof coupon.usageLimit === 'number' && coupon.usageLimit > 0 ? coupon.usageLimit : null
  const usedCount = typeof coupon.usedCount === 'number' ? coupon.usedCount : 0
  const voucher: CreatorVoucher = {
    id: String(coupon.id),
    title: coupon.title,
    description: coupon.description || null,
    benefitSummary: coupon.benefitSummary || null,
    discountType: coupon.discountType,
    amount: coupon.amount,
    minimumSpend: typeof coupon.minimumSpend === 'number' ? coupon.minimumSpend : 0,
    appliesTo: coupon.appliesTo,
    productIds: normalizeRelationshipDocs(coupon.products).map((product: any) => String(product.id)),
    allowedTiers: Array.isArray(coupon.allowedTiers) ? coupon.allowedTiers : [],
    remainingUses: usageLimit === null ? null : Math.max(0, usageLimit - usedCount),
    startsAt: coupon.startsAt || null,
    expiresAt: coupon.expiresAt || null,
    marketingNotes: coupon.publicPromotion?.marketingNotes || null,
  }

  if (coupon.publicPromotion?.showCode === true) {
    voucher.code = coupon.code
  }

  return voucher
}

function isPromoBannerActive(promo: any, now: Date): boolean {
  if (promo.status !== 'published') return false
  if (promo.startDate && new Date(promo.startDate).getTime() > now.getTime()) return false
  if (promo.endDate && new Date(promo.endDate).getTime() <= now.getTime()) return false
  return true
}

function serializePromoBanner(promo: any, baseUrl: string): CreatorPromo {
  return {
    id: String(promo.id),
    title: promo.title,
    link: promo.link ? absolutizeUrl(promo.link, baseUrl) : null,
    imageUrl: getMediaUrl(promo.image, baseUrl),
    startsAt: promo.startDate || null,
    endsAt: promo.endDate || null,
    priority: typeof promo.priority === 'number' ? promo.priority : 0,
  }
}

function sortCreatorProducts(a: CreatorProduct, b: CreatorProduct): number {
  return (
    b.creatorPromotion.priority - a.creatorPromotion.priority ||
    Number(b.isFeatured) - Number(a.isFeatured) ||
    Number(b.flashSale?.active === true) - Number(a.flashSale?.active === true) ||
    b.soldCount - a.soldCount ||
    new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  )
}

function getProductImageUrl(product: any, baseUrl: string): string | null {
  const galleryItem = Array.isArray(product.gallery) ? product.gallery[0] : null
  return getMediaUrl(galleryItem?.image, baseUrl)
}

function getMediaUrl(media: any, baseUrl: string): string | null {
  if (!media || typeof media !== 'object') return null
  if (typeof media.url === 'string' && media.url) return absolutizeUrl(media.url, baseUrl)
  if (typeof media.filename === 'string' && media.filename) return `${baseUrl}/media/${media.filename}`
  return null
}

function absolutizeUrl(url: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

function normalizeRelationshipDocs(value: unknown): any[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'object' && item !== null)
  if (typeof value === 'object' && value !== null && Array.isArray((value as any).docs)) {
    return (value as any).docs.filter((item: unknown) => typeof item === 'object' && item !== null)
  }
  return []
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null
}
