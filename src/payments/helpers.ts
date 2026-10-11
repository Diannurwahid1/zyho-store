import {
    buildBuyNowCartItems,
    calculateCartItemsSubtotal,
    getBuyNowItemFromRawData,
    getCartItemUnitPrice,
} from '@/lib/buyNow'
import { assertOwnedActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import { expandBundleCartItems, getBundleReservationEntries } from '@/lib/bundles'
import { assignDigitalStockToOrder } from '@/lib/digitalStock'
import { confirmStockReservation } from '@/lib/stock'
import {
    calculateVoucherDiscount,
    getVoucherByCodeForUser,
    normalizeCouponCode,
} from '@/lib/vouchers'
import type { Address, Coupon } from '@/payload-types'
import { assertCurrencyEnabled } from '@/utilities/currencySettings'
import { withPayloadTransaction } from '@/utilities/payloadTransaction'
import type { PaymentAttemptSnapshot } from '@/payments/paymentAttempts'
import { createHash } from 'crypto'
import type { CollectionSlug, PayloadRequest } from 'payload'

export type PreparedPaymentContext = {
  amount: number
  billingAddress?: Partial<Address>
  buyNowItem: ReturnType<typeof getBuyNowItemFromRawData>
  cartItems: any[]
  cartID?: number | string
  checkoutSessionID: string
  currencyCode: 'IDR' | 'USD'
  customerEmail: string
  customerID?: number | string | null
  discountAmount: number
  eligibleVoucher: Awaited<ReturnType<typeof getVoucherByCodeForUser>>
  paymentReference: string
  shippingAddress?: Partial<Address>
  subtotalBeforeDiscount: number
  voucherCode: string | null
}

export const findFinalizedPayment = async ({
  field,
  paymentReference,
  req,
  transactionsSlug,
}: {
  field: string
  paymentReference: string
  req: PayloadRequest
  transactionsSlug: CollectionSlug
}) => {
  if (!paymentReference || !req.user?.id) return null
  const existing = await req.payload.find({
    collection: transactionsSlug as any,
    depth: 1,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      and: [
        { [field]: { equals: paymentReference } },
        { status: { equals: 'succeeded' } },
        { customer: { equals: req.user.id } },
      ],
    } as any,
  })
  const transaction = existing.docs[0] as any
  if (!transaction?.order) return null
  const order =
    typeof transaction.order === 'object'
      ? transaction.order
      : await req.payload.findByID({
          collection: 'orders',
          id: transaction.order,
          depth: 0,
          overrideAccess: true,
          req,
         })
  const orderCustomerID = relationID(order?.customer)
  if (!orderCustomerID || String(orderCustomerID) !== String(req.user.id)) return null
  return {
    orderID: order.id,
    pointsEarned: order.pointsEarned || 0,
    transactionID: transaction.id,
  }
}

const getExtendedPaymentData = (
  data: Record<string, any>,
  req: PayloadRequest,
): Record<string, any> => {
  const requestData =
    (req as PayloadRequest & { data?: Record<string, any> }).data &&
    typeof (req as any).data === 'object'
      ? ((req as PayloadRequest & { data?: Record<string, any> }).data as Record<string, any>)
      : {}

  return {
    ...requestData,
    ...data,
  }
}

const resolveCustomerID = async ({
  customerEmail,
  req,
}: {
  customerEmail: string
  req: PayloadRequest
}): Promise<number | string | null> => {
  if (req.user?.id) {
    return req.user.id
  }

  if (!customerEmail) {
    return null
  }

  const foundUsers = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      email: {
        equals: customerEmail.toLowerCase(),
      },
    },
  })

  return foundUsers.docs[0]?.id ?? null
}

export const getTrustedConfirmationData = ({
  attempt,
  rawData,
}: {
  attempt: Record<string, any>
  rawData: Record<string, any>
}) => {
  const snapshot = attempt.snapshot as PaymentAttemptSnapshot | null
  if (!snapshot?.cartFingerprint) {
    throw new Error('Snapshot payment attempt tidak valid.')
  }

  return {
    billingAddress: rawData.billingAddress,
    buyNowItem: snapshot.buyNowItem || undefined,
    checkoutSessionId: rawData.checkoutSessionId,
    paymentIntentID: attempt.providerOrderId,
    paymentReference: attempt.providerOrderId,
    shippingAddress: rawData.shippingAddress,
    voucherCode: snapshot.voucherCode || undefined,
  }
}

