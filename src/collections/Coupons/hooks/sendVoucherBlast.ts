import { triggerVoucherBlast } from '@/lib/commerceWhatsApp'
import { emailVoucherBlast } from '@/lib/commerceEmail'
import type { CollectionAfterChangeHook } from 'payload'

export const sendVoucherBlastAfterChange: CollectionAfterChangeHook = async ({
  context,
  doc,
  previousDoc,
  req,
}) => {
  if (context.skipVoucherWhatsAppBlast) {
    return doc
  }

  if (!doc.sendWhatsAppBlast || doc.status !== 'active') {
    return doc
  }

  const shouldSend =
    !previousDoc?.sendWhatsAppBlast ||
    previousDoc.status !== doc.status ||
    previousDoc.code !== doc.code ||
    previousDoc.amount !== doc.amount ||
    previousDoc.benefitSummary !== doc.benefitSummary ||
    previousDoc.expiresAt !== doc.expiresAt

  if (!shouldSend) {
    return doc
  }

  // WhatsApp blast
  void triggerVoucherBlast({ coupon: doc as any, payload: req.payload })
    .then(async (result) => {
      await req.payload.update({
        collection: 'coupons',
        id: doc.id,
        context: {
          skipVoucherWhatsAppBlast: true,
        },
        data: {
          sendWhatsAppBlast: false,
          whatsAppBlastRecipientCount: result.sent,
          whatsAppBlastSentAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
    })
    .catch((error) => {
      req.payload.logger.error(
        {
          couponID: doc.id,
          error: error instanceof Error ? error.message : String(error),
        },
        '[WhatsApp] Voucher blast failed',
      )
    })

  // Email blast (parallel)
  void emailVoucherBlast({ coupon: doc as any, payload: req.payload })
    .then((result) => {
      req.payload.logger.info(
        { couponID: doc.id, emailSent: result.sent, emailFailed: result.failed },
        '[Email] Voucher blast completed',
      )
    })
    .catch((error) => {
      req.payload.logger.error(
        {
          couponID: doc.id,
          error: error instanceof Error ? error.message : String(error),
        },
        '[Email] Voucher blast failed',
      )
    })

  return doc
}
