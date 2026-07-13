import { getAvailableStock } from '@/lib/stock'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

/**
 * GET /api/stock/check?productId=...&variantId=...
 * Cek stok tersedia untuk satu produk / variant.
 * Response: { available: number, inStock: boolean }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const variantId = searchParams.get('variantId') || null

    if (!productId) {
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
  try {
    const body = await req.json()
    const items: { productId: string; variantId?: string }[] = body?.items ?? []

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ stocks: [] })
    }

    const payload = await getPayload({ config: configPromise })

    const stocks = await Promise.all(
      items.map(async ({ productId, variantId }) => {
        const inventory = await getAvailableStock(payload, productId, variantId ?? null)
        return { productId, variantId, inventory }
      }),
    )

    return NextResponse.json({ stocks })
  } catch (err) {
    console.error('[Stock Check POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
