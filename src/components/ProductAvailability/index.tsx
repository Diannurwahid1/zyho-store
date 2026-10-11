'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ProductAvailabilityContextValue = {
  available: number
  isChecking: boolean
  productId: number
}

const ProductAvailabilityContext = createContext<ProductAvailabilityContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  initialAvailable: number
  productId: number
}

/**
 * Reconcile only cards that the server initially marks as sold out. This protects
 * storefront cards from showing a stale waitlist state after stock is adjusted.
 */
export function ProductAvailabilityProvider({
  children,
  initialAvailable,
  productId,
}: ProviderProps) {
  const [available, setAvailable] = useState(initialAvailable)
  const [isChecking, setIsChecking] = useState(initialAvailable <= 0)

  useEffect(() => {
    if (initialAvailable > 0 || !Number.isInteger(productId) || productId <= 0) {
      setAvailable(initialAvailable)
      setIsChecking(false)
      return
    }

    const controller = new AbortController()

    fetch(`/api/stock/check?productId=${encodeURIComponent(String(productId))}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Stock check failed')
        return response.json() as Promise<{ available?: unknown }>
      })
      .then((data) => {
        if (typeof data.available === 'number' && Number.isFinite(data.available)) {
          setAvailable(Math.max(0, data.available))
        }
      })
      .catch(() => {
        // Keep the server-rendered value when live reconciliation is unavailable.
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsChecking(false)
      })

    return () => controller.abort()
  }, [initialAvailable, productId])

  const value = useMemo(
    () => ({ available, isChecking, productId }),
    [available, isChecking, productId],
  )

  return <ProductAvailabilityContext.Provider value={value}>{children}</ProductAvailabilityContext.Provider>
}

export function useProductAvailability(productId: number) {
  const value = useContext(ProductAvailabilityContext)
  return value?.productId === productId ? value : null
}

type BadgeProps = {
  children: React.ReactNode
  className: string
  initialOutOfStock: boolean
}

export function ProductStockBadge({ children, className, initialOutOfStock }: BadgeProps) {
  const availability = useContext(ProductAvailabilityContext)

  if (!initialOutOfStock) return null
  if (availability?.isChecking) return null
  if (availability && availability.available > 0) return null

  return <span className={className}>{children}</span>
}
