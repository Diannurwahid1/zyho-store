'use client'

import { useEffect, useState } from 'react'

/**
 * Hook untuk check apakah user punya active checkout session.
 * Returns true jika ada checkout session aktif (creating/pending).
 */
export function useActiveCheckout() {
  const [hasActiveCheckout, setHasActiveCheckout] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkActiveCheckout = async () => {
      try {
        const response = await fetch('/api/checkout/session', {
          method: 'GET',
          credentials: 'include',
        })

        if (!mounted) return

        if (response.ok) {
          const data = await response.json()
          // Session aktif jika ada data dan status creating/pending
          const isActive = data && (data.status === 'creating' || data.status === 'pending')
          setHasActiveCheckout(isActive)
        } else {
          // No active session
          setHasActiveCheckout(false)
        }
      } catch (error) {
        console.error('[useActiveCheckout] Error checking active checkout:', error)
        setHasActiveCheckout(false)
      } finally {
        if (mounted) {
          setIsChecking(false)
        }
      }
    }

    checkActiveCheckout()

    // Recheck setiap 5 detik untuk keep in sync
    const interval = setInterval(checkActiveCheckout, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return { hasActiveCheckout, isChecking }
}
