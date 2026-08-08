type MaybeID = number | string

type BundleConfigLike = {
  enabled?: boolean | null
  items?: unknown
} | null | undefined

type BundleProductSnapshot = {
  digitalFulfillmentMode?: string | null
  id: MaybeID
  inventory?: number | null
  priceInIDR?: number | null
  priceInUSD?: number | null
  slug?: string | null
  title?: string | null
}

export type NormalizedBundleItem = {
  discountPercent: number
  product?: BundleProductSnapshot | null
  productId: MaybeID
  quantity: number
}

const normalizeID = (value: unknown): MaybeID | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (value && typeof value === 'object' && 'id' in value) {
    const nestedID = (value as { id?: unknown }).id
    return normalizeID(nestedID)
  }
  return null
}

const normalizePercent = (value: unknown) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.min(100, Math.max(0, numeric))
}

const normalizeQuantity = (value: unknown) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return 1
  return Math.max(1, Math.floor(numeric))
}

const resolveBundleConfig = (product: unknown): BundleConfigLike => {
  if (!product || typeof product !== 'object' || !('bundleConfig' in product)) return null
  const config = (product as { bundleConfig?: BundleConfigLike }).bundleConfig
  if (!config || typeof config !== 'object') return null
  return config
}

export const getNormalizedBundleItems = (product: unknown): NormalizedBundleItem[] => {
  const config = resolveBundleConfig(product)
  if (!config?.enabled || !Array.isArray(config.items)) return []

  const items = config.items
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const rawItem = item as {
        discountPercent?: unknown
        product?: unknown
        productId?: unknown
        quantity?: unknown
      }

      const product = rawItem.product && typeof rawItem.product === 'object'
        ? (rawItem.product as BundleProductSnapshot)
        : null
      const productId = normalizeID(rawItem.productId ?? product)

      if (!productId) return null

      return {
        discountPercent: normalizePercent(rawItem.discountPercent),
        product,
        productId,
        quantity: normalizeQuantity(rawItem.quantity),
      }
    })
    .filter(
      (
        item,
      ): item is {
        discountPercent: number
        product: BundleProductSnapshot | null
        productId: MaybeID
        quantity: number
      } => Boolean(item),
    )

  return items
}

export const isBundleProduct = (product: unknown) => getNormalizedBundleItems(product).length > 0

const getBundleItemBasePrice = (
  item: NormalizedBundleItem,
  currencyCode: 'IDR' | 'USD',
) => {
  if (!item.product) return 0
  const price = currencyCode === 'IDR' ? item.product.priceInIDR : item.product.priceInUSD
  return typeof price === 'number' ? price : 0
}

export const getBundleItemDiscountedUnitPrice = (
  item: NormalizedBundleItem,
  currencyCode: 'IDR' | 'USD',
) => {
  const basePrice = getBundleItemBasePrice(item, currencyCode)
  if (basePrice <= 0) return 0
  return Math.max(0, Math.round(basePrice * (1 - item.discountPercent / 100)))
}

export const calculateBundleUnitPrice = (
  product: unknown,
  currencyCode: 'IDR' | 'USD',
  fallbackPrice = 0,
) => {
  const items = getNormalizedBundleItems(product)
  if (!items.length) return fallbackPrice

  const total = items.reduce((sum, item) => {
    return sum + getBundleItemDiscountedUnitPrice(item, currencyCode) * item.quantity
  }, 0)

  return total > 0 ? total : fallbackPrice
}

export const calculateBundleAvailability = (product: unknown, fallbackInventory = 0) => {
  const items = getNormalizedBundleItems(product)
  if (!items.length) return fallbackInventory

  let maxBundles = Number.POSITIVE_INFINITY

  for (const item of items) {
    if (!item.product || typeof item.product.inventory !== 'number') return fallbackInventory
    maxBundles = Math.min(maxBundles, Math.floor(item.product.inventory / item.quantity))
  }

  return Number.isFinite(maxBundles) ? Math.max(0, maxBundles) : fallbackInventory
}

export const expandBundleCartItems = (cartItems: any[]) => {
  const expanded: any[] = []

  for (const item of cartItems) {
    const product = item?.product
    const quantity = Math.max(0, Number(item?.quantity || 0))

    if (!product || quantity <= 0) continue

    if (!isBundleProduct(product)) {
      expanded.push(item)
      continue
    }

    const bundleItems = getNormalizedBundleItems(product)

    for (const bundleItem of bundleItems) {
      expanded.push({
        ...item,
        bundleComponentDiscountPercent: bundleItem.discountPercent,
        bundleComponentUnitPriceInIDR: getBundleItemDiscountedUnitPrice(bundleItem, 'IDR'),
        bundleComponentUnitPriceInUSD: getBundleItemDiscountedUnitPrice(bundleItem, 'USD'),
        bundleParentId: normalizeID(product),
        bundleParentTitle:
          typeof product === 'object' && product && 'title' in product ? product.title : undefined,
        product: bundleItem.product || bundleItem.productId,
        quantity: quantity * bundleItem.quantity,
        variant: undefined,
      })
    }
  }

  return expanded
}

export const getBundleReservationEntries = (cartItems: any[]) =>
  expandBundleCartItems(cartItems)
    .map((item) => {
      const productId = normalizeID(item?.product)
      const variantId = normalizeID(item?.variant)
      const quantity = Math.max(0, Number(item?.quantity || 0))

      if (!productId || quantity <= 0) return null

      return {
        productId,
        quantity,
        variantId: variantId || undefined,
      }
    })
    .filter((item) => Boolean(item))
    .reduce<
      Array<{
        productId: MaybeID
        quantity: number
        variantId?: MaybeID
      }>
    >((entries, item) => {
      if (!item) return entries

      const existing = entries.find(
        (entry) =>
          String(entry.productId) === String(item.productId) &&
          String(entry.variantId || '') === String(item.variantId || ''),
      )

      if (existing) {
        existing.quantity += item.quantity
        return entries
      }

      entries.push({ ...item })
      return entries
    }, [])
