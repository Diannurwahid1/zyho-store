import type { Coupon } from '@/payload-types'
import {
    buildInitiatePaymentPayload,
    finalizePaidOrder,
    findFinalizedPayment,
    preparePaymentContext,
} from '@/payments/helpers'
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
      const { amount, discountAmount, orderID, subtotal, voucherCode } =
        await buildInitiatePaymentPayload({
          currencyCode: 'IDR',
          data: rawData,
          req,
        })

      return {
        amount,
        clientSecret: `pakasir_secret_${orderID}`,
        discountAmount,
        message: 'Payment initiated successfully',
        orderID,
        subtotal,
        voucherCode,
      }
    },
    confirmOrder: async ({ data, ordersSlug, req, transactionsSlug }) => {
      const rawData = data as Record<string, any>
      const paymentIntentID: string = rawData?.paymentIntentID ?? ''
      const resolvedOrdersSlug = (ordersSlug || 'orders') as CollectionSlug
      const resolvedTransactionsSlug = (transactionsSlug || 'transactions') as CollectionSlug

      req.payload.logger.info(
        { paymentIntentID, customerEmail: rawData?.customerEmail, cartID: rawData?.cartID },
        '[SumoPod] confirmOrder called',
      )

      const existing = await findFinalizedPayment({
        field: 'pakasir.pakasirOrderID',
        paymentReference: paymentIntentID,
        req,
        transactionsSlug: resolvedTransactionsSlug,
      })
      if (existing) return { ...existing, message: 'Order already confirmed' }

      const context = await preparePaymentContext({
        currencyCode: 'IDR',
        data: rawData,
        req,
      })

      // Check if order with this paymentReference already exists
      const existingOrder = await req.payload.find({
        collection: resolvedOrdersSlug,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          paymentReference: { equals: context.paymentReference },
        } as any,
      })

      if (existingOrder.docs.length > 0) {
        const order = existingOrder.docs[0] as any
        req.payload.logger.info(
          { orderID: order.id, paymentReference: context.paymentReference },
          '[SumoPod] Order already exists, skipping creation',
        )
        return {
          accessToken: order.accessToken,
          message: 'Order already exists',
          orderID: order.id,
          pointsEarned: order.pointsEarned || 0,
          transactionID: null,
        }
      }

      const checkoutSession = await req.payload.find({
        collection: 'checkout-sessions' as any,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        req,
        where: {
          sessionId: { equals: context.checkoutSessionID },
        } as any,
      })
      const paymentData = checkoutSession.docs[0]?.paymentData as Record<string, any> | undefined
      const sumopodStatus = String(paymentData?.sumopodStatus || '').toLowerCase()

      if (sumopodStatus !== 'completed') {
        req.payload.logger.warn(
          { paymentIntentID, sumopodStatus },
          '[SumoPod] confirmOrder blocked because payment is not completed',
        )
        throw new Error(
          sumopodStatus
            ? `Pembayaran belum selesai. Status: ${sumopodStatus}`
            : 'Pembayaran belum terverifikasi oleh SumoPod.',
        )
      }

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
        accessToken: finalized.accessToken,
        message: 'Order confirmed successfully',
        orderID: finalized.orderID,
        pointsEarned: finalized.pointsEarned,
        transactionID: finalized.transactionID,
      }
    },
  }
}
