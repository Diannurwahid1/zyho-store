import { releaseOwnedCheckoutReservations } from '@/lib/checkoutSessionServer'
import configPromise from '@payload-config'
import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const SUMOPOD_WEBHOOK_SECRET = process.env.SUMOPOD_WEBHOOK_SECRET || ''
const SUMOPOD_WEBHOOK_TOKEN = process.env.SUMOPOD_WEBHOOK_TOKEN || ''

const relationID = (value: unknown): string | number | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
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

  const secretBytes = Buffer.from(secret.replace('whsec_', ''), 'base64')
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`
  const expectedSignature = createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64')

  return svixSignature
    .split(' ')
    .map((signature) => signature.split(',')[1])
    .filter(Boolean)
    .some((signature) => safeEqual(signature, expectedSignature))
}

const eventStatus = (eventType: string, dataStatus?: string) => {
  if (eventType === 'payment.completed') return 'completed'
  if (eventType === 'payment.failed') return 'failed'
  if (eventType === 'payment.expired') return 'expired'
  return dataStatus || 'pending'
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const receivedToken = req.headers.get('x-webhook-token')

  const tokenIsValid =
    Boolean(SUMOPOD_WEBHOOK_TOKEN) &&
    Boolean(receivedToken) &&
    safeEqual(receivedToken || '', SUMOPOD_WEBHOOK_TOKEN)
  const signatureIsValid = verifySignature({
    rawBody,
    secret: SUMOPOD_WEBHOOK_SECRET,
    svixId: req.headers.get('svix-id'),
    svixSignature: req.headers.get('svix-signature'),
    svixTimestamp: req.headers.get('svix-timestamp'),
  })

  if (!tokenIsValid && !signatureIsValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as {
    data?: {
      order_id?: string
      payment_id?: string
      status?: string
    }
    event_type?: string
  }
  const orderID = event.data?.order_id
  if (!orderID) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
  }

  const nextStatus = eventStatus(event.event_type || '', event.data?.status)
  const payload = await getPayload({ config: configPromise })
  const sessions = await payload.find({
    collection: 'checkout-sessions' as any,
    depth: 0,
    limit: 100,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      status: { in: ['creating', 'pending'] },
    } as any,
  })

  const session = (sessions.docs as any[]).find((doc) => doc.paymentData?.orderID === orderID)
  if (!session) {
    return NextResponse.json({ received: true, matched: false })
  }

  const customerID = relationID(session.customer)
  const shouldRelease = nextStatus === 'failed' || nextStatus === 'expired'

  if (shouldRelease && customerID) {
    await releaseOwnedCheckoutReservations(
      payload,
      customerID,
      session.sessionId,
      `SumoPod payment ${nextStatus}`,
    )
  }

  await payload.update({
    collection: 'checkout-sessions' as any,
    id: session.id,
    data: {
      ...(shouldRelease ? { activeKey: null, status: 'expired' } : {}),
      paymentData: {
        ...session.paymentData,
        sumopodLastWebhookAt: new Date().toISOString(),
        sumopodPaymentID: event.data?.payment_id || session.paymentData?.sumopodPaymentID,
        sumopodStatus: nextStatus,
      },
    } as any,
    overrideAccess: true,
  })

  return NextResponse.json({ received: true, matched: true })
}
