'use client'

import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import type { BuyNowItem } from '@/lib/buyNow'
import { Address } from '@/payload-types'
import type { AnalyticsItem } from '@/utilities/googleAnalytics'
import { gaPurchase } from '@/utilities/googleAnalytics'
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  billingAddress?: Partial<Address>
  shippingAddress?: Partial<Address>
  setProcessingPayment: React.Dispatch<React.SetStateAction<boolean>>
  isPakasir?: boolean
  isNowPayments?: boolean
  nowpaymentsPayAddress?: string
  nowpaymentsPayAmount?: number
  nowpaymentsPayCurrency?: string
  nowpaymentsPaymentID?: string
  cartID?: string | null
  checkoutSessionId?: string | null
  orderID?: string
  amount?: number
  analyticsItems?: AnalyticsItem[]
  selectedVoucherCode?: string
  buyNowItem?: BuyNowItem | null
  onOrderConfirmed?: (orderID: string) => Promise<void> | void
  onFeeKnown?: (fee: number) => void
}

const PakasirCheckoutForm: React.FC<
  Pick<
    Props,
    | 'amount'
    | 'analyticsItems'
    | 'buyNowItem'
    | 'cartID'
    | 'checkoutSessionId'
    | 'customerEmail'
    | 'customerName'
    | 'customerPhone'
    | 'billingAddress'
    | 'isNowPayments'
    | 'onOrderConfirmed'
    | 'onFeeKnown'
    | 'orderID'
    | 'nowpaymentsPayAddress'
    | 'nowpaymentsPayAmount'
    | 'nowpaymentsPayCurrency'
    | 'nowpaymentsPaymentID'
    | 'selectedVoucherCode'
    | 'setProcessingPayment'
    | 'shippingAddress'
  >
