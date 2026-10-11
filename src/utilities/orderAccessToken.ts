import jwt from 'jsonwebtoken'

type OrderAccessClaims = {
  email: string
  orderID: string
  scope: 'order:read'
}

const getSigningSecret = () => {
  const secret = process.env.ORDER_ACCESS_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('ORDER_ACCESS_SECRET atau PAYLOAD_SECRET wajib dikonfigurasi.')
  return `${secret}:order-access:v1`
}

export const createOrderAccessToken = ({
  email,
  orderID,
}: {
  email: string
  orderID: number | string
}) =>
  jwt.sign(
    {
      email: email.trim().toLowerCase(),
      orderID: String(orderID),
      scope: 'order:read',
    } satisfies OrderAccessClaims,
    getSigningSecret(),
    {
      algorithm: 'HS256',
      audience: 'zyho-order-access',
      expiresIn: '30m',
      issuer: 'zyho.store',
      jwtid: crypto.randomUUID(),
    },
  )

export const verifyOrderAccessToken = (token: string): OrderAccessClaims | null => {
  try {
    const decoded = jwt.verify(token, getSigningSecret(), {
      algorithms: ['HS256'],
      audience: 'zyho-order-access',
      issuer: 'zyho.store',
    })
    if (
      !decoded ||
      typeof decoded === 'string' ||
      decoded.scope !== 'order:read' ||
      typeof decoded.email !== 'string' ||
      typeof decoded.orderID !== 'string'
    ) {
      return null
    }
    return {
      email: decoded.email,
      orderID: decoded.orderID,
      scope: 'order:read',
    }
  } catch {
    return null
  }
}
