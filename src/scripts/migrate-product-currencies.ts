import configPromise from '@payload-config'
import 'dotenv/config'
import { getPayload } from 'payload'
import { DEFAULT_USD_IDR_RATE, runCurrencyMigration } from '@/utilities/currencyMigration'

const parseArgs = () => {
  const args = process.argv.slice(2)
  const hasFlag = (flag: string) => args.includes(flag)
  const readValue = (flag: string) => {
    const direct = args.find((arg) => arg.startsWith(`${flag}=`))
    if (direct) return direct.slice(flag.length + 1)

    const index = args.indexOf(flag)
    if (index >= 0) return args[index + 1]

    return undefined
  }

  const rateRaw = readValue('--rate') || process.env.USD_IDR_RATE || process.env.CURRENCY_USD_IDR_RATE
  const rate = Number(rateRaw || DEFAULT_USD_IDR_RATE)

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Nilai kurs USD/IDR tidak valid: ${rateRaw}`)
  }

  return {
    dryRun: !hasFlag('--write'),
    limit: Number(readValue('--limit') || 0),
    rate,
  }
}

async function run() {
  const { dryRun, limit, rate } = parseArgs()
  const payload = await getPayload({ config: configPromise })
  const { changed, preview, totalTargets } = await runCurrencyMigration({
    dryRun,
    limit,
    payload,
    rate,
  })

  payload.logger.info(
    `[currency-migration] Mode=${dryRun ? 'dry-run' : 'write'} rate=${rate} total-targets=${totalTargets}`,
  )

  payload.logger.info(`[currency-migration] changed=${changed}`)

  for (const item of preview.slice(0, 20)) {
    payload.logger.info(`[currency-migration] ${JSON.stringify(item)}`)
  }

  if (preview.length > 20) {
    payload.logger.info(`[currency-migration] ... ${preview.length - 20} more rows`)
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[currency-migration] failed', error)
    process.exit(1)
  })
