import { notifyPendingPayment } from '@/lib/commerceWhatsApp'
import {
  findActiveCheckoutSession,
  releaseOwnedCheckoutReservations,
} from '@/lib/checkoutSessionServer'
import {
  getAttemptPublicPaymentData,
  transitionPaymentAttempt,
} from '@/payments/paymentAttempts'
import { getServerSideURL } from '@/utilities/getURL'
import {
  auditLog,
  buildAuditMeta,
  enforceRateLimit,
  getClientIP,
  readJSONBodyLimited,
} from '@/utilities/security'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY || ''
const SUMOPOD_API_BASE_URL =
  process.env.SUMOPOD_API_BASE_URL || 'https://api-pay-sandbox.sumopod.com'
const SUMOPOD_PAYMENT_METHOD = process.env.SUMOPOD_PAYMENT_METHOD || 'QRIS'
const MAX_PROVIDER_RESPONSE_BYTES = 256 * 1024
const MAX_REQUEST_BODY_BYTES = 16 * 1024
const TRUSTED_SUMOPOD_CHECKOUT_HOSTS = new Set([
  'sumopod.com',
  'checkout.pymnt.app',
])

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
    if (typeof nestedValue === 'string' && fieldNames.has(key.toLowerCase())) return nestedValue
    const found = findStringByKey(nestedValue, fieldNames)
    if (found) return found
  }
  return null
}

const isTrustedSumoPodURL = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value) return false
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      (TRUSTED_SUMOPOD_CHECKOUT_HOSTS.has(url.hostname) ||
        url.hostname.endsWith('.sumopod.com'))
    )
  } catch {
    return false
  }
}

const normalizeSumoPodPayment = (payment: Record<string, any>) => {
  const rawQrisPayload =
    findStringByKey(payment, QRIS_FIELD_NAMES) ||
    findStringByKey(payment, new Set(['qr_code', 'payment_code']))
  const rawQrisImage = findStringByKey(payment, QRIS_IMAGE_FIELD_NAMES)
  const paymentLinkURL = isTrustedSumoPodURL(payment.payment_link_url)
    ? payment.payment_link_url
    : null
  const qrisImageURL =
    typeof rawQrisImage === 'string' &&
    (/^data:image\/(?:png|jpeg|webp);base64,/i.test(rawQrisImage) ||
      isTrustedSumoPodURL(rawQrisImage))
      ? rawQrisImage
      : null

  return {
    expired_at: payment.expires_at || payment.expired_at || null,
    fee: Number.isFinite(Number(payment.fee)) ? Number(payment.fee) : 0,
    payment_id: payment.payment_id ? String(payment.payment_id) : null,
    payment_link_url: paymentLinkURL,
    payment_number: rawQrisPayload || paymentLinkURL,
    provider: 'sumopod',
    qris_image_url: qrisImageURL,
    qris_payload: rawQrisPayload,
    status: String(payment.status || 'pending').toLowerCase(),
    total_payment: Number.isFinite(Number(payment.amount)) ? Number(payment.amount) : null,
  }
}

const requireAuthenticatedCustomer = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return null
  const roles = Array.isArray(user.roles) ? user.roles : []
  const allowed = roles.some((role) =>
    ['admin', 'manager', 'finance', 'customer'].includes(String(role)),
  )
  return allowed ? { payload, user } : null
}

const requireOwnedAttempt = async ({
  payload,
  userID,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>
  userID: number | string
}) => {
  const activeSession = await findActiveCheckoutSession(payload, userID)
  if (!activeSession || activeSession.paymentMethod !== 'pakasir') return null

  const attempts = await payload.find({
    collection: 'payment-attempts' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { checkoutSession: { equals: activeSession.id } },
        { customer: { equals: userID } },
        { provider: { equals: 'sumopod' } },
      ],
    } as any,
  })
  const attempt = attempts.docs[0] as Record<string, any> | undefined
  return attempt ? { activeSession, attempt } : null
}

const validateClientReference = ({
  amount,
  attempt,
  orderID,
}: {
  amount: unknown
  attempt: Record<string, any>
  orderID: unknown
}) => {
  if (orderID !== undefined && String(orderID) !== String(attempt.providerOrderId)) return false
  if (amount !== undefined && Number(amount) !== Number(attempt.expectedAmount)) return false
  return true
}

