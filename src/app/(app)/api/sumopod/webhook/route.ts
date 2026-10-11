import {
  CHECKOUT_SESSION_TTL_MS,
  releaseOwnedCheckoutReservations,
} from '@/lib/checkoutSessionServer'
import {
  getAttemptPublicPaymentData,
  relationID,
  transitionPaymentAttempt,
} from '@/payments/paymentAttempts'
import configPromise from '@payload-config'
import { readRequestBodyLimited } from '@/utilities/security'
import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const MAX_BODY_BYTES = 256 * 1024
const MAX_TIMESTAMP_SKEW_SECONDS = 5 * 60
const SUMOPOD_WEBHOOK_SECRET = process.env.SUMOPOD_WEBHOOK_SECRET || ''
const SUMOPOD_WEBHOOK_TOKEN = process.env.SUMOPOD_WEBHOOK_TOKEN || ''
const SUPPORTED_EVENTS = new Set([
  'payment.completed',
  'payment.expired',
  'payment.failed',
  'payment.test',
])

type SumoPodEvent = {
  data?: {
    amount?: number
    currency?: string
    fee?: number
    net_amount?: number
    order_id?: string
    payment_id?: string
    status?: string
  }
  event_type?: string
}

const matchesSumoPodAmount = ({
  expectedAmount,
  payment,
}: {
  expectedAmount: number
  payment: NonNullable<SumoPodEvent['data']>
}) => {
  const totalAmount = Number(payment.amount)
  if (!Number.isInteger(totalAmount)) return false
  if (totalAmount === expectedAmount) return true

  const netAmount = Number(payment.net_amount)
  const fee = Number(payment.fee)
  return (
    Number.isInteger(netAmount) &&
    Number.isInteger(fee) &&
    fee >= 0 &&
    netAmount === expectedAmount &&
    totalAmount === netAmount + fee
  )
}

const safeEqual = (leftValue: string, rightValue: string) => {
  const left = Buffer.from(leftValue)
  const right = Buffer.from(rightValue)
  return left.length === right.length && timingSafeEqual(left, right)
}

const verifySignature = ({
  rawBody,
  secret,
  svixId,
  svixSignature,
  svixTimestamp,
}: {
  rawBody: string
  secret: string
  svixId: string | null
  svixSignature: string | null
  svixTimestamp: string | null
}) => {
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false
  const timestamp = Number(svixTimestamp)
  if (
    !Number.isInteger(timestamp) ||
    Math.abs(Math.floor(Date.now() / 1000) - timestamp) > MAX_TIMESTAMP_SKEW_SECONDS
  ) {
    return false
  }

  try {
    const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
    if (secretBytes.length < 16) return false
    const expected = createHmac('sha256', secretBytes)
      .update(`${svixId}.${svixTimestamp}.${rawBody}`)
      .digest('base64')

    return svixSignature
      .split(' ')
      .map((signature) => signature.split(',')[1])
      .filter((signature): signature is string => Boolean(signature))
      .some((signature) => safeEqual(signature, expected))
  } catch {
    return false
  }
}

const createOrResumeWebhookEvent = async ({
  eventType,
  externalID,
  payload,
  payloadHash,
}: {
  eventType: string
  externalID: string
  payload: Awaited<ReturnType<typeof getPayload>>
  payloadHash: string
}) => {
  try {
    const event = await payload.create({
      collection: 'payment-webhook-events' as any,
      data: {
        eventType,
        externalId: externalID,
        payloadHash,
        provider: 'sumopod',
        status: 'processing',
      } as any,
      overrideAccess: true,
    })
    return { duplicate: false, event: event as Record<string, any> }
  } catch {
    const existing = await payload.find({
      collection: 'payment-webhook-events' as any,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { externalId: { equals: externalID } } as any,
    })
    const event = existing.docs[0] as Record<string, any> | undefined
    if (!event) throw new Error('Gagal mencatat webhook event.')
    if (event.payloadHash !== payloadHash) {
      throw new Error('Webhook ID digunakan ulang dengan payload berbeda.')
    }
    if (event.status === 'processed') return { duplicate: true, event }

    const resumed = await payload.update({
      collection: 'payment-webhook-events' as any,
      id: event.id,
      data: { error: null, status: 'processing' } as any,
      overrideAccess: true,
    })
    return { duplicate: false, event: resumed as Record<string, any> }
  }
}

