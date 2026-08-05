import { redeemDigitalStockUnit } from '@/lib/redeemDigitalStockUnit'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Silakan login dulu untuk redeem kode.' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const payloadReq = await createLocalReq({ user }, payload)
    const result = await redeemDigitalStockUnit({
      code: String(body.code || ''),
      req: payloadReq,
      user,
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
