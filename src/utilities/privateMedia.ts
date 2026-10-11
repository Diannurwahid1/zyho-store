import { copyFile, mkdir, rename, unlink } from 'fs/promises'
import path from 'path'
import type { BasePayload, PayloadRequest } from 'payload'

export const PUBLIC_MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
export const PRIVATE_MEDIA_DIR = path.resolve(process.cwd(), 'storage/protected-media')

const safeFilename = (value: unknown) => {
  if (typeof value !== 'string' || !value || path.basename(value) !== value) return null
  return value
}

export const getMediaFilenames = (media: Record<string, any>) => {
  const filenames = new Set<string>()
  const original = safeFilename(media.filename)
  if (original) filenames.add(original)

  if (media.sizes && typeof media.sizes === 'object') {
    for (const size of Object.values(media.sizes) as Array<Record<string, any> | null>) {
      const filename = safeFilename(size?.filename)
      if (filename) filenames.add(filename)
    }
  }
  return [...filenames]
}

export const moveMediaFilesToPrivateStorage = async (media: Record<string, any>) => {
  await mkdir(PRIVATE_MEDIA_DIR, { recursive: true, mode: 0o750 })

  for (const filename of getMediaFilenames(media)) {
    const source = path.join(PUBLIC_MEDIA_DIR, filename)
    const destination = path.join(PRIVATE_MEDIA_DIR, filename)
    try {
      await rename(source, destination)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code === 'ENOENT') continue
      if (code !== 'EXDEV') throw error
      await copyFile(source, destination)
      await unlink(source)
    }
  }
}

export const protectMediaFile = async ({
  media: mediaValue,
  payload,
  req,
}: {
  media: number | string | Record<string, any> | null | undefined
  payload: BasePayload
  req?: PayloadRequest
}) => {
  const mediaID =
    mediaValue && typeof mediaValue === 'object' ? mediaValue.id : mediaValue
  if (!mediaID) return

  const media =
    mediaValue && typeof mediaValue === 'object' && mediaValue.filename
      ? mediaValue
      : ((await payload.findByID({
          collection: 'media',
          depth: 0,
          id: mediaID,
          overrideAccess: true,
          req,
        })) as Record<string, any>)

  await moveMediaFilesToPrivateStorage(media)
  if (media.isProtectedDigitalAsset !== true) {
    await payload.update({
      collection: 'media',
      id: mediaID,
      data: { isProtectedDigitalAsset: true } as any,
      overrideAccess: true,
      req,
    })
  }
}
