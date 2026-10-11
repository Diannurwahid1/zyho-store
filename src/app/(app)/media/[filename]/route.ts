import { relationID } from '@/payments/paymentAttempts'
import { verifyOrderAccessToken } from '@/utilities/orderAccessToken'
import { PRIVATE_MEDIA_DIR, PUBLIC_MEDIA_DIR } from '@/utilities/privateMedia'
import { enforceRateLimit, getClientIP } from '@/utilities/security'
import configPromise from '@payload-config'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { Readable } from 'stream'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ filename: string }> }

const getAuthorizedDownload = async ({
  accessToken,
  mediaID,
  payload,
  userID,
}: {
  accessToken: string | null
  mediaID: number | string
  payload: Awaited<ReturnType<typeof getPayload>>
  userID?: number | string
}) => {
  const claims = accessToken ? verifyOrderAccessToken(accessToken) : null
  let orderID: number | string | null = null

  if (claims) {
    const orders = await payload.find({
      collection: 'orders',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      select: { customerEmail: true },
      where: {
        and: [
          { id: { equals: claims.orderID } },
          { customerEmail: { equals: claims.email } },
        ],
      },
    })
    orderID = orders.docs[0]?.id || null
  }

  const assets = await payload.find({
    collection: 'digital-assets',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [{ file: { equals: mediaID } }, { protected: { not_equals: false } }],
    },
  })
  const assetIDs = assets.docs.map((asset) => asset.id)
  if (assetIDs.length > 0 && (userID || orderID)) {
    const access = await payload.find({
      collection: 'download-access',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          { asset: { in: assetIDs } },
          { status: { equals: 'active' } },
          userID ? { customer: { equals: userID } } : { order: { equals: orderID } },
          {
            or: [
              { expiresAt: { exists: false } },
              { expiresAt: { greater_than: new Date().toISOString() } },
            ],
          },
        ],
      },
    })
    const grant = access.docs[0] as Record<string, any> | undefined
    if (grant) {
      const maxDownloads = Number(grant.maxDownloads || 0)
      const downloadCount = Number(grant.downloadCount || 0)
      if (maxDownloads > 0 && downloadCount >= maxDownloads) return null
      return { asset: relationID(grant.asset), grant, orderID: relationID(grant.order) }
    }
  }

  if (userID || orderID) {
    const units = await payload.find({
      collection: 'digital-stock-units',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          { deliveryType: { equals: 'file' } },
          { file: { equals: mediaID } },
          { status: { equals: 'assigned' } },
          userID ? { customer: { equals: userID } } : { order: { equals: orderID } },
        ],
      },
    })
    const unit = units.docs[0] as Record<string, any> | undefined
    if (unit) return { asset: null, grant: null, orderID: relationID(unit.order) }
  }

  return null
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const rateLimited = enforceRateLimit({
    key: `media:${getClientIP(req)}`,
    limit: 120,
    request: req,
    responseMessage: 'Terlalu banyak permintaan file.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  const { filename: rawFilename } = await params
  const filename = path.basename(rawFilename)
  if (!filename || filename !== rawFilename || filename.length > 255) {
    return NextResponse.json({ error: 'File tidak valid.' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const mediaResult = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { filename: { equals: filename } },
  })
  const media = mediaResult.docs[0] as Record<string, any> | undefined
  if (!media) return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 404 })

  const isPrivate = media.isSupportAttachment === true || media.isProtectedDigitalAsset === true
  let authorization: Awaited<ReturnType<typeof getAuthorizedDownload>> = null
  const { user } = await payload.auth({ headers: req.headers })
  const roles = Array.isArray(user?.roles) ? user.roles : []
  const isStaff = roles.some((role) => ['admin', 'manager', 'support'].includes(String(role)))

  if (media.isSupportAttachment === true) {
    const uploadedBy = relationID(media.uploadedBy)
    if (!isStaff && (!user?.id || String(uploadedBy) !== String(user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } else if (media.isProtectedDigitalAsset === true && !isStaff) {
    authorization = await getAuthorizedDownload({
      accessToken: new URL(req.url).searchParams.get('accessToken'),
      mediaID: media.id,
      payload,
      userID: user?.id,
    })
    if (!authorization) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const filePath = path.join(isPrivate ? PRIVATE_MEDIA_DIR : PUBLIC_MEDIA_DIR, filename)
  let fileStats
  try {
    fileStats = await stat(filePath)
  } catch {
    return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 404 })
  }
  if (!fileStats.isFile()) return NextResponse.json({ error: 'File tidak valid.' }, { status: 404 })

  if (authorization?.grant) {
    const grant = authorization.grant
    const maxDownloads = Number(grant.maxDownloads || 0)
    const conditions: Record<string, any>[] = [{ id: { equals: grant.id } }]
    if (maxDownloads > 0) conditions.push({ downloadCount: { less_than: maxDownloads } })
    const incremented = await payload.db.updateOne({
      collection: 'download-access',
      data: { downloadCount: { $inc: 1 } },
      where: { and: conditions },
    })
    if (!incremented) return NextResponse.json({ error: 'Batas download tercapai.' }, { status: 403 })

    const customerID = relationID(grant.customer)
    const productID = relationID(grant.product)
    if (customerID && productID && authorization.asset && authorization.orderID) {
      await payload
        .create({
          collection: 'download-logs',
          data: {
            asset: authorization.asset,
            customer: customerID,
            downloadedAt: new Date().toISOString(),
            ip: getClientIP(req),
            order: authorization.orderID,
            product: productID,
            userAgent: req.headers.get('user-agent')?.slice(0, 500),
          } as any,
          overrideAccess: true,
        })
        .catch(() => undefined)
    }
  }

  const headers = new Headers({
    'Accept-Ranges': 'bytes',
    'Cache-Control': isPrivate ? 'private, no-store' : 'public, max-age=31536000, immutable',
    'Content-Disposition': `${isPrivate ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'Content-Type': String(media.mimeType || 'application/octet-stream'),
    'X-Content-Type-Options': 'nosniff',
  })
  const range = req.headers.get('range')
  let start = 0
  let end = fileStats.size - 1
  let status = 200

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!match) return new Response(null, { status: 416 })
    start = match[1] ? Number(match[1]) : 0
    end = match[2] ? Number(match[2]) : end
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end >= fileStats.size) {
      return new Response(null, { status: 416 })
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${fileStats.size}`)
    status = 206
  }

  headers.set('Content-Length', String(end - start + 1))
  const stream = createReadStream(filePath, { end, start })
  return new Response(Readable.toWeb(stream) as ReadableStream, { headers, status })
}
