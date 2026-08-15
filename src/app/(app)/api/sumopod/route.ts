import { notifyPendingPayment } from '@/lib/commerceWhatsApp'
import { findActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import { getServerSideURL } from '@/utilities/getURL'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY || ''
const SUMOPOD_API_BASE_URL =
  process.env.SUMOPOD_API_BASE_URL || 'https://api-pay-sandbox.sumopod.com'
const SUMOPOD_PAYMENT_METHOD = process.env.SUMOPOD_PAYMENT_METHOD || 'QRIS'

const QRIS_FIELD_NAMES = new Set([
  'payment_number',
  'qr_content',
  'qr_payload',
  'qr_string',
  'qris',
  'qris_code',
  'qris_payload',
  'qris_string',
])

const QRIS_IMAGE_FIELD_NAMES = new Set([
  'qr_code_url',
  'qr_image',
  'qr_image_url',
  'qris_image',
  'qris_image_url',
])

const requireAuthenticatedCustomer = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) return null

  const roles = Array.isArray(user.roles) ? user.roles : []
  const isAllowed = roles.some((role) => ['admin', 'manager', 'finance', 'customer'].includes(role))

  return isAllowed ? { payload, user } : null
}

const requireOwnedSumoPodPayment = async ({
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

const findStringByKey = (value: unknown, fieldNames: Set<string>): string | null => {
  if (!value || typeof value !== 'object') return null

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStringByKey(item, fieldNames)
      if (found) return found
    }
    return null
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (typeof nestedValue === 'string' && fieldNames.has(key.toLowerCase())) {
      return nestedValue
    }

    const found = findStringByKey(nestedValue, fieldNames)
    if (found) return found
  }

  return null
}

const findQrisPayload = (payment: any) => {
  const direct = findStringByKey(payment, QRIS_FIELD_NAMES)
  if (direct) return direct

  return findStringByKey(payment, new Set(['qr_code', 'payment_code']))
}

const findQrisImageUrl = (payment: any) => {
  const image = findStringByKey(payment, QRIS_IMAGE_FIELD_NAMES)
  if (image) return image

  const qrCode = findStringByKey(payment, new Set(['qr_code']))
  return qrCode && /^(https?:|data:image\/)/i.test(qrCode) ? qrCode : null
}

