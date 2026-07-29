import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/stock', () => ({
  getAvailableStock: vi.fn(async (_payload, _productId, variantId) => (variantId ? 2 : 12)),
}))

import {
  buildCreatorCatalogSnapshot,
  createCreatorCatalogETag,
  isAuthorizedCreatorRequest,
} from '@/lib/creatorCatalogSnapshot'
import { NextRequest } from 'next/server'

const generatedAt = new Date('2026-07-29T01:00:00.000Z')

describe('creator catalog snapshot', () => {
  beforeEach(() => {
    process.env.CREATOR_INTEGRATION_SECRET = 'creator-secret-32-characters-long'
    process.env.CREATOR_INTEGRATION_ALLOWED_ORIGIN = 'https://jakacs.arahdigital.id'
    process.env.NEXT_PUBLIC_STORE_URL = 'https://zyho.store'
    vi.clearAllMocks()
  })

  it('rejects missing and wrong bearer tokens', () => {
    expect(isAuthorizedCreatorRequest(null, process.env.CREATOR_INTEGRATION_SECRET)).toBe(false)
    expect(isAuthorizedCreatorRequest('Bearer wrong-token', process.env.CREATOR_INTEGRATION_SECRET)).toBe(false)
  })

  it('accepts the correct bearer token', () => {
    expect(
      isAuthorizedCreatorRequest(
        `Bearer ${process.env.CREATOR_INTEGRATION_SECRET}`,
        process.env.CREATOR_INTEGRATION_SECRET,
      ),
    ).toBe(true)
  })

  it('builds a sanitized snapshot and filters private or inactive commerce data', async () => {
    const payload = createPayloadMock()
    const { snapshot, etag } = await buildCreatorCatalogSnapshot(payload as any, { generatedAt })

    expect(snapshot.products).toHaveLength(1)
    expect(snapshot.products[0]?.slug).toBe('chatgpt-plus')
    expect(snapshot.products[0]?.availability).toEqual({
      status: 'in_stock',
      available: 12,
      label: 'Tersedia',
    })
    expect(snapshot.products[0]?.flashSale?.active).toBe(true)
    expect(snapshot.vouchers).toHaveLength(1)
    expect(snapshot.vouchers[0]?.code).toBe('ZYHO10')
    expect(snapshot.vouchers[0]?.benefitSummary).toBe('Diskon 10% min. belanja Rp100.000')
    expect(snapshot.promos).toHaveLength(1)
    expect(etag).toBe(createCreatorCatalogETag(snapshot))

    const serialized = JSON.stringify(snapshot)
    expect(serialized).not.toContain('accountPassword')
    expect(serialized).not.toContain('customer@example.com')
    expect(serialized).not.toContain('cart-secret')
    expect(serialized).not.toContain('PRIVATE10')
    expect(serialized).not.toContain('EXPIRED10')
  })

  it('uses required Payload query filters for product and coupon opt-in', async () => {
    const payload = createPayloadMock()
    await buildCreatorCatalogSnapshot(payload as any, { generatedAt })

    const productQuery = payload.find.mock.calls.find(([args]) => args.collection === 'products')?.[0]
    const couponQuery = payload.find.mock.calls.find(([args]) => args.collection === 'coupons')?.[0]

    expect(productQuery.where).toEqual({
      and: [
        { _status: { equals: 'published' } },
        { 'creatorPromotion.enabled': { equals: true } },
      ],
    })
    expect(productQuery.select).not.toHaveProperty('digitalStockUnits')
    expect(couponQuery.where).toEqual({
      and: [
        { status: { equals: 'active' } },
        { 'publicPromotion.enabled': { equals: true } },
      ],
    })
  })

  it('keeps ETag stable for the same commerce payload even when generatedAt changes', async () => {
    const first = await buildCreatorCatalogSnapshot(createPayloadMock() as any, { generatedAt })
    const second = await buildCreatorCatalogSnapshot(createPayloadMock() as any, {
      generatedAt: new Date('2026-07-29T01:00:30.000Z'),
    })

    expect(first.etag).toBe(second.etag)
  })

  it('returns 401 for missing or wrong Authorization headers', async () => {
    const { GET } = await importCreatorRoute()

    const missing = await GET(new NextRequest('http://localhost/api/integrations/creator/catalog-snapshot'))
    const wrong = await GET(
      new NextRequest('http://localhost/api/integrations/creator/catalog-snapshot', {
        headers: { authorization: 'Bearer wrong-token' },
      }),
    )

    expect(missing.status).toBe(401)
    expect(wrong.status).toBe(401)
  })

  it('returns 200 with the correct token and 304 for a matching If-None-Match', async () => {
    const { GET } = await importCreatorRoute()
    const request = new NextRequest('http://localhost/api/integrations/creator/catalog-snapshot', {
      headers: { authorization: `Bearer ${process.env.CREATOR_INTEGRATION_SECRET}` },
    })

    const first = await GET(request)
    const etag = first.headers.get('etag')
    const second = await GET(
      new NextRequest('http://localhost/api/integrations/creator/catalog-snapshot', {
        headers: {
          authorization: `Bearer ${process.env.CREATOR_INTEGRATION_SECRET}`,
          'if-none-match': etag || '',
        },
      }),
    )

    expect(first.status).toBe(200)
    expect(etag).toMatch(/^"[a-f0-9]{64}"$/)
    expect(first.headers.get('cache-control')).toBe('private, max-age=60')
    expect(second.status).toBe(304)
    expect(second.headers.get('etag')).toBe(etag)
  })

  it('rejects a request from a disallowed Origin before serving the snapshot', async () => {
    const { GET } = await importCreatorRoute()
    const response = await GET(
      new NextRequest('http://localhost/api/integrations/creator/catalog-snapshot', {
        headers: {
          authorization: `Bearer ${process.env.CREATOR_INTEGRATION_SECRET}`,
          origin: 'https://not-jaka.example',
        },
      }),
    )

    expect(response.status).toBe(403)
  })
})