> = ({
  billingAddress,
  cartID,
  checkoutSessionId,
  customerEmail,
  customerName,
  customerPhone,
  isNowPayments,
  nowpaymentsPayAddress,
  nowpaymentsPayAmount,
  nowpaymentsPayCurrency,
  nowpaymentsPaymentID,
  orderID,
  amount,
  analyticsItems,
  selectedVoucherCode,
  setProcessingPayment,
  shippingAddress,
  buyNowItem,
  onOrderConfirmed,
  onFeeKnown,
}) => {
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [expiredAt, setExpiredAt] = useState<string | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'completed' | 'failed'>('idle')
  const [isSimulating, setIsSimulating] = useState(false)
  const [successResult, setSuccessResult] = useState<null | {
    nextURL: string
    orderID: string
    pointsEarned: number
  }>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  usePayments()

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const startPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          isNowPayments
            ? `/api/nowpayments?paymentId=${encodeURIComponent(String(nowpaymentsPaymentID || ''))}`
            : `/api/pakasir?order_id=${orderID}&amount=${amount}`,
        )
        const data = await res.json()
        const txStatus = isNowPayments
          ? String(data?.status || data?.payment_status || '').toLowerCase()
          : data?.transaction?.status

        if (
          (isNowPayments && txStatus === 'paid') ||
          (!isNowPayments && txStatus === 'completed')
        ) {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStatus('completed')
          setProcessingPayment(true)

          try {
            // Use fetch API directly instead of hook
            const confirmResponse = await fetch('/api/payments/pakasir/confirm-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentID: orderID,
                ...(buyNowItem ? { buyNowItem } : {}),
                ...(cartID ? { cartID } : {}),
                ...(checkoutSessionId ? { checkoutSessionId } : {}),
                currency: isNowPayments ? 'USD' : 'IDR',
                ...(customerEmail ? { customerEmail } : {}),
                ...(billingAddress ? { billingAddress } : {}),
                ...(isNowPayments ? { nowpaymentsPaymentID } : {}),
                ...(shippingAddress ? { shippingAddress } : {}),
                ...(selectedVoucherCode ? { voucherCode: selectedVoucherCode } : {}),
              }),
            })

            if (!confirmResponse.ok) {
              throw new Error(`HTTP ${confirmResponse.status}`)
            }

            const result = await confirmResponse.json()
            console.log('[CheckoutForm] confirmOrder result:', result)
            console.log('[CheckoutForm] result has orderID?', 'orderID' in result, result.orderID)

            if (result && typeof result === 'object' && 'orderID' in result && result.orderID) {
              console.log('[CheckoutForm] Setting success popup...')

              if (analyticsItems?.length) {
                gaPurchase({
                  currency: isNowPayments ? 'USD' : 'IDR',
                  transactionID: String(result.orderID),
                  value: amount,
                  voucher: selectedVoucherCode,
                  items: analyticsItems,
                })
              }

              const nextURL = new URL(`/orders/${result.orderID}`, window.location.origin)
              if ('accessToken' in result && result.accessToken) {
                nextURL.searchParams.set('accessToken', String(result.accessToken))
              }
              if (customerEmail) {
                nextURL.searchParams.set('email', customerEmail)
              }

              console.log('[CheckoutForm] Payment confirmed, redirecting to order page...')

              // Stop processing flag immediately
              setProcessingPayment(false)

              // Redirect directly to order page without popup
              const redirectURL = `${nextURL.pathname}${nextURL.search}`
              console.log('[CheckoutForm] Redirecting to:', redirectURL)
              router.push(redirectURL)

              if (onOrderConfirmed) {
                console.log('[CheckoutForm] Calling onOrderConfirmed callback...')
                try {
                  await onOrderConfirmed(String(result.orderID))
                } catch (err) {
                  console.error('[CheckoutForm] onOrderConfirmed error:', err)
                }
              }
            } else {
              console.error('[CheckoutForm] Invalid result - no orderID:', result)
            }
          } catch (err) {
            console.error('[CheckoutForm] confirmOrder error:', err)
            setError('Pembayaran berhasil tapi gagal konfirmasi order. Hubungi support.')
            setStatus('failed')
          }
        }
      } catch {
        // ignore transient polling errors
      }
    }, 3000)
  }, [
    amount,
    analyticsItems,
    buyNowItem,
    checkoutSessionId,
    customerEmail,
    isNowPayments,
    nowpaymentsPaymentID,
    onOrderConfirmed,
    orderID,
    router,
    selectedVoucherCode,
    setProcessingPayment,
  ])

  const handleCreateQris = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/pakasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          order_id: orderID,
          amount,
          customerName,
          phone: customerPhone,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data?.payment?.payment_number) {
        setError(data?.message || data?.error || 'Gagal membuat transaksi QRIS.')
        setIsLoading(false)
        return
      }

      const { payment_number, expired_at, total_payment } = data.payment
      const dataUrl = await QRCode.toDataURL(payment_number, { width: 280, margin: 2 })

      setQrDataUrl(dataUrl)
      setExpiredAt(expired_at)
      setStatus('waiting')
      setTotalPayment(total_payment)
      if (onFeeKnown && typeof total_payment === 'number' && typeof amount === 'number') {
        onFeeKnown(total_payment - amount)
      }
      startPolling()
    } catch {
      setError('Gagal menghubungi server pembayaran.')
    } finally {
      setIsLoading(false)
    }
  }, [amount, customerName, customerPhone, orderID, startPolling])

  useEffect(() => {
    if (!isNowPayments || !nowpaymentsPaymentID || status !== 'idle') return

    setStatus('waiting')
    void QRCode.toDataURL(String(nowpaymentsPayAddress || ''), { width: 280, margin: 2 }).then(
      setQrDataUrl,
    )
    startPolling()
  }, [isNowPayments, nowpaymentsPayAddress, nowpaymentsPaymentID, startPolling, status])

  const handleSimulate = useCallback(async () => {
    setIsSimulating(true)
    setError(null)

    try {
      const res = await fetch('/api/pakasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate', order_id: orderID, amount }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.message || data?.error || 'Simulasi gagal.')
      }
    } catch {
      setError('Gagal menjalankan simulasi pembayaran.')
    } finally {
      setIsSimulating(false)
    }
  }, [amount, orderID])

  // Popup removed - now redirects directly after payment confirmation

  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="text-lg font-semibold uppercase tracking-[0.24em] text-emerald-600">
          Paid
        </div>
        <h3 className="text-xl font-semibold">Pembayaran Berhasil!</h3>
        <p className="text-muted-foreground">Mengalihkan ke halaman pesanan...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Message error={error} />}

      {status === 'idle' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Klik tombol di bawah untuk menampilkan kode QRIS pembayaran.
          </p>
          <Button disabled={isLoading} onClick={handleCreateQris} variant="default">
            {isLoading ? 'Membuat QRIS...' : 'Tampilkan QRIS'}
          </Button>
        </div>
      )}

      {status === 'waiting' && qrDataUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QRIS Payment Code" width={280} height={280} />
          </div>

          <div className="space-y-1 text-center">
            {!isNowPayments && typeof totalPayment === 'number' && typeof amount === 'number' ? (
              <div className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                      style: 'currency',
                    }).format(amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Biaya admin</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                      style: 'currency',
                    }).format(totalPayment - amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 font-semibold text-base">
                  <span>Total bayar</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                      style: 'currency',
                    }).format(totalPayment)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold">
                Total:{' '}
                {isNowPayments
                  ? `${nowpaymentsPayAmount || '-'} ${String(nowpaymentsPayCurrency || 'USDT').toUpperCase()}`
                  : typeof totalPayment === 'number'
                    ? new Intl.NumberFormat('id-ID', {
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                        style: 'currency',
                      }).format(totalPayment)
                    : '-'}
              </p>
            )}
            {isNowPayments && nowpaymentsPayAddress ? (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Wallet Address
                </p>
                <p className="max-w-xs break-all rounded-xl border bg-muted px-3 py-2 text-sm">
                  {nowpaymentsPayAddress}
                </p>
              </div>
            ) : null}
            {!isNowPayments && expiredAt && (
              <p className="text-sm text-muted-foreground">
                Berlaku hingga:{' '}
                {new Date(expiredAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            )}
          </div>

          <div className="flex w-full max-w-xs flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
              Menunggu pembayaran...
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {isNowPayments
                ? 'Kirim USDT BEP20 ke alamat di atas. Status akan terdeteksi otomatis setelah transaksi blockchain masuk.'
                : 'Scan QR di atas dengan aplikasi e-wallet atau mobile banking Anda.'}
            </p>

            {!isNowPayments && process.env.NEXT_PUBLIC_PAKASIR_SANDBOX === 'true' && process.env.NODE_ENV !== 'production' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSimulating}
                onClick={handleSimulate}
                className="mt-2 w-full"
              >
                {isSimulating ? 'Mensimulasikan...' : 'Simulasi Bayar (Sandbox)'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const CheckoutForm: React.FC<Props> = ({
  buyNowItem,
  customerEmail,
  customerName,
  customerPhone,
  billingAddress,
  isNowPayments,
  onOrderConfirmed,
  onFeeKnown,
  nowpaymentsPayAddress,
  nowpaymentsPayAmount,
  nowpaymentsPayCurrency,
  nowpaymentsPaymentID,
  cartID,
  checkoutSessionId,
  setProcessingPayment,
  orderID,
  amount,
  analyticsItems,
  shippingAddress,
  selectedVoucherCode,
}) => {
  return (
    <PakasirCheckoutForm
      buyNowItem={buyNowItem}
      billingAddress={billingAddress}
      cartID={cartID}
      checkoutSessionId={checkoutSessionId}
      customerEmail={customerEmail}
      customerName={customerName}
      customerPhone={customerPhone}
      isNowPayments={isNowPayments}
      onOrderConfirmed={onOrderConfirmed}
      onFeeKnown={onFeeKnown}
      nowpaymentsPayAddress={nowpaymentsPayAddress}
      nowpaymentsPayAmount={nowpaymentsPayAmount}
      nowpaymentsPayCurrency={nowpaymentsPayCurrency}
      nowpaymentsPaymentID={nowpaymentsPaymentID}
      orderID={orderID}
      amount={amount}
      analyticsItems={analyticsItems}
      selectedVoucherCode={selectedVoucherCode}
      setProcessingPayment={setProcessingPayment}
      shippingAddress={shippingAddress}
    />
  )
}
