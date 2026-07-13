import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

const graphqlPost = GRAPHQL_POST(config)

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit({
    limit: 60,
    request,
    responseMessage: 'Too many GraphQL requests',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  const payload = await getPayload({ config })
  const authResult = await payload.auth({ headers: request.headers }).catch(() => null)

  auditLog({
    logger: payload.logger,
    message: '[Audit] GraphQL access',
    meta: buildAuditMeta(request, {
      authenticated: Boolean(authResult?.user),
      userID: authResult?.user?.id ?? null,
    }),
  })

  return graphqlPost(request)
}

export const OPTIONS = REST_OPTIONS(config)
