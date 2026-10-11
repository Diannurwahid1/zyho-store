import type { BasePayload, PayloadRequest } from 'payload'

export type PaymentProvider = 'nowpayments' | 'sumopod'
export type PaymentCurrency = 'IDR' | 'USD'

export type PaymentAttemptSnapshot = {
  buyNowItem?: {
    productId: number
    quantity: number
    variantId?: number
  } | null
  cartFingerprint: string
  discountAmount: number
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    variantId: string | null
  }>
  subtotal: number
  voucherCode?: string | null
}

type CreatePaymentAttemptArgs = {
  activeSession: Record<string, any>
  currency: PaymentCurrency
  expectedAmount: number
  provider: PaymentProvider
  providerOrderId: string
  req: PayloadRequest
  snapshot: PaymentAttemptSnapshot
}

export const relationID = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' || typeof id === 'string' ? id : null
  }
  return null
}

export const createOrGetPaymentAttempt = async ({
  activeSession,
  currency,
  expectedAmount,
  provider,
  providerOrderId,
  req,
  snapshot,
}: CreatePaymentAttemptArgs) => {
  const customerID = relationID(activeSession.customer)
  if (!customerID || !req.user?.id || String(customerID) !== String(req.user.id)) {
    throw new Error('Sesi pembayaran bukan milik customer ini.')
  }

  const existing = await req.payload.find({
    collection: 'payment-attempts' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      checkoutSession: { equals: activeSession.id },
    } as any,
  })
  const attempt = existing.docs[0] as Record<string, any> | undefined

  if (attempt) {
    const isSameAttempt =
      attempt.provider === provider &&
      attempt.currency === currency &&
      Number(attempt.expectedAmount) === expectedAmount &&
      String(attempt.cartId) === String(activeSession.cartId) &&
      attempt.snapshot?.cartFingerprint === snapshot.cartFingerprint

    if (!isSameAttempt) {
      throw new Error('Detail pembayaran berubah. Batalkan sesi checkout lalu coba lagi.')
    }

    return attempt
  }

  let created: Record<string, any>
  try {
    created = (await req.payload.create({
      collection: 'payment-attempts' as any,
      data: {
        attemptId: crypto.randomUUID(),
        cartId: String(activeSession.cartId),
        checkoutSession: activeSession.id,
        currency,
        customer: customerID,
        expectedAmount,
        provider,
        providerOrderId,
        snapshot,
        status: 'initiated',
      } as any,
      overrideAccess: true,
      req,
    })) as Record<string, any>
  } catch (error) {
    const raced = await req.payload.find({
      collection: 'payment-attempts' as any,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { checkoutSession: { equals: activeSession.id } } as any,
    })
    if (!raced.docs[0]) throw error
    created = raced.docs[0] as Record<string, any>
  }

  await req.payload.update({
    collection: 'checkout-sessions' as any,
    id: activeSession.id,
    data: {
      paymentAttempt: created.id,
      paymentData: {
        amount: expectedAmount,
        discountAmount: snapshot.discountAmount,
        orderID: providerOrderId,
        paymentMethod: provider === 'sumopod' ? 'pakasir' : 'nowpayments',
        subtotal: snapshot.subtotal,
        voucherCode: snapshot.voucherCode || null,
      },
      status: 'pending',
    } as any,
    overrideAccess: true,
    req,
  })

  return created
}

export const findOwnedPaymentAttempt = async ({
  activeSession,
  provider,
  req,
}: {
  activeSession: Record<string, any>
  provider: PaymentProvider
  req: PayloadRequest
}) => {
  if (!req.user?.id) throw new Error('Login customer diperlukan untuk pembayaran.')

  const result = await req.payload.find({
    collection: 'payment-attempts' as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      and: [
        { checkoutSession: { equals: activeSession.id } },
        { customer: { equals: req.user.id } },
        { provider: { equals: provider } },
      ],
    } as any,
  })
  const attempt = result.docs[0] as Record<string, any> | undefined
  if (!attempt) throw new Error('Payment attempt tidak ditemukan atau bukan milik customer ini.')
  return attempt
}

