import { notifyPaidOrder } from '@/lib/commerceWhatsApp'
import type { CollectionAfterChangeHook } from 'payload'

export const sendTransactionWhatsAppAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === previousDoc?.status || doc.status !== 'succeeded') {
    return doc
  }

  void notifyPaidOrder({
    amount: doc.amount || 0,
    currency: doc.currency,
    customer: doc.customer,
    customerEmail: doc.customerEmail,
    order: doc.order as any,
    payload: req.payload,
    phone:
      typeof doc.billingAddress === 'object' && doc.billingAddress
        ? doc.billingAddress.phone || undefined
        : undefined,
  })
    .then((result) => {
      if (!result?.success) {
        req.payload.logger.error(
          {
            error: result?.error || result?.reason || 'Unknown WhatsApp failure',
            recipient: result?.recipient,
            transactionID: doc.id,
          },
          '[WhatsApp] Transaction success notification failed',
        )
      }
    })
    .catch((error) => {
      req.payload.logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          transactionID: doc.id,
        },
        '[WhatsApp] Transaction success notification failed',
      )
    })

  return doc
}
