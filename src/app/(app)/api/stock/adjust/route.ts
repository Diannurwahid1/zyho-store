import { createDigitalStockUnits } from '@/lib/digitalStock'
import { addStock } from '@/lib/stock'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const normalizeProductID = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value)
  return null
}

/**
 * POST /api/stock/adjust
 * Endpoint untuk admin melakukan adjustment stok (restock / kurangi stok)
 * Body: {
 *   productId: string,
 *   variantId?: string,
 *   quantity: number (positif = tambah, negatif = kurangi),
 *   type: 'in' | 'adjust',
 *   notes?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Check if user is admin
    const { user } = await payload.auth({ headers: req.headers })
    const roles = Array.isArray((user as any)?.roles) ? (user as any).roles : []
    if (!user || (!roles.includes('admin') && !roles.includes('manager'))) {
      return NextResponse.json({ error: 'Unauthorized - Admin/Manager only' }, { status: 403 })
    }

    const body = await req.json()
    const { digitalUnits, productId, variantId, quantity, type = 'adjust', notes, costPerUnit } = body
    const normalizedProductID = normalizeProductID(productId)
    const normalizedVariantID =
      typeof variantId === 'string' && variantId.trim().length > 0 ? variantId.trim() : null

    if (!normalizedProductID) {
      return NextResponse.json({ error: 'productId wajib diisi' }, { status: 400 })
    }

    if (typeof quantity !== 'number' || quantity === 0) {
      return NextResponse.json(
        { error: 'quantity harus berupa angka dan tidak boleh 0' },
        { status: 400 },
      )
    }

    const product = await payload.findByID({
      collection: 'products',
      id: normalizedProductID,
      depth: 0,
      overrideAccess: true,
    })

    const isPerUnitStock = product?.digitalFulfillmentMode === 'per_unit_stock'
    const normalizedUnits = Array.isArray(digitalUnits) ? digitalUnits : []

    if (isPerUnitStock && quantity > 0 && normalizedUnits.length !== quantity) {
      return NextResponse.json(
        {
          error:
            'Untuk produk mode per-unit digital stock, jumlah data unit harus sama persis dengan quantity restock.',
        },
        { status: 400 },
      )
    }

    if (!isPerUnitStock && normalizedUnits.length > 0) {
      return NextResponse.json(
        {
          error:
            'Produk ini tidak memakai mode per-unit digital stock. Hapus data unit atau aktifkan mode tersebut di produk.',
        },
        { status: 400 },
      )
    }

    if (isPerUnitStock && quantity < 0) {
      const removableUnits = await payload.find({
        collection: 'digital-stock-units',
        depth: 0,
        limit: Math.abs(quantity),
        overrideAccess: true,
        pagination: false,
        req,
        sort: 'createdAt',
        where: {
          and: [
            { product: { equals: normalizedProductID } },
            normalizedVariantID
              ? { variant: { equals: normalizedVariantID } }
              : { variant: { exists: false } },
            { status: { equals: 'available' } },
            {
              or: [
                { redeemEnabled: { exists: false } },
                { redeemEnabled: { equals: false } },
              ],
            },
          ],
        },
      })

      if (removableUnits.docs.length < Math.abs(quantity)) {
        return NextResponse.json(
          {
            error:
              'Jumlah unit stok digital yang available tidak cukup untuk dikurangi. Kurangi hanya dari unit yang belum terjual.',
          },
          { status: 400 },
        )
      }
    }

    const result = await addStock(payload, {
      productId: normalizedProductID,
      variantId: normalizedVariantID,
      quantity,
      type,
      notes: notes || (quantity > 0 ? 'Manual restock' : 'Manual adjustment'),
      performedById: user.id,
      costPerUnit: typeof costPerUnit === 'number' && costPerUnit > 0 ? costPerUnit : null,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to adjust stock' }, { status: 400 })
    }

    if (isPerUnitStock && quantity > 0) {
      try {
        await createDigitalStockUnits({
          entries: normalizedUnits,
          payload,
          productId: normalizedProductID,
          variantId: normalizedVariantID,
        })
      } catch (error) {
        await addStock(payload, {
          productId: normalizedProductID,
          variantId: normalizedVariantID,
          quantity: -quantity,
          type: 'adjust',
          notes: `Rollback after digital unit creation failed: ${notes || 'stock adjust'}`,
          performedById: user.id,
        })

        throw error
      }
    }

    if (isPerUnitStock && quantity < 0) {
      try {
        const removableUnits = await payload.find({
          collection: 'digital-stock-units',
          depth: 0,
          limit: Math.abs(quantity),
          overrideAccess: true,
          pagination: false,
          req,
          sort: 'createdAt',
          where: {
            and: [
              { product: { equals: normalizedProductID } },
              normalizedVariantID
                ? { variant: { equals: normalizedVariantID } }
                : { variant: { exists: false } },
              { status: { equals: 'available' } },
              {
                or: [
                  { redeemEnabled: { exists: false } },
                  { redeemEnabled: { equals: false } },
                ],
              },
            ],
          },
        })

        for (const unit of removableUnits.docs as any[]) {
          await payload.update({
            collection: 'digital-stock-units',
            id: unit.id,
            data: {
              notes: [unit.notes, notes || 'Manual stock reduction'].filter(Boolean).join('\n'),
              status: 'archived',
            } as any,
            overrideAccess: true,
            req,
          })
        }
      } catch (error) {
        await addStock(payload, {
          productId: normalizedProductID,
          variantId: normalizedVariantID,
          quantity: Math.abs(quantity),
          type: 'adjust',
          notes: `Rollback after digital unit archive failed: ${notes || 'stock adjust'}`,
          performedById: user.id,
        })

        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Stock adjusted successfully',
      newInventory: result.newInventory,
    })
  } catch (err) {
    console.error('[Stock Adjust] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
