import { notifyPendingPayment } from '@/lib/commerceWhatsApp'
import {
  assertOwnedActiveCheckoutSession,
  CHECKOUT_SESSION_TTL_MS,
  releaseOwnedCheckoutReservations,
} from '@/lib/checkoutSessionServer'
import type { Coupon } from '@/payload-types'
import {
  assertPaymentAttemptMatchesContext,
  buildInitiatePaymentPayload,
  finalizePaidOrder,
  getTrustedConfirmationData,
  preparePaymentContext,
} from '@/payments/helpers'
import {
  createOrGetPaymentAttempt,
  findOwnedPaymentAttempt,
  getAttemptPublicPaymentData,
  getOwnedAttemptOrder,
  relationID,
  syncCheckoutSessionPaymentData,
  transitionPaymentAttempt,
} from '@/payments/paymentAttempts'
import { usdBaseUnitsToDecimal } from '@/utilities/currencyUnits'
import { getServerSideURL } from '@/utilities/getURL'
import { NowPaymentsSDK } from '@nowpaymentsio/nowpayments-sdk-nodejs'
import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { CollectionSlug } from 'payload'
import { createHash } from 'crypto'

export interface NowPaymentsAdapterConfig {
  apiKey: string
  email?: string
  ipnSecret?: string
  password?: string
}

const createNowPaymentsSDK = (config: NowPaymentsAdapterConfig) =>
  new NowPaymentsSDK({
    apiKey: config.apiKey,
    email: config.email,
    password: config.password,
    ipnCallbackUrl: `${getServerSideURL()}/api/payments/nowpayments/webhooks`,
    ipnSecret: config.ipnSecret,
    cancelUrl: `${getServerSideURL()}/checkout`,
    successUrl: `${getServerSideURL()}/checkout/confirm-order`,
  })

