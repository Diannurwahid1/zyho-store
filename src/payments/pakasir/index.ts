import type { Coupon } from '@/payload-types'
import { assertOwnedActiveCheckoutSession } from '@/lib/checkoutSessionServer'
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
  getOwnedAttemptOrder,
} from '@/payments/paymentAttempts'
import type { CollectionSlug } from 'payload'
import { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'

export interface PakasirAdapterConfig {
  apiKey: string
  projectSlug: string
  isSandbox?: boolean
}

export const pakasirAdapter = (config: PakasirAdapterConfig): PaymentAdapter => {
  void config

  return {
    name: 'pakasir',
    label: 'SumoPod QRIS',
    group: {
      name: 'pakasir',
      type: 'group',
      admin: {
        condition: (data) => data?.paymentMethod === 'pakasir',
      },
      fields: [
        {
          name: 'pakasirOrderID',
          type: 'text',
          label: 'SumoPod Order ID',
          unique: true,
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
          currencyCode: 'IDR',
          data: rawData,
          req,
        })
      const attempt = await createOrGetPaymentAttempt({
        activeSession: activeCheckoutSession,
        currency: 'IDR',
        expectedAmount: amount,
        provider: 'sumopod',
        providerOrderId: orderID,
        req,
        snapshot,
      })

      return {
        amount: Number(attempt.expectedAmount),
        clientSecret: `pakasir_secret_${attempt.attemptId}`,
        discountAmount: Number(attempt.snapshot?.discountAmount || discountAmount),
        message: 'Payment initiated successfully',
        orderID: String(attempt.providerOrderId),
        subtotal: Number(attempt.snapshot?.subtotal || subtotal),
        voucherCode: attempt.snapshot?.voucherCode || voucherCode,
      }
    },
    confirmOrder: async ({ data, ordersSlug, req, transactionsSlug }) => {
      const rawData = data as Record<string, any>
      const paymentIntentID: string = rawData?.paymentIntentID ?? ''
      const resolvedOrdersSlug = (ordersSlug || 'orders') as CollectionSlug
      const resolvedTransactionsSlug = (transactionsSlug || 'transactions') as CollectionSlug

      const checkoutSessionID = String(rawData.checkoutSessionId || '')
      const activeSession = await assertOwnedActiveCheckoutSession(req, checkoutSessionID)
      const attempt = await findOwnedPaymentAttempt({
        activeSession,
        provider: 'sumopod',
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

      if (!paymentIntentID || paymentIntentID !== attempt.providerOrderId) {
        throw new Error('Referensi pembayaran tidak cocok dengan sesi checkout.')
      }
      if (attempt.status !== 'completed') {
        req.payload.logger.warn(
          { attemptID: attempt.id, paymentIntentID, status: attempt.status },
          '[SumoPod] confirmOrder blocked because payment is not completed',
        )
        throw new Error(
          attempt.status
            ? `Pembayaran belum selesai. Status: ${attempt.status}`
            : 'Pembayaran belum terverifikasi oleh SumoPod.',
        )
      }

      const context = await preparePaymentContext({
        currencyCode: 'IDR',
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
        currencyCode: 'IDR',
        customerEmail: context.customerEmail,
        customerID: context.customerID,
        discountAmount: context.discountAmount,
        eligibleVoucher: context.eligibleVoucher as Coupon | null,
        ordersSlug: resolvedOrdersSlug,
        paymentGroupData: {
          pakasirOrderID: paymentIntentID,
        },
        paymentMethod: 'pakasir',
        paymentReference: context.paymentReference,
        paymentAttemptID: attempt.id,
        req,
        shippingAddress: context.shippingAddress,
        subtotalBeforeDiscount: context.subtotalBeforeDiscount,
        transactionsSlug: resolvedTransactionsSlug,
      })

      req.payload.logger.info(
        { orderID: finalized.orderID, transactionID: finalized.transactionID },
        '[SumoPod] confirmOrder success',
      )

      return {
        message: 'Order confirmed successfully',
        orderID: finalized.orderID,
        pointsEarned: finalized.pointsEarned,
        transactionID: finalized.transactionID,
      }
    },
  }
}
