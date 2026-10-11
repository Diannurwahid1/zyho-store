import { createDigitalStockUnits } from '@/lib/digitalStock'
import { addStock } from '@/lib/stock'
import { withPayloadTransaction } from '@/utilities/payloadTransaction'
import { enforceRateLimit, getClientIP, readJSONBodyLimited } from '@/utilities/security'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload, type PayloadRequest } from 'payload'

const MAX_BODY_BYTES = 2 * 1024 * 1024
const MAX_QUANTITY = 1000

type DigitalUnitInput = {
  accountEmail?: string
  accountPassword?: string
  accountUsername?: string
  content?: string
  deliveryType: 'credentials'
  label?: string
  loginUrl?: string
  referenceCode?: string
}

class StockAdjustmentError extends Error {}

const normalizeProductID = (value: unknown) => {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value)
  return null
}

const normalizeOptionalString = (value: unknown, maxLength: number, field: string) => {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value !== 'string') throw new StockAdjustmentError(`${field} harus berupa teks.`)
  const normalized = value.trim()
  if (normalized.length > maxLength) {
    throw new StockAdjustmentError(`${field} terlalu panjang.`)
  }
  return normalized || undefined
}

const normalizeLoginURL = (value: unknown) => {
  const normalized = normalizeOptionalString(value, 2048, 'loginUrl')
  if (!normalized) return undefined

  try {
    const url = new URL(normalized)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('invalid protocol')
  } catch {
    throw new StockAdjustmentError('loginUrl harus berupa URL HTTP/HTTPS yang valid.')
  }

  return normalized
}

const normalizeDigitalUnits = (value: unknown): DigitalUnitInput[] => {
  if (value === null || value === undefined) return []
  if (!Array.isArray(value) || value.length > MAX_QUANTITY) {
    throw new StockAdjustmentError(`digitalUnits maksimal ${MAX_QUANTITY} item.`)
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new StockAdjustmentError(`Data credentials baris ${index + 1} tidak valid.`)
    }

    const unit = entry as Record<string, unknown>
    if (unit.deliveryType !== undefined && unit.deliveryType !== 'credentials') {
      throw new StockAdjustmentError('Import Excel hanya menerima deliveryType credentials.')
    }

    return {
      accountEmail: normalizeOptionalString(unit.accountEmail, 320, 'accountEmail'),
      accountPassword: normalizeOptionalString(unit.accountPassword, 2000, 'accountPassword'),
      accountUsername: normalizeOptionalString(unit.accountUsername, 500, 'accountUsername'),
      content: normalizeOptionalString(unit.content, 10_000, 'content'),
      deliveryType: 'credentials',
      label: normalizeOptionalString(unit.label, 200, 'label'),
      loginUrl: normalizeLoginURL(unit.loginUrl),
      referenceCode: normalizeOptionalString(unit.referenceCode, 500, 'referenceCode'),
    }
  })
}

const relationID = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id?: unknown }).id
  }
  return null
}

