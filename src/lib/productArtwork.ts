import { getNormalizedBundleItems } from '@/lib/bundles'

export type ArtworkImage = {
  alt?: string
  url: string
}

const extractArtworkImage = (value: unknown): ArtworkImage | null => {
  if (!value || typeof value !== 'object') return null

  const image = value as {
    alt?: string | null
    url?: string | null
  }

  if (typeof image.url !== 'string' || image.url.trim().length === 0) return null

  return {
    alt: typeof image.alt === 'string' ? image.alt : undefined,
    url: image.url,
  }
}

const getDirectProductImages = (product: any): ArtworkImage[] => {
  if (!product || typeof product !== 'object') return []

  const galleryImages = Array.isArray(product.gallery)
    ? product.gallery
        .map((item: any) => extractArtworkImage(item?.image))
        .filter((item: ArtworkImage | null): item is ArtworkImage => Boolean(item))
    : []

  const metaImage = extractArtworkImage(product.meta?.image)

  return [...galleryImages, ...(metaImage ? [metaImage] : [])].filter(
    (image, index, list) => list.findIndex((item) => item.url === image.url) === index,
  )
}

export const getProductArtworkImages = (product: any, max = 4): ArtworkImage[] => {
  const bundleItems = getNormalizedBundleItems(product)

  if (bundleItems.length > 0) {
    const bundleImages = bundleItems
      .flatMap((item) => getDirectProductImages(item.product))
      .filter((image, index, list) => list.findIndex((item) => item.url === image.url) === index)

    if (bundleImages.length > 0) {
      return bundleImages.slice(0, max)
    }
  }

  return getDirectProductImages(product).slice(0, max)
}

export const getProductPrimaryArtwork = (product: any): ArtworkImage | null =>
  getProductArtworkImages(product, 1)[0] || null
