import { notifyPendingPayment } from '@/lib/commerceWhatsApp'
import { findActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import { getServerSideURL } from '@/utilities/getURL'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || ''
const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || ''

const requireAuthenticatedCustomer = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return null
  }

  const roles = Array.isArray(user.roles) ? user.roles : []
  const isAllowed = roles.some((role) => ['admin', 'manager', 'finance', 'customer'].includes(role))

  return isAllowed ? { payload, user } : null
}

const requireOwnedPakasirPayment = async ({
  amount,
  orderID,
  payload,
  userID,
}: {
  amount: number
  orderID: string
  payload: Awaited<ReturnType<typeof getPayload>>
  userID: number | string
}) => {
  const activeSession = await findActiveCheckoutSession(payload, userID)
  const paymentData = activeSession?.paymentData as any

  if (
    !activeSession ||
    activeSession.paymentMethod !== 'pakasir' ||
    paymentData?.orderID !== orderID ||
    Number(paymentData?.amount) !== amount
  ) {
    return null
  }

  return activeSession
}

/**
 * POST /api/pakasir
 * Proxy untuk Pakasir API — menyembunyikan API key dari frontend.
 *
 * Body: { action: 'create' | 'simulate' | 'cancel', order_id: string, amount: number }
 * Response: JSON dari Pakasir API
 */
export async function POST(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      key: `pakasir-post:${req.headers.get('x-forwarded-for') || 'unknown'}`,
      limit: 20,
      request: req,
      responseMessage: 'Too many payment requests',
      windowMs: 60_000,
    })
    if (rateLimited) return rateLimited

    const context = await requireAuthenticatedCustomer(req)
    if (!context) {
      auditLog({
        level: 'warn',
        message: '[Security] Unauthorized Pakasir POST blocked',
        meta: buildAuditMeta(req),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { payload: localPayload, user } = context

    const body = await req.json()
    const { action, order_id, amount, customerName, phone } = body as {
      action: 'create' | 'simulate' | 'cancel'
      order_id: string
      amount: number
      customerName?: string
      phone?: string
    }

    if (!PAKASIR_API_KEY || !PAKASIR_PROJECT_SLUG) {
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 503 })
    }

    if (!action || !order_id || !amount) {
      return NextResponse.json({ error: 'action, order_id, dan amount wajib diisi.' }, { status: 400 })
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount tidak valid.' }, { status: 400 })
    }

    if (!/^[A-Za-z0-9._:-]{1,100}$/.test(order_id)) {
      return NextResponse.json({ error: 'order_id tidak valid.' }, { status: 400 })
    }

    const activeSession = await requireOwnedPakasirPayment({
      amount,
      orderID: order_id,
      payload: localPayload,
      userID: user.id,
    })

    if (!activeSession) {
      auditLog({
        level: 'warn',
        message: '[Security] Pakasir payment ownership check failed',
        meta: buildAuditMeta(req, { action, amount, orderID: order_id, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (action === 'simulate' && process.env.NODE_ENV === 'production') {
      auditLog({
        level: 'warn',
        message: '[Security] Forbidden Pakasir simulate in production',
        meta: buildAuditMeta(req, { action, userID: user.id }),
      })
      return NextResponse.json({ error: 'simulate is disabled in production.' }, { status: 403 })
    }

    auditLog({
      logger: console,
      message: '[Audit] Pakasir POST access',
      meta: buildAuditMeta(req, { action, amount, orderID: order_id, userID: user.id }),
    })

    const payload = {
      project: PAKASIR_PROJECT_SLUG,
      order_id,
      amount,
      api_key: PAKASIR_API_KEY,
    }

    let url: string
    if (action === 'create') {
      url = 'https://app.pakasir.com/api/transactioncreate/qris'
    } else if (action === 'simulate') {
      url = 'https://app.pakasir.com/api/paymentsimulation'
    } else if (action === 'cancel') {
      url = 'https://app.pakasir.com/api/transactioncancel'
    } else {
      return NextResponse.json({ error: 'action tidak valid.' }, { status: 400 })
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (action === 'create' && response.ok && data?.payment?.payment_number) {
      // Generate pending payment URL dengan session
      const pendingPaymentUrl = `${getServerSideURL()}/checkout?reservation_id=${order_id}&session_id=${order_id}_${Date.now()}`
      
      void notifyPendingPayment({
        amount,
        customerName: customerName || user.name || undefined,
        orderCode: order_id,
        phone: phone || user.phone || undefined,
        currency: 'IDR',
        pendingPaymentUrl,
        sessionExpiry: '10:00',
      })
        .then((result) => {
          if (!result?.success) {
            console.error('[Pakasir pending WA] failed:', result)
          }
        })
        .catch((error) => {
          console.error('[Pakasir pending WA] error:', error)
        })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error('[Pakasir proxy] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/pakasir?order_id=...&amount=...
 * Cek status transaksi Pakasir.
 */
export async function GET(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      key: `pakasir-get:${req.headers.get('x-forwarded-for') || 'unknown'}`,
      limit: 30,
      request: req,
      responseMessage: 'Too many payment status checks',
      windowMs: 60_000,
    })
    if (rateLimited) return rateLimited

    const context = await requireAuthenticatedCustomer(req)
    if (!context) {
      auditLog({
        level: 'warn',
        message: '[Security] Unauthorized Pakasir GET blocked',
        meta: buildAuditMeta(req),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { payload: localPayload, user } = context

    const { searchParams } = new URL(req.url)
    const order_id = searchParams.get('order_id')
    const amountParam = searchParams.get('amount')

    if (!PAKASIR_API_KEY || !PAKASIR_PROJECT_SLUG) {
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 503 })
    }

    if (!order_id || !amountParam) {
      return NextResponse.json({ error: 'order_id dan amount wajib diisi.' }, { status: 400 })
    }

    const amount = Number(amountParam)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount tidak valid.' }, { status: 400 })
    }

    if (!/^[A-Za-z0-9._:-]{1,100}$/.test(order_id)) {
      return NextResponse.json({ error: 'order_id tidak valid.' }, { status: 400 })
    }

    const activeSession = await requireOwnedPakasirPayment({
      amount,
      orderID: order_id,
      payload: localPayload,
      userID: user.id,
    })

    if (!activeSession) {
      auditLog({
        level: 'warn',
        message: '[Security] Pakasir status ownership check failed',
        meta: buildAuditMeta(req, { amount, orderID: order_id, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    auditLog({
      message: '[Audit] Pakasir GET access',
      meta: buildAuditMeta(req, { amount, orderID: order_id, userID: user.id }),
    })

    const url = `https://app.pakasir.com/api/transactiondetail?project=${PAKASIR_PROJECT_SLUG}&amount=${amount}&order_id=${order_id}&api_key=${PAKASIR_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error('[Pakasir proxy] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