export const assertPaymentAttemptMatchesContext = ({
  attempt,
  context,
}: {
  attempt: Record<string, any>
  context: PreparedPaymentContext
}) => {
  const snapshot = attempt.snapshot as PaymentAttemptSnapshot | null
  if (!snapshot) throw new Error('Snapshot payment attempt tidak ditemukan.')

  const currentSnapshot = buildPaymentSnapshot({
    buyNowItem: context.buyNowItem,
    cartItems: context.cartItems,
    currencyCode: context.currencyCode,
    discountAmount: context.discountAmount,
    subtotal: context.subtotalBeforeDiscount,
    voucherCode: context.eligibleVoucher?.code || null,
  })
  const matches =
    String(attempt.cartId) === String(context.cartID) &&
    attempt.currency === context.currencyCode &&
    Number(attempt.expectedAmount) === context.amount &&
    Number(snapshot.subtotal) === context.subtotalBeforeDiscount &&
    Number(snapshot.discountAmount) === context.discountAmount &&
    snapshot.cartFingerprint === currentSnapshot.cartFingerprint

  if (!matches) {
    throw new Error('Detail keranjang berubah setelah pembayaran dibuat. Hubungi support.')
  }
}

const relationID = (value: unknown): string | null => {
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number' || typeof id === 'string') return String(id)
  }
  return null
}

export const buildPaymentSnapshot = ({
  buyNowItem,
  cartItems,
  currencyCode,
  discountAmount,
  subtotal,
  voucherCode,
}: {
  buyNowItem: ReturnType<typeof getBuyNowItemFromRawData>
  cartItems: any[]
  currencyCode: 'IDR' | 'USD'
  discountAmount: number
  subtotal: number
  voucherCode: string | null
}): PaymentAttemptSnapshot => {
  const items = cartItems
    .map((item) => {
      const productId = relationID(item?.product)
      const variantId = relationID(item?.variant)
      const quantity = Number(item?.quantity)
      const unitPrice = getCartItemUnitPrice(item, currencyCode)

      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        throw new Error('Item atau jumlah produk pada keranjang tidak valid.')
      }
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error('Harga produk pada keranjang tidak valid.')
      }

      return { productId, quantity, unitPrice, variantId }
    })
    .sort((left, right) =>
      `${left.productId}:${left.variantId || ''}`.localeCompare(
        `${right.productId}:${right.variantId || ''}`,
      ),
    )

  if (items.length === 0 || items.length > 100) {
    throw new Error('Keranjang pembayaran kosong atau terlalu besar.')
  }

  const normalizedBuyNow = buyNowItem
    ? {
        productId: buyNowItem.productId,
        quantity: buyNowItem.quantity,
        ...(buyNowItem.variantId !== undefined ? { variantId: buyNowItem.variantId } : {}),
      }
    : null
  const fingerprintInput = {
    buyNowItem: normalizedBuyNow,
    currencyCode,
    items,
    voucherCode: voucherCode || null,
  }

  return {
    buyNowItem: normalizedBuyNow,
    cartFingerprint: createHash('sha256').update(JSON.stringify(fingerprintInput)).digest('hex'),
    discountAmount,
    items,
    subtotal,
    voucherCode: voucherCode || null,
  }
}

const getVoucherDiscountBaseSubtotal = ({
  cartItems,
  currencyCode,
  subtotal,
  voucher,
}: {
  cartItems: any[]
  currencyCode: 'IDR' | 'USD'
  subtotal: number
  voucher: Awaited<ReturnType<typeof getVoucherByCodeForUser>>
}) => {
  if (!voucher) return subtotal
  const appliesToSpecificProducts = voucher.appliesTo === 'specific' && Boolean(voucher.products?.length)
  const isEligibleItem = (item: any) => {
    if (!appliesToSpecificProducts) return true

    const productId = typeof item.product === 'object' ? item.product?.id : item.product
    return Boolean(productId && voucher.products?.includes(Number(productId)))
  }

  const eligibleItemsSubtotal = cartItems.reduce((total, item) => {
    if (!isEligibleItem(item)) return total

    return total + getCartItemUnitPrice(item, currencyCode) * (item.quantity ?? 0)
  }, 0)

  if (voucher.discountType === 'percentage' && voucher.amount > 85) {
    return cartItems.reduce((highestUnitPrice, item) => {
      if (!isEligibleItem(item)) return highestUnitPrice
      if ((item.quantity ?? 0) <= 0) return highestUnitPrice

      return Math.max(highestUnitPrice, getCartItemUnitPrice(item, currencyCode))
    }, 0)
  }

  return eligibleItemsSubtotal
}

