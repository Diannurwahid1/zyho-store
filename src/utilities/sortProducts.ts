import type { Product } from '@/payload-types'

/**
 * Sort products with smart ordering:
 * 1. Promo/flash sale + in stock → first (sorted by soldCount desc)
 * 2. In stock, no promo → next (sorted by soldCount desc)
 * 3. Out of stock → last (sorted by soldCount desc)
 */
export function sortProducts<T extends Partial<Product>>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const aStock = getIsInStock(a)
    const bStock = getIsInStock(b)
    const aPromo = getHasPromo(a)
    const bPromo = getHasPromo(b)
    const aSold = (a as any).soldCount ?? 0
    const bSold = (b as any).soldCount ?? 0

    // Out of stock always goes last
    if (aStock && !bStock) return -1
    if (!aStock && bStock) return 1

    // Both in stock: promo first
    if (aStock && bStock) {
      if (aPromo && !bPromo) return -1
      if (!aPromo && bPromo) return 1
    }

    // Within same group: sort by soldCount desc
    return bSold - aSold
  })
}

function getIsInStock(product: Partial<Product>): boolean {
  const variants = product.variants?.docs
  if (product.enableVariants && variants && variants.length > 0) {
    return variants.some(
      (variant) => typeof variant === 'object' && (variant.inventory ?? 0) > 0,
    )
  }
  return (product.inventory ?? 0) > 0
}

function getHasPromo(product: Partial<Product>): boolean {
  const promo = product.promo
  if (!promo) return false
  if (!promo.isFlashSale) return false
  // Check if flash sale is still active
  if (promo.flashSaleEndDate) {
    return new Date(promo.flashSaleEndDate) > new Date()
  }
  return true
}
