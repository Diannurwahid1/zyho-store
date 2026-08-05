'use client'

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { LocalizedPrice } from '@/components/LocalizedPrice'
import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    buildBuyNowCartItems,
    calculateCartItemsSubtotal,
    getBuyNowItemFromSearchParams,
    getCartItemUnitPrice,
    matchesBuyNowItem,
} from '@/lib/buyNow'
import type { EligibleVoucher } from '@/lib/vouchers'
import { Address } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useCart, useCurrency, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  initialEligibleVouchers: EligibleVoucher[]
}

type PaymentData = {
  amount: number
  discountAmount: number
  nowpaymentsPayAddress?: string
  nowpaymentsPayAmount?: number
  nowpaymentsPayCurrency?: string
  nowpaymentsPaymentID?: string
  orderID: string
  paymentMethod: 'nowpayments' | 'pakasir'
  subtotal: number
  voucherCode?: string | null
}

type CheckoutSessionState = {
  cartId: string | null
  isLocked: boolean
  sessionId: string | null
  expiresAt: number | null
}

const readJSONResponse = async <T,>(response: Response): Promise<T | null> => {
  const text = await response.text()

  if (!text) {
    return null
  }

  return JSON.parse(text) as T
}

const isExistingAccountErrorMessage = (message: string) =>
  /(already|exists|registered|duplicate|taken|invalid: email|email.*invalid)/i.test(message)

const calculateVoucherPreviewDiscount = (
  voucher: EligibleVoucher | null,
  subtotal: number,
  currencyCode: string,
) => {
  if (!voucher) return 0

  if (voucher.discountType === 'percentage' && voucher.amount >= 100) {
    const finalUnitPrice = currencyCode === 'IDR' ? 1000 : 0
    return Math.max(subtotal - finalUnitPrice, 0)
  }

  if (voucher.discountType === 'percentage') {
    return Math.min(Math.round((subtotal * voucher.amount) / 100), subtotal)
  }

  return Math.min(voucher.amount, subtotal)
}

