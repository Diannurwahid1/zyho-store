import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload } from 'payload'

const hasProductDuplicateAccess = (user: any) => {
  const roles = Array.isArray(user?.roles) ? user.roles : []
  return roles.some((role: string) => ['admin', 'manager'].includes(role))
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

const stripNestedKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => stripNestedKeys(item))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([key]) => !['id', '_id', 'createdAt', 'updatedAt'].includes(key),
  )

  return Object.fromEntries(entries.map(([key, nestedValue]) => [key, stripNestedKeys(nestedValue)]))
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || !hasProductDuplicateAccess(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const productId = body?.productId

    if (!productId) {
      return NextResponse.json({ error: 'productId wajib diisi.' }, { status: 400 })
    }

    const payloadReq = await createLocalReq({ user }, payload)
    const sourceProduct = await payload.findByID({
      collection: 'products',
      depth: 0,
      id: productId,
      overrideAccess: false,
      req: payloadReq,
    })

    const duplicatedAt = Date.now().toString(36).toUpperCase()
    const sourceTitle = String(sourceProduct?.title || 'Produk')
    const nextTitle = `${sourceTitle} Copy`
    const nextSlug = `${slugify(sourceProduct?.slug || sourceTitle || 'produk')}-copy-${duplicatedAt.toLowerCase()}`

    const cleanedSource = stripNestedKeys(sourceProduct) as Record<string, unknown>
    const {
      duplicateAction,
      id,
      slug,
      title,
      _status,
      inventory,
      soldCount,
      stockReservations,
      stockHistory,
      digitalAssets,
      digitalStockUnits,
      createdAt,
      updatedAt,
      ...restData
    } = cleanedSource

    const duplicatedProduct = await payload.create({
      collection: 'products',
      data: {
        ...restData,
        title: nextTitle,
        slug: nextSlug,
        inventory: 0,
        soldCount: 0,
        _status: 'draft',
      },
      overrideAccess: false,
      req: payloadReq,
    })

    return NextResponse.json({
      success: true,
      product: {
        id: duplicatedProduct.id,
        title: duplicatedProduct.title,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
