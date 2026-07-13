export type BuyNowItem = {
  previousQuantity?: number
  productId: number
  quantity: number
  variantId?: number
}

type CartLikeItem = {
  id?: number | string
  product?: number | string | { id?: number | string; priceInIDR?: number | null; priceInUSD?: number | null }
  quantity?: number | null
  variant?: number | string | { id?: number | string; priceInIDR?: number | null; priceInUSD?: number | null }
}

export const getBuyNowItemFromSearchParams = (searchParams: URLSearchParams): BuyNowItem | null => {
  if (searchParams.get('buyNow') !== '1') return null

  const productId = Number(searchParams.get('productId'))
  const quantity = Number(searchParams.get('quantity') || '1')
  const variantIdParam = searchParams.get('variantId')
  const previousQuantity = Number(searchParams.get('previousQuantity') || '0')

  if (!Number.isFinite(productId) || productId <= 0) return null

  return {
    previousQuantity: Number.isFinite(previousQuantity) ? previousQuantity : 0,
    productId,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    variantId:
      variantIdParam && Number.isFinite(Number(variantIdParam)) ? Number(variantIdParam) : undefined,
  }
}

export const getBuyNowItemFromRawData = (rawData: Record<string, unknown>): BuyNowItem | null => {
  const candidate = rawData.buyNowItem

  if (!candidate || typeof candidate !== 'object') return null

  const item = candidate as Record<string, unknown>
  const productId = Number(item.productId)
  const quantity = Number(item.quantity || '1')
  const variantId = item.variantId !== undefined ? Number(item.variantId) : undefined
  const previousQuantity =
    item.previousQuantity !== undefined ? Number(item.previousQuantity) : undefined

  if (!Number.isFinite(productId) || productId <= 0) return null

  return {
    previousQuantity:
      previousQuantity !== undefined && Number.isFinite(previousQuantity) ? previousQuantity : undefined,
    productId,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    variantId: variantId !== undefined && Number.isFinite(variantId) ? variantId : undefined,
  }
}

export const matchesBuyNowItem = (item: CartLikeItem, buyNowItem: BuyNowItem) => {
  const productId = typeof item.product === 'object' ? item.product?.id : item.product
  const variantId = typeof item.variant === 'object' ? item.variant?.id : item.variant

  if (Number(productId) !== buyNowItem.productId) return false

  if (buyNowItem.variantId !== undefined) {
    return Number(variantId) === buyNowItem.variantId
  }

  return variantId === undefined || variantId === null
}

export const buildBuyNowCartItems = <T extends CartLikeItem>(
  items: T[],
  buyNowItem: BuyNowItem | null,
): T[] => {
  if (!buyNowItem) return items

  return items
    .filter((item) => matchesBuyNowItem(item, buyNowItem))
    .map((item) => ({
      ...item,
      quantity: buyNowItem.quantity,
    }))
}

export const getCartItemUnitPrice = (
  item: CartLikeItem,
  currencyCode: string,
): number => {
  if (typeof item.variant === 'object' && item.variant) {
    const variantPrice =
      currencyCode === 'IDR' ? item.variant.priceInIDR : item.variant.priceInUSD

    if (typeof variantPrice === 'number') return variantPrice
  }

  if (typeof item.product === 'object' && item.product) {
    const productPrice =
      currencyCode === 'IDR' ? item.product.priceInIDR : item.product.priceInUSD

    if (typeof productPrice === 'number') return productPrice
  }

  return 0
}

export const calculateCartItemsSubtotal = (
  items: CartLikeItem[],
  currencyCode: string,
): number =>
  items.reduce((total, item) => {
    const unitPrice = getCartItemUnitPrice(item, currencyCode)
    const quantity = item.quantity ?? 0

    return total + unitPrice * quantity
  }, 0)
