import { createManualOrderFromDigitalStockUnit } from '@/lib/manualDigitalStockOrder'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload } from 'payload'

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

    const body = await req.json().catch(() => ({}))
    const payloadReq = await createLocalReq({ user }, payload)
    const result = await createManualOrderFromDigitalStockUnit({
      digitalStockUnitId: body.digitalStockUnitId,
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