export const nowpaymentsAdapter = (config: NowPaymentsAdapterConfig): PaymentAdapter => {
  const sdk = createNowPaymentsSDK(config)

  return {
    name: 'nowpayments',
    label: 'NOWPayments',
    group: {
      name: 'nowpayments',
      type: 'group',
      admin: {
        condition: (data) => data?.paymentMethod === 'nowpayments',
      },
      fields: [
        {
          name: 'nowpaymentsPaymentID',
          type: 'text',
          label: 'NOWPayments Payment ID',
          unique: true,
        },
        {
          name: 'payCurrency',
          type: 'text',
          label: 'Pay Currency',
        },
      ],
    },
    initiatePayment: async ({ data, req }) => {
      const rawData = data as Record<string, any>
      const {
        activeCheckoutSession,
        amount,
        discountAmount,
        orderID,
        snapshot,
        subtotal,
        voucherCode,
      } =
        await buildInitiatePaymentPayload({
          currencyCode: 'USD',
          data: rawData,
          req,
        })
      let attempt = await createOrGetPaymentAttempt({
        activeSession: activeCheckoutSession,
        currency: 'USD',
        expectedAmount: amount,
        provider: 'nowpayments',
        providerOrderId: orderID,
        req,
        snapshot,
      })

      if (attempt.providerPaymentId) {
        const providerData = (attempt.providerData as Record<string, any> | null) || {}
        return {
          amount: Number(attempt.expectedAmount),
          discountAmount: Number(attempt.snapshot?.discountAmount || discountAmount),
          message: 'Crypto payment already initiated',
          nowpaymentsPayAddress: providerData.payAddress,
          nowpaymentsPayAmount: providerData.payAmount,
          nowpaymentsPayCurrency: providerData.payCurrency || 'usdtbsc',
          nowpaymentsPaymentID: attempt.providerPaymentId,
          nowpaymentsStatus: attempt.status,
          orderID: attempt.providerOrderId,
          subtotal: Number(attempt.snapshot?.subtotal || subtotal),
          voucherCode: attempt.snapshot?.voucherCode || voucherCode,
        }
      }

      if (['failed', 'expired', 'cancelled'].includes(String(attempt.status))) {
        throw new Error('Sesi pembayaran sudah tidak aktif. Mulai checkout baru.')
      }

      const createClaim = await transitionPaymentAttempt({
        allowedStatuses: ['initiated'],
        attemptID: attempt.id,
        data: { status: 'creating' },
        payload: req.payload,
        req,
      })
      if (!createClaim.transitioned) {
        throw new Error('Pembuatan pembayaran sedang diproses. Coba lagi sebentar.')
      }

      let payment: Record<string, any>
      try {
        payment = (await sdk.createDirectPayment({
          amount: usdBaseUnitsToDecimal(Number(attempt.expectedAmount)),
          currency: 'usd',
          orderId: String(attempt.providerOrderId),
          payCurrency: 'usdtbsc',
        })) as Record<string, any>
      } catch (error) {
        await transitionPaymentAttempt({
          allowedStatuses: ['creating'],
          attemptID: attempt.id,
          data: { status: 'initiated' },
          payload: req.payload,
          req,
        }).catch(() => undefined)
        throw error
      }

      // Send WhatsApp notification for pending payment (USD)
      const phone =
        rawData?.shippingAddress?.phone || rawData?.billingAddress?.phone || req.user?.phone
      const customerName = req.user?.name || rawData?.customerEmail || 'Customer'
      const paymentID = payment.payment_id || payment.id
      if (!paymentID) {
        await transitionPaymentAttempt({
          allowedStatuses: ['creating'],
          attemptID: attempt.id,
          data: { status: 'initiated' },
          payload: req.payload,
          req,
        }).catch(() => undefined)
        throw new Error('NOWPayments tidak mengembalikan payment ID.')
      }

      const savedAttempt = await transitionPaymentAttempt({
        allowedStatuses: ['creating'],
        attemptID: attempt.id,
        data: {
          providerData: {
            payAddress: payment.pay_address || null,
            payAmount: payment.pay_amount || null,
            payCurrency: payment.pay_currency || 'usdtbsc',
          },
          providerPaymentId: String(paymentID),
          status: 'pending',
        },
        payload: req.payload,
        req,
      })
      attempt = savedAttempt.attempt
      if (!savedAttempt.transitioned) {
        throw new Error('Status payment attempt berubah saat pembayaran dibuat.')
      }
      await syncCheckoutSessionPaymentData({
        activeSession: activeCheckoutSession,
        attempt,
        req,
      })

      if (phone && paymentID) {
        const pendingPaymentUrl = `${getServerSideURL()}/checkout?reservation_id=${encodeURIComponent(String(attempt.providerOrderId))}&session_id=${encodeURIComponent(String(paymentID))}`

        void notifyPendingPayment({
          amount,
          customerName,
          orderCode: String(attempt.providerOrderId),
          phone,
          currency: 'USD',
          pendingPaymentUrl,
          sessionExpiry: '60:00',
        })
          .then((result) => {
            if (!result?.success) {
              console.error('[NowPayments pending WA] failed:', result)
            }
          })
          .catch((error) => {
            console.error('[NowPayments pending WA] error:', error)
          })
      }

      return {
        amount: Number(attempt.expectedAmount),
        discountAmount: Number(attempt.snapshot?.discountAmount || discountAmount),
        message: 'Crypto payment initiated successfully',
        nowpaymentsPayAddress: payment.pay_address,
        nowpaymentsPayAmount: payment.pay_amount,
        nowpaymentsPayCurrency: payment.pay_currency || 'usdtbsc',
        nowpaymentsPaymentID: payment.payment_id || payment.id,
        nowpaymentsStatus: payment.status || payment.payment_status,
        orderID: attempt.providerOrderId,
        subtotal: Number(attempt.snapshot?.subtotal || subtotal),
        voucherCode: attempt.snapshot?.voucherCode || voucherCode,
      }
    },
    confirmOrder: async ({ data, ordersSlug, req, transactionsSlug }) => {
      const rawData = data as Record<string, any>
      const paymentID = String(rawData?.nowpaymentsPaymentID || rawData?.paymentIntentID || '')
      const resolvedOrdersSlug = (ordersSlug || 'orders') as CollectionSlug
      const resolvedTransactionsSlug = (transactionsSlug || 'transactions') as CollectionSlug

      if (!paymentID) {
        throw new Error('NOWPayments payment ID tidak ditemukan.')
      }

      const checkoutSessionID = String(rawData.checkoutSessionId || '')
      const activeSession = await assertOwnedActiveCheckoutSession(req, checkoutSessionID)
      let attempt = await findOwnedPaymentAttempt({
        activeSession,
        provider: 'nowpayments',
        req,
      })
      const existingOrder = await getOwnedAttemptOrder({ attempt, req })
      if (existingOrder) {
        return {
          message: 'Order already confirmed',
          orderID: existingOrder.id,
          pointsEarned: Number(existingOrder.pointsEarned || 0),
          transactionID: 0,
        }
      }
      if (!attempt.providerPaymentId || String(attempt.providerPaymentId) !== paymentID) {
        throw new Error('NOWPayments payment ID tidak cocok dengan sesi checkout.')
      }

      const payment = await sdk.getPaymentStatus(paymentID)
      const normalizedStatus = String(payment.status || payment.payment_status || '').toLowerCase()

      if (normalizedStatus !== 'paid') {
        throw new Error(`Pembayaran crypto belum selesai. Status: ${normalizedStatus || 'unknown'}`)
      }
      const providerPaymentID = String(payment.payment_id || '')
      const providerOrderID = String(payment.order_id || '')
      const providerCurrency = String(payment.price_currency || '').toLowerCase()
      const providerAmount = Number(payment.price_amount)
      const expectedProviderAmount = usdBaseUnitsToDecimal(Number(attempt.expectedAmount))
      if (
        providerPaymentID !== paymentID ||
        providerOrderID !== String(attempt.providerOrderId) ||
        providerCurrency !== 'usd' ||
        !Number.isFinite(providerAmount) ||
        Math.abs(providerAmount - expectedProviderAmount) > 0.000001
      ) {
        throw new Error('Detail pembayaran dari NOWPayments tidak cocok dengan payment attempt.')
      }

      const verifiedAttempt = await transitionPaymentAttempt({
        allowedStatuses: ['initiated', 'creating', 'pending', 'failed', 'expired', 'cancelled'],
        attemptID: attempt.id,
        data: {
          paidAmount: Number(attempt.expectedAmount),
          providerData: {
            ...((attempt.providerData as Record<string, any> | null) || {}),
            paymentStatus: normalizedStatus,
            priceAmount: providerAmount,
            priceCurrency: providerCurrency,
          },
          status: 'completed',
          verifiedAt: new Date().toISOString(),
        },
        payload: req.payload,
        req,
      })
      attempt = verifiedAttempt.attempt
      if (!['completed', 'finalizing', 'consumed'].includes(String(attempt.status))) {
        throw new Error('Payment attempt tidak dapat ditandai selesai.')
      }

      const context = await preparePaymentContext({
        currencyCode: 'USD',
        data: getTrustedConfirmationData({ attempt, rawData }),
        req,
      })
      assertPaymentAttemptMatchesContext({ attempt, context })

      const finalized = await finalizePaidOrder({
        amount: context.amount,
        billingAddress: context.billingAddress,
        cartID: context.cartID,
        checkoutSessionID: context.checkoutSessionID,
        cartItems: context.cartItems,
        currencyCode: 'USD',
        customerEmail: context.customerEmail,
        customerID: context.customerID,
        discountAmount: context.discountAmount,
        eligibleVoucher: context.eligibleVoucher as Coupon | null,
        ordersSlug: resolvedOrdersSlug,
        paymentGroupData: {
          nowpaymentsPaymentID: paymentID,
          payCurrency: payment.pay_currency || 'usdtbsc',
        },
        paymentMethod: 'nowpayments',
        paymentReference: String(attempt.providerOrderId),
        paymentAttemptID: attempt.id,
        req,
        shippingAddress: context.shippingAddress,
        subtotalBeforeDiscount: context.subtotalBeforeDiscount,
        transactionsSlug: resolvedTransactionsSlug,
      })

      return {
        message: 'Order confirmed successfully',
        orderID: finalized.orderID,
        pointsEarned: finalized.pointsEarned,
        transactionID: finalized.transactionID,
      }
    },
    endpoints: [
      {
        method: 'post',
        path: '/webhooks',
        handler: async (req) => {
          let webhookExternalID: string | null = null
          try {
            if (Number(req.headers.get('content-length') || 0) > 256 * 1024) {
              return Response.json({ ok: false }, { status: 413 })
            }
            const signature = req.headers.get('x-nowpayments-sig') || undefined
            const webhookPayload = req.json ? await req.json() : {}
            const serializedPayload = JSON.stringify(webhookPayload)
            if (Buffer.byteLength(serializedPayload, 'utf8') > 256 * 1024) {
              return Response.json({ ok: false }, { status: 413 })
            }
            const event = sdk.parseWebhook(webhookPayload, signature)

            if (event.type !== 'payment.status_changed' || !event.payment) {
              return Response.json({ ok: false }, { status: 400 })
            }
            const payment = event.payment as Record<string, any>
            const paymentID = String(payment.payment_id || '')
            const orderID = String(payment.order_id || '')
            const status = String(payment.status || payment.payment_status || '').toLowerCase()
            if (!paymentID || !orderID) return Response.json({ ok: false }, { status: 400 })

            const payloadHash = createHash('sha256').update(serializedPayload).digest('hex')
            const externalID = `nowpayments:${paymentID}:${status}:${payloadHash}`
            webhookExternalID = externalID
            try {
              await req.payload.create({
                collection: 'payment-webhook-events' as any,
                data: {
                  eventType: event.type,
                  externalId: externalID,
                  payloadHash,
                  provider: 'nowpayments',
                  status: 'processing',
                } as any,
                overrideAccess: true,
                req,
              })
            } catch (createError) {
              const existingEvents = await req.payload.find({
                collection: 'payment-webhook-events' as any,
                depth: 0,
                limit: 1,
                overrideAccess: true,
                pagination: false,
                req,
                where: { externalId: { equals: externalID } } as any,
              })
              const existingEvent = existingEvents.docs[0] as Record<string, any> | undefined
              if (!existingEvent) throw createError
              if (existingEvent.payloadHash !== payloadHash) {
                throw new Error('NOWPayments event ID collision.')
              }
              if (existingEvent.status === 'processed') {
                return Response.json({ duplicate: true, ok: true })
              }
              await req.payload.update({
                collection: 'payment-webhook-events' as any,
                id: existingEvent.id,
                data: { error: null, status: 'processing' } as any,
                overrideAccess: true,
                req,
              })
            }

            const attempts = await req.payload.find({
              collection: 'payment-attempts' as any,
              depth: 0,
              limit: 1,
              overrideAccess: true,
              pagination: false,
              req,
              where: {
                and: [
                  { provider: { equals: 'nowpayments' } },
                  { providerOrderId: { equals: orderID } },
                  { providerPaymentId: { equals: paymentID } },
                ],
              } as any,
            })
            const attempt = attempts.docs[0] as Record<string, any> | undefined
            if (!attempt) throw new Error('NOWPayments attempt tidak ditemukan.')
            const expectedProviderAmount = usdBaseUnitsToDecimal(Number(attempt.expectedAmount))
            if (
              String(payment.price_currency || '').toLowerCase() !== 'usd' ||
              !Number.isFinite(Number(payment.price_amount)) ||
              Math.abs(Number(payment.price_amount) - expectedProviderAmount) > 0.000001
            ) {
              throw new Error('NOWPayments webhook amount atau currency tidak cocok.')
            }

            let nextStatus: string | null = null
            if (status === 'paid') nextStatus = 'completed'
            if (['failed', 'expired', 'cancelled'].includes(status)) nextStatus = status
            let updatedAttempt = attempt
            let transitioned = false
            if (nextStatus === 'completed') {
              const result = await transitionPaymentAttempt({
                allowedStatuses: [
                  'initiated',
                  'creating',
                  'pending',
                  'failed',
                  'expired',
                  'cancelled',
                ],
                attemptID: attempt.id,
                data: {
                  ...(nextStatus === 'completed'
                    ? { paidAmount: attempt.expectedAmount, verifiedAt: new Date().toISOString() }
                    : {}),
                  status: nextStatus,
                },
                payload: req.payload,
                req,
              })
              updatedAttempt = result.attempt
              transitioned = result.transitioned
            } else if (nextStatus) {
              const result = await transitionPaymentAttempt({
                allowedStatuses: ['initiated', 'creating', 'pending'],
                attemptID: attempt.id,
                data: { status: nextStatus },
                payload: req.payload,
                req,
              })
              updatedAttempt = result.attempt
              transitioned = result.transitioned
            }

            const checkoutSessionID = relationID(attempt.checkoutSession)
            if (checkoutSessionID) {
              const checkoutSession = (await req.payload.findByID({
                collection: 'checkout-sessions' as any,
                depth: 0,
                id: checkoutSessionID,
                overrideAccess: true,
                req,
              })) as Record<string, any>
              const shouldRelease = ['failed', 'expired', 'cancelled'].includes(
                String(updatedAttempt.status),
              )
              if (shouldRelease && transitioned) {
                const customerID = relationID(checkoutSession.customer)
                if (customerID) {
                  await releaseOwnedCheckoutReservations(
                    req.payload,
                    customerID,
                    checkoutSession.sessionId,
                    `NOWPayments ${updatedAttempt.status}`,
                  )
                }
              }
              await req.payload.update({
                collection: 'checkout-sessions' as any,
                id: checkoutSession.id,
                data: {
                  ...(shouldRelease ? { activeKey: null, status: 'expired' } : {}),
                  ...(['completed', 'finalizing'].includes(String(updatedAttempt.status))
                    ? {
                        expiresAt: new Date(Date.now() + CHECKOUT_SESSION_TTL_MS).toISOString(),
                        status: 'pending',
                      }
                    : {}),
                  paymentData: getAttemptPublicPaymentData(updatedAttempt),
                } as any,
                overrideAccess: true,
                req,
              })
            }

            const webhookEvents = await req.payload.find({
              collection: 'payment-webhook-events' as any,
              depth: 0,
              limit: 1,
              overrideAccess: true,
              pagination: false,
              req,
              where: { externalId: { equals: externalID } } as any,
            })
            if (webhookEvents.docs[0]) {
              await req.payload.update({
                collection: 'payment-webhook-events' as any,
                id: webhookEvents.docs[0].id,
                data: {
                  paymentAttempt: attempt.id,
                  processedAt: new Date().toISOString(),
                  status: 'processed',
                } as any,
                overrideAccess: true,
                req,
              })
            }

            req.payload.logger.info(
              {
                orderID,
                paymentID,
                status,
                type: event.type,
              },
              '[NOWPayments] webhook received',
            )

            return Response.json({ ok: true })
          } catch (error) {
            if (webhookExternalID) {
              const events = await req.payload.find({
                collection: 'payment-webhook-events' as any,
                depth: 0,
                limit: 1,
                overrideAccess: true,
                pagination: false,
                req,
                where: { externalId: { equals: webhookExternalID } } as any,
              }).catch(() => ({ docs: [] }))
              if (events.docs[0]) {
                await req.payload.update({
                  collection: 'payment-webhook-events' as any,
                  id: events.docs[0].id,
                  data: {
                    error: error instanceof Error ? error.message.slice(0, 1000) : 'Unknown error',
                    status: 'failed',
                  } as any,
                  overrideAccess: true,
                  req,
                }).catch(() => undefined)
              }
            }
            req.payload.logger.error(
              { error: error instanceof Error ? error.message : String(error) },
              '[NOWPayments] webhook failed',
            )
            return Response.json({ ok: false }, { status: 400 })
          }
        },
      },
    ],
  }
}
