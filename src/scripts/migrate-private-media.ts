import configPromise from '@payload-config'
import 'dotenv/config'
import { moveMediaFilesToPrivateStorage, protectMediaFile } from '@/utilities/privateMedia'
import { getPayload } from 'payload'

const relationID = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number' || typeof id === 'string') return id
  }
  return null
}

const main = async () => {
  const payload = await getPayload({ config: configPromise })
  const protectedMediaIDs = new Set<number | string>()

  for (const collection of ['digital-assets', 'digital-stock-units'] as const) {
    let page = 1
    let hasNextPage = true
    while (hasNextPage) {
      const result = await payload.find({
        collection,
        depth: 0,
        limit: 100,
        overrideAccess: true,
        page,
        where:
          collection === 'digital-assets'
            ? ({ protected: { not_equals: false } } as any)
            : ({
                and: [
                  { deliveryType: { equals: 'file' } },
                  { file: { exists: true } },
                ],
              } as any),
      })
      for (const doc of result.docs as Array<Record<string, any>>) {
        const mediaID = relationID(doc.file)
        if (mediaID) protectedMediaIDs.add(mediaID)
      }
      hasNextPage = result.hasNextPage
      page += 1
    }
  }

  for (const mediaID of protectedMediaIDs) {
    await protectMediaFile({ media: mediaID, payload })
  }

  const supportMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: { isSupportAttachment: { equals: true } },
  })
  for (const media of supportMedia.docs as Array<Record<string, any>>) {
    await moveMediaFilesToPrivateStorage(media)
  }

  payload.logger.info(
    { protectedDigitalFiles: protectedMediaIDs.size, supportFiles: supportMedia.docs.length },
    '[Security] Private media migration completed',
  )
  await payload.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
