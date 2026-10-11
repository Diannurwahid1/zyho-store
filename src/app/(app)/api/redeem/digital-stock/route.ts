import { redeemDigitalStockUnit } from '@/lib/redeemDigitalStockUnit'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createLocalReq, getPayload } from 'payload'
import { enforceRateLimit, getClientIP, readJSONBodyLimited } from '@/utilities/security'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Silakan login dulu untuk redeem kode.' }, { status: 401 })
    }
    const rateLimited = enforceRateLimit({
      key: `digital-redeem:${user.id}:${getClientIP(req)}`,
      limit: 10,
      request: req,
      responseMessage: 'Terlalu banyak percobaan kode redeem.',
      windowMs: 60 * 60_000,
    })
    if (rateLimited) return rateLimited
    const parsed = await readJSONBodyLimited<Record<string, unknown>>(req, 2 * 1024)
    if (parsed.response) return parsed.response
    const body = parsed.data
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
