import {
    CHECKOUT_SESSION_TTL_MS,
    findActiveCheckoutSession,
    releaseOwnedCheckoutReservations,
} from '@/lib/checkoutSessionServer'
import { enforceRateLimit } from '@/utilities/security'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const getContext = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })
  return { payload, user }
}

const publicSession = (session: any) => ({
  currency: session.currency,
  expiresAt: new Date(session.expiresAt).getTime(),
  paymentData: session.paymentData || null,
  paymentMethod: session.paymentMethod,
  reservationId: session.reservationId || session.sessionId,
  sessionId: session.sessionId,
  status: session.status,
})

const ensureCartBelongsToUser = async ({
  cart,
  cartSecret,
  payload,
  userID,
}: {
  cart: any
  cartSecret?: string | null
  payload: Awaited<ReturnType<typeof getPayload>>
  userID: number | string
}) => {
  const cartCustomer = typeof cart.customer === 'object' ? cart.customer?.id : cart.customer

  if (cartCustomer && String(cartCustomer) === String(userID)) {
    return cart
  }

  if (!cartCustomer) {
    // If cart has no customer, claim it for this user
    return payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        customer: userID,
      } as any,
      overrideAccess: true,
    })
  }

  // If cart belongs to someone else, clone it for this user
  return payload.create({
    collection: 'carts',
    data: {
      customer: userID,
      items: cart.items || [],
      currency: cart.currency,
    } as any,
    overrideAccess: true,
  })
}

export async function GET(req: NextRequest) {
  try {
    const { payload, user } = await getContext(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const session = await findActiveCheckoutSession(payload, user.id)
    return NextResponse.json({ session: session ? publicSession(session) : null })
  } catch (err) {
    console.error('[Checkout Session GET] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    limit: 10,
    request: req,
    responseMessage: 'Terlalu banyak percobaan checkout. Tunggu sebentar.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited
  const { payload, user } = await getContext(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await findActiveCheckoutSession(payload, user.id)
  if (existing) {
    return NextResponse.json(
      { error: 'Anda masih memiliki pembayaran aktif.', session: publicSession(existing) },
      { status: 409 },
    )
  }

  const body = await req.json().catch(() => ({}))
  if (!body.cartId || (typeof body.cartId !== 'string' && typeof body.cartId !== 'number')) {
    return NextResponse.json({ error: 'Keranjang checkout tidak valid.' }, { status: 400 })
  }

  const cart = await payload.findByID({
    collection: 'carts',
    depth: 0,
    id: body.cartId,
    overrideAccess: true,
  })

  const ownedCart = await ensureCartBelongsToUser({
    cart,
    cartSecret: typeof body.cartSecret === 'string' ? body.cartSecret : null,
    payload,
    userID: user.id,
  })

  if (!ownedCart) {
    return NextResponse.json({ error: 'Keranjang bukan milik customer ini.' }, { status: 403 })
  }

  const currency = body.currency === 'USD' ? 'USD' : 'IDR'
  const paymentMethod = currency === 'USD' ? 'nowpayments' : 'pakasir'
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + CHECKOUT_SESSION_TTL_MS).toISOString()
  let session
  try {
    session = await payload.create({
      collection: 'checkout-sessions' as any,
      data: {
        activeKey: `customer:${user.id}`,
        cartId: String(ownedCart.id),
        currency,
        customer: user.id,
        expiresAt,
        paymentMethod,
        reservationId: sessionId,
        sessionId,
        status: 'creating',
      } as any,
      overrideAccess: true,
    })
  } catch {
    const racedSession = await findActiveCheckoutSession(payload, user.id)
    if (racedSession) {
      return NextResponse.json(
        { error: 'Anda masih memiliki pembayaran aktif.', session: publicSession(racedSession) },
        { status: 409 },
      )
    }
    throw new Error('Gagal membuat sesi checkout.')
  }
  return NextResponse.json({ session: publicSession(session) }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { payload, user } = await getContext(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const active = await findActiveCheckoutSession(payload, user.id)
  if (!active || active.sessionId !== body.sessionId) {
    return NextResponse.json({ error: 'Sesi checkout tidak aktif.' }, { status: 409 })
  }
  const session = await payload.update({
    collection: 'checkout-sessions' as any,
    id: active.id,
    data: {
      paymentData: body.paymentData,
      reservationId: active.sessionId,
      status: 'pending',
    } as any,
    overrideAccess: true,
  })
  return NextResponse.json({ session: publicSession(session) })
}

export async function PATCH(req: NextRequest) {
  const { payload, user } = await getContext(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const active = await findActiveCheckoutSession(payload, user.id)
  if (!active || active.sessionId !== body.sessionId) {
    return NextResponse.json({ error: 'Sesi checkout tidak aktif.' }, { status: 409 })
  }
  const order = await payload.findByID({
    collection: 'orders',
    depth: 0,
    id: body.orderId,
    overrideAccess: true,
  })
  const orderCustomer = typeof order.customer === 'object' ? order.customer?.id : order.customer
  if (!orderCustomer || String(orderCustomer) !== String(user.id)) {
    return NextResponse.json({ error: 'Order bukan milik customer ini.' }, { status: 403 })
  }
  await payload.update({
    collection: 'checkout-sessions' as any,
    id: active.id,
    data: { activeKey: null, order: order.id, status: 'completed' } as any,
    overrideAccess: true,
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { payload, user } = await getContext(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const active = await findActiveCheckoutSession(payload, user.id)
  if (!active || (body.sessionId && active.sessionId !== body.sessionId)) {
    return NextResponse.json({ error: 'Sesi checkout tidak aktif.' }, { status: 409 })
  }
  await releaseOwnedCheckoutReservations(
    payload,
    user.id,
    active.sessionId,
    'Customer cancelled checkout',
  )
  await payload.update({
    collection: 'checkout-sessions' as any,
    id: active.id,
    data: { activeKey: null, status: 'cancelled' } as any,
    overrideAccess: true,
  })
  return NextResponse.json({ success: true })
}
