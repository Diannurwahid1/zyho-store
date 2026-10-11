import { createManualOrderFromDigitalStockUnit } from '@/lib/manualDigitalStockOrder'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload } from 'payload'
import { enforceRateLimit, getClientIP, readJSONBodyLimited } from '@/utilities/security'

const hasStaffAccess = (user: any) => {
  const roles = Array.isArray(user?.roles) ? user.roles : []
  return roles.some((role: string) => ['admin', 'manager', 'finance', 'support'].includes(role))
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || !hasStaffAccess(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const rateLimited = enforceRateLimit({
      key: `manual-order:${user.id}:${getClientIP(req)}`,
      limit: 20,
      request: req,
      responseMessage: 'Terlalu banyak pembuatan order manual.',
      windowMs: 10 * 60_000,
    })
    if (rateLimited) return rateLimited
    const parsed = await readJSONBodyLimited<Record<string, unknown>>(req, 8 * 1024)
    if (parsed.response) return parsed.response
    const body = parsed.data
    const digitalStockUnitId = body.digitalStockUnitId
    if (typeof digitalStockUnitId !== 'string' && typeof digitalStockUnitId !== 'number') {
      return NextResponse.json({ error: 'Digital stock unit tidak valid.' }, { status: 400 })
    }
    const payloadReq = await createLocalReq({ user }, payload)
    const result = await createManualOrderFromDigitalStockUnit({
      digitalStockUnitId,
      email: String(body.email || ''),
      phone: String(body.phone || ''),
      req: payloadReq,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