export const getOwnedAttemptOrder = async ({
  attempt,
  req,
}: {
  attempt: Record<string, any>
  req: PayloadRequest
}) => {
  const orderID = relationID(attempt.order)
  if (!orderID || !req.user?.id) return null

  const order = await req.payload.findByID({
    collection: 'orders',
    id: orderID,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const customerID = relationID((order as any).customer)
  if (!customerID || String(customerID) !== String(req.user.id)) return null
  return order as Record<string, any>
}

export const updatePaymentAttempt = async ({
  attemptID,
  data,
  req,
}: {
  attemptID: number | string
  data: Record<string, unknown>
  req: PayloadRequest
}) =>
  req.payload.update({
    collection: 'payment-attempts' as any,
    id: attemptID,
    data: data as any,
    overrideAccess: true,
    req,
  })

export const transitionPaymentAttempt = async ({
  allowedStatuses,
  attemptID,
  data,
  payload,
  req,
}: {
  allowedStatuses: string[]
  attemptID: number | string
  data: Record<string, unknown>
  payload: BasePayload
  req?: PayloadRequest
}) => {
  const updated = await payload.db.updateOne({
    collection: 'payment-attempts' as any,
    data: data as any,
    req,
    where: {
      and: [
        { id: { equals: attemptID } },
        { status: { in: allowedStatuses } },
      ],
    } as any,
  })

  if (updated) {
    return { attempt: updated as Record<string, any>, transitioned: true }
  }

  const current = (await payload.findByID({
    collection: 'payment-attempts' as any,
    depth: 0,
    id: attemptID,
    overrideAccess: true,
    req,
  })) as Record<string, any>

  return { attempt: current, transitioned: false }
}

export const getAttemptPublicPaymentData = (attempt: Record<string, any>) => {
  const providerData = (attempt.providerData as Record<string, any> | null) || {}

  if (attempt.provider === 'sumopod') {
    return {
      amount: Number(attempt.expectedAmount),
      discountAmount: Number(attempt.snapshot?.discountAmount || 0),
      orderID: String(attempt.providerOrderId),
      paymentMethod: 'pakasir',
      subtotal: Number(attempt.snapshot?.subtotal || 0),
      sumopodExpiresAt: providerData.expiresAt || null,
      sumopodFee: Number(providerData.fee || 0),
      sumopodPaymentID: attempt.providerPaymentId || null,
      sumopodPaymentLinkURL: providerData.paymentLinkURL || null,
      sumopodQrisImageURL: providerData.qrisImageURL || null,
      sumopodQrisPayload: providerData.qrisPayload || null,
      sumopodStatus: attempt.status === 'consumed' ? 'completed' : attempt.status,
      voucherCode: attempt.snapshot?.voucherCode || null,
    }
  }

  return {
    amount: Number(attempt.expectedAmount),
    discountAmount: Number(attempt.snapshot?.discountAmount || 0),
    nowpaymentsPayAddress: providerData.payAddress || null,
    nowpaymentsPayAmount: providerData.payAmount || null,
    nowpaymentsPayCurrency: providerData.payCurrency || null,
    nowpaymentsPaymentID: attempt.providerPaymentId || null,
    nowpaymentsStatus: attempt.status === 'consumed' ? 'paid' : attempt.status,
    orderID: String(attempt.providerOrderId),
    paymentMethod: 'nowpayments',
    subtotal: Number(attempt.snapshot?.subtotal || 0),
    voucherCode: attempt.snapshot?.voucherCode || null,
  }
}

export const syncCheckoutSessionPaymentData = async ({
  activeSession,
  attempt,
  req,
}: {
  activeSession: Record<string, any>
  attempt: Record<string, any>
  req: PayloadRequest
}) =>
  req.payload.update({
    collection: 'checkout-sessions' as any,
    id: activeSession.id,
    data: {
      paymentAttempt: attempt.id,
      paymentData: getAttemptPublicPaymentData(attempt),
      status: ['failed', 'expired', 'cancelled'].includes(String(attempt.status))
        ? 'expired'
        : attempt.status === 'consumed'
          ? 'completed'
          : 'pending',
    } as any,
    overrideAccess: true,
    req,
  })