export async function POST(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    key: `sumopod-post:${getClientIP(req)}`,
    limit: 10,
    request: req,
    responseMessage: 'Terlalu banyak permintaan pembayaran.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  try {
    const context = await requireAuthenticatedCustomer(req)
    if (!context) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { payload, user } = context
    const parsed = await readJSONBodyLimited<Record<string, unknown>>(
      req,
      MAX_REQUEST_BODY_BYTES,
    )
    if (parsed.response) return parsed.response
    const body = parsed.data
    const action = String(body.action || '')
    if (!['create', 'simulate', 'cancel'].includes(action)) {
      return NextResponse.json({ error: 'Action pembayaran tidak valid.' }, { status: 400 })
    }

    const owned = await requireOwnedAttempt({ payload, userID: user.id })
    if (!owned) return NextResponse.json({ error: 'Payment attempt tidak ditemukan.' }, { status: 409 })
    const { activeSession, attempt } = owned
    if (!validateClientReference({ amount: body.amount, attempt, orderID: body.order_id })) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] SumoPod client reference mismatch',
        meta: buildAuditMeta(req, { attemptID: attempt.id, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const amount = Number(attempt.expectedAmount)
    const orderID = String(attempt.providerOrderId)
    const providerData = (attempt.providerData as Record<string, any> | null) || {}

    if (action === 'simulate') {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Simulasi dinonaktifkan di production.' }, { status: 403 })
      }
      const simulatedResult = await transitionPaymentAttempt({
        allowedStatuses: ['initiated', 'creating', 'pending'],
        attemptID: attempt.id,
        data: {
          paidAmount: amount,
          status: 'completed',
          verifiedAt: new Date().toISOString(),
        },
        payload,
      })
      const simulated = simulatedResult.attempt
      if (!simulatedResult.transitioned && simulated.status !== 'completed') {
        return NextResponse.json({ error: 'Status pembayaran tidak dapat disimulasikan.' }, { status: 409 })
      }
      await payload.update({
        collection: 'checkout-sessions' as any,
        id: activeSession.id,
        data: { paymentData: getAttemptPublicPaymentData(simulated) } as any,
        overrideAccess: true,
      })
      return NextResponse.json({ transaction: { status: 'completed' } })
    }

    if (action === 'cancel') {
      const cancelResult = await transitionPaymentAttempt({
        allowedStatuses: ['initiated', 'creating', 'pending'],
        attemptID: attempt.id,
        data: { status: 'cancelled' },
        payload,
      })
      const cancelled = cancelResult.attempt

      if (['completed', 'finalizing', 'consumed'].includes(String(cancelled.status))) {
        return NextResponse.json(
          { error: 'Pembayaran sudah diterima dan tidak dapat dibatalkan.' },
          { status: 409 },
        )
      }
      if (!cancelResult.transitioned && cancelled.status !== 'cancelled') {
        return NextResponse.json({ error: 'Pembayaran tidak dapat dibatalkan.' }, { status: 409 })
      }

      await releaseOwnedCheckoutReservations(
        payload,
        user.id,
        activeSession.sessionId,
        'Customer cancelled SumoPod payment',
      )
      await payload.update({
        collection: 'checkout-sessions' as any,
        id: activeSession.id,
        data: {
          activeKey: null,
          paymentData: getAttemptPublicPaymentData(cancelled),
          status: 'cancelled',
        } as any,
        overrideAccess: true,
      })
      return NextResponse.json({ transaction: { status: 'cancelled' } })
    }

    if (!SUMOPOD_API_KEY) {
      return NextResponse.json({ error: 'Payment gateway belum dikonfigurasi.' }, { status: 503 })
    }
    if (['failed', 'expired', 'cancelled'].includes(String(attempt.status))) {
      return NextResponse.json(
        { error: 'Sesi pembayaran sudah tidak aktif. Mulai checkout baru.' },
        { status: 409 },
      )
    }
    if (providerData.paymentLinkURL) {
      return NextResponse.json({
        payment: normalizeSumoPodPayment({
          amount,
          expires_at: providerData.expiresAt,
          fee: providerData.fee,
          payment_id: attempt.providerPaymentId,
          payment_link_url: providerData.paymentLinkURL,
          qris_image_url: providerData.qrisImageURL,
          qris_payload: providerData.qrisPayload,
          status: attempt.status,
        }),
      })
    }

    if (['completed', 'finalizing', 'consumed'].includes(String(attempt.status))) {
      return NextResponse.json({ error: 'Pembayaran sudah diterima.' }, { status: 409 })
    }

    const claim = await transitionPaymentAttempt({
      allowedStatuses: ['initiated'],
      attemptID: attempt.id,
      data: { status: 'creating' },
      payload,
    })
    if (!claim.transitioned) {
      return NextResponse.json(
        { error: 'Pembuatan link pembayaran sedang diproses. Coba lagi sebentar.' },
        { status: 409 },
      )
    }

    const resetCreateClaim = () =>
      transitionPaymentAttempt({
        allowedStatuses: ['creating'],
        attemptID: attempt.id,
        data: { status: 'initiated' },
        payload,
      }).catch(() => undefined)

    const checkoutURL = `${getServerSideURL()}/checkout`
    const successReturnURL = `${checkoutURL}?sumopod_return=success&order_id=${encodeURIComponent(orderID)}`
    const cancelReturnURL = `${checkoutURL}?sumopod_return=cancel&order_id=${encodeURIComponent(orderID)}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)
    let response: Response
    try {
      response = await fetch(`${SUMOPOD_API_BASE_URL.replace(/\/$/, '')}/api/v1/payments`, {
        body: JSON.stringify({
          amount,
          cancel_return_url: cancelReturnURL,
          currency: 'IDR',
          expires_in_hours: 1,
          order_id: orderID,
          payment_method_type_code: SUMOPOD_PAYMENT_METHOD,
          success_return_url: successReturnURL,
        }),
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': SUMOPOD_API_KEY },
        method: 'POST',
        signal: controller.signal,
      })
    } catch (error) {
      await resetCreateClaim()
      throw error
    } finally {
      clearTimeout(timeout)
    }

    const responseText = await response.text()
    if (Buffer.byteLength(responseText, 'utf8') > MAX_PROVIDER_RESPONSE_BYTES) {
      await resetCreateClaim()
      throw new Error('Respons SumoPod terlalu besar.')
    }
    let data: Record<string, any>
    try {
      data = responseText ? (JSON.parse(responseText) as Record<string, any>) : {}
    } catch {
      await resetCreateClaim()
      throw new Error('Respons SumoPod bukan JSON yang valid.')
    }
    if (!response.ok) {
      await resetCreateClaim()
      return NextResponse.json(
        { error: data.message || data.error || 'Gagal membuat pembayaran SumoPod.' },
        { status: response.status >= 400 && response.status < 500 ? 502 : response.status },
      )
    }
    if (
      !isTrustedSumoPodURL(data.payment_link_url) ||
      (data.order_id && String(data.order_id) !== orderID) ||
      (data.amount !== undefined && Number(data.amount) !== amount) ||
      (data.currency && String(data.currency).toUpperCase() !== 'IDR')
    ) {
      await resetCreateClaim()
      throw new Error('Respons SumoPod tidak cocok dengan payment attempt.')
    }

    const normalized = normalizeSumoPodPayment(data)
    const savedAttempt = await transitionPaymentAttempt({
      allowedStatuses: ['creating'],
      attemptID: attempt.id,
      data: {
        providerData: {
          expiresAt: normalized.expired_at,
          fee: normalized.fee,
          paymentLinkURL: normalized.payment_link_url,
          qrisImageURL: normalized.qris_image_url,
          qrisPayload: normalized.qris_payload,
        },
        providerPaymentId: normalized.payment_id,
        status: 'pending',
      },
      payload,
    })
    const updatedAttempt = savedAttempt.attempt
    if (
      !savedAttempt.transitioned &&
      !['completed', 'finalizing', 'consumed'].includes(String(updatedAttempt.status))
    ) {
      throw new Error('Status payment attempt berubah saat link dibuat.')
    }
    await payload.update({
      collection: 'checkout-sessions' as any,
      id: activeSession.id,
      data: { paymentData: getAttemptPublicPaymentData(updatedAttempt), status: 'pending' } as any,
      overrideAccess: true,
    })

    void notifyPendingPayment({
      amount,
      currency: 'IDR',
      customerName: user.name || undefined,
      orderCode: orderID,
      pendingPaymentUrl: normalized.payment_link_url || checkoutURL,
      phone: user.phone || undefined,
      sessionExpiry: '60:00',
    }).catch((error) => payload.logger.warn({ error }, '[SumoPod pending WA] failed'))

    return NextResponse.json({ payment: normalized })
  } catch (error) {
    console.error('[SumoPod proxy] error:', error)
    return NextResponse.json({ error: 'Gagal memproses pembayaran.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    key: `sumopod-get:${getClientIP(req)}`,
    limit: 30,
    request: req,
    responseMessage: 'Terlalu banyak pemeriksaan status pembayaran.',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  try {
    const context = await requireAuthenticatedCustomer(req)
    if (!context) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const owned = await requireOwnedAttempt({ payload: context.payload, userID: context.user.id })
    if (!owned) return NextResponse.json({ error: 'Payment attempt tidak ditemukan.' }, { status: 404 })

    const params = new URL(req.url).searchParams
    if (
      !validateClientReference({
        amount: params.get('amount') ?? undefined,
        attempt: owned.attempt,
        orderID: params.get('order_id') ?? undefined,
      })
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      transaction: {
        payment_id: owned.attempt.providerPaymentId || null,
        status: owned.attempt.status === 'consumed' ? 'completed' : owned.attempt.status,
      },
    })
  } catch (error) {
    console.error('[SumoPod status] error:', error)
    return NextResponse.json({ error: 'Gagal memeriksa status pembayaran.' }, { status: 500 })
  }
}
