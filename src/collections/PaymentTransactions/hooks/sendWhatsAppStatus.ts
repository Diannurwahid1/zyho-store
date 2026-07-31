import { emailNotifyPaidOrder, emailNotifyPendingPayment } from '@/lib/commerceEmail'
import { getWhatsAppFailureMeta, notifyPaidOrder, notifyPendingPayment } from '@/lib/commerceWhatsApp'
import type { CollectionAfterChangeHook } from 'payload'

const PENDING_STATUSES = new Set(['created', 'waiting_payment'])
const PAID_STATUSES = new Set(['capture', 'settlement'])

export const sendPaymentTransactionWhatsAppAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (req?.context?.skipPaymentTransactionNotifications) {
    return doc
  }

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

    // WhatsApp notification
    void notifyPendingPayment({
      amount: doc.amount,
      customerName: customer?.name || undefined,
      orderCode: orderReference,
      phone: customer?.phone || undefined,
    })
      .then((result) => {
        if (!result?.success) {
          const failure = getWhatsAppFailureMeta(result)
          req.payload.logger.error(
            {
              error: failure.error,
              recipient: failure.recipient,
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

    // Email notification (parallel)
    void emailNotifyPendingPayment({
      amount: doc.amount,
      customerName: customer?.name || undefined,
      orderCode: orderReference,
      email: customer?.email || undefined,
    })
      .then((result) => {
        if (!result?.success) {
          req.payload.logger.error(
            { error: 'reason' in result ? result.reason : 'unknown', paymentTransactionID: doc.id },
            '[Email] Pending payment notification failed',
          )
        }
      })
      .catch((error) => {
        req.payload.logger.error(
          { error: error instanceof Error ? error.message : String(error), paymentTransactionID: doc.id },
          '[Email] Pending payment notification failed',
        )
      })
  }

  if (PAID_STATUSES.has(currentStatus)) {
    // WhatsApp notification
    void notifyPaidOrder({
      amount: doc.amount,
      currency: doc.currency,
      customer: doc.customer,
      order: doc.order,
      payload: req.payload,
    })
      .then((result) => {
        if (!result?.success) {
          const failure = getWhatsAppFailureMeta(result)
          req.payload.logger.error(
            {
              error: failure.error,
              recipient: failure.recipient,
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

    // Email notification (parallel)
    void emailNotifyPaidOrder({
      amount: doc.amount,
      currency: doc.currency,
      customer: doc.customer,
      order: doc.order,
      payload: req.payload,
    })
      .then((result) => {
        if (!result?.success) {
          req.payload.logger.error(
            { error: 'reason' in result ? result.reason : 'unknown', paymentTransactionID: doc.id },
            '[Email] Paid order notification failed',
          )
        }
      })
      .catch((error) => {
        req.payload.logger.error(
          { error: error instanceof Error ? error.message : String(error), paymentTransactionID: doc.id },
          '[Email] Paid order notification failed',
        )
      })
  }

  return doc
}
