import type { BasePayload } from 'payload'
import { normalizeStoredUSDToBaseUnits, usdDecimalToBaseUnits } from '@/utilities/currencyUnits'

export type CurrencyTarget = {
  collection: 'products' | 'variants'
  id: number | string
  label: string
  parentProductId?: number | string
  priceInIDR?: null | number
  priceInIDREnabled?: boolean | null
  priceInUSD?: null | number
  priceInUSDEnabled?: boolean | null
}

export type NormalizedResult = {
  nextIDR: null | number
  nextIDREnabled: boolean
  nextUSD: null | number
  nextUSDEnabled: boolean
  reason: string
}

export const DEFAULT_USD_IDR_RATE = 16000
export const LEGACY_USD_IDR_THRESHOLD = 1000

const roundIDR = (value: number) => Math.round(value)
const roundUSDCents = (value: number) => usdDecimalToBaseUnits(value)

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0

const looksLikeLegacyIDRStoredInUSD = ({
  idr,
  usd,
}: {
  idr?: null | number
  usd?: null | number
}) => {
  if (!isPositiveNumber(usd)) return false

  if (isPositiveNumber(idr)) {
    return usd >= LEGACY_USD_IDR_THRESHOLD && Math.abs(usd - idr) <= 1
  }

  return usd >= LEGACY_USD_IDR_THRESHOLD
}

export const normalizeCurrencyRecord = (
  record: CurrencyTarget,
  rate: number,
): null | NormalizedResult => {
  const currentIDR = isPositiveNumber(record.priceInIDR) ? roundIDR(record.priceInIDR) : null
  const currentUSD = normalizeStoredUSDToBaseUnits(record.priceInUSD)

  if (!currentIDR && !currentUSD) {
    return null
  }

  const legacyUSD = looksLikeLegacyIDRStoredInUSD({
    idr: currentIDR,
    usd: currentUSD,
  })

  let nextIDR: null | number = currentIDR
  let nextUSD: null | number = currentUSD
  let reason = 'preserved-dual-currency'

  if (currentIDR && (!currentUSD || legacyUSD || !record.priceInUSDEnabled)) {
    nextIDR = currentIDR
    nextUSD = roundUSDCents(currentIDR / rate)
    reason = legacyUSD
      ? 'recomputed-usd-from-idr-legacy-usd-field'
      : 'generated-usd-from-idr'
  } else if (!currentIDR && currentUSD) {
    if (legacyUSD) {
      nextIDR = roundIDR(currentUSD)
      nextUSD = roundUSDCents(nextIDR / rate)
      reason = 'moved-legacy-usd-price-into-idr-and-generated-usd'
    } else {
      nextUSD = currentUSD
      nextIDR = roundIDR((currentUSD / 100) * rate)
      reason = 'generated-idr-from-usd'
    }
  } else if (currentIDR && currentUSD && legacyUSD) {
    nextIDR = currentIDR
    nextUSD = roundUSDCents(currentIDR / rate)
    reason = 'replaced-legacy-duplicated-usd-with-converted-usd'
  }

  if (!nextIDR && !nextUSD) {
    return null
  }

  const nextIDREnabled = Boolean(nextIDR)
  const nextUSDEnabled = Boolean(nextUSD)

  const unchanged =
    nextIDR === (record.priceInIDR ?? null) &&
    nextUSD === (record.priceInUSD ?? null) &&
    nextIDREnabled === Boolean(record.priceInIDREnabled) &&
    nextUSDEnabled === Boolean(record.priceInUSDEnabled)

  if (unchanged) {
    return null
  }

  return {
    nextIDR,
    nextIDREnabled,
    nextUSD,
    nextUSDEnabled,
    reason,
  }
}

export async function loadCurrencyTargets(payload: BasePayload, limit?: number) {
  const targets: CurrencyTarget[] = []

  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: limit && limit > 0 ? limit : 200,
    overrideAccess: true,
    pagination: false,
    select: {
      id: true,
      title: true,
      priceInIDR: true,
      priceInIDREnabled: true,
      priceInUSD: true,
      priceInUSDEnabled: true,
    },
  })

  for (const product of products.docs) {
    targets.push({
      collection: 'products',
      id: product.id,
      label: `product:${product.title || product.id}`,
      priceInIDR: product.priceInIDR,
      priceInIDREnabled: product.priceInIDREnabled,
      priceInUSD: product.priceInUSD,
      priceInUSDEnabled: product.priceInUSDEnabled,
    })
  }

  const variants = await payload.find({
    collection: 'variants',
    depth: 0,
    limit: limit && limit > 0 ? limit : 500,
    overrideAccess: true,
    pagination: false,
    select: {
      id: true,
      product: true,
      title: true,
      priceInIDR: true,
      priceInIDREnabled: true,
      priceInUSD: true,
      priceInUSDEnabled: true,
    },
  })

  for (const variant of variants.docs) {
    const variantTitle = variant.title || variant.id
    const parentProductId =
      typeof variant.product === 'object' && variant.product ? variant.product.id : variant.product

    targets.push({
      collection: 'variants',
      id: variant.id,
      label: `variant:${variantTitle}`,
      parentProductId: parentProductId ?? undefined,
      priceInIDR: variant.priceInIDR,
      priceInIDREnabled: variant.priceInIDREnabled,
      priceInUSD: variant.priceInUSD,
      priceInUSDEnabled: variant.priceInUSDEnabled,
    })
  }

  return targets
}

export async function runCurrencyMigration({
  dryRun,
  limit,
  payload,
  rate,
}: {
  dryRun: boolean
  limit?: number
  payload: BasePayload
  rate: number
}) {
  const targets = await loadCurrencyTargets(payload, limit)
  let changed = 0
  const preview: Array<Record<string, unknown>> = []

  for (const target of targets) {
    const normalized = normalizeCurrencyRecord(target, rate)

    if (!normalized) continue

    changed += 1

    preview.push({
      collection: target.collection,
      id: target.id,
      label: target.label,
      fromIDR: target.priceInIDR ?? null,
      fromUSD: target.priceInUSD ?? null,
      toIDR: normalized.nextIDR,
      toUSD: normalized.nextUSD,
      reason: normalized.reason,
    })

    if (dryRun) continue

    await payload.update({
      collection: target.collection,
      id: target.id,
      data: {
        priceInIDR: normalized.nextIDR,
        priceInIDREnabled: normalized.nextIDREnabled,
        priceInUSD: normalized.nextUSD,
        priceInUSDEnabled: normalized.nextUSDEnabled,
      },
      overrideAccess: true,
    })
  }

  return {
    changed,
    preview,
    totalTargets: targets.length,
  }
}
