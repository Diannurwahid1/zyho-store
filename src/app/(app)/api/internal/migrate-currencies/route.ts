import { DEFAULT_USD_IDR_RATE, runCurrencyMigration } from '@/utilities/currencyMigration'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const isAuthorized = (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return Boolean(
    token &&
      process.env.INTERNAL_MIGRATION_SECRET &&
      token === process.env.INTERNAL_MIGRATION_SECRET,
  )
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      dryRun?: boolean
      limit?: number
      rate?: number
    }

    const payload = await getPayload({ config: configPromise })
    const rate =
      typeof body.rate === 'number' && Number.isFinite(body.rate) && body.rate > 0
        ? body.rate
        : DEFAULT_USD_IDR_RATE

    const result = await runCurrencyMigration({
      dryRun: body.dryRun !== false,
      limit: typeof body.limit === 'number' ? body.limit : undefined,
      payload,
      rate,
    })

    return NextResponse.json({
      changed: result.changed,
      dryRun: body.dryRun !== false,
      preview: result.preview.slice(0, 50),
      rate,
      totalTargets: result.totalTargets,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
