import {
  buildGoogleAuthorizationURL,
  getGoogleStateCookieName,
  isGoogleAuthEnabled,
  normalizeRedirectPath,
  parseGoogleStateCookie,
  serializeGoogleStateCookie,
} from '@/utilities/googleAuth'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    limit: 20,
    request: req,
    responseMessage: 'Too many Google auth attempts',
    windowMs: 10 * 60_000,
  })
  if (rateLimited) return rateLimited

  if (!isGoogleAuthEnabled()) {
    return NextResponse.json({ error: 'Google Sign-In is not configured.' }, { status: 503 })
  }

  const redirect = normalizeRedirectPath(req.nextUrl.searchParams.get('redirect'))
  const { nonce, url } = buildGoogleAuthorizationURL(redirect)
  const response = NextResponse.redirect(url)
  const existingNonces = parseGoogleStateCookie(req.cookies.get(getGoogleStateCookieName())?.value)

  response.cookies.set(getGoogleStateCookieName(), serializeGoogleStateCookie([...existingNonces, nonce]), {
    httpOnly: true,
    maxAge: 600,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  auditLog({
    message: '[Audit] Google auth flow started',
    meta: buildAuditMeta(req, { redirect }),
  })

  return response
}
