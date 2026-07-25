import {
    buildBuyNowCartItems,
    calculateCartItemsSubtotal,
    getBuyNowItemFromRawData,
    getCartItemUnitPrice,
} from '@/lib/buyNow'
import { assertOwnedActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import { assignDigitalStockToOrder } from '@/lib/digitalStock'
import { confirmStockReservation } from '@/lib/stock'
import {
    calculateVoucherDiscount,
    getVoucherByCodeForUser,
    normalizeCouponCode,
} from '@/lib/vouchers'
import type { Address, Coupon } from '@/payload-types'
import { assertCurrencyEnabled } from '@/utilities/currencySettings'
import type { CollectionSlug, PayloadRequest } from 'payload'

type PreparedPaymentContext = {
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
  if (!paymentReference) return null
  const existing = await req.payload.find({
    collection: transactionsSlug as any,
    depth: 1,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      and: [{ [field]: { equals: paymentReference } }, { status: { equals: 'succeeded' } }],
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
  return {
    accessToken: order.accessToken,
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
  const customerEmail: string = rawData?.customerEmail ?? req.user?.email ?? ''
  const customerID = await resolveCustomerID({ customerEmail, req })
  const cartID = activeCheckoutSession?.cartId || rawData?.cartID
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
  await assertOwnedActiveCheckoutSession(req, checkoutSessionID)
  const buyNowItem = getBuyNowItemFromRawData(rawData)
  const cartItems = Array.isArray(rawData?.cart?.items) ? rawData.cart.items : []
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
  const orderID = `INV${Date.now()}`

  return {
    amount: Math.max(subtotal - discountAmount, 0),
    checkoutSessionID,
    discountAmount,
    orderID,
    subtotal,
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
  req: PayloadRequest
  shippingAddress?: Partial<Address>
  subtotalBeforeDiscount: number
  transactionsSlug: CollectionSlug
}) => {
  const pointsEarned =
    currencyCode === 'IDR'
      ? Math.max(1, Math.floor(amount / 1000))
      : Math.max(1, Math.floor(amount / 100) * 10)
  const orderData: Record<string, any> = {
    customer: customerID ?? null,
    customerEmail,
    discountAmount,
    status: 'completed',
    items: cartItems,
    amount,
    currency: currencyCode,
    memberTierSnapshot: req.user?.memberTier ?? 'bronze',
    pointsEarned,
    paymentReference,
    subtotalBeforeDiscount,
    accessToken: crypto.randomUUID(),
    ...(shippingAddress ? { shippingAddress } : {}),
    ...(eligibleVoucher
      ? {
          voucher: eligibleVoucher.id,
          voucherCode: eligibleVoucher.code,
        }
      : {}),
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

  const txData: Record<string, any> = {
    paymentMethod,
    status: 'succeeded',
    items: cartItems,
    amount,
    currency: currencyCode,
    customer: customerID ?? null,
    customerEmail,
    order: order.id,
    ...(billingAddress ? { billingAddress } : {}),
    ...(paymentGroupData ? { [paymentMethod]: paymentGroupData } : {}),
  }

  const transaction = await req.payload.create({
    collection: transactionsSlug,
    data: txData as any,
    req,
  })

  await req.payload.update({
    collection: ordersSlug,
    id: createdOrder.id,
    data: { transactions: [transaction.id] } as any,
    req,
  })

  if (eligibleVoucher) {
    const currentCoupon = await req.payload.findByID({
      collection: 'coupons',
      id: eligibleVoucher.id,
      depth: 0,
      req,
    })

    await req.payload.update({
      collection: 'coupons',
      id: eligibleVoucher.id,
      data: {
        usedCount: (currentCoupon.usedCount || 0) + 1,
      },
      req,
    })
  }

  if (cartID) {
    for (const item of cartItems) {
      const productId = typeof item.product === 'object' ? item.product?.id : item.product
      const variantId = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : 'base'

      if (!productId) continue

      const reservationID = `${checkoutSessionID}:${productId}:${variantId}`

      try {
        const stockResult = await confirmStockReservation(
          req.payload,
          reservationID,
          createdOrder.id,
        )

        if (!stockResult.success) {
          req.payload.logger.warn(
            { error: stockResult.error, reservationID },
            `[${paymentMethod}] Gagal konfirmasi reservasi stok`,
          )
        }
      } catch (error) {
        req.payload.logger.warn(
          {
            error: error instanceof Error ? error.message : String(error),
            reservationID,
          },
          `[${paymentMethod}] Error konfirmasi stok`,
        )
      }
    }
  }

  return {
    accessToken: createdOrder.accessToken,
    orderID: createdOrder.id,
    pointsEarned,
    transactionID: transaction.id,
  }
}
