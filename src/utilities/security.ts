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
const MAX_RATE_LIMIT_BUCKETS = 10_000
let lastCleanupAt = 0

const defaultLogger: AuditLogger = {
  error: (meta, message) => console.error(message, meta),
  info: (meta, message) => console.info(message, meta),
  warn: (meta, message) => console.warn(message, meta),
}

const getHeader = (request: NextRequest | Request, key: string) => request.headers.get(key)

export const getClientIP = (request: NextRequest | Request) => {
  // Nginx overwrites X-Real-IP. Do not trust a client-supplied X-Forwarded-For chain.
  return getHeader(request, 'x-real-ip')?.trim() || 'unknown'
}

type LimitedBodyResult =
  | { body: string; response?: never }
  | { body?: never; response: NextResponse }

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

export const readRequestBodyLimited = async (
  request: NextRequest | Request,
  maxBytes: number,
): Promise<LimitedBodyResult> => {
  const declaredLength = request.headers.get('content-length')
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > maxBytes)) {
    return {
      response: NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 }),
    }
  }
  if (!request.body) return { body: '' }

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let body = ''
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        return {
          response: NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 }),
        }
      }
      body += decoder.decode(value, { stream: true })
    }
    body += decoder.decode()
    return { body }
  } catch {
    return {
      response: NextResponse.json({ error: 'Payload tidak dapat dibaca.' }, { status: 400 }),
    }
  } finally {
    reader.releaseLock()
  }
}

export const readJSONBodyLimited = async <T = Record<string, unknown>>(
  request: NextRequest | Request,
  maxBytes: number,
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> => {
  const result = await readRequestBodyLimited(request, maxBytes)
  if (result.response) return { response: result.response }

  try {
    return { data: (result.body ? JSON.parse(result.body) : {}) as T }
  } catch {
    return {
      response: NextResponse.json({ error: 'JSON tidak valid.' }, { status: 400 }),
    }
  }
}

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

  if (now - lastCleanupAt > 60_000 || rateLimitStore.size >= MAX_RATE_LIMIT_BUCKETS) {
    for (const [storedKey, bucket] of rateLimitStore) {
      if (bucket.resetAt <= now) rateLimitStore.delete(storedKey)
    }
    while (rateLimitStore.size >= MAX_RATE_LIMIT_BUCKETS) {
      const oldestKey = rateLimitStore.keys().next().value as string | undefined
      if (!oldestKey) break
      rateLimitStore.delete(oldestKey)
    }
    lastCleanupAt = now
  }

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