async function importCreatorRoute() {
  vi.doMock('payload', () => ({
    getPayload: vi.fn(async () => createPayloadMock()),
  }))
  vi.doMock('@payload-config', () => ({
    default: {},
  }))

  return import('@/app/(app)/api/integrations/creator/catalog-snapshot/route')
}

function createPayloadMock() {
  return {
    find: vi.fn(async ({ collection }) => {
      if (collection === 'products') {
        return {
          docs: [
            {
              id: 7,
              _status: 'published',
              slug: 'chatgpt-plus',
              title: 'ChatGPT Plus',
              shortDescription: 'Ringkasan storefront',
              priceInIDR: 149000,
              priceInUSD: null,
              inventory: 15,
              categories: [{ id: 1, title: 'AI Assistant' }],
              gallery: [{ image: { url: '/api/media/file/example.webp' } }],
              badge: 'best_seller',
              isFeatured: true,
              soldCount: 120,
              promo: {
                isFlashSale: true,
                discountPercent: 20,
                flashSaleEndDate: '2026-07-31T16:59:59.000Z',
              },
              creatorPromotion: {
                enabled: true,
                priority: 10,
                allowedAngles: ['promo', 'education'],
                claimNotes: 'Cocok untuk mahasiswa.',
                ctaLabel: 'Cek produk',
              },
              digitalStockUnits: {
                docs: [{ accountPassword: 'secret-password' }],
              },
              customerEmail: 'customer@example.com',
              cartSecret: 'cart-secret',
              updatedAt: '2026-07-29T00:30:00.000Z',
            },
          ],
        }
      }

      if (collection === 'coupons') {
        return {
          docs: [
            {
              id: 21,
              title: 'Promo Akhir Bulan',
              description: 'Syarat singkat',
              benefitSummary: null,
              code: 'ZYHO10',
              discountType: 'percentage',
              amount: 10,
              minimumSpend: 100000,
              appliesTo: 'all',
              products: [],
              allowedTiers: [],
              usageLimit: 50,
              usedCount: 10,
              startsAt: '2026-07-29T00:00:00.000Z',
              expiresAt: '2026-07-31T16:59:59.000Z',
              status: 'active',
              publicPromotion: {
                enabled: true,
                showCode: true,
                marketingNotes: 'Untuk campaign publik akhir bulan.',
              },
            },
            {
              id: 22,
              title: 'Private',
              code: 'PRIVATE10',
              status: 'active',
              publicPromotion: { enabled: false, showCode: true },
              expiresAt: '2026-07-31T16:59:59.000Z',
            },
            {
              id: 23,
              title: 'Assigned',
              code: 'ASSIGNED10',
              status: 'active',
              assignedUser: 1,
              publicPromotion: { enabled: true, showCode: true },
              expiresAt: '2026-07-31T16:59:59.000Z',
            },
            {
              id: 24,
              title: 'Expired',
              code: 'EXPIRED10',
              status: 'active',
              publicPromotion: { enabled: true, showCode: true },
              expiresAt: '2026-07-28T16:59:59.000Z',
            },
          ],
        }
      }

      if (collection === 'promo-banners') {
        return {
          docs: [
            {
              id: 8,
              title: 'AI Tools Week',
              link: '/promo',
              image: { url: '/api/media/file/promo.webp' },
              status: 'published',
              priority: 10,
              startDate: '2026-07-29T00:00:00.000Z',
              endDate: '2026-08-02T16:59:59.000Z',
            },
          ],
        }
      }

      return { docs: [] }
    }),
  }
}
