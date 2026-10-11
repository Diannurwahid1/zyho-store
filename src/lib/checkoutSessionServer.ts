import { releaseReservation } from '@/lib/stock'
import { getAttemptPublicPaymentData, relationID as paymentRelationID } from '@/payments/paymentAttempts'
import type { BasePayload, PayloadRequest } from 'payload'

export const CHECKOUT_SESSION_TTL_MS = 60 * 60 * 1000
export const PAYMENT_FINALIZATION_GRACE_MS = 30 * 60 * 1000

const relationID = (value: unknown): string | number | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

export const expireCheckoutSessions = async (payload: BasePayload, customerID: string | number) => {
  const expired = await payload.find({
    collection: 'checkout-sessions' as any,
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: {
      and: [
        { customer: { equals: customerID } },
        { status: { in: ['creating', 'pending'] } },
        { expiresAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
  })

  for (const session of expired.docs as any[]) {
    const linkedAttemptID = paymentRelationID(session.paymentAttempt)
    let attempt: Record<string, any> | null = null

    if (linkedAttemptID) {
      attempt = (await payload.findByID({
        collection: 'payment-attempts' as any,
        depth: 0,
        id: linkedAttemptID,
        overrideAccess: true,
      })) as Record<string, any>
    } else {
      const attempts = await payload.find({
        collection: 'payment-attempts' as any,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: { checkoutSession: { equals: session.id } } as any,
      })
      attempt = (attempts.docs[0] as Record<string, any> | undefined) || null
    }

    if (attempt && ['completed', 'finalizing', 'consumed'].includes(String(attempt.status))) {
      await payload.update({
        collection: 'checkout-sessions' as any,
        id: session.id,
        data: {
          ...(attempt.status === 'consumed'
            ? { activeKey: null, status: 'completed' }
            : {
                expiresAt: new Date(Date.now() + PAYMENT_FINALIZATION_GRACE_MS).toISOString(),
                status: 'pending',
              }),
          paymentData: getAttemptPublicPaymentData(attempt),
        } as any,
        overrideAccess: true,
      })
      continue
    }

    await releaseOwnedCheckoutReservations(
      payload,
      customerID,
      session.sessionId,
      'Checkout expired',
    )
    await payload.update({
      collection: 'checkout-sessions' as any,
      id: session.id,
      data: { activeKey: null, status: 'expired' } as any,
      overrideAccess: true,
    })
  }
}

export const findActiveCheckoutSession = async (
  payload: BasePayload,
  customerID: string | number,
) => {
  await expireCheckoutSessions(payload, customerID)
  const result = await payload.find({
    collection: 'checkout-sessions' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { customer: { equals: customerID } },
        { status: { in: ['creating', 'pending'] } },
        { expiresAt: { greater_than: new Date().toISOString() } },
      ],
    },
  })
  return (result.docs[0] as any) || null
}

export const assertOwnedActiveCheckoutSession = async (req: PayloadRequest, sessionID: unknown) => {
  if (!req.user?.id) throw new Error('Login customer diperlukan untuk checkout.')
  if (typeof sessionID !== 'string' || !sessionID) throw new Error('Sesi checkout tidak valid.')

  const active = await findActiveCheckoutSession(req.payload, req.user.id)
  if (!active || active.sessionId !== sessionID) {
    throw new Error('Sesi checkout tidak aktif atau sudah berakhir.')
  }
  return active
}

export const releaseOwnedCheckoutReservations = async (
  payload: BasePayload,
  customerID: string | number,
  sessionID: string,
  reason: string,
) => {
  const reservations = await payload.find({
    collection: 'stock-reservations',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: {
      and: [
        { customer: { equals: customerID } },
        { reservationId: { contains: `${sessionID}:` } },
        { status: { equals: 'pending' } },
      ],
    },
  })

  for (const reservation of reservations.docs as any[]) {
    if (String(relationID(reservation.customer)) !== String(customerID)) continue
    await releaseReservation(payload, reservation.reservationId, reason)
  }
}