const calculateScopedVoucherDiscount = ({
  currencyCode,
  subtotal,
  voucher,
}: {
  currencyCode: 'IDR' | 'USD'
  subtotal: number
  voucher: Awaited<ReturnType<typeof getVoucherByCodeForUser>>
}) => {
  if (!voucher) return 0

  if (voucher.discountType === 'percentage' && voucher.amount >= 100) {
    const finalUnitPrice = currencyCode === 'IDR' ? 1000 : 0
    return Math.max(subtotal - finalUnitPrice, 0)
  }

  return calculateVoucherDiscount(voucher, subtotal)
}

export const preparePaymentContext = async ({
  currencyCode,
  data,
  req,
}: {
  currencyCode: 'IDR' | 'USD'
  data: Record<string, any>
  req: PayloadRequest
}): Promise<PreparedPaymentContext> => {
  await assertCurrencyEnabled({ currencyCode, req })

  const rawData = getExtendedPaymentData(data, req)
  const checkoutSessionID = String(rawData?.checkoutSessionId || '')
  const activeCheckoutSession = await assertOwnedActiveCheckoutSession(req, checkoutSessionID)
  const paymentReference: string = rawData?.paymentIntentID ?? rawData?.paymentReference ?? ''
  const customerEmail: string = req.user?.email ?? rawData?.customerEmail ?? ''
  const customerID = await resolveCustomerID({ customerEmail, req })
  const cartID = activeCheckoutSession?.cartId
  const buyNowItem = getBuyNowItemFromRawData(rawData)
  const voucherCode = normalizeCouponCode(rawData?.voucherCode)
  const billingAddress = rawData?.billingAddress
  const shippingAddress = rawData?.shippingAddress

  let amount = 0
  let cartItems: any[] = []
  let discountAmount = 0
  let eligibleVoucher: Awaited<ReturnType<typeof getVoucherByCodeForUser>> = null
  let subtotalBeforeDiscount = 0

  if (cartID) {
    const cart = await req.payload.findByID({
      id: cartID,
      collection: 'carts',
      depth: 2,
      overrideAccess: true,
      req,
    })

    if (cart) {
      const scopedCartItems = buildBuyNowCartItems((cart as any).items ?? [], buyNowItem)
      subtotalBeforeDiscount = calculateCartItemsSubtotal(scopedCartItems, currencyCode)
      amount = subtotalBeforeDiscount
      cartItems = scopedCartItems
    }
  }

  if (voucherCode) {
    eligibleVoucher = await getVoucherByCodeForUser({
      cartItems,
      code: voucherCode,
      payload: req.payload,
      subtotal: subtotalBeforeDiscount,
      user: req.user
        ? {
            id: req.user.id,
            memberTier: req.user.memberTier,
            totalSpentIDR: req.user.totalSpentIDR,
          }
        : null,
    })

    if (!eligibleVoucher) {
      throw new Error('Voucher tidak valid untuk akun member ini.')
    }

    const discountBaseSubtotal = getVoucherDiscountBaseSubtotal({
      cartItems,
      currencyCode,
      subtotal: subtotalBeforeDiscount,
      voucher: eligibleVoucher,
    })
    discountAmount = calculateScopedVoucherDiscount({
      currencyCode,
      subtotal: discountBaseSubtotal,
      voucher: eligibleVoucher,
    })
    amount = Math.max(subtotalBeforeDiscount - discountAmount, 0)
  }

  return {
    amount,
    billingAddress,
    buyNowItem,
    cartID,
    checkoutSessionID,
    cartItems,
    currencyCode,
    customerEmail,
    customerID,
    discountAmount,
    eligibleVoucher,
    paymentReference,
    shippingAddress,
    subtotalBeforeDiscount,
    voucherCode,
  }
}

