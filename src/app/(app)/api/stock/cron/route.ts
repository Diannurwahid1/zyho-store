import { releaseExpiredReservations } from '@/lib/stock'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

const CRON_SECRET = process.env.CRON_SECRET

/**
 * GET /api/stock/cron
 * Endpoint cron untuk release reservasi yang expired (> 10 menit).
 * Dipanggil oleh Vercel Cron / external scheduler setiap 1 menit.
 *
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  const rateLimited = enforceRateLimit({
    limit: 30,
    request: req,
    responseMessage: 'Too many cron requests',
    windowMs: 60_000,
  })
  if (rateLimited) return rateLimited

  if (!CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 })
  }

  // Validasi secret
  const authHeader = req.headers.get('authorization')
  const secret = authHeader?.replace('Bearer ', '')

  if (secret !== CRON_SECRET) {
    auditLog({
      level: 'warn',
      message: '[Security] Invalid cron secret attempt',
      meta: buildAuditMeta(req),
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { released } = await releaseExpiredReservations(payload)

    auditLog({
      logger: payload.logger,
      message: '[Audit] Stock cron executed',
      meta: buildAuditMeta(req, { released }),
    })

    return NextResponse.json({
      success: true,
      released,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Stock Cron] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/stock/cron
 * Sama seperti GET tapi bisa dipanggil via POST (untuk webhook-style cron).
 */
export async function POST(req: NextRequest) {
  return GET(req)
}