const normalizeSumoPodPayment = (payment: any) => {
  const qrisPayload = findQrisPayload(payment)
  const qrisImageUrl = findQrisImageUrl(payment)

  return {
    expired_at: payment?.expires_at || payment?.expired_at || null,
    fee: typeof payment?.fee === 'number' ? payment.fee : 0,
    payment_id: payment?.payment_id || null,
    payment_link_url: payment?.payment_link_url || null,
    payment_number: qrisPayload || payment?.payment_link_url || null,
    provider: 'sumopod',
    qris_image_url: qrisImageUrl,
    qris_payload: qrisPayload,
    status: payment?.status || 'pending',
    total_payment: typeof payment?.amount === 'number' ? payment.amount : null,
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      key: `sumopod-post:${req.headers.get('x-forwarded-for') || 'unknown'}`,
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
        message: '[Security] Unauthorized SumoPod POST blocked',
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

    if (!SUMOPOD_API_KEY) {
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

    const activeSession = await requireOwnedSumoPodPayment({
      amount,
      orderID: order_id,
      payload: localPayload,
      userID: user.id,
    })

    if (!activeSession) {
      auditLog({
        level: 'warn',
        message: '[Security] SumoPod payment ownership check failed',
        meta: buildAuditMeta(req, { action, amount, orderID: order_id, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const paymentData = (activeSession.paymentData as Record<string, any>) || {}

    if (action === 'simulate') {
      if (process.env.NODE_ENV === 'production') {
        auditLog({
          level: 'warn',
          message: '[Security] Forbidden SumoPod simulate in production',
          meta: buildAuditMeta(req, { action, userID: user.id }),
        })
        return NextResponse.json({ error: 'simulate is disabled in production.' }, { status: 403 })
      }

      await localPayload.update({
        collection: 'checkout-sessions' as any,
        id: activeSession.id,
        data: {
          paymentData: {
            ...paymentData,
            sumopodStatus: 'completed',
            sumopodSimulatedAt: new Date().toISOString(),
          },
        } as any,
        overrideAccess: true,
      })

      return NextResponse.json({ transaction: { status: 'completed' } })
    }

    if (action === 'cancel') {
      await localPayload.update({
        collection: 'checkout-sessions' as any,
        id: activeSession.id,
        data: {
          paymentData: { ...paymentData, sumopodStatus: 'cancelled' },
        } as any,
        overrideAccess: true,
      })

      return NextResponse.json({ transaction: { status: 'cancelled' } })
    }

    if (paymentData.sumopodPaymentLinkURL) {
      return NextResponse.json({
        payment: normalizeSumoPodPayment({
          amount,
          expires_at: paymentData.sumopodExpiresAt,
          fee: paymentData.sumopodFee,
          payment_id: paymentData.sumopodPaymentID,
          payment_link_url: paymentData.sumopodPaymentLinkURL,
          qris_image_url: paymentData.sumopodQrisImageURL,
          qris_payload: paymentData.sumopodQrisPayload,
          status: paymentData.sumopodStatus || 'pending',
        }),
      })
    }

    auditLog({
      logger: console,
      message: '[Audit] SumoPod POST access',
      meta: buildAuditMeta(req, { action, amount, orderID: order_id, userID: user.id }),
    })

    const checkoutURL = `${getServerSideURL()}/checkout`
    const successReturnURL = `${checkoutURL}?sumopod_return=success&order_id=${encodeURIComponent(order_id)}`
    const cancelReturnURL = `${checkoutURL}?sumopod_return=cancel&order_id=${encodeURIComponent(order_id)}`
    const response = await fetch(`${SUMOPOD_API_BASE_URL.replace(/\/$/, '')}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': SUMOPOD_API_KEY,
      },
      body: JSON.stringify({
        amount,
        cancel_return_url: cancelReturnURL,
        currency: 'IDR',
        expires_in_hours: 1,
        order_id,
        payment_method_type_code: SUMOPOD_PAYMENT_METHOD,
        success_return_url: successReturnURL,
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok || !data?.payment_link_url) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Gagal membuat pembayaran SumoPod.' },
        { status: response.status },
      )
    }

    const normalized = normalizeSumoPodPayment(data)
    await localPayload.update({
      collection: 'checkout-sessions' as any,
      id: activeSession.id,
      data: {
        paymentData: {
          ...paymentData,
          sumopodExpiresAt: normalized.expired_at,
          sumopodFee: normalized.fee,
          sumopodPaymentID: normalized.payment_id,
          sumopodPaymentLinkURL: normalized.payment_link_url,
          sumopodQrisImageURL: normalized.qris_image_url,
          sumopodQrisPayload: normalized.qris_payload,
          sumopodStatus: normalized.status,
        },
      } as any,
      overrideAccess: true,
    })

    void notifyPendingPayment({
      amount,
      currency: 'IDR',
      customerName: customerName || user.name || undefined,
      orderCode: order_id,
      pendingPaymentUrl: normalized.payment_link_url || checkoutURL,
      phone: phone || user.phone || undefined,
      sessionExpiry: '10:00',
    })
      .then((result) => {
        if (!result?.success) console.error('[SumoPod pending WA] failed:', result)
      })
      .catch((error) => {
        console.error('[SumoPod pending WA] error:', error)
      })

    return NextResponse.json({ payment: normalized }, { status: response.status })
  } catch (err) {
    console.error('[SumoPod proxy] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      key: `sumopod-get:${req.headers.get('x-forwarded-for') || 'unknown'}`,
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
        message: '[Security] Unauthorized SumoPod GET blocked',
        meta: buildAuditMeta(req),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { payload: localPayload, user } = context

    const { searchParams } = new URL(req.url)
    const order_id = searchParams.get('order_id')
    const amountParam = searchParams.get('amount')

    if (!order_id || !amountParam) {
      return NextResponse.json({ error: 'order_id dan amount wajib diisi.' }, { status: 400 })
    }

    const amount = Number(amountParam)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount tidak valid.' }, { status: 400 })
    }

    const activeSession = await requireOwnedSumoPodPayment({
      amount,
      orderID: order_id,
      payload: localPayload,
      userID: user.id,
    })

    if (!activeSession) {
      auditLog({
        level: 'warn',
        message: '[Security] SumoPod status ownership check failed',
        meta: buildAuditMeta(req, { amount, orderID: order_id, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    auditLog({
      message: '[Audit] SumoPod GET access',
      meta: buildAuditMeta(req, { amount, orderID: order_id, userID: user.id }),
    })

    const paymentData = (activeSession.paymentData as Record<string, any>) || {}
    return NextResponse.json({
      transaction: {
        payment_id: paymentData.sumopodPaymentID || null,
        status: paymentData.sumopodStatus || 'pending',
      },
    })
  } catch (err) {
    console.error('[SumoPod proxy] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
