import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type AuditLevel = 'error' | 'info' | 'warn'

type AuditLogger = {
  error: (meta: Record<string, unknown>, message: string) => void
  info: (meta: Record<string, unknown>, message: string) => void
  warn: (meta: Record<string, unknown>, message: string) => void
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

type RateLimitOptions = {
  key?: string
  limit: number
  request: NextRequest | Request
  responseMessage?: string
  windowMs: number
}

const rateLimitStore = new Map<string, RateLimitBucket>()

const defaultLogger: AuditLogger = {
  error: (meta, message) => console.error(message, meta),
  info: (meta, message) => console.info(message, meta),
  warn: (meta, message) => console.warn(message, meta),
}

const getHeader = (request: NextRequest | Request, key: string) => request.headers.get(key)

export const getClientIP = (request: NextRequest | Request) => {
  const forwardedFor = getHeader(request, 'x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return getHeader(request, 'x-real-ip') || 'unknown'
}

export const buildAuditMeta = (
  request: NextRequest | Request,
  extra: Record<string, unknown> = {},
) => ({
  ip: getClientIP(request),
  method: request.method,
  path: new URL(request.url).pathname,
  userAgent: getHeader(request, 'user-agent') || 'unknown',
  ...extra,
})

export const auditLog = ({
  level = 'info',
  logger,
  message,
  meta,
}: {
  level?: AuditLevel
  logger?: Partial<AuditLogger> | null
  message: string
  meta: Record<string, unknown>
}) => {
  const preferredLogger = logger?.[level]

  if (typeof preferredLogger === 'function') {
    preferredLogger.call(logger, meta, message)
    return
  }

  defaultLogger[level](meta, message)
}

export const enforceRateLimit = ({
  key,
  limit,
  request,
  responseMessage = 'Too many requests',
  windowMs,
}: RateLimitOptions) => {
  const ip = getClientIP(request)
  const bucketKey = key || `${new URL(request.url).pathname}:${ip}`
  const now = Date.now()
  const current = rateLimitStore.get(bucketKey)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return NextResponse.json(
      { error: responseMessage },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
        },
      },
    )
  }

  current.count += 1
  rateLimitStore.set(bucketKey, current)
  return null
}
