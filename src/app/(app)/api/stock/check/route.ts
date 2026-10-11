import { getAvailableStock } from '@/lib/stock'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { enforceRateLimit, getClientIP, readJSONBodyLimited } from '@/utilities/security'

const MAX_BATCH_ITEMS = 50
const MAX_BODY_BYTES = 16 * 1024
const validID = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{1,20}$/.test(value)

/**
 * GET /api/stock/check?productId=...&variantId=...
 * Cek stok tersedia untuk satu produk / variant.
 * Response: { available: number, inStock: boolean }
 */
export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    key: `stock-get:${getClientIP(req)}`,
    limit: 120,
    request: req,
    responseMessage: 'Terlalu banyak pemeriksaan stok.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const variantId = searchParams.get('variantId') || null

    if (!validID(productId) || (variantId && !validID(variantId))) {
      return NextResponse.json({ error: 'productId wajib diisi.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const available = await getAvailableStock(payload, productId, variantId)

    return NextResponse.json({
      available,
      inStock: available > 0,
    })
  } catch (err) {
    console.error('[Stock Check] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/stock/check
 * Cek stok untuk banyak item sekaligus (digunakan CartModal).
 * Body: { items: [{ productId, variantId? }] }
 * Response: { stocks: [{ productId, variantId?, inventory }] }
 */
export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    key: `stock-post:${getClientIP(req)}`,
    limit: 30,
    request: req,
    responseMessage: 'Terlalu banyak pemeriksaan stok.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  try {
    const parsed = await readJSONBodyLimited<{ items?: unknown }>(req, MAX_BODY_BYTES)
    if (parsed.response) return parsed.response
    const body = parsed.data
    const items = Array.isArray(body.items)
      ? (body.items as Array<{ productId: string; variantId?: string }>)
      : []

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ stocks: [] })
    }
    if (items.length > MAX_BATCH_ITEMS) {
      return NextResponse.json({ error: 'Maksimal 50 item per permintaan.' }, { status: 400 })
    }

    const uniqueItems = Array.from(
      new Map(
        items.map((item) => [
          `${item?.productId}:${item?.variantId || ''}`,
          item,
        ]),
      ).values(),
    )
    if (
      uniqueItems.some(
        ({ productId, variantId }) =>
          !validID(productId) || (variantId !== undefined && !validID(variantId)),
      )
    ) {
      return NextResponse.json({ error: 'Product ID atau variant ID tidak valid.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const stocks: Array<{ inventory: number; productId: string; variantId?: string }> = []
    for (let index = 0; index < uniqueItems.length; index += 5) {
      const batch = uniqueItems.slice(index, index + 5)
      stocks.push(
        ...(await Promise.all(
          batch.map(async ({ productId, variantId }) => ({
            inventory: await getAvailableStock(payload, productId, variantId ?? null),
            productId,
            variantId,
          })),
        )),
      )
    }

    return NextResponse.json({ stocks })
  } catch (err) {
    console.error('[Stock Check POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
