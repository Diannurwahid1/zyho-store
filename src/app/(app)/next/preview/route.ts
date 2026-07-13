import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const rateLimited = enforceRateLimit({
    limit: 20,
    request: req,
    responseMessage: 'Too many preview requests',
    windowMs: 10 * 60_000,
  })
  if (rateLimited) return rateLimited

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    auditLog({
      level: 'warn',
      logger: payload.logger,
      message: '[Security] Invalid preview secret attempt',
      meta: buildAuditMeta(req, { path }),
    })
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  if (!process.env.PREVIEW_SECRET) {
    payload.logger.error('PREVIEW_SECRET is not configured')
    return new Response('Preview is not configured', { status: 503 })
  }

  let authResult

  try {
    authResult = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()
  const user = authResult?.user

  if (!user) {
    draft.disable()
    auditLog({
      level: 'warn',
      logger: payload.logger,
      message: '[Security] Preview denied due to missing user',
      meta: buildAuditMeta(req, { path }),
    })
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const roles = Array.isArray(user.roles) ? user.roles : []
  const canPreview = roles.some((role) => ['admin', 'manager'].includes(role))

  if (!canPreview) {
    draft.disable()
    auditLog({
      level: 'warn',
      logger: payload.logger,
      message: '[Security] Preview denied due to insufficient role',
      meta: buildAuditMeta(req, { path, userID: user.id }),
    })
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()

  auditLog({
    logger: payload.logger,
    message: '[Audit] Preview enabled',
    meta: buildAuditMeta(req, { path, userID: user.id }),
  })

  redirect(path)
}
