'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'

interface VoucherDiscount {
  couponId: string
  couponCode: string
  discountType: 'percentage' | 'fixed'
  amount: number
  appliesTo: 'all' | 'specific'
  isWelcomeVoucher?: boolean
}

interface ActiveVouchersData {
  global: VoucherDiscount | null
  perProduct: Record<string, VoucherDiscount>
}

type WelcomeReward = {
  amount: number
  code: string
  discountType: 'fixed' | 'percentage'
  productIds: number[]
}

interface ActiveVouchersContextValue {
  vouchers: ActiveVouchersData | null
  loading: boolean
  getProductDiscount: (productId: string | number) => VoucherDiscount | null
}

const ActiveVouchersContext = createContext<ActiveVouchersContextValue>({
  vouchers: null,
  loading: true,
  getProductDiscount: () => null,
})

export const useActiveVouchers = () => useContext(ActiveVouchersContext)

export const ActiveVouchersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth()
  const [vouchers, setVouchers] = useState<ActiveVouchersData | null>(null)
  const [welcomeReward, setWelcomeReward] = useState<WelcomeReward | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('/api/active-vouchers')
        if (response.ok) {
          const data = await response.json()
          setVouchers(data)
        }
      } catch (error) {
        console.error('Failed to fetch active vouchers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVouchers()

    // Refresh vouchers setiap 5 menit
    const interval = setInterval(fetchVouchers, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status !== 'loggedIn') {
      setWelcomeReward(null)
      return
    }

    let active = true

    const fetchWelcomeReward = async () => {
      try {
        const response = await fetch('/api/signup-voucher/welcome', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) return

        const data = await response.json()
        if (active) {
          setWelcomeReward(data?.reward || null)
        }
      } catch {
        if (active) setWelcomeReward(null)
      }
    }

    void fetchWelcomeReward()

    return () => {
      active = false
    }
  }, [status])

  const getProductDiscount = (productId: string | number): VoucherDiscount | null => {
    const id = String(productId)

    if (
      welcomeReward &&
      (welcomeReward.productIds.length === 0 || welcomeReward.productIds.includes(Number(productId)))
    ) {
      return {
        amount: welcomeReward.amount,
        appliesTo: welcomeReward.productIds.length > 0 ? 'specific' : 'all',
        couponCode: welcomeReward.code,
        couponId: welcomeReward.code,
        discountType: welcomeReward.discountType,
        isWelcomeVoucher: true,
      }
    }

    if (!vouchers) return null

    // Cek apakah ada voucher spesifik untuk produk ini
    if (vouchers.perProduct[id]) {
      return vouchers.perProduct[id]
    }

    // Kalau tidak ada voucher spesifik, gunakan global voucher
    return vouchers.global
  }

  return (
    <ActiveVouchersContext.Provider value={{ vouchers, loading, getProductDiscount }}>
      {children}
    </ActiveVouchersContext.Provider>
  )
}
