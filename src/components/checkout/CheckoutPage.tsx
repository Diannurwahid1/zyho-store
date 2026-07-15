'use client'

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
    matchesBuyNowItem,
} from '@/lib/buyNow'
import type { EligibleVoucher } from '@/lib/vouchers'
import { Address } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useCart, useCurrency, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
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
  isLocked: boolean
  sessionId: string | null
  expiresAt: number | null
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
  const [pakasirFee, setPakasirFee] = useState<number | null>(null)
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionState>({
    isLocked: false,
    sessionId: null,
    expiresAt: null,
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
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

  const eligibleVouchers = useMemo(
    () =>
      initialEligibleVouchers.filter((voucher) => {
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
    [checkoutItems, checkoutSubtotal, initialEligibleVouchers],
  )

  const normalizedProfilePhone = (user?.phone || '').trim()
  const normalizedWhatsAppNumber = whatsAppNumber.trim()

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

  // The server owns checkout state; localStorage is only a UI cache.
  useEffect(() => {
    let active = true
    void fetch('/api/checkout/session', { cache: 'no-store', credentials: 'include' })
      .then((response) => response.json())
      .then(({ session }) => {
        if (!active || !session) {
          localStorage.removeItem('checkout_session')
          return
        }
        setCheckoutSession({
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

  const handleReservationExpired = useCallback(() => {
    setCountdown(null)
    if (checkoutSession.sessionId) void releaseReservation(checkoutSession.sessionId)
    setReservationId(null)
    setPaymentData(null)

    // Clear checkout session
    setCheckoutSession({
      isLocked: false,
      sessionId: null,
      expiresAt: null,
    })

    // Clear session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkout_session')
    }

    toast.error('Waktu pembayaran habis. Stok sudah dilepas, silakan checkout kembali.')
  }, [checkoutSession.sessionId, releaseReservation])

  const handleCancelPayment = useCallback(async () => {
    setCountdown(null)
    if (checkoutSession.sessionId) await releaseReservation(checkoutSession.sessionId)
    setReservationId(null)
    setPaymentData(null)

    // Clear checkout session
    setCheckoutSession({
      isLocked: false,
      sessionId: null,
      expiresAt: null,
    })

    // Clear session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkout_session')
    }

    toast.success('Pembayaran dibatalkan. Stok sudah kembali tersedia.')
  }, [checkoutSession.sessionId, releaseReservation])

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
  const canGoToPayment = Boolean(user?.email && whatsAppNumber)
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
      const sessionResult = await sessionResponse.json()
      if (!sessionResponse.ok) {
        if (sessionResult?.session) {
          const existing = sessionResult.session
          setCheckoutSession({
            isLocked: true,
            sessionId: existing.sessionId,
            expiresAt: existing.expiresAt,
          })
          setReservationId(existing.reservationId)
          setPaymentData(existing.paymentData)
          setCountdown(Math.max(0, Math.ceil((existing.expiresAt - Date.now()) / 1000)))
        }
        throw new Error(sessionResult?.error || 'Tidak dapat membuat sesi checkout.')
      }

      const activeSession = sessionResult.session
      claimedSessionID = activeSession.sessionId
      setCheckoutSession({
        expiresAt: activeSession.expiresAt,
        isLocked: true,
        sessionId: activeSession.sessionId,
      })
      setReservationId(activeSession.sessionId)
      setCountdown(Math.max(0, Math.ceil((activeSession.expiresAt - Date.now()) / 1000)))

      if (reservationBaseId && reservationItems.length > 0) {
        const reserveRes = await fetch('/api/stock/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: reservationBaseId,
            cartSecret: reservationCartSecret,
            items: reservationItems,
            reservationId: activeSession.sessionId,
          }),
        })

        if (!reserveRes.ok) {
          const resData = await reserveRes.json().catch(() => ({}))
          const msg = resData?.error ?? 'Stok tidak tersedia untuk beberapa item.'
          setError(msg)
          toast.error(msg)
          await releaseReservation(activeSession.sessionId)
          return
        }

        const resData = await reserveRes.json()
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
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Not you?{' '}
                <Link className="underline" href="/logout">
                  Log out
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-primary/70">
            Checkout memerlukan login customer.
          </div>
        )}

        <div className="rounded-3xl border bg-primary/5 p-5">
          <h2 className="mb-4 text-3xl font-medium">WhatsApp</h2>
          <FormItem>
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              onBlur={() => {
                void persistWhatsAppToProfile()
              }}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
              type="tel"
              value={whatsAppNumber}
            />
          </FormItem>
          <p className="mt-3 text-sm text-primary/60">
            Nomor ini dipakai untuk konfirmasi order dan tindak lanjut checkout.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Nomor ini akan tersimpan ke profil Anda dan tetap bisa diedit kapan saja.
          </p>
          {isSavingWhatsApp && (
            <p className="mt-2 text-xs text-muted-foreground">
              Menyimpan nomor WhatsApp ke profil...
            </p>
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
                  onChange={() => setSelectedVoucherCode('')}
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
                    onChange={() => setSelectedVoucherCode(voucher.code)}
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
                cartID={reservationBaseId}
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
          <div className="flex items-center justify-between gap-2">
            <span className="uppercase">Total</span>
            <Price
              className="text-3xl font-medium"
              amount={checkoutSubtotal}
              currencyCode={activeCurrencyCode}
            />
          </div>
        </div>
      )}
    </div>
  )
}
