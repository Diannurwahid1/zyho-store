import configPromise from '@payload-config'
import 'dotenv/config'
import { getPayload } from 'payload'

const sensitiveFields = [
  'accountEmail',
  'accountPassword',
  'accountUsername',
  'content',
  'loginUrl',
  'redeemCode',
  'referenceCode',
] as const

const main = async () => {
  const payload = await getPayload({ config: configPromise })
  let migrated = 0
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'digital-stock-units',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      sort: 'id',
    })

    for (const unit of result.docs) {
      const data: Record<string, string> = {}
      for (const field of sensitiveFields) {
        const value = unit[field]
        if (typeof value === 'string' && value) data[field] = value
      }

      if (Object.keys(data).length === 0) continue
      await payload.update({
        collection: 'digital-stock-units',
        data,
        id: unit.id,
        overrideAccess: true,
      })
      migrated += 1
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  payload.logger.info({ migrated }, '[Security] Sensitive digital stock migration completed')
  // Payload leaves background handles open in one-off scripts on some hosts.
  process.exit(0)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Sensitive data migration failed')
  process.exitCode = 1
})