export async function POST(req: NextRequest) {
  const bodyResult = await readRequestBodyLimited(req, MAX_BODY_BYTES)
  if (bodyResult.response) return bodyResult.response
  const rawBody = bodyResult.body
  if (!rawBody) return NextResponse.json({ error: 'Invalid payload size' }, { status: 400 })

  const svixID = req.headers.get('svix-id')
  const signatureIsValid = verifySignature({
    rawBody,
    secret: SUMOPOD_WEBHOOK_SECRET,
    svixId: svixID,
    svixSignature: req.headers.get('svix-signature'),
    svixTimestamp: req.headers.get('svix-timestamp'),
  })
  const receivedToken = req.headers.get('x-webhook-token') || ''
  const tokenIsValid =
    Boolean(SUMOPOD_WEBHOOK_TOKEN) && safeEqual(receivedToken, SUMOPOD_WEBHOOK_TOKEN)
  const isProduction = process.env.NODE_ENV === 'production'

  if (!signatureIsValid && (isProduction || !tokenIsValid)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }
  if (!svixID && isProduction) {
    return NextResponse.json({ error: 'Missing webhook ID' }, { status: 401 })
  }

  let event: SumoPodEvent
  try {
    event = JSON.parse(rawBody) as SumoPodEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = String(event.event_type || '')
  if (!SUPPORTED_EVENTS.has(eventType)) {
    return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const payloadHash = createHash('sha256').update(rawBody).digest('hex')
  const externalID = svixID || `local:${payloadHash}`
  let webhookEvent: Record<string, any> | null = null

  try {
    const recorded = await createOrResumeWebhookEvent({
      eventType,
      externalID,
      payload,
      payloadHash,
    })
    webhookEvent = recorded.event
    if (recorded.duplicate) {
      return NextResponse.json({ duplicate: true, received: true })
    }

    if (eventType === 'payment.test') {
      await payload.update({
        collection: 'payment-webhook-events' as any,
        id: webhookEvent.id,
        data: { processedAt: new Date().toISOString(), status: 'processed' } as any,
        overrideAccess: true,
      })
      return NextResponse.json({ matched: false, received: true, test: true })
    }

    const orderID = String(event.data?.order_id || '')
    if (!orderID) throw new Error('Missing order_id')
    const attempts = await payload.find({
      collection: 'payment-attempts' as any,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [
          { provider: { equals: 'sumopod' } },
          { providerOrderId: { equals: orderID } },
        ],
      } as any,
    })
    const attempt = attempts.docs[0] as Record<string, any> | undefined
    if (!attempt) throw new Error('Payment attempt tidak ditemukan.')

    const paymentID = String(event.data?.payment_id || '')
    if (
      !paymentID ||
      (attempt.providerPaymentId && String(attempt.providerPaymentId) !== paymentID)
    ) {
      throw new Error('Payment ID webhook tidak cocok.')
    }

    let nextStatus: 'completed' | 'expired' | 'failed'
    if (eventType === 'payment.completed') {
      const currency = String(event.data?.currency || 'IDR').toUpperCase()
      if (
        event.data?.status !== 'completed' ||
        !event.data ||
        !matchesSumoPodAmount({ expectedAmount: Number(attempt.expectedAmount), payment: event.data }) ||
        currency !== 'IDR'
      ) {
        throw new Error('Nominal, currency, atau status webhook tidak cocok.')
      }
      nextStatus = 'completed'
    } else {
      nextStatus = eventType === 'payment.expired' ? 'expired' : 'failed'
    }

    const checkoutSessionID = relationID(attempt.checkoutSession)
    if (!checkoutSessionID) throw new Error('Checkout session payment attempt tidak valid.')
    const checkoutSession = (await payload.findByID({
      collection: 'checkout-sessions' as any,
      depth: 0,
      id: checkoutSessionID,
      overrideAccess: true,
    })) as Record<string, any>

    let updatedAttempt = attempt
    let transitioned = false
    if (nextStatus === 'completed') {
      const result = await transitionPaymentAttempt({
        allowedStatuses: ['initiated', 'creating', 'pending', 'failed', 'expired', 'cancelled'],
        attemptID: attempt.id,
        data: {
            paidAmount: Number(event.data?.amount),
            providerPaymentId: paymentID,
            status: 'completed',
            verifiedAt: new Date().toISOString(),
        },
        payload,
      })
      updatedAttempt = result.attempt
      transitioned = result.transitioned
    } else {
      const result = await transitionPaymentAttempt({
        allowedStatuses: ['initiated', 'creating', 'pending'],
        attemptID: attempt.id,
        data: { providerPaymentId: paymentID, status: nextStatus },
        payload,
      })
      updatedAttempt = result.attempt
      transitioned = result.transitioned

      if (transitioned) {
      const customerID = relationID(checkoutSession.customer)
      if (customerID) {
        await releaseOwnedCheckoutReservations(
          payload,
          customerID,
          checkoutSession.sessionId,
          `SumoPod payment ${nextStatus}`,
        )
      }
      }
    }

    const shouldExpire = ['expired', 'failed'].includes(String(updatedAttempt.status))
    const shouldExtend = ['completed', 'finalizing'].includes(String(updatedAttempt.status))
    await payload.update({
      collection: 'checkout-sessions' as any,
      id: checkoutSession.id,
      data: {
        ...(shouldExpire ? { activeKey: null, status: 'expired' } : {}),
        ...(shouldExtend
          ? {
              expiresAt: new Date(Date.now() + CHECKOUT_SESSION_TTL_MS).toISOString(),
              status: 'pending',
            }
          : {}),
        paymentData: getAttemptPublicPaymentData(updatedAttempt),
      } as any,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'payment-webhook-events' as any,
      id: webhookEvent.id,
      data: {
        paymentAttempt: attempt.id,
        processedAt: new Date().toISOString(),
        status: 'processed',
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ matched: true, received: true })
  } catch (error) {
    if (webhookEvent?.id) {
      await payload
        .update({
          collection: 'payment-webhook-events' as any,
          id: webhookEvent.id,
          data: {
            error: error instanceof Error ? error.message.slice(0, 1000) : 'Unknown error',
            status: 'failed',
          } as any,
          overrideAccess: true,
        })
        .catch(() => undefined)
    }
    payload.logger.error(
      { error: error instanceof Error ? error.message : String(error), externalID },
      '[SumoPod] webhook rejected',
    )
    return NextResponse.json({ error: 'Webhook rejected' }, { status: 400 })
  }
}