export const buildInitiatePaymentPayload = async ({
  currencyCode,
  data,
  req,
}: {
  currencyCode: 'IDR' | 'USD'
  data: Record<string, any>
  req: PayloadRequest
}) => {
  await assertCurrencyEnabled({ currencyCode, req })

  const rawData = getExtendedPaymentData(data, req)
  const checkoutSessionID = String(rawData?.checkoutSessionId || '')
  const activeCheckoutSession = await assertOwnedActiveCheckoutSession(req, checkoutSessionID)
  const buyNowItem = getBuyNowItemFromRawData(rawData)
  const cartID = activeCheckoutSession.cartId
  if (!cartID) throw new Error('Keranjang pada sesi checkout tidak ditemukan.')

  const cart = await req.payload.findByID({
    collection: 'carts',
    depth: 2,
    id: cartID,
    overrideAccess: true,
    req,
  })
  const cartItems = Array.isArray((cart as any)?.items) ? (cart as any).items : []

  if (buyNowItem) {
    const matchingItem = cartItems.find((item: any) => {
      const productID = Number(relationID(item?.product))
      const variantID = relationID(item?.variant)
      return (
        productID === buyNowItem.productId &&
        (buyNowItem.variantId === undefined
          ? !variantID
          : Number(variantID) === buyNowItem.variantId)
      )
    })
    const cartQuantity = Number(matchingItem?.quantity || 0)
    if (
      !matchingItem ||
      !Number.isInteger(buyNowItem.quantity) ||
      buyNowItem.quantity < 1 ||
      buyNowItem.quantity > 100 ||
      buyNowItem.quantity > cartQuantity
    ) {
      throw new Error('Item Beli Sekarang tidak cocok dengan keranjang.')
    }
  }

  const scopedCartItems = buildBuyNowCartItems(cartItems, buyNowItem)
  const subtotal = calculateCartItemsSubtotal(scopedCartItems, currencyCode)
  const voucherCode = normalizeCouponCode(rawData?.voucherCode)
  const eligibleVoucher = voucherCode
    ? await getVoucherByCodeForUser({
        cartItems: scopedCartItems,
        code: voucherCode,
        payload: req.payload,
        subtotal,
        user: req.user
          ? {
              id: req.user.id,
              memberTier: req.user.memberTier,
              totalSpentIDR: req.user.totalSpentIDR,
            }
          : null,
      })
    : null
  const discountBaseSubtotal = getVoucherDiscountBaseSubtotal({
    cartItems: scopedCartItems,
    currencyCode,
    subtotal,
    voucher: eligibleVoucher,
  })
  const discountAmount = calculateScopedVoucherDiscount({
    currencyCode,
    subtotal: discountBaseSubtotal,
    voucher: eligibleVoucher,
  })
  const orderID = `INV${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  const amount = Math.max(subtotal - discountAmount, 0)
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Total pembayaran harus berupa nilai positif yang valid.')
  }
  const snapshot = buildPaymentSnapshot({
    buyNowItem,
    cartItems: scopedCartItems,
    currencyCode,
    discountAmount,
    subtotal,
    voucherCode: eligibleVoucher?.code || null,
  })

  return {
    amount,
    activeCheckoutSession,
    checkoutSessionID,
    discountAmount,
    orderID,
    subtotal,
    snapshot,
    voucherCode: eligibleVoucher?.code || null,
  }
}

export const finalizePaidOrder = async ({
  amount,
  billingAddress,
  cartID,
  checkoutSessionID,
  cartItems,
  currencyCode,
  customerEmail,
  customerID,
  discountAmount,
  eligibleVoucher,
  ordersSlug,
  paymentGroupData,
  paymentMethod,
  paymentReference,
  paymentAttemptID,
  req,
  shippingAddress,
  subtotalBeforeDiscount,
  transactionsSlug,
}: {
  amount: number
  billingAddress?: Partial<Address>
  cartID?: number | string
  checkoutSessionID: string
  cartItems: any[]
  currencyCode: 'IDR' | 'USD'
  customerEmail: string
  customerID?: number | string | null
  discountAmount: number
  eligibleVoucher: Coupon | null
  ordersSlug: CollectionSlug
  paymentGroupData?: Record<string, unknown>
  paymentMethod: string
  paymentReference: string
  paymentAttemptID: number | string
  req: PayloadRequest
  shippingAddress?: Partial<Address>
  subtotalBeforeDiscount: number
  transactionsSlug: CollectionSlug
}) => {
  const pointsEarned =
    currencyCode === 'IDR'
      ? Math.max(1, Math.floor(amount / 1000))
      : Math.max(1, Math.floor(amount / 100) * 10)
  const orderItems = expandBundleCartItems(cartItems).map((item) => ({
    product: item.product,
    quantity: item.quantity,
    variant: item.variant,
    ...(item.bundleParentId
      ? {
          bundleParentProduct: item.bundleParentId,
          bundleParentTitle: item.bundleParentTitle,
          bundleDiscountPercent: item.bundleComponentDiscountPercent,
          bundleUnitPriceInIDR: item.bundleComponentUnitPriceInIDR,
          bundleUnitPriceInUSD: item.bundleComponentUnitPriceInUSD,
        }
      : {}),
  }))
  const orderData: Record<string, any> = {
    customer: customerID ?? null,
    customerEmail,
    discountAmount,
    status: 'completed',
    items: orderItems,
    amount,
    currency: currencyCode,
    memberTierSnapshot: req.user?.memberTier ?? 'bronze',
    pointsEarned,
    paymentReference,
    subtotalBeforeDiscount,
    ...(shippingAddress ? { shippingAddress } : {}),
    ...(eligibleVoucher
      ? {
          voucher: eligibleVoucher.id,
          voucherCode: eligibleVoucher.code,
        }
      : {}),
  }

  const txData: Record<string, any> = {
    paymentMethod,
    status: 'succeeded',
    items: orderItems.map(({ product, quantity, variant }) => ({
      product,
      quantity,
      variant,
    })),
    amount,
    currency: currencyCode,
    customer: customerID ?? null,
    customerEmail,
    ...(billingAddress ? { billingAddress } : {}),
    ...(paymentGroupData ? { [paymentMethod]: paymentGroupData } : {}),
  }

  return withPayloadTransaction(req, async () => {
    const claimedAttempt = await req.payload.db.updateOne({
      collection: 'payment-attempts' as any,
      data: { status: 'finalizing', updatedAt: new Date().toISOString() },
      req,
      where: {
        and: [
          { id: { equals: paymentAttemptID } },
          { customer: { equals: customerID } },
          { status: { equals: 'completed' } },
        ],
      } as any,
    })
    if (!claimedAttempt) {
      throw new Error('Pembayaran sudah diproses atau belum terverifikasi.')
    }

    const order = await req.payload.create({
      collection: ordersSlug,
      data: orderData as any,
      req,
    })
    const createdOrder = order as any

    await assignDigitalStockToOrder({
      cartItems,
      customer: customerID ?? null,
      order,
      req,
    })

    const transaction = await req.payload.create({
      collection: transactionsSlug,
      data: { ...txData, order: order.id } as any,
      req,
    })

    await req.payload.update({
      collection: ordersSlug,
      id: createdOrder.id,
      data: { transactions: [transaction.id] } as any,
      req,
    })

    if (eligibleVoucher) {
      const couponConditions: Record<string, any>[] = [{ id: { equals: eligibleVoucher.id } }]
      if (typeof eligibleVoucher.usageLimit === 'number' && eligibleVoucher.usageLimit > 0) {
        couponConditions.push({ usedCount: { less_than: eligibleVoucher.usageLimit } })
      }

      const updatedCoupon = await req.payload.db.updateOne({
        collection: 'coupons',
        data: { usedCount: { $inc: 1 } },
        req,
        where: { and: couponConditions } as any,
      })
      if (!updatedCoupon) throw new Error('Batas penggunaan voucher baru saja tercapai.')
    }

    if (cartID) {
      for (const item of getBundleReservationEntries(cartItems)) {
        const productId = item.productId
        const variantId = item.variantId || 'base'
        if (!productId) continue

        const reservationID = `${checkoutSessionID}:${productId}:${variantId}`
        const stockResult = await confirmStockReservation(
          req.payload,
          reservationID,
          createdOrder.id,
          req,
        )
        if (!stockResult.success) {
          throw new Error(stockResult.error || 'Gagal mengonfirmasi reservasi stok.')
        }
      }
    }

    await req.payload.update({
      collection: 'payment-attempts' as any,
      id: paymentAttemptID,
      data: {
        consumedAt: new Date().toISOString(),
        order: createdOrder.id,
        status: 'consumed',
      } as any,
      overrideAccess: true,
      req,
    })
    await req.payload.update({
      collection: 'checkout-sessions' as any,
      id: relationID(claimedAttempt.checkoutSession) as any,
      data: { activeKey: null, order: createdOrder.id, status: 'completed' } as any,
      overrideAccess: true,
      req,
    })

    return {
      orderID: createdOrder.id,
      pointsEarned,
      // The plugin requires a numeric field; zero keeps its legacy stock decrement disabled.
      transactionID: 0,
    }
  })
}