const getVoucherPreviewSubtotal = (
  voucher: EligibleVoucher | null,
  items: any[],
  currencyCode: string,
  subtotal: number,
) => {
  if (!voucher) return subtotal
  const appliesToSpecificProducts = voucher.appliesTo === 'specific' && Boolean(voucher.products?.length)
  const isEligibleItem = (item: any) => {
    if (!appliesToSpecificProducts) return true

    const productId = typeof item.product === 'object' ? item.product?.id : item.product
    return Boolean(productId && voucher.products?.includes(Number(productId)))
  }

  const eligibleItemsSubtotal = items.reduce((total, item) => {
    if (!isEligibleItem(item)) return total

    return total + getCartItemUnitPrice(item, currencyCode) * (item.quantity ?? 0)
  }, 0)

  if (voucher.discountType === 'percentage' && voucher.amount > 85) {
    return items.reduce((highestUnitPrice, item) => {
      if (!isEligibleItem(item)) return highestUnitPrice
      if ((item.quantity ?? 0) <= 0) return highestUnitPrice

      return Math.max(highestUnitPrice, getCartItemUnitPrice(item, currencyCode))
    }, 0)
  }

  return eligibleItemsSubtotal
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const CheckoutPage: React.FC<Props> = ({ initialEligibleVouchers }) => {
  const { setUser, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart, clearCart, decrementItem, removeItem } = useCart()
  const { currency } = useCurrency()
  const [error, setError] = useState<null | string>(null)
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false)
  const [paymentData, setPaymentData] = useState<null | PaymentData>(null)
  const { initiatePayment } = usePayments()
  const [isProcessingPayment, setProcessingPayment] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('')
  const [voucherAppliedPulse, setVoucherAppliedPulse] = useState(false)
  const [pakasirFee, setPakasirFee] = useState<number | null>(null)
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionState>({
    cartId: null,
    isLocked: false,
    sessionId: null,
    expiresAt: null,
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  // Inline auth state
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  // WhatsApp verification state
  const [waVerified, setWaVerified] = useState(false)
  const [waVerifying, setWaVerifying] = useState(false)
  const [waVerifyError, setWaVerifyError] = useState<string | null>(null)
  // Vouchers state for post-auth fetch
  const [dynamicVouchers, setDynamicVouchers] = useState<EligibleVoucher[] | null>(null)
  const buyNowItem = useMemo(() => getBuyNowItemFromSearchParams(searchParams), [searchParams])
  const cartItems = useMemo(() => cart?.items || [], [cart?.items])
  const checkoutItems = useMemo(
    () => buildBuyNowCartItems(cartItems, buyNowItem),
    [buyNowItem, cartItems],
  )
  const checkoutSubtotal = useMemo(
    () => calculateCartItemsSubtotal(checkoutItems, currency.code),
    [checkoutItems, currency.code],
  )

  const baseVouchers = dynamicVouchers ?? initialEligibleVouchers
  const eligibleVouchers = useMemo(
    () =>
      baseVouchers.filter((voucher) => {
        if (checkoutSubtotal < voucher.minimumSpend) return false

        if (voucher.appliesTo === 'specific' && Array.isArray(voucher.products) && voucher.products.length > 0) {
          if (checkoutItems.length === 0) return false

          const hasEligibleProduct = checkoutItems.some((item) => {
            const productId = typeof item.product === 'object' ? item.product?.id : item.product
            return productId && voucher.products?.includes(Number(productId))
          })

          if (!hasEligibleProduct) return false
        }

        return true
      }),
    [checkoutItems, checkoutSubtotal, baseVouchers],
  )
  const selectedVoucher = useMemo(
    () => eligibleVouchers.find((voucher) => voucher.code === selectedVoucherCode) || null,
    [eligibleVouchers, selectedVoucherCode],
  )
  const voucherApplicableSubtotal = useMemo(
    () => getVoucherPreviewSubtotal(selectedVoucher, checkoutItems, currency.code, checkoutSubtotal),
    [checkoutItems, checkoutSubtotal, currency.code, selectedVoucher],
  )
  const previewDiscountAmount = useMemo(
    () => calculateVoucherPreviewDiscount(selectedVoucher, voucherApplicableSubtotal, currency.code),
    [currency.code, selectedVoucher, voucherApplicableSubtotal],
  )
  const previewTotalAmount = Math.max(checkoutSubtotal - previewDiscountAmount, 0)

  const normalizedProfilePhone = (user?.phone || '').trim()
  const normalizedWhatsAppNumber = whatsAppNumber.trim()
  const cleanedWhatsAppNumber = normalizedWhatsAppNumber.replace(/\D/g, '')
  const hasValidWhatsAppNumber =
    cleanedWhatsAppNumber.length >= 10 && cleanedWhatsAppNumber.length <= 15

  useEffect(() => {
    if (!whatsAppNumber && normalizedProfilePhone) {
      setWhatsAppNumber(normalizedProfilePhone)
    }
  }, [normalizedProfilePhone, whatsAppNumber])

  useEffect(() => {
    if (
      selectedVoucherCode &&
      !eligibleVouchers.some((voucher) => voucher.code === selectedVoucherCode)
    ) {
      setSelectedVoucherCode('')
    }
  }, [eligibleVouchers, selectedVoucherCode])

  const handleVoucherChange = useCallback((voucherCode: string) => {
    setSelectedVoucherCode(voucherCode)

    if (voucherCode) {
      setVoucherAppliedPulse(true)
      toast.success('Voucher berhasil digunakan. Total checkout sudah dikurangi.')
      window.setTimeout(() => setVoucherAppliedPulse(false), 1200)
    }
  }, [])

  // The server owns checkout state; localStorage is only a UI cache.
  useEffect(() => {
    let active = true
    void fetch('/api/checkout/session', { cache: 'no-store', credentials: 'include' })
      .then((response) => readJSONResponse<{ session?: any }>(response))
      .then((result) => {
        const session = result?.session
        if (!active || !session) {
          localStorage.removeItem('checkout_session')
          return
        }
        setCheckoutSession({
          cartId: session.cartId ? String(session.cartId) : null,
          isLocked: true,
          sessionId: session.sessionId,
          expiresAt: session.expiresAt,
        })
        setReservationId(session.reservationId)
        setPaymentData(session.paymentData)
        setCountdown(Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 1000)))
        localStorage.setItem('checkout_session', JSON.stringify(session))
        toast.info('Pembayaranmu masih aktif. Yuk lanjutkan sebelum stok dilepas.')
      })
      .catch(() => toast.error('Status pembayaran belum dapat diperiksa. Coba muat ulang halaman.'))
    return () => {
      active = false
    }
  }, [])

  const customerEmail = user?.email || ''
  const reservationItems = useMemo(
    () =>
      checkoutItems
        .filter((item) => typeof item.product === 'object' && item.product)
        .map((item) => ({
          productId: (item.product as { id: string | number }).id,
          quantity: item.quantity ?? 1,
          variantId:
            item.variant && typeof item.variant === 'object'
              ? (item.variant as { id: string | number }).id
              : undefined,
        })),
    [checkoutItems],
  )
  const reservationBaseId = cart?.id ? String(cart.id) : null
  const reservationCartSecret =
    cart && 'secret' in cart && typeof cart.secret === 'string' ? cart.secret : null
  const checkoutContactAddress: Partial<Address> | undefined = whatsAppNumber
    ? ({
        firstName: user?.name || 'Customer',
        phone: whatsAppNumber,
        addressLine1: 'WhatsApp checkout',
        city: 'Online',
        postalCode: '-',
        country: 'ID',
      } as unknown as Partial<Address>)
    : undefined

  const releaseReservation = useCallback(async (sessionId: string) => {
    const response = await fetch('/api/checkout/session', {
      body: JSON.stringify({ sessionId }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    })
    if (!response.ok && response.status !== 409) throw new Error('Gagal membatalkan pembayaran.')
  }, [])

  const resetCheckoutState = useCallback(() => {
    setCountdown(null)
    setReservationId(null)
    setPaymentData(null)
    setCheckoutSession({
      cartId: null,
      isLocked: false,
      sessionId: null,
      expiresAt: null,
    })

    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkout_session')
    }
  }, [])

  const clearInvalidCart = useCallback(async () => {
    resetCheckoutState()
    await clearCart()
  }, [clearCart, resetCheckoutState])

  const handleReservationExpired = useCallback(() => {
    if (checkoutSession.sessionId) void releaseReservation(checkoutSession.sessionId)
    resetCheckoutState()
    toast.error('Waktu pembayaran habis. Stok sudah dilepas, silakan checkout kembali.')
  }, [checkoutSession.sessionId, releaseReservation, resetCheckoutState])

  const handleCancelPayment = useCallback(async () => {
    if (checkoutSession.sessionId) await releaseReservation(checkoutSession.sessionId)
    resetCheckoutState()
    toast.success('Pembayaran dibatalkan. Stok sudah kembali tersedia.')
  }, [checkoutSession.sessionId, releaseReservation, resetCheckoutState])

  useEffect(() => {
    if (!checkoutSession.expiresAt) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((checkoutSession.expiresAt! - Date.now()) / 1000))
      setCountdown(remaining)
      if (remaining === 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [checkoutSession.expiresAt])

  useEffect(() => {
    if (countdown === 0) {
      handleReservationExpired()
    }
  }, [countdown, handleReservationExpired])

  const cartIsEmpty = checkoutItems.length === 0
  const canGoToPayment = Boolean(user?.email && hasValidWhatsAppNumber)
  const activeCurrencyCode = currency.code === 'USD' ? 'USD' : 'IDR'
  const activePaymentMethod = activeCurrencyCode === 'USD' ? 'nowpayments' : 'pakasir'

  const persistWhatsAppToProfile = useCallback(async () => {
    if (!user || !normalizedWhatsAppNumber || normalizedWhatsAppNumber === normalizedProfilePhone) {
      return
    }

    setIsSavingWhatsApp(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        body: JSON.stringify({
          phone: normalizedWhatsAppNumber,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan nomor WhatsApp ke profil.')
      }

      const json = await response.json()
      setUser(json.doc)
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Gagal menyimpan nomor WhatsApp ke profil.'

      toast.error(message)
    } finally {
      setIsSavingWhatsApp(false)
    }
  }, [normalizedProfilePhone, normalizedWhatsAppNumber, setUser, user])

  // Inline auth: smart login/register
  const { login } = useAuth()
  const refreshEligibleVouchers = useCallback(async () => {
    try {
      const voucherRes = await fetch('/api/vouchers/eligible', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (voucherRes.ok) {
        const voucherData = await voucherRes.json()
        setDynamicVouchers(voucherData.vouchers || [])
      }
    } catch {
      // Voucher fetch failure is non-critical for checkout auth.
    }
  }, [])

  const handleInlineAuth = useCallback(async () => {
    if (!authEmail || !authPassword) {
      setAuthError('Email dan password wajib diisi.')
      return
    }

    setAuthLoading(true)
    setAuthError(null)

    try {
      // Try login first
      await login({ email: authEmail, password: authPassword })
      toast.success('Berhasil masuk!')

      await refreshEligibleVouchers()

      router.refresh()
    } catch (loginError) {
      // Login failed — try creating account via Payload REST API
      try {
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authEmail,
            password: authPassword,
            passwordConfirm: authPassword,
          }),
        })

        if (!createRes.ok) {
          const errData = await createRes.json().catch(() => ({}))
          const errMsg =
            errData?.errors?.[0]?.message ||
            errData?.message ||
            'Gagal mendaftar. Pastikan email valid dan password minimal 6 karakter.'
          throw new Error(errMsg)
        }

        // Account created, now login
        window.sessionStorage.setItem('welcome-voucher-pending', '1')
        await login({ email: authEmail, password: authPassword })
        await refreshEligibleVouchers()
        toast.success('Akun berhasil dibuat! Selamat datang, member Bronze 🥉')
        router.refresh()
      } catch (regErr) {
        const registrationMessage =
          regErr instanceof Error
            ? regErr.message
            : 'Gagal masuk atau mendaftar. Pastikan email valid dan password minimal 6 karakter.'
        const loginMessage = loginError instanceof Error ? loginError.message : ''

        setAuthError(
          isExistingAccountErrorMessage(registrationMessage)
            ? 'Email sudah terdaftar. Jika akun ini dibuat lewat Google, lanjutkan dengan Google. Jika bukan, cek lagi password Anda atau gunakan Lupa Password.'
            : loginMessage || registrationMessage,
        )
      }
    } finally {
      setAuthLoading(false)
    }
  }, [authEmail, authPassword, login, refreshEligibleVouchers, router])

  // WhatsApp verification
  const handleVerifyWhatsApp = useCallback(async () => {
    const cleaned = whatsAppNumber.replace(/\D/g, '')
    if (cleaned.length < 10) {
      setWaVerifyError('Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx.')
      return
    }

    setWaVerifying(true)
    setWaVerifyError(null)

    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: whatsAppNumber }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setWaVerified(true)
        toast.success('Nomor WhatsApp terverifikasi! ✅')
        // Also persist to profile
        void persistWhatsAppToProfile()
      } else {
        setWaVerifyError(
          data.error || 'Nomor WhatsApp tidak valid atau tidak terdaftar di WhatsApp.',
        )
      }
    } catch {
      setWaVerifyError('Gagal memverifikasi nomor. Coba lagi nanti.')
    } finally {
      setWaVerifying(false)
    }
  }, [whatsAppNumber, persistWhatsAppToProfile])

  // Reset WA verification when number changes
  useEffect(() => {
    setWaVerified(false)
    setWaVerifyError(null)
  }, [whatsAppNumber])

  const restoreBuyNowCartState = useCallback(async () => {
    if (!buyNowItem) return

    const matchingCartItem = cart?.items?.find((item) =>
      matchesBuyNowItem(item as never, buyNowItem),
    )

    if (!matchingCartItem || !('id' in matchingCartItem) || !matchingCartItem.id) return

    const currentQuantity = matchingCartItem.quantity ?? 0
    const previousQuantity = buyNowItem.previousQuantity ?? 0
    const delta = currentQuantity - previousQuantity

    if (delta <= 0) return

    if (previousQuantity <= 0) {
      await removeItem(String(matchingCartItem.id))
      return
    }

    for (let i = 0; i < delta; i += 1) {
      await decrementItem(String(matchingCartItem.id))
    }
  }, [buyNowItem, cart?.items, decrementItem, removeItem])

  const handleOrderConfirmed = useCallback(
    async (orderId: string) => {
      if (checkoutSession.sessionId) {
        const response = await fetch('/api/checkout/session', {
          body: JSON.stringify({ orderId, sessionId: checkoutSession.sessionId }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
        })
        if (!response.ok && response.status !== 409) {
          throw new Error('Order berhasil, tetapi sesi checkout belum dapat ditutup.')
        }
      }
      // Clear checkout session after order confirmed
      setCheckoutSession({
        cartId: null,
        isLocked: false,
        sessionId: null,
        expiresAt: null,
      })

      if (typeof window !== 'undefined') {
        localStorage.removeItem('checkout_session')
      }

      if (buyNowItem) {
        await restoreBuyNowCartState()
        return
      }

      await clearCart()
    },
    [buyNowItem, checkoutSession.sessionId, clearCart, restoreBuyNowCartState],
  )

  const initiatePaymentIntent = useCallback(async () => {
    let claimedSessionID: string | null = null
    let paymentCreated = false
    try {
      void persistWhatsAppToProfile()

      const sessionResponse = await fetch('/api/checkout/session', {
        body: JSON.stringify({
          cartId: reservationBaseId,
          cartSecret: reservationCartSecret,
          currency: activeCurrencyCode,
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const sessionResult = await readJSONResponse<{ error?: string; session?: any }>(sessionResponse)
      if (!sessionResponse.ok) {
        const sessionError = sessionResult?.error || 'Tidak dapat membuat sesi checkout.'

        if (
          sessionError === 'Keranjang checkout tidak valid.' ||
          sessionError === 'Keranjang tidak ditemukan. Muat ulang halaman lalu coba checkout lagi.'
        ) {
          await clearInvalidCart()
          throw new Error('Keranjang sudah tidak valid dan telah dikosongkan. Silakan pilih produk lagi.')
        }

        if (sessionResult?.session) {
          const existing = sessionResult.session
          setCheckoutSession({
            cartId: existing.cartId ? String(existing.cartId) : null,
            isLocked: true,
            sessionId: existing.sessionId,
            expiresAt: existing.expiresAt,
          })
          setReservationId(existing.reservationId)
          setPaymentData(existing.paymentData)
          setCountdown(Math.max(0, Math.ceil((existing.expiresAt - Date.now()) / 1000)))
        }
        throw new Error(sessionError)
      }

      const activeSession = sessionResult?.session
      if (!activeSession) {
        throw new Error('Sesi checkout tidak valid.')
      }
      claimedSessionID = activeSession.sessionId
      setCheckoutSession({
        cartId: activeSession.cartId ? String(activeSession.cartId) : null,
        expiresAt: activeSession.expiresAt,
        isLocked: true,
        sessionId: activeSession.sessionId,
      })
      setReservationId(activeSession.sessionId)
      setCountdown(Math.max(0, Math.ceil((activeSession.expiresAt - Date.now()) / 1000)))

      const sessionCartId = activeSession.cartId ? String(activeSession.cartId) : reservationBaseId

      if (sessionCartId && reservationItems.length > 0) {
        const reserveRes = await fetch('/api/stock/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: sessionCartId,
            cartSecret: reservationCartSecret,
            items: reservationItems,
            reservationId: activeSession.sessionId,
          }),
        })

        if (!reserveRes.ok) {
          const resData = (await readJSONResponse<{ error?: string }>(reserveRes)) || {}
          const msg = resData?.error ?? 'Stok tidak tersedia untuk beberapa item.'
          setError(msg)
          toast.error(msg)
          await releaseReservation(activeSession.sessionId)
          return
        }

        const resData = await readJSONResponse<{ reservationId?: string }>(reserveRes)
        const newReservationId = resData?.reservationId as string | undefined

        if (newReservationId) {
          setReservationId(newReservationId)
        }
      }

      const nextPaymentData = (await initiatePayment(activePaymentMethod, {
        additionalData: {
          ...(buyNowItem ? { buyNowItem } : {}),
          checkoutSessionId: activeSession.sessionId,
          ...(customerEmail ? { customerEmail } : {}),
          billingAddress: checkoutContactAddress,
          currency: activeCurrencyCode,
          shippingAddress: checkoutContactAddress,
          ...(selectedVoucherCode ? { voucherCode: selectedVoucherCode } : {}),
        },
      })) as PaymentData
      paymentCreated = Boolean(nextPaymentData)

      if (nextPaymentData) {
        const paymentDataWithMethod: PaymentData = {
          ...nextPaymentData,
          paymentMethod: activePaymentMethod as 'nowpayments' | 'pakasir',
        }

        setPaymentData(paymentDataWithMethod)

        const checkoutSessionData = {
          cartId: sessionCartId,
          sessionId: activeSession.sessionId,
          reservationId: activeSession.sessionId,
          expiresAt: activeSession.expiresAt,
          paymentData: paymentDataWithMethod,
          currency: activeCurrencyCode,
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('checkout_session', JSON.stringify(checkoutSessionData))
        }

        const saveResponse = await fetch('/api/checkout/session', {
          body: JSON.stringify({
            paymentData: paymentDataWithMethod,
            sessionId: activeSession.sessionId,
          }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
        })
        if (!saveResponse.ok) {
          throw new Error('Pembayaran dibuat tetapi sesi gagal disimpan. Hubungi support.')
        }

        setCheckoutSession({
          cartId: sessionCartId,
          isLocked: true,
          sessionId: activeSession.sessionId,
          expiresAt: activeSession.expiresAt,
        })

        toast.success('Pembayaran siap. Selesaikan sekarang sebelum stok dilepas.')
      }
    } catch (paymentError) {
      if (claimedSessionID && !paymentCreated) {
        await releaseReservation(claimedSessionID).catch(() => undefined)
      }
      const errorMessage =
        paymentError instanceof Error
          ? paymentError.message
          : 'An error occurred while initiating payment.'

      setError(errorMessage)
      toast.error(errorMessage)
    }
  }, [
    buyNowItem,
    checkoutContactAddress,
    customerEmail,
    activeCurrencyCode,
    initiatePayment,
    activePaymentMethod,
    persistWhatsAppToProfile,
    reservationBaseId,
    reservationCartSecret,
    reservationItems,
    releaseReservation,
    clearInvalidCart,
    resetCheckoutState,
    selectedVoucherCode,
  ])

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Processing your payment...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose dark:prose-invert py-12 w-full items-center">
        <p>Your cart is empty.</p>
        <Link href="/search">Continue shopping?</Link>
      </div>
    )
  }

  return (
    <div className="my-8 flex grow flex-col items-stretch justify-stretch gap-10 md:flex-row md:gap-6 lg:gap-8">
      <div className="flex basis-full flex-col justify-stretch gap-8 lg:basis-2/3">
        <h2 className="text-3xl font-medium">Contact</h2>

        {/* Pending payment session notification */}
        {checkoutSession.isLocked && countdown !== null && (
          <div
            className={`rounded-2xl border bg-card p-6 shadow-lg ${
              countdown < 120
                ? 'border-red-500/30 bg-white dark:bg-gray-900'
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      countdown < 120
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {countdown < 120 ? 'Waktu hampir habis' : 'Pembayaran aktif'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sedikit lagi, pesananmu segera aman
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Ayo lanjutkan pembayaran sebelum stok habis. Sesi baru hanya bisa dibuat setelah
                  pembayaran ini selesai atau dibatalkan.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-right">
                  <div className="mb-1 text-xs text-muted-foreground">Sisa waktu</div>
                  <div
                    className={`text-2xl font-mono font-bold ${
                      countdown < 120
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {formatCountdown(countdown)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="sm"
                className="flex-1"
                disabled={!paymentData}
                onClick={() => {
                  const paymentSection = document.querySelector('[data-payment-section]')
                  paymentSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {paymentData ? 'Lanjutkan Pembayaran' : 'Menyiapkan Pembayaran...'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => void handleCancelPayment()}
              >
                Batalkan
              </Button>
            </div>
          </div>
        )}

        {user ? (
          <div className="rounded-3xl bg-accent p-5 dark:bg-card">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Bukan kamu?{' '}
                  <Link className="underline" href="/logout">
                    Keluar
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Masuk atau Daftar</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Masukkan email dan password untuk melanjutkan. Akun baru akan otomatis terdaftar.
              </p>
            </div>

            <GoogleSignInButton
              className="w-full"
              label="Masuk dengan Google"
              redirect="/checkout"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            {authError && <Message error={authError} />}

            <div className="space-y-3">
              <FormItem>
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleInlineAuth()}
                  required
                  autoComplete="email"
                />
              </FormItem>
              <FormItem>
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleInlineAuth()}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
              </FormItem>
              <Button
                className="w-full"
                disabled={authLoading || !authEmail || !authPassword}
                onClick={(e) => {
                  e.preventDefault()
                  void handleInlineAuth()
                }}
              >
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk / Daftar'
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-3xl border bg-primary/5 p-5">
          <h2 className="mb-4 text-3xl font-medium">WhatsApp</h2>
          {!user ? (
            <p className="text-sm text-muted-foreground">
              Masuk terlebih dahulu untuk mengisi nomor WhatsApp.
            </p>
          ) : (
            <>
              <FormItem>
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                    type="tel"
                    value={whatsAppNumber}
                    disabled={waVerified}
                    className={waVerified ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : ''}
                  />
                  {waVerified ? (
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 px-3 text-sm font-medium text-emerald-600 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                      Terverifikasi
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={waVerifying || !hasValidWhatsAppNumber}
                      onClick={(e) => {
                        e.preventDefault()
                        void handleVerifyWhatsApp()
                      }}
                      className="shrink-0"
                    >
                      {waVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifikasi...
                        </>
                      ) : (
                        'Cek WA'
                      )}
                    </Button>
                  )}
                </div>
              </FormItem>
              {waVerifyError && (
                <p className="mt-2 text-sm text-destructive">{waVerifyError}</p>
              )}
              {waVerified ? (
                <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                  ✅ Nomor WhatsApp terverifikasi. Pesan konfirmasi sudah dikirim ke nomor kamu.
                </p>
              ) : (
                <p className="mt-3 text-sm text-primary/60">
                  Nomor ini akan dipakai untuk konfirmasi order dan pengiriman produk digital. Verifikasi WhatsApp bersifat opsional.
                </p>
              )}
              {waVerified && (
                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground underline hover:text-primary"
                  onClick={() => {
                    setWaVerified(false)
                    setWaVerifyError(null)
                  }}
                >
                  Ganti nomor WhatsApp
                </button>
              )}
              {isSavingWhatsApp && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Menyimpan nomor WhatsApp ke profil...
                </p>
              )}
            </>
          )}
        </div>

        <div className="rounded-3xl border bg-primary-foreground p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Voucher member</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilih voucher yang tersedia langsung dari akun member Anda.
              </p>
            </div>
            {user && (
              <Button asChild variant="outline">
                <Link href="/account">Buka halaman member</Link>
              </Button>
            )}
          </div>

          {eligibleVouchers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada voucher yang memenuhi syarat untuk subtotal keranjang saat ini.
            </p>
          ) : (
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-2xl border p-4 transition-colors hover:border-primary/40">
                <input
                  checked={selectedVoucherCode === ''}
                  className="h-4 w-4"
                  name="voucher"
                  onChange={() => handleVoucherChange('')}
                  type="radio"
                />
                <div>
                  <p className="font-medium">Tanpa voucher</p>
                  <p className="text-sm text-muted-foreground">Bayar dengan harga normal.</p>
                </div>
              </label>

              {eligibleVouchers.map((voucher) => (
                <label
                  key={voucher.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors hover:border-primary/40 ${
                    selectedVoucherCode === voucher.code ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <input
                    checked={selectedVoucherCode === voucher.code}
                    className="mt-1 h-4 w-4"
                    name="voucher"
                    onChange={() => handleVoucherChange(voucher.code)}
                    type="radio"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{voucher.code}</p>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        {voucher.discountLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{voucher.benefitSummary}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Min. belanja {voucher.minimumSpend.toLocaleString('id-ID')} | limit akun{' '}
                      {voucher.perUserLimit}x
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {!paymentData && (
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4"
                required
              />
              <div className="text-sm">
                <span>Saya menyetujui </span>
                <Link href="/terms-and-conditions" className="underline text-primary hover:text-primary/80">
                  Syarat & Ketentuan
                </Link>
                <span>. Segala bentuk pembelian dan uang yang sudah dibayar tidak dapat dikembalikan.</span>
              </div>
            </label>
            <Button
              className="self-start"
              disabled={!canGoToPayment || checkoutSession.isLocked || !termsAccepted}
              onClick={(e) => {
                e.preventDefault()
                void initiatePaymentIntent()
              }}
            >
              Lanjut ke pembayaran
            </Button>
          </div>
        )}

        {!paymentData && checkoutSession.isLocked && (
          <div className="rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Kamu masih memiliki pembayaran aktif. Selesaikan atau batalkan pembayaran tersebut
              sebelum membuat checkout baru.
            </p>
          </div>
        )}

        {!paymentData && error && (
          <div className="my-8">
            <Message error={error} />
            <Button
              onClick={(e) => {
                e.preventDefault()
                router.refresh()
              }}
              variant="default"
            >
              Try again
            </Button>
          </div>
        )}

        {paymentData && (
          <div className="pb-16" data-payment-section>
            <h2 className="text-3xl font-medium">Payment</h2>
            {error && <p>{`Error: ${error}`}</p>}
            <div className="mt-6 flex flex-col gap-8">
              {countdown !== null && (
                <div
                  className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-sm font-semibold ${countdown < 60 ? 'border-destructive/20 bg-destructive/10 text-destructive' : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}
                >
                  Stok dipesan: {formatCountdown(countdown)}
                </div>
              )}

              <div className="rounded-3xl border bg-card p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <Price amount={paymentData.subtotal} currencyCode={activeCurrencyCode} />
                  </div>
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Potongan voucher</span>
                    <Price amount={paymentData.discountAmount} currencyCode={activeCurrencyCode} />
                  </div>
                    {paymentData.paymentMethod === 'pakasir' && pakasirFee !== null && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Biaya admin</span>
                        <Price amount={pakasirFee} currencyCode={activeCurrencyCode} />
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                      <span>Total bayar</span>
                      <Price
                        amount={
                          paymentData.paymentMethod === 'pakasir' && pakasirFee !== null
                            ? paymentData.amount + pakasirFee
                            : paymentData.amount
                        }
                        currencyCode={activeCurrencyCode}
                      />
                    </div>
                  </div>
                </div>

              <CheckoutForm
                amount={paymentData.amount}
                billingAddress={checkoutContactAddress}
                buyNowItem={buyNowItem}
                cartID={checkoutSession.cartId || reservationBaseId}
                checkoutSessionId={checkoutSession.sessionId}
                customerEmail={customerEmail}
                customerName={user?.name || user?.email || 'Customer'}
                customerPhone={normalizedWhatsAppNumber}
                isPakasir={paymentData.paymentMethod === 'pakasir'}
                isNowPayments={paymentData.paymentMethod === 'nowpayments'}
                nowpaymentsPayAddress={paymentData.nowpaymentsPayAddress}
                nowpaymentsPayAmount={paymentData.nowpaymentsPayAmount}
                nowpaymentsPayCurrency={paymentData.nowpaymentsPayCurrency}
                nowpaymentsPaymentID={paymentData.nowpaymentsPaymentID}
                onOrderConfirmed={handleOrderConfirmed}
                onFeeKnown={(fee) => setPakasirFee(fee)}
                orderID={paymentData.orderID}
                selectedVoucherCode={paymentData.voucherCode || selectedVoucherCode}
                setProcessingPayment={setProcessingPayment}
                shippingAddress={checkoutContactAddress}
              />

              <Button
                variant="ghost"
                className="self-start"
                onClick={() => void handleCancelPayment()}
              >
                Cancel payment
              </Button>
            </div>
          </div>
        )}
      </div>

      {!cartIsEmpty && (
        <div className="flex basis-full flex-col gap-8 rounded-3xl border-none bg-primary/5 p-8 lg:basis-1/3 lg:pl-8">
          <h2 className="text-3xl font-medium">Your cart</h2>
          {checkoutItems.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { meta, title, gallery },
                quantity,
                variant,
              } = item

              if (!quantity) return null

              let image = gallery?.[0]?.image || meta?.image
              let price = product?.priceInUSD
              let priceInIDR = product?.priceInIDR

              const isVariant = Boolean(variant) && typeof variant === 'object'

              if (isVariant) {
                price = variant?.priceInUSD
                priceInIDR = variant?.priceInIDR ?? priceInIDR

                const imageVariant = product.gallery?.find(
                  (galleryItem: {
                    image?: unknown
                    variantOption?: null | string | { id: string }
                  }) => {
                    if (!galleryItem.variantOption) return false

                    const variantOptionID =
                      typeof galleryItem.variantOption === 'object'
                        ? galleryItem.variantOption.id
                        : galleryItem.variantOption

                    return (
                      variant?.options?.some((option: string | { id: string; label?: string }) =>
                        typeof option === 'object'
                          ? option.id === variantOptionID
                          : option === variantOptionID,
                      ) || false
                    )
                  },
                )

                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className="flex h-20 w-20 items-stretch justify-stretch rounded-lg border p-2">
                    <div className="relative h-full w-full">
                      {image && typeof image !== 'string' && (
                        <Media className="" fill imgClassName="rounded-lg" resource={image} />
                      )}
                    </div>
                  </div>

                  <div className="flex grow items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-medium">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="text-sm font-mono tracking-widest text-primary/50">
                          {variant.options
                            ?.map((option: string | { id: string; label?: string }) =>
                              typeof option === 'object' ? option.label : null,
                            )
                            .join(', ')}
                        </p>
                      )}
                      <div>
                        {'x'}
                        {quantity}
                      </div>
                    </div>

                    {(typeof price === 'number' || typeof priceInIDR === 'number') && (
                      <LocalizedPrice
                        as="span"
                        currencyCode={activeCurrencyCode}
                        priceInIDR={priceInIDR}
                        priceInUSD={price}
                      />
                    )}
                  </div>
                </div>
              )
            }

            return null
          })}
          <hr />
          <div
            className={`rounded-2xl border p-4 transition-all duration-300 ${
              voucherAppliedPulse
                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.22)]'
                : 'border-transparent bg-transparent'
            }`}
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2 text-muted-foreground">
                <span>Subtotal</span>
                <Price amount={checkoutSubtotal} currencyCode={activeCurrencyCode} />
              </div>

              {selectedVoucher && (
                <div className="flex items-center justify-between gap-2 text-emerald-500">
                  <span>Potongan voucher</span>
                  <span className="font-semibold">
                    -<Price as="span" amount={previewDiscountAmount} currencyCode={activeCurrencyCode} />
                  </span>
                </div>
              )}

              {selectedVoucher && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  Voucher berhasil digunakan
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-t pt-3">
                <span className="uppercase">Total bayar</span>
                <Price
                  className="text-3xl font-medium"
                  amount={previewTotalAmount}
                  currencyCode={activeCurrencyCode}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
