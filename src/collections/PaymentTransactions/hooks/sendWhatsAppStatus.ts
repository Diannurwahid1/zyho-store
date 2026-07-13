import { notifyPaidOrder, notifyPendingPayment } from '@/lib/commerceWhatsApp'
import type { CollectionAfterChangeHook } from 'payload'

const PENDING_STATUSES = new Set(['created', 'waiting_payment'])
const PAID_STATUSES = new Set(['capture', 'settlement'])

export const sendPaymentTransactionWhatsAppAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const currentStatus = doc.status
  const previousStatus = previousDoc?.status

  if (currentStatus === previousStatus) {
    return doc
  }

  if (PENDING_STATUSES.has(currentStatus)) {
    const customer =
      typeof doc.customer === 'object' && doc.customer ? doc.customer : null
    const orderReference =
      typeof doc.order === 'object' && doc.order ? `#${doc.order.id}` : doc.providerTransactionId

    void notifyPendingPayment({
      amount: doc.amount,
      customerName: customer?.name || undefined,
      orderCode: orderReference,
      phone: customer?.phone || undefined,
    })
      .then((result) => {
        if (!result?.success) {
          req.payload.logger.error(
            {
              error: result?.error || result?.reason || 'Unknown WhatsApp failure',
              recipient: result?.recipient,
              paymentTransactionID: doc.id,
            },
            '[WhatsApp] Pending payment notification failed',
          )
        }
      })
      .catch((error) => {
        req.payload.logger.error(
          {
            error: error instanceof Error ? error.message : String(error),
            paymentTransactionID: doc.id,
          },
          '[WhatsApp] Pending payment notification failed',
        )
      })
  }

  if (PAID_STATUSES.has(currentStatus)) {
    void notifyPaidOrder({
      amount: doc.amount,
      currency: doc.currency,
      customer: doc.customer,
      order: doc.order,
      payload: req.payload,
    })
      .then((result) => {
        if (!result?.success) {
          req.payload.logger.error(
            {
              error: result?.error || result?.reason || 'Unknown WhatsApp failure',
              recipient: result?.recipient,
              paymentTransactionID: doc.id,
            },
            '[WhatsApp] Paid order notification failed',
          )
        }
      })
      .catch((error) => {
        req.payload.logger.error(
          {
            error: error instanceof Error ? error.message : String(error),
            paymentTransactionID: doc.id,
          },
          '[WhatsApp] Paid order notification failed',
        )
      })
  }

  return doc
}
