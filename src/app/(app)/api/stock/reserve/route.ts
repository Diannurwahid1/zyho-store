import { releaseReservation, reserveStock } from '@/lib/stock'
import { findActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

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
    return payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        customer: userID,
      } as any,
      overrideAccess: true,
    })
  }

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

/**
 * POST /api/stock/reserve
 * Reservasi stok saat user mulai proses pembayaran.
 *
 * Body: {
 *   reservationId: string   — biasanya cartId + timestamp
 *   items: Array<{
 *     productId: string
 *     variantId?: string
 *     quantity: number
 *   }>
 *   cartId?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { reservationId, items, cartId, cartSecret } = body as {
      reservationId: string
      items: Array<{ productId: number | string; variantId?: number | string; quantity: number }>
      cartId?: string
      cartSecret?: string
    }

    if (!reservationId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'reservationId dan items wajib diisi.' }, { status: 400 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Login customer diperlukan.' }, { status: 401 })
    }
    const customerId = user.id
    const activeSession = await findActiveCheckoutSession(payload, customerId)
    if (!activeSession || activeSession.sessionId !== reservationId) {
      return NextResponse.json(
        { error: 'Sesi checkout tidak aktif atau tidak valid.' },
        { status: 409 },
      )
    }
    if (
      items.some(
        (item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100,
      )
    ) {
      return NextResponse.json({ error: 'Jumlah item reservasi tidak valid.' }, { status: 400 })
    }
    if (!cartId || String(activeSession.cartId) !== String(cartId)) {
      return NextResponse.json(
        { error: 'Keranjang tidak cocok dengan sesi checkout.' },
        { status: 403 },
      )
    }
    const cart = await payload.findByID({
      collection: 'carts',
      depth: 1,
      id: cartId,
      overrideAccess: true,
    })

    const ownedCart = await ensureCartBelongsToUser({
      cart,
      cartSecret: typeof cartSecret === 'string' ? cartSecret : null,
      payload,
      userID: customerId,
    })

    if (!ownedCart) {
      return NextResponse.json({ error: 'Keranjang bukan milik customer ini.' }, { status: 403 })
    }
    const cartItems = ownedCart.items || []
    const invalidItem = items.some((requested) => {
      const matching = cartItems.find((cartItem: any) => {
        const productId =
          typeof cartItem.product === 'object' ? cartItem.product?.id : cartItem.product
        const variantId =
          typeof cartItem.variant === 'object' ? cartItem.variant?.id : cartItem.variant
        return (
          String(productId) === String(requested.productId) &&
          String(variantId || '') === String(requested.variantId || '')
        )
      })
      return !matching || requested.quantity > matching.quantity
    })
    if (invalidItem) {
      return NextResponse.json(
        { error: 'Item reservasi tidak cocok dengan keranjang.' },
        { status: 403 },
      )
    }

    const results: Array<{ productId: string; success: boolean; error?: string }> = []

    for (const item of items) {
      const reservationKey = `${reservationId}:${item.productId}:${item.variantId || 'base'}`
      const result = await reserveStock(payload, {
        reservationId: reservationKey,
        productId: item.productId,
        variantId: item.variantId != null ? String(item.variantId) : null,
        quantity: item.quantity,
        customerId,
        cartId: cartId || null,
      })

      results.push({ productId: String(item.productId), ...result })
    }

    const allSuccess = results.every((r) => r.success)
    const failures = results.filter((r) => !r.success)

    if (!allSuccess) {
      // Release semua yang berhasil direservasi karena ada yang gagal
      for (const item of items) {
        const reservationKey = `${reservationId}:${item.productId}:${item.variantId || 'base'}`
        await releaseReservation(payload, reservationKey, 'Partial reservation rollback')
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Beberapa item tidak tersedia.',
          failures,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ success: true, reservationId, results })
  } catch (err) {
    console.error('[Stock Reserve] error:', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/stock/reserve
 * Release reservasi stok (user cancel / timeout dari client).
 *
 * Body: { reservationId: string, items: Array<{ productId: string, variantId?: string }> }
 */
export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { reservationId, items } = body as {
      reservationId: string
      items: Array<{ productId: number | string; variantId?: number | string }>
    }

    if (!reservationId || !items) {
      return NextResponse.json({ error: 'reservationId dan items wajib diisi.' }, { status: 400 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const activeSession = await findActiveCheckoutSession(payload, user.id)
    if (!activeSession || activeSession.sessionId !== reservationId) {
      return NextResponse.json(
        { error: 'Sesi checkout bukan milik customer ini.' },
        { status: 403 },
      )
    }

    let released = 0
    for (const item of items) {
      const result = await releaseReservation(
        payload,
        `${reservationId}:${item.productId}:${item.variantId || 'base'}`,
        'User cancelled payment',
      )
      released += result.released
    }

    return NextResponse.json({ success: true, released })
  } catch (err) {
    console.error('[Stock Release] error:', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
