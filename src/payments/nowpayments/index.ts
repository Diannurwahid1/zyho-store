import { notifyPendingPayment } from '@/lib/commerceWhatsApp'
import type { Coupon } from '@/payload-types'
import {
  buildInitiatePaymentPayload,
  finalizePaidOrder,
  findFinalizedPayment,
  preparePaymentContext,
} from '@/payments/helpers'
import { usdBaseUnitsToDecimal } from '@/utilities/currencyUnits'
import { getServerSideURL } from '@/utilities/getURL'
import { NowPaymentsSDK } from '@nowpaymentsio/nowpayments-sdk-nodejs'
import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'

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
      const { amount, discountAmount, orderID, subtotal, voucherCode } =
        await buildInitiatePaymentPayload({
          currencyCode: 'USD',
          data: rawData,
          req,
        })

      const payment = await sdk.createDirectPayment({
        amount: usdBaseUnitsToDecimal(amount),
        currency: 'usd',
        orderId: orderID,
        payCurrency: 'usdtbsc',
      })

      // Send WhatsApp notification for pending payment (USD)
      const phone =
        rawData?.shippingAddress?.phone || rawData?.billingAddress?.phone || req.user?.phone
      const customerName = req.user?.name || rawData?.customerEmail || 'Customer'
      const paymentID = payment.payment_id || payment.id

      if (phone && paymentID) {
        const pendingPaymentUrl = `${getServerSideURL()}/checkout?reservation_id=${orderID}&session_id=${paymentID}`

        void notifyPendingPayment({
          amount,
          customerName,
          orderCode: orderID,
          phone,
          currency: 'USD',
          pendingPaymentUrl,
          sessionExpiry: '10:00',
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
        amount,
        discountAmount,
        message: 'Crypto payment initiated successfully',
        nowpaymentsPayAddress: payment.pay_address,
        nowpaymentsPayAmount: payment.pay_amount,
        nowpaymentsPayCurrency: payment.pay_currency || 'usdtbsc',
        nowpaymentsPaymentID: payment.payment_id || payment.id,
        nowpaymentsStatus: payment.status || payment.payment_status,
        orderID,
        subtotal,
        voucherCode,
      }
    },
    confirmOrder: async ({ data, ordersSlug, req, transactionsSlug }) => {
      const rawData = data as Record<string, any>
      const paymentID = String(rawData?.nowpaymentsPaymentID || rawData?.paymentIntentID || '')

      if (!paymentID) {
        throw new Error('NOWPayments payment ID tidak ditemukan.')
      }

      const existing = await findFinalizedPayment({
        field: 'nowpayments.nowpaymentsPaymentID',
        paymentReference: paymentID,
        req,
        transactionsSlug: transactionsSlug || 'transactions',
      })
      if (existing) return { ...existing, message: 'Order already confirmed' }

      const payment = await sdk.getPaymentStatus(paymentID)
      const normalizedStatus = String(payment.status || payment.payment_status || '').toLowerCase()

      if (normalizedStatus !== 'paid') {
        throw new Error(`Pembayaran crypto belum selesai. Status: ${normalizedStatus || 'unknown'}`)
      }

      const context = await preparePaymentContext({
        currencyCode: 'USD',
        data: {
          ...rawData,
          paymentReference: paymentID,
        },
        req,
      })

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
        ordersSlug: ordersSlug || 'orders',
        paymentGroupData: {
          nowpaymentsPaymentID: paymentID,
          payCurrency: payment.pay_currency || 'usdtbsc',
        },
        paymentMethod: 'nowpayments',
        paymentReference: context.paymentReference,
        req,
        shippingAddress: context.shippingAddress,
        subtotalBeforeDiscount: context.subtotalBeforeDiscount,
        transactionsSlug: transactionsSlug || 'transactions',
      })

      return {
        accessToken: finalized.accessToken,
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
          try {
            const signature = req.headers.get('x-nowpayments-sig') || undefined
            const payload = req.json ? await req.json() : {}
            const event = sdk.parseWebhook(payload, signature)

            req.payload.logger.info(
              {
                orderID: event.payment?.order_id,
                paymentID: event.payment?.payment_id,
                status: event.payment?.status || event.payment?.payment_status,
                type: event.type,
              },
              '[NOWPayments] webhook received',
            )

            return Response.json({ ok: true })
          } catch (error) {
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
