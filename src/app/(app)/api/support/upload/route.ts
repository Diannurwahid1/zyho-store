import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import sharp from 'sharp'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const safeImageExtension: Record<string, string> = {
  'image/gif': 'png',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const reencodeImage = async (buffer: Buffer, mimeType: string) => {
  const image = sharp(buffer, { animated: mimeType === 'image/gif' })
  const metadata = await image.metadata()

  if (!metadata.format || !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format)) {
    throw new Error('Unsupported image format')
  }

  if ((metadata.width ?? 0) <= 0 || (metadata.height ?? 0) <= 0) {
    throw new Error('Invalid image dimensions')
  }

  if (mimeType === 'image/jpeg') {
    return {
      buffer: await image.jpeg({ mozjpeg: true, quality: 90 }).toBuffer(),
      extension: 'jpg',
      mimeType: 'image/jpeg',
    }
  }

  if (mimeType === 'image/webp') {
    return {
      buffer: await image.webp({ quality: 90 }).toBuffer(),
      extension: 'webp',
      mimeType: 'image/webp',
    }
  }

  return {
    buffer: await image.png({ compressionLevel: 9 }).toBuffer(),
    extension: safeImageExtension[mimeType] || 'png',
    mimeType: 'image/png',
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      limit: 10,
      request: req,
      responseMessage: 'Too many uploads',
      windowMs: 5 * 60_000,
    })
    if (rateLimited) return rateLimited

    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] Unauthorized support upload blocked',
        meta: buildAuditMeta(req),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only image files are allowed (JPEG, PNG, GIF, WEBP)' },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size must be 2 MB or less' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeFile = await reencodeImage(buffer, file.type)
    const fileName = `support-${user.id}-${crypto.randomUUID()}.${safeFile.extension}`

    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: {
        alt: `Support attachment by user ${user.id}`,
        isSupportAttachment: true,
        uploadedBy: user.id,
      } as any,
      file: {
        data: safeFile.buffer,
        mimetype: safeFile.mimeType,
        name: fileName,
        size: safeFile.buffer.length,
      },
    })

    auditLog({
      logger: payload.logger,
      message: '[Audit] Support upload created',
      meta: buildAuditMeta(req, {
        mediaID: media.id,
        mimeType: safeFile.mimeType,
        size: safeFile.buffer.length,
        userID: user.id,
      }),
    })

    return NextResponse.json({ doc: media, id: media.id, url: media.url }, { status: 201 })
  } catch (err) {
    console.error('[support/upload POST]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
