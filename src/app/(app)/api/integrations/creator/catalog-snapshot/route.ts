import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import {
  buildCreatorCatalogSnapshot,
  checkCreatorCatalogRateLimit,
  isAuthorizedCreatorRequest,
} from '@/lib/creatorCatalogSnapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function OPTIONS(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  })
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now()
  const ip = getClientIP(req)

  if (!isAllowedOrigin(req)) {
    logSnapshotRequest({ status: 403, durationMs: Date.now() - startedAt })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: getCorsHeaders(req) })
  }

  if (!checkCreatorCatalogRateLimit(ip)) {
    logSnapshotRequest({ status: 429, durationMs: Date.now() - startedAt })
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: getCorsHeaders(req) })
  }

  if (!isAuthorizedCreatorRequest(req.headers.get('authorization'), process.env.CREATOR_INTEGRATION_SECRET)) {
    logSnapshotRequest({ status: 401, durationMs: Date.now() - startedAt })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getCorsHeaders(req) })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { snapshot, etag } = await buildCreatorCatalogSnapshot(payload)

    if (req.headers.get('if-none-match') === etag) {
      logSnapshotRequest({
        status: 304,
        durationMs: Date.now() - startedAt,
        products: snapshot.products.length,
        vouchers: snapshot.vouchers.length,
        promos: snapshot.promos.length,
      })

      return new NextResponse(null, {
        status: 304,
        headers: getSnapshotHeaders(etag, req),
      })
    }

    logSnapshotRequest({
      status: 200,
      durationMs: Date.now() - startedAt,
      products: snapshot.products.length,
      vouchers: snapshot.vouchers.length,
      promos: snapshot.promos.length,
    })

    return NextResponse.json(snapshot, {
      status: 200,
      headers: getSnapshotHeaders(etag, req),
    })
  } catch (err) {
    console.error({
      event: 'creator.catalog_snapshot',
      status: 500,
      durationMs: Date.now() - startedAt,
      errorCode: err instanceof Error ? err.name : 'unknown_error',
    })

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: getCorsHeaders(req) })
  }
}

function getSnapshotHeaders(etag: string, req: NextRequest) {
  return {
    'Cache-Control': 'private, max-age=60',
    ETag: etag,
    ...getCorsHeaders(req),
  }
}

function getCorsHeaders(req: NextRequest): Record<string, string> {
  const allowedOrigin = process.env.CREATOR_INTEGRATION_ALLOWED_ORIGIN
  const origin = req.headers.get('origin')
  if (!allowedOrigin || !origin || origin !== allowedOrigin) return {}

  return {
    'Access-Control-Allow-Headers': 'Authorization, If-None-Match',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigin,
    Vary: 'Origin',
  }
}

function isAllowedOrigin(req: NextRequest): boolean {
  const allowedOrigin = process.env.CREATOR_INTEGRATION_ALLOWED_ORIGIN
  const origin = req.headers.get('origin')
  return !allowedOrigin || !origin || origin === allowedOrigin
}

function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') || 'unknown'
}

function logSnapshotRequest(data: {
  status: number
  durationMs: number
  products?: number
  vouchers?: number
  promos?: number
}) {
  console.info({
    event: 'creator.catalog_snapshot',
    ...data,
  })
}
