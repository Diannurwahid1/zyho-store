type ProductBadgeSource = {
  badge?: string | null
  customBadge?: string | null
}

const LEGACY_BADGE_LABELS: Record<string, string> = {
  best_seller: 'Best Seller',
  discount: 'Discount',
  new: 'New',
}

export function getProductBadgeLabel(product: ProductBadgeSource | null | undefined): string | null {
  if (!product) return null

  const customBadge = typeof product.customBadge === 'string' ? product.customBadge.trim() : ''
  if (customBadge) return customBadge

  const badge = typeof product.badge === 'string' ? product.badge.trim() : ''
  if (!badge) return null

  return LEGACY_BADGE_LABELS[badge] || badge.replace(/_/g, ' ')
}
