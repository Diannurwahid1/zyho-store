import { findActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import configPromise from '@payload-config'
import { NowPaymentsSDK } from '@nowpaymentsio/nowpayments-sdk-nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

const createSDK = () =>
  new NowPaymentsSDK({
    apiKey: process.env.NOWPAYMENTS_API_KEY,
    email: process.env.NOWPAYMENTS_EMAIL,
    password: process.env.NOWPAYMENTS_PASSWORD,
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET,
  })

export async function GET(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      key: `nowpayments-get:${req.headers.get('x-forwarded-for') || 'unknown'}`,
      limit: 30,
      request: req,
      responseMessage: 'Too many crypto payment checks',
      windowMs: 60_000,
    })
    if (rateLimited) return rateLimited

    const paymentId = new URL(req.url).searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId wajib diisi.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] Unauthorized NOWPayments status blocked',
        meta: buildAuditMeta(req, { paymentId }),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const activeSession = await findActiveCheckoutSession(payload, user.id)
    const paymentData = activeSession?.paymentData as any
    if (
      !activeSession ||
      activeSession.paymentMethod !== 'nowpayments' ||
      String(paymentData?.nowpaymentsPaymentID || '') !== paymentId
    ) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] NOWPayments status ownership check failed',
        meta: buildAuditMeta(req, { paymentId, userID: user.id }),
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    auditLog({
      logger: payload.logger,
      message: '[Audit] NOWPayments GET access',
      meta: buildAuditMeta(req, { paymentId, userID: user.id }),
    })

    const sdk = createSDK()
    const payment = await sdk.getPaymentStatus(paymentId)

    return NextResponse.json(payment)
  } catch (error) {
    console.error('[NOWPayments] status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
