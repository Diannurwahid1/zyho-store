import type { Coupon, DigitalAsset, Media, Order, Product, User } from '@/payload-types'
import { usdBaseUnitsToDecimal } from '@/utilities/currencyUnits'
import type { Payload } from 'payload'
import {
  getAbsoluteMediaURL,
  sendVoucherBlast,
  sendWhatsAppDocument,
  sendWhatsAppImage,
  sendWhatsAppText,
} from './whatsapp'

const formatCurrency = (amount: number, currencyCode: string = 'IDR') =>
  new Intl.NumberFormat(currencyCode === 'USD' ? 'en-US' : 'id-ID', {
    currency: currencyCode === 'USD' ? 'USD' : 'IDR',
    maximumFractionDigits: currencyCode === 'USD' ? 2 : 0,
    style: 'currency',
  }).format(currencyCode === 'USD' ? usdBaseUnitsToDecimal(amount) : amount)

const getCustomerName = (user?: Partial<User> | null, email?: string | null) =>
  user?.name?.trim() || email?.trim() || 'Kak'

const getCustomerPhone = ({
  order,
  phone,
  user,
}: {
  order?: Order | null
  phone?: string | null
  user?: Partial<User> | null
}) => phone?.trim() || order?.shippingAddress?.phone?.trim() || user?.phone?.trim() || ''

const listOrderProducts = (order: Order) =>
  (order.items || [])
    .map((item) => {
      if (!item?.product || typeof item.product !== 'object') return null
      return item.product
    })
    .filter(Boolean) as Product[]

const getOrderReference = (order: Order) => `#${order.id}`

const buildPendingPaymentMessage = ({
  amount,
  customerName,
  orderCode,
  currency = 'IDR',
  pendingPaymentUrl,
  sessionExpiry,
}: {
  amount: number
  customerName: string
  orderCode: string
  currency?: 'IDR' | 'USD'
  pendingPaymentUrl?: string
  sessionExpiry?: string
}) => {
  const formattedAmount = formatCurrency(amount, currency)
  const messages = [
    `🛒 Halo ${customerName},`,
    '',
    `📋 Pesanan ${orderCode} sudah dibuat dan saat ini menunggu pembayaran.`,
    `💰 Total pembayaran: ${formattedAmount}`,
    '',
  ]

  if (pendingPaymentUrl) {
    messages.push(`🔗 Silakan lanjutkan pembayaran di link berikut:`)
    messages.push(pendingPaymentUrl)
    messages.push('')
  }

  if (sessionExpiry) {
    messages.push(`⏰ Sesi checkout akan berakhir dalam: ${sessionExpiry}`)
    messages.push('')
  }

  messages.push('📱 Silakan lanjutkan pembayaran dari QRIS yang muncul di halaman checkout.')
  messages.push(
    '✅ Terima kasih, kami akan langsung memproses pesanan setelah pembayaran terkonfirmasi.',
  )
  messages.push('')
  messages.push('💬 Jika ada pertanyaan, silakan hubungi kami.')

  return messages.join('\n')
}

const buildPaidMessage = ({
  amount,
  currency,
  customerName,
  order,
}: {
  amount: number
  currency?: string | null
  customerName: string
  order: Order
}) => {
  const productLines = listOrderProducts(order)
    .map((product, index) => `${index + 1}. ${product.title}`)
    .join('\n')

  return [
    `🎉 Halo ${customerName},`,
    '',
    `✅ Pembayaran untuk pesanan ${getOrderReference(order)} sudah berhasil kami terima!`,
    productLines ? `📦 Produk:\n${productLines}` : '',
    `💰 Total: ${formatCurrency(amount, currency || 'IDR')}`,
    '',
    `🙏 Terima kasih sudah berbelanja bersama kami!`,
    `📁 Jika produk Anda memiliki file digital, kami akan kirimkan langsung ke WhatsApp ini.`,
    '',
    `💬 Ada pertanyaan? Jangan ragu untuk menghubungi kami.`,
  ]
    .filter(Boolean)
    .join('\n')
}

const buildAssetCaption = (productTitle: string, fileName: string) =>
  [
    `Berikut file untuk produk *${productTitle}*.`,
    `File: ${fileName}`,
    '',
    'Terima kasih sudah berbelanja bersama kami.',
  ].join('\n')

const buildAssignedUnitMessage = ({
  productTitle,
  unit,
}: {
  productTitle: string
  unit: Record<string, any>
}) => {
  const lines = [
    `Detail akses untuk *${productTitle}*`,
    unit.label ? `Label: ${unit.label}` : '',
    unit.accountEmail ? `Email: ${unit.accountEmail}` : '',
    unit.accountUsername ? `Username: ${unit.accountUsername}` : '',
    unit.accountPassword ? `Password: ${unit.accountPassword}` : '',
    unit.loginUrl ? `Login: ${unit.loginUrl}` : '',
    unit.referenceCode ? `Reference: ${unit.referenceCode}` : '',
    unit.content || '',
  ]

  return lines.filter(Boolean).join('\n')
}

const fetchCustomer = async (payload: Payload, customer: number | User | null | undefined) => {
  if (!customer) return null
  if (typeof customer === 'object') return customer

  try {
    return (await payload.findByID({
      collection: 'users',
      depth: 0,
      id: customer,
      overrideAccess: true,
    })) as User
  } catch {
    return null
  }
}