const archiveAvailableUnits = async ({
  notes,
  payloadReq,
  productID,
  quantity,
  variantID,
}: {
  notes?: string
  payloadReq: PayloadRequest
  productID: number
  quantity: number
  variantID: string | null
}) => {
  const removableUnits = await payloadReq.payload.find({
    collection: 'digital-stock-units',
    depth: 0,
    limit: quantity,
    overrideAccess: true,
    pagination: false,
    req: payloadReq,
    sort: 'createdAt',
    where: {
      and: [
        { product: { equals: productID } },
        variantID ? { variant: { equals: variantID } } : { variant: { exists: false } },
        { status: { equals: 'available' } },
        {
          or: [{ redeemEnabled: { exists: false } }, { redeemEnabled: { equals: false } }],
        },
      ],
    },
  })

  if (removableUnits.docs.length < quantity) {
    throw new StockAdjustmentError(
      'Jumlah unit stok digital yang available tidak cukup untuk dikurangi.',
    )
  }

  for (const unit of removableUnits.docs as unknown as Array<Record<string, unknown>>) {
    const archived = await payloadReq.payload.db.updateOne({
      collection: 'digital-stock-units' as any,
      data: {
        notes: [unit.notes, notes || 'Manual stock reduction'].filter(Boolean).join('\n'),
        status: 'archived',
      } as any,
      req: payloadReq,
      where: {
        and: [
          { id: { equals: unit.id } },
          { status: { equals: 'available' } },
          {
            or: [{ redeemEnabled: { exists: false } }, { redeemEnabled: { equals: false } }],
          },
        ],
      } as any,
    })

    if (!archived) {
      throw new StockAdjustmentError('Unit stok sedang diproses oleh operasi lain. Coba lagi.')
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    const roles = Array.isArray((user as any)?.roles) ? (user as any).roles : []

    if (!user || (!roles.includes('admin') && !roles.includes('manager'))) {
      return NextResponse.json({ error: 'Unauthorized - Admin/Manager only' }, { status: 403 })
    }

    const rateLimited = enforceRateLimit({
      key: `stock-adjust:${user.id}:${getClientIP(req)}`,
      limit: 20,
      request: req,
      responseMessage: 'Terlalu banyak penyesuaian stok. Tunggu sebentar.',
      windowMs: 10 * 60_000,
    })
    if (rateLimited) return rateLimited

    const parsed = await readJSONBodyLimited<Record<string, unknown>>(req, MAX_BODY_BYTES)
    if (parsed.response) return parsed.response
    const body = parsed.data

    const productID = normalizeProductID(body.productId)
    const variantID = normalizeOptionalString(body.variantId, 100, 'variantId') || null
    const quantity = body.quantity
    const type = body.type === 'in' || body.type === 'out' || body.type === 'adjust' ? body.type : 'adjust'
    const notes = normalizeOptionalString(body.notes, 2000, 'notes')
    const costPerUnit = body.costPerUnit
    const digitalUnits = normalizeDigitalUnits(body.digitalUnits)

    if (!productID) {
      return NextResponse.json({ error: 'productId wajib diisi.' }, { status: 400 })
    }
    if (!Number.isInteger(quantity) || Math.abs(Number(quantity)) > MAX_QUANTITY || quantity === 0) {
      return NextResponse.json(
        { error: `quantity harus bilangan bulat antara -${MAX_QUANTITY} dan ${MAX_QUANTITY}, selain 0.` },
        { status: 400 },
      )
    }
    if (
      costPerUnit !== undefined &&
      (typeof costPerUnit !== 'number' || !Number.isFinite(costPerUnit) || costPerUnit < 0)
    ) {
      return NextResponse.json({ error: 'costPerUnit tidak valid.' }, { status: 400 })
    }

    const product = await payload.findByID({
      collection: 'products',
      depth: 0,
      id: productID,
      overrideAccess: true,
    })
    const isPerUnitStock = product.digitalFulfillmentMode === 'per_unit_stock'

    if (variantID) {
      const variant = await payload.findByID({
        collection: 'variants',
        depth: 0,
        id: variantID,
        overrideAccess: true,
      })
      if (String(relationID(variant.product)) !== String(productID)) {
        return NextResponse.json({ error: 'Variant bukan milik produk ini.' }, { status: 400 })
      }
    }

    if (isPerUnitStock && Number(quantity) > 0 && digitalUnits.length !== quantity) {
      return NextResponse.json(
        { error: 'Jumlah data credentials harus sama persis dengan quantity restock.' },
        { status: 400 },
      )
    }
    if ((!isPerUnitStock || Number(quantity) < 0) && digitalUnits.length > 0) {
      return NextResponse.json(
        { error: 'Data credentials hanya boleh dikirim saat menambah stok produk per-unit.' },
        { status: 400 },
      )
    }

    const payloadReq = await createLocalReq({ user }, payload)
    const result = await withPayloadTransaction(payloadReq, async () => {
      if (isPerUnitStock && Number(quantity) < 0) {
        await archiveAvailableUnits({
          notes,
          payloadReq,
          productID,
          quantity: Math.abs(Number(quantity)),
          variantID,
        })
      }

      const stockResult = await addStock(
        payload,
        {
          costPerUnit: typeof costPerUnit === 'number' && costPerUnit > 0 ? costPerUnit : null,
          notes: notes || (Number(quantity) > 0 ? 'Manual restock' : 'Manual adjustment'),
          performedById: user.id,
          productId: productID,
          quantity: Number(quantity),
          type,
          variantId: variantID,
        },
        payloadReq,
      )

      if (!stockResult.success) {
        throw new StockAdjustmentError(stockResult.error || 'Gagal menyesuaikan stok.')
      }

      if (isPerUnitStock && Number(quantity) > 0) {
        await createDigitalStockUnits({
          entries: digitalUnits,
          payload,
          productId: productID,
          req: payloadReq,
          variantId: variantID,
        })
      }

      return stockResult
    })

    return NextResponse.json({
      message: 'Stock adjusted successfully',
      newInventory: result.newInventory,
      success: true,
    })
  } catch (error) {
    const status = error instanceof StockAdjustmentError ? 400 : 500
    console.error('[Stock Adjust] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status },
    )
  }
}
