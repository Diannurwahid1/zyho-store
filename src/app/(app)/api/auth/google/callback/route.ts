import {
  getGoogleStateCookieName,
  isGoogleAuthEnabled,
  loginOrCreateGoogleCustomer,
  parseGoogleOAuthState,
  parseGoogleStateCookie,
  serializeGoogleStateCookie,
} from '@/utilities/googleAuth'
import { getServerSideURL } from '@/utilities/getURL'
import { NextRequest, NextResponse } from 'next/server'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    limit: 20,
    request: req,
    responseMessage: 'Too many Google auth callbacks',
    windowMs: 10 * 60_000,
  })
  if (rateLimited) return rateLimited

  const fallbackURL = new URL('/login?error=google-auth', getServerSideURL())

  if (!isGoogleAuthEnabled()) {
    return NextResponse.redirect(fallbackURL)
  }

  const code = req.nextUrl.searchParams.get('code')
  const state = parseGoogleOAuthState(req.nextUrl.searchParams.get('state'))
  const cookieNonces = parseGoogleStateCookie(req.cookies.get(getGoogleStateCookieName())?.value)
  const hasMatchingNonce = Boolean(state?.nonce && cookieNonces.includes(state.nonce))

  if (!code || !state || !hasMatchingNonce) {
    auditLog({
      level: 'warn',
      message: '[Security] Google auth callback validation failed',
      meta: buildAuditMeta(req, {
        hasCode: Boolean(code),
        hasMatchingNonce,
        hasState: Boolean(state),
        pendingNonceCount: cookieNonces.length,
      }),
    })
    return NextResponse.redirect(fallbackURL)
  }

  try {
    const { cookie, isNewUser } = await loginOrCreateGoogleCustomer(code)
    const redirectURL = new URL(state.redirect, getServerSideURL())
    if (isNewUser) redirectURL.searchParams.set('welcome', '1')
    const response = NextResponse.redirect(redirectURL)

    if (!cookie.value) {
      throw new Error('Missing session cookie value')
    }

    response.cookies.set(cookie.name, cookie.value, {
      domain: cookie.domain,
      expires: cookie.expires ? new Date(cookie.expires) : undefined,
      httpOnly: cookie.httpOnly,
      maxAge: cookie.maxAge,
      path: cookie.path,
      sameSite: cookie.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none' | undefined,
      secure: cookie.secure,
    })
    const remainingNonces = cookieNonces.filter((nonce) => nonce !== state.nonce)
    if (remainingNonces.length > 0) {
      response.cookies.set(getGoogleStateCookieName(), serializeGoogleStateCookie(remainingNonces), {
        httpOnly: true,
        maxAge: 600,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    } else {
      response.cookies.delete(getGoogleStateCookieName())
    }

    auditLog({
      message: '[Audit] Google auth callback completed',
      meta: buildAuditMeta(req, { redirect: state.redirect }),
    })

    return response
  } catch (error) {
    console.error('[google callback]', error)
    return NextResponse.redirect(fallbackURL)
  }
}
