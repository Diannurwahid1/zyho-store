'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface VoucherDiscount {
  couponId: string
  couponCode: string
  discountType: 'percentage' | 'fixed'
  amount: number
  appliesTo: 'all' | 'specific'
}

interface ActiveVouchersData {
  global: VoucherDiscount | null
  perProduct: Record<string, VoucherDiscount>
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
  const [vouchers, setVouchers] = useState<ActiveVouchersData | null>(null)
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

  const getProductDiscount = (productId: string | number): VoucherDiscount | null => {
    if (!vouchers) return null

    const id = String(productId)

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
