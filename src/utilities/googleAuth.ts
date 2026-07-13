import configPromise from '@payload-config'
import { User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { generatePayloadCookie, getFieldsToSign, getPayload, jwtSign } from 'payload'

type GoogleUserInfo = {
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
  sub?: string
}

type VerifiedGoogleUserInfo = {
  email: string
  picture?: string
  name?: string
  sub: string
}

const GOOGLE_STATE_COOKIE = 'google-oauth-state'
const USERS_SLUG = 'users'

export const getGoogleStateCookieName = () => GOOGLE_STATE_COOKIE

export const isGoogleAuthEnabled = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const normalizeRedirectPath = (redirect?: null | string) => {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/account'
  }

  return redirect
}

export const getGoogleCallbackURL = () => `${getServerSideURL()}/api/auth/google/callback`

export const buildGoogleAuthorizationURL = (redirect?: null | string) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured.')
  }

  const nonce = crypto.randomUUID()
  const state = Buffer.from(
    JSON.stringify({
      nonce,
      redirect: normalizeRedirectPath(redirect),
    }),
  ).toString('base64url')

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID)
  url.searchParams.set('redirect_uri', getGoogleCallbackURL())
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('prompt', 'select_account')
  url.searchParams.set('state', state)

  return {
    nonce,
    url,
  }
}

export const parseGoogleOAuthState = (encodedState?: null | string) => {
  if (!encodedState) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedState, 'base64url').toString('utf8')) as {
      nonce?: string
      redirect?: string
    }

    if (!parsed?.nonce) {
      return null
    }

    return {
      nonce: parsed.nonce,
      redirect: normalizeRedirectPath(parsed.redirect),
    }
  } catch {
    return null
  }
}

const exchangeCodeForAccessToken = async (code: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials are not configured.')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getGoogleCallbackURL(),
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to exchange Google authorization code.')
  }

  const data = (await response.json()) as { access_token?: string }

  if (!data.access_token) {
    throw new Error('Google access token was not returned.')
  }

  return data.access_token
}

const fetchGoogleUserInfo = async (accessToken: string): Promise<VerifiedGoogleUserInfo> => {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Google profile.')
  }

  const profile = (await response.json()) as GoogleUserInfo

  if (!profile.sub || !profile.email || !profile.email_verified) {
    throw new Error('Google account must have a verified email address.')
  }

  return {
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
    sub: profile.sub,
  }
}

const createPayloadSessionCookie = async (user: User) => {
  const payload = await getPayload({ config: configPromise })
  const collection = payload.collections[USERS_SLUG]
  const authConfig = collection.config.auth

  if (!authConfig) {
    throw new Error('Users collection auth is not configured.')
  }

  const userForToken = { ...user }
  let sid: string | undefined

  if (authConfig.useSessions) {
    sid = crypto.randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + authConfig.tokenExpiration * 1000)
    const createdAt = now.toISOString()
    const expiresAtISO = expiresAt.toISOString()
    const sessions: NonNullable<User['sessions']> = Array.isArray(userForToken.sessions)
      ? userForToken.sessions.filter(Boolean)
      : []

    userForToken.sessions = [
      ...sessions.filter((session) => {
        const expiresValue =
          session && typeof session === 'object' && 'expiresAt' in session
            ? session.expiresAt
            : null

        return expiresValue ? new Date(String(expiresValue)) > now : false
      }),
      {
        id: sid,
        createdAt,
        expiresAt: expiresAtISO,
      },
    ]

    await payload.update({
      collection: USERS_SLUG,
      id: userForToken.id,
      data: {
        sessions: userForToken.sessions,
      },
    })
  }

  const fieldsToSign = getFieldsToSign({
    collectionConfig: collection.config,
    email: String(userForToken.email || ''),
    ...(sid ? { sid } : {}),
    user: userForToken,
  })

  const { token } = await jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration: authConfig.tokenExpiration,
  })

  return generatePayloadCookie({
    collectionAuthConfig: authConfig,
    cookiePrefix: payload.config.cookiePrefix,
    returnCookieAsObject: true,
    token,
  })
}

export const loginOrCreateGoogleCustomer = async (code: string) => {
  const payload = await getPayload({ config: configPromise })
  const accessToken = await exchangeCodeForAccessToken(code)
  const profile = await fetchGoogleUserInfo(accessToken)

  const {
    docs: [existingUser],
  } = await payload.find({
    collection: USERS_SLUG,
    limit: 1,
    pagination: false,
    where: {
      or: [
        {
          googleId: {
            equals: profile.sub,
          },
        },
        {
          email: {
            equals: profile.email.toLowerCase(),
          },
        },
      ],
    },
  })

  const userData = {
    email: profile.email.toLowerCase(),
    googleAvatarURL: profile.picture,
    googleId: profile.sub,
    memberTier: 'bronze' as const,
    memberSince: existingUser?.memberSince || new Date().toISOString(),
    name: profile.name || profile.email.split('@')[0],
    roles: ['customer' as const],
    totalSpentIDR: existingUser?.totalSpentIDR || 0,
  }

  const user = existingUser
    ? await payload.update({
        collection: USERS_SLUG,
        id: existingUser.id,
        data: userData,
      })
    : await payload.create({
        collection: USERS_SLUG,
        data: {
          ...userData,
          password: crypto.randomUUID(),
        },
      })

  const cookie = await createPayloadSessionCookie(
    user as User,
  )

  return { cookie }
}
