import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

const restGet = REST_GET(config)
const restPost = REST_POST(config)
const restDelete = REST_DELETE(config)
const restPatch = REST_PATCH(config)
const restPut = REST_PUT(config)

const isSensitiveAuthPath = (pathname: string) =>
  ['/api/users/login', '/api/users/forgot-password', '/api/users/reset-password'].includes(pathname)

const logRestAccess = async (request: Request) => {
  const pathname = new URL(request.url).pathname

  if (!isSensitiveAuthPath(pathname)) {
    return
  }

  try {
    const payload = await getPayload({ config })
    const hasAuthContext =
      Boolean(request.headers.get('cookie')) || Boolean(request.headers.get('authorization'))

    const authResult = hasAuthContext
      ? await payload.auth({ headers: request.headers }).catch(() => null)
      : null

    auditLog({
      logger: payload.logger,
      message: '[Audit] Sensitive auth REST access',
      meta: buildAuditMeta(request, {
        authenticated: Boolean(authResult?.user),
        userID: authResult?.user?.id ?? null,
      }),
    })
  } catch (error) {
    console.error('[Auth REST audit failed]', error)
  }
}

const maybeRateLimitRest = (request: Request) => {
  const pathname = new URL(request.url).pathname

  if (!isSensitiveAuthPath(pathname)) {
    return null
  }

  return enforceRateLimit({
    key: `rest-auth:${pathname}:${request.headers.get('x-forwarded-for') || 'unknown'}`,
    limit: pathname.endsWith('/login') ? 10 : 6,
    request,
    responseMessage: 'Too many authentication requests',
    windowMs: 10 * 60_000,
  })
}

type RouteContext = {
  params: Promise<{ slug: string[] }>
}

export async function GET(request: Request, context: RouteContext) {
  await logRestAccess(request)
  return restGet(request, context)
}

export async function POST(request: Request, context: RouteContext) {
  const rateLimited = maybeRateLimitRest(request)
  if (rateLimited) return rateLimited

  await logRestAccess(request)
  return restPost(request, context)
}

export async function DELETE(request: Request, context: RouteContext) {
  await logRestAccess(request)
  return restDelete(request, context)
}

export async function PATCH(request: Request, context: RouteContext) {
  const rateLimited = maybeRateLimitRest(request)
  if (rateLimited) return rateLimited

  await logRestAccess(request)
  return restPatch(request, context)
}

export async function PUT(request: Request, context: RouteContext) {
  const rateLimited = maybeRateLimitRest(request)
  if (rateLimited) return rateLimited

  await logRestAccess(request)
  return restPut(request, context)
}
export const OPTIONS = REST_OPTIONS(config)