const fetchOrder = async (payload: Payload, order: number | Order | null | undefined) => {
  if (!order) return null
  if (typeof order === 'object') return order

  try {
    return (await payload.findByID({
      collection: 'orders',
      depth: 2,
      id: order,
      overrideAccess: true,
    })) as Order
  } catch {
    return null
  }
}

const fetchOrderAssets = async (payload: Payload, order: Order) => {
  const products = listOrderProducts(order)
  const productIds = [...new Set(products.map((product) => product.id).filter(Boolean))]

  if (productIds.length === 0) {
    return []
  }

  const result = await payload.find({
    collection: 'digital-assets',
    depth: 1,
    limit: 100,
    overrideAccess: true,
    where: {
      and: [
        {
          product: {
            in: productIds,
          },
        },
        {
          status: {
            equals: 'active',
          },
        },
      ],
    },
  })

  return result.docs as DigitalAsset[]
}

const sendOrderAssets = async ({ assets, phone }: { assets: DigitalAsset[]; phone: string }) => {
  for (const asset of assets) {
    const file = typeof asset.file === 'object' ? (asset.file as Media) : null
    const productTitle =
      typeof asset.product === 'object' && asset.product?.title
        ? asset.product.title
        : 'produk Anda'
    const fileName = asset.fileName || file?.filename || 'file'
    const fileURL = getAbsoluteMediaURL(file)

    if (!fileURL) continue

    if (file?.mimeType?.startsWith('image/')) {
      await sendWhatsAppImage({
        caption: buildAssetCaption(productTitle, fileName),
        phone,
        url: fileURL,
      })
      continue
    }

    await sendWhatsAppDocument({
      caption: buildAssetCaption(productTitle, fileName),
      filename: file?.filename || asset.fileName || 'download',
      mimetype: file?.mimeType || undefined,
      phone,
      url: fileURL,
    })
  }
}

const sendAssignedDigitalDeliveries = async ({ order, phone }: { order: Order; phone: string }) => {
  const deliveries = Array.isArray((order as any).digitalDeliveries)
    ? ((order as any).digitalDeliveries as Record<string, any>[])
    : []

  for (const delivery of deliveries) {
    const productTitle = delivery.productTitle || 'produk Anda'

    for (const unit of delivery.units || []) {
      const file = unit.file && typeof unit.file === 'object' ? (unit.file as Media) : null
      const textMessage = buildAssignedUnitMessage({ productTitle, unit })

      if (textMessage.trim()) {
        await sendWhatsAppText(phone, textMessage)
      }

      const fileURL = getAbsoluteMediaURL(file)
      if (!fileURL) continue

      if (file?.mimeType?.startsWith('image/')) {
        await sendWhatsAppImage({
          caption: buildAssetCaption(productTitle, file?.filename || unit.label || 'image'),
          phone,
          url: fileURL,
        })
        continue
      }

      await sendWhatsAppDocument({
        caption: buildAssetCaption(productTitle, file?.filename || unit.label || 'file'),
        filename: file?.filename || unit.label || 'download',
        mimetype: file?.mimeType || undefined,
        phone,
        url: fileURL,
      })
    }
  }
}

export const notifyPendingPayment = async ({
  amount,
  customerName,
  orderCode,
  phone,
  currency = 'IDR',
  pendingPaymentUrl,
  sessionExpiry,
}: {
  amount: number
  customerName?: string | null
  orderCode: string
  phone?: string | null
  currency?: 'IDR' | 'USD'
  pendingPaymentUrl?: string
  sessionExpiry?: string
}) => {
  if (!phone?.trim()) {
    return { reason: 'missing-phone', success: false }
  }

  return sendWhatsAppText(
    phone,
    buildPendingPaymentMessage({
      amount,
      customerName: customerName?.trim() || 'Kak',
      orderCode,
      currency,
      pendingPaymentUrl,
      sessionExpiry,
    }),
  )
}

export const notifyPaidOrder = async ({
  amount,
  currency,
  customer,
  customerEmail,
  order,
  payload,
  phone,
}: {
  amount: number
  currency?: string | null
  customer?: number | User | null
  customerEmail?: string | null
  order: number | Order
  payload: Payload
  phone?: string | null
}) => {
  const resolvedOrder = await fetchOrder(payload, order)

  if (!resolvedOrder) {
    return { reason: 'missing-order', success: false }
  }

  const resolvedCustomer = await fetchCustomer(payload, customer ?? resolvedOrder.customer)
  const customerName = getCustomerName(
    resolvedCustomer,
    customerEmail || resolvedOrder.customerEmail,
  )
  const targetPhone = getCustomerPhone({ order: resolvedOrder, phone, user: resolvedCustomer })

  if (!targetPhone) {
    return { reason: 'missing-phone', success: false }
  }

  const textResult = await sendWhatsAppText(
    targetPhone,
    buildPaidMessage({
      amount,
      currency,
      customerName,
      order: resolvedOrder,
    }),
  )

  if (!textResult.success) {
    return textResult
  }

  const assets = await fetchOrderAssets(payload, resolvedOrder)
  await sendAssignedDigitalDeliveries({ order: resolvedOrder, phone: targetPhone })
  await sendOrderAssets({ assets, phone: targetPhone })

  return textResult
}

export const triggerVoucherBlast = async ({
  coupon,
  payload,
}: {
  coupon: Coupon
  payload: Payload
}) => {
  return sendVoucherBlast({ coupon, payload })
}
