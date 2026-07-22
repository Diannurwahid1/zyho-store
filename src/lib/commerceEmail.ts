import type { Coupon, Order, Product, User } from '@/payload-types'
import { usdBaseUnitsToDecimal } from '@/utilities/currencyUnits'
import type { Payload } from 'payload'
import { isEmailConfigured, sendBulkEmail, sendEmail } from './email'

const STORE_NAME = process.env.SMTP_STORE_NAME || 'Zyho Store'
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://zyho.store'

// ─── Helpers ─────────────────────────────────────────────────────
const formatCurrency = (amount: number, currencyCode: string = 'IDR') =>
  new Intl.NumberFormat(currencyCode === 'USD' ? 'en-US' : 'id-ID', {
    currency: currencyCode === 'USD' ? 'USD' : 'IDR',
    maximumFractionDigits: currencyCode === 'USD' ? 2 : 0,
    style: 'currency',
  }).format(currencyCode === 'USD' ? usdBaseUnitsToDecimal(amount) : amount)

const getCustomerName = (user?: Partial<User> | null, email?: string | null) =>
  user?.name?.trim() || email?.split('@')[0] || 'Kak'

const getCustomerEmail = ({
  order,
  email,
  user,
}: {
  order?: Order | null
  email?: string | null
  user?: Partial<User> | null
}) => email?.trim() || user?.email?.trim() || order?.customerEmail?.trim() || ''

const listOrderProducts = (order: Order) =>
  (order.items || [])
    .map((item) => {
      if (!item?.product || typeof item.product !== 'object') return null
      return item.product
    })
    .filter(Boolean) as Product[]

const getOrderReference = (order: Order) => `#${order.id}`

// ─── Fetch helpers ───────────────────────────────────────────────
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

// ─── Email Message Builders ──────────────────────────────────────

const buildPendingPaymentEmailHtml = ({
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
  let html = `
    <h2>Menunggu Pembayaran</h2>
    <p>Halo <strong>${customerName}</strong>,</p>
    <p>Pesanan <strong>${orderCode}</strong> sudah dibuat dan saat ini menunggu pembayaran.</p>
    <p style="font-size: 18px; font-weight: bold;">💰 Total: ${formattedAmount}</p>
  `

  if (pendingPaymentUrl) {
    html += `
      <p>Silakan lanjutkan pembayaran di link berikut:</p>
      <p><a href="${pendingPaymentUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Bayar Sekarang</a></p>
    `
  }

  if (sessionExpiry) {
    html += `<p>⏰ Sesi checkout akan berakhir dalam: <strong>${sessionExpiry}</strong></p>`
  }

  html += `
    <p>Silakan lanjutkan pembayaran dari QRIS yang muncul di halaman checkout.</p>
    <p>Kami akan langsung memproses pesanan setelah pembayaran terkonfirmasi. ✅</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #666; font-size: 13px;">Jika ada pertanyaan, silakan hubungi kami.</p>
  `

  return html
}

const buildPendingPaymentEmailText = ({
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
  const lines = [
    `Halo ${customerName},`,
    '',
    `Pesanan ${orderCode} sudah dibuat dan saat ini menunggu pembayaran.`,
    `Total pembayaran: ${formattedAmount}`,
    '',
  ]

  if (pendingPaymentUrl) {
    lines.push(`Silakan lanjutkan pembayaran di: ${pendingPaymentUrl}`)
    lines.push('')
  }

  if (sessionExpiry) {
    lines.push(`Sesi checkout akan berakhir dalam: ${sessionExpiry}`)
    lines.push('')
  }

  lines.push('Silakan lanjutkan pembayaran dari QRIS yang muncul di halaman checkout.')
  lines.push('Kami akan langsung memproses pesanan setelah pembayaran terkonfirmasi.')
  lines.push('')
  lines.push('Jika ada pertanyaan, silakan hubungi kami.')

  return lines.join('\n')
}

const buildPaidEmailHtml = ({
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
    .map((product) => `<li>${product.title}</li>`)
    .join('\n')

  const digitalNote = listOrderProducts(order).length > 0
    ? `<p>📁 Jika produk Anda memiliki file digital, kami akan kirimkan ke email ini atau WhatsApp Anda.</p>`
    : ''

  return `
    <h2>🎉 Pembayaran Berhasil!</h2>
    <p>Halo <strong>${customerName}</strong>,</p>
    <p>Pembayaran untuk pesanan <strong>${getOrderReference(order)}</strong> sudah berhasil kami terima!</p>
    ${productLines ? `<p><strong>Produk:</strong></p><ul>${productLines}</ul>` : ''}
    <p style="font-size: 18px; font-weight: bold;">💰 Total: ${formatCurrency(amount, currency || 'IDR')}</p>
    ${digitalNote}
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p>🙏 Terima kasih sudah berbelanja bersama kami!</p>
    <p style="color: #666; font-size: 13px;">Ada pertanyaan? Jangan ragu untuk menghubungi kami.</p>
  `
}

const buildPaidEmailText = ({
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
    `Halo ${customerName},`,
    '',
    `Pembayaran untuk pesanan ${getOrderReference(order)} sudah berhasil kami terima!`,
    productLines ? `Produk:\n${productLines}` : '',
    `Total: ${formatCurrency(amount, currency || 'IDR')}`,
    '',
    'Terima kasih sudah berbelanja bersama kami!',
    'Jika produk Anda memiliki file digital, kami akan kirimkan ke email ini atau WhatsApp Anda.',
    '',
    'Ada pertanyaan? Jangan ragu untuk menghubungi kami.',
  ]
    .filter(Boolean)
    .join('\n')
}

const buildDigitalDeliveryEmailHtml = ({
  productTitle,
  units,
}: {
  productTitle: string
  units: Array<Record<string, any>>
}) => {
  const unitLines = units
    .map((unit) => {
      const details: string[] = []
      if (unit.label) details.push(`<strong>Label:</strong> ${unit.label}`)
      if (unit.accountEmail) details.push(`<strong>Email:</strong> ${unit.accountEmail}`)
      if (unit.accountUsername) details.push(`<strong>Username:</strong> ${unit.accountUsername}`)
      if (unit.accountPassword) details.push(`<strong>Password:</strong> ${unit.accountPassword}`)
      if (unit.loginUrl) details.push(`<strong>Login:</strong> <a href="${unit.loginUrl}">${unit.loginUrl}</a>`)
      if (unit.referenceCode) details.push(`<strong>Reference:</strong> ${unit.referenceCode}`)
      if (unit.content) details.push(`<p>${unit.content}</p>`)
      return details.join('<br>')
    })
    .filter(Boolean)

  return `
    <h2>📦 Detail Akses Produk Digital</h2>
    <p>Berikut detail akses untuk <strong>${productTitle}</strong>:</p>
    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 12px 0;">
      ${unitLines.join('<hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;">')}
    </div>
    <p>Terima kasih sudah berbelanja bersama kami. 🙏</p>
  `
}

// ─── Voucher Blast Email ─────────────────────────────────────────
export const buildVoucherBlastEmailHtml = (
  coupon: Coupon,
  user?: Pick<User, 'memberTier' | 'name'>,
) => {
  const greetingName = user?.name?.trim() || 'Kak'
  const tierLabel = user?.memberTier ? ` untuk member ${user.memberTier}` : ''
  const benefit =
    coupon.benefitSummary?.trim() ||
    (coupon.discountType === 'percentage'
      ? `Diskon ${coupon.amount}%`
      : `Potongan Rp ${Number(coupon.amount || 0).toLocaleString('id-ID')}`)
  const minimumSpend =
    typeof coupon.minimumSpend === 'number' && coupon.minimumSpend > 0
      ? `<br>Minimum belanja: Rp ${coupon.minimumSpend.toLocaleString('id-ID')}`
      : ''
  const expiresAt = coupon.expiresAt
    ? `<br>Berlaku sampai: ${new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(coupon.expiresAt))}`
    : ''

  return `
    <h2>🎁 Voucher Spesial${tierLabel}</h2>
    <p>Halo <strong>${greetingName}</strong>,</p>
    <p>Ada voucher spesial${tierLabel} yang baru aktif di akun Anda.</p>
    <div style="background: #f0fdf4; border: 2px dashed #22c55e; padding: 20px; text-align: center; border-radius: 8px; margin: 16px 0;">
      <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 0;">${coupon.code}</p>
      <p style="margin: 8px 0 0; color: #333;">${benefit}${minimumSpend}${expiresAt}</p>
    </div>
    <p>Voucher bisa langsung dipakai saat checkout.</p>
    <p><a href="${SITE_URL}/shop" style="display: inline-block; background: #22c55e; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Belanja Sekarang</a></p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p>Terima kasih sudah belanja bersama kami. 🙏</p>
  `
}

export const buildVoucherBlastEmailText = (
  coupon: Coupon,
  user?: Pick<User, 'memberTier' | 'name'>,
) => {
  const greetingName = user?.name?.trim() || 'Kak'
  const tierLabel = user?.memberTier ? ` untuk member ${user.memberTier}` : ''
  const benefit =
    coupon.benefitSummary?.trim() ||
    (coupon.discountType === 'percentage'
      ? `Diskon ${coupon.amount}%`
      : `Potongan Rp ${Number(coupon.amount || 0).toLocaleString('id-ID')}`)
  const minimumSpend =
    typeof coupon.minimumSpend === 'number' && coupon.minimumSpend > 0
      ? `\nMinimum belanja: Rp ${coupon.minimumSpend.toLocaleString('id-ID')}`
      : ''
  const expiresAt = coupon.expiresAt
    ? `\nBerlaku sampai: ${new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(coupon.expiresAt))}`
    : ''

  return [
    `Halo ${greetingName},`,
    '',
    `Ada voucher spesial${tierLabel} yang baru aktif di akun Anda.`,
    '',
    `Kode voucher: ${coupon.code}`,
    `Benefit: ${benefit}${minimumSpend}${expiresAt}`,
    '',
    'Terima kasih sudah belanja bersama kami. Voucher bisa langsung dipakai saat checkout.',
  ].join('\n')
}

// ─── Waitlist Notification Email ─────────────────────────────────
export const buildWaitlistEmailHtml = ({
  productName,
  productUrl,
  customerName,
  voucherCode,
}: {
  productName: string
  productUrl: string
  customerName?: string
  voucherCode?: string
}) => {
  const name = customerName?.trim() || 'Kak'
  const voucherHtml = voucherCode
    ? `
      <div style="background: #fef3c7; border: 2px dashed #f59e0b; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; font-weight: bold;">🎁 Bonus Spesial!</p>
        <p style="font-size: 20px; font-weight: bold; color: #d97706; margin: 8px 0;">${voucherCode}</p>
        <p style="margin: 0; font-size: 13px;">Gunakan kode ini untuk diskon eksklusif</p>
      </div>
    `
    : ''

  return `
    <h2>📦 Produk Sudah Tersedia!</h2>
    <p>Halo <strong>${name}</strong>,</p>
    <p>Kabar baik! Produk yang Anda tunggu sekarang sudah tersedia kembali:</p>
    <p style="font-size: 18px; font-weight: bold;">📦 ${productName}</p>
    ${voucherHtml}
    <p>Buruan order sekarang sebelum habis lagi!</p>
    <p><a href="${productUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Lihat Produk</a></p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p>Terima kasih sudah sabar menunggu! 🙏</p>
  `
}

// ─── Promo Blast Email ───────────────────────────────────────────
export const buildPromoBlastEmailHtml = (
  products: Array<{
    id: number | string
    inventory?: number
    isFeatured?: boolean
    priceInIDR?: number
    shortDescription?: string
    title: string
  }>,
  customerName: string,
) => {
  const productRows = products
    .slice(0, 5)
    .map(
      (p) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">
          <strong>${p.title}</strong>
          ${p.shortDescription ? `<br><span style="color: #666; font-size: 13px;">${p.shortDescription}</span>` : ''}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
          ${p.priceInIDR ? formatCurrency(p.priceInIDR, 'IDR') : '-'}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${p.inventory ? `sisa ${p.inventory}` : '-'}
        </td>
      </tr>
    `,
    )
    .join('')

  const moreProducts =
    products.length > 5
      ? `<p>...dan ${products.length - 5} produk lainnya!</p>`
      : ''

  return `
    <h2>☀️ Selamat Pagi, ${customerName}!</h2>
    <p>Ada produk digital siap pakai hari ini di <strong>${STORE_NAME}</strong>:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="background: #f9f9f9;">
          <th style="padding: 8px 12px; text-align: left;">Produk</th>
          <th style="padding: 8px 12px; text-align: right;">Harga</th>
          <th style="padding: 8px 12px; text-align: center;">Stok</th>
        </tr>
      </thead>
      <tbody>${productRows}</tbody>
    </table>
    ${moreProducts}
    <p><a href="${SITE_URL}/shop" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Lihat Semua Produk</a></p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #666; font-size: 13px;">Terima kasih sudah menjadi pelanggan setia ${STORE_NAME}! 🙏</p>
  `
}

// ─── Public Notification Functions (parallel to WA) ──────────────

export const emailNotifyPendingPayment = async ({
  amount,
  customerName,
  orderCode,
  email,
  currency = 'IDR',
  pendingPaymentUrl,
  sessionExpiry,
}: {
  amount: number
  customerName?: string | null
  orderCode: string
  email?: string | null
  currency?: 'IDR' | 'USD'
  pendingPaymentUrl?: string
  sessionExpiry?: string
}) => {
  if (!email?.trim() || !isEmailConfigured()) {
    return { success: false, reason: !email?.trim() ? 'missing-email' : 'email-not-configured', recipient: email || '' }
  }

  const name = customerName?.trim() || 'Kak'
  return sendEmail({
    to: email,
    subject: `Menunggu Pembayaran - Pesanan ${orderCode}`,
    text: buildPendingPaymentEmailText({ amount, customerName: name, orderCode, currency, pendingPaymentUrl, sessionExpiry }),
    html: buildPendingPaymentEmailHtml({ amount, customerName: name, orderCode, currency, pendingPaymentUrl, sessionExpiry }),
    context: 'order',
  })
}

export const emailNotifyPaidOrder = async ({
  amount,
  currency,
  customer,
  customerEmail,
  order,
  payload,
}: {
  amount: number
  currency?: string | null
  customer?: number | User | null
  customerEmail?: string | null
  order: number | Order
  payload: Payload
}) => {
  if (!isEmailConfigured()) {
    return { success: false, reason: 'email-not-configured', recipient: '' }
  }

  const resolvedOrder = await fetchOrder(payload, order)
  if (!resolvedOrder) {
    return { success: false, reason: 'missing-order', recipient: '' }
  }

  const resolvedCustomer = await fetchCustomer(payload, customer ?? resolvedOrder.customer)
  const name = getCustomerName(resolvedCustomer, customerEmail || resolvedOrder.customerEmail)
  const email = getCustomerEmail({ order: resolvedOrder, email: customerEmail, user: resolvedCustomer })

  if (!email) {
    return { success: false, reason: 'missing-email', recipient: '' }
  }

  // Send payment confirmation email
  const result = await sendEmail({
    to: email,
    subject: `Pembayaran Berhasil - Pesanan ${getOrderReference(resolvedOrder)}`,
    text: buildPaidEmailText({ amount, currency, customerName: name, order: resolvedOrder }),
    html: buildPaidEmailHtml({ amount, currency, customerName: name, order: resolvedOrder }),
    context: 'order',
  })

  // Send digital delivery details via email if available
  const deliveries = Array.isArray((resolvedOrder as any).digitalDeliveries)
    ? ((resolvedOrder as any).digitalDeliveries as Record<string, any>[])
    : []

  for (const delivery of deliveries) {
    const productTitle = delivery.productTitle || 'produk Anda'
    const units = delivery.units || []
    if (units.length === 0) continue

    await sendEmail({
      to: email,
      subject: `Detail Akses Digital - ${productTitle}`,
      text: units
        .map((unit: Record<string, any>) => {
          const lines: string[] = [`Detail akses untuk ${productTitle}`]
          if (unit.label) lines.push(`Label: ${unit.label}`)
          if (unit.accountEmail) lines.push(`Email: ${unit.accountEmail}`)
          if (unit.accountUsername) lines.push(`Username: ${unit.accountUsername}`)
          if (unit.accountPassword) lines.push(`Password: ${unit.accountPassword}`)
          if (unit.loginUrl) lines.push(`Login: ${unit.loginUrl}`)
          if (unit.referenceCode) lines.push(`Reference: ${unit.referenceCode}`)
          if (unit.content) lines.push(unit.content)
          return lines.join('\n')
        })
        .join('\n---\n'),
      html: buildDigitalDeliveryEmailHtml({ productTitle, units }),
      context: 'order',
    })
  }

  return result
}

export const emailVoucherBlast = async ({
  coupon,
  payload,
}: {
  coupon: Coupon
  payload: Payload
}) => {
  if (!isEmailConfigured()) {
    return { sent: 0, failed: 0, total: 0 }
  }

  // Collect all customers with email
  const recipients: Array<Pick<User, 'email' | 'id' | 'memberTier' | 'name' | 'roles'>> = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const batch = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      select: {
        email: true,
        memberTier: true,
        name: true,
        roles: true,
      },
      where: {
        email: { exists: true },
      },
    })

    const docs = batch.docs as Array<Pick<User, 'email' | 'id' | 'memberTier' | 'name' | 'roles'>>
    recipients.push(
      ...docs.filter((user) => {
        const roles = Array.isArray(user.roles) ? user.roles : []
        const hasCustomerRole = roles.includes('customer')
        const tierAllowed =
          !coupon.allowedTiers?.length ||
          (user.memberTier ? coupon.allowedTiers.includes(user.memberTier) : false)
        return hasCustomerRole && Boolean(user.email) && tierAllowed
      }),
    )

    hasNextPage = batch.hasNextPage
    page += 1
  }

  const benefit =
    coupon.benefitSummary?.trim() ||
    (coupon.discountType === 'percentage'
      ? `Diskon ${coupon.amount}%`
      : `Potongan Rp ${Number(coupon.amount || 0).toLocaleString('id-ID')}`)

  return sendBulkEmail({
    recipients: recipients.map((r) => ({ email: r.email, name: r.name ?? undefined, memberTier: r.memberTier })),
    subject: `🎁 Voucher Spesial: ${coupon.code} — ${benefit}`,
    buildText: (r) => buildVoucherBlastEmailText(coupon, { name: r.name, memberTier: r.memberTier } as any),
    buildHtml: (r) => buildVoucherBlastEmailHtml(coupon, { name: r.name, memberTier: r.memberTier } as any),
    context: 'promo',
    delayMs: 500,
    logger: payload.logger,
  })
}

export const emailWaitlistBlast = async ({
  waitlistId,
  payload,
}: {
  waitlistId: number | string
  payload: Payload
}) => {
  if (!isEmailConfigured()) {
    return { sent: 0, failed: 0, total: 0 }
  }

  const waitlist = await payload.findByID({
    collection: 'waitlists',
    id: waitlistId,
    depth: 2,
    overrideAccess: true,
  })

  if (!waitlist) throw new Error('Waitlist not found')

  const product = typeof waitlist.product === 'object' ? waitlist.product : null
  if (!product) throw new Error('Product not found')

  const productUrl = `${SITE_URL}/products/${product.slug}`
  const voucher = waitlist.voucher && typeof waitlist.voucher === 'object' ? waitlist.voucher : null
  const voucherCode = voucher?.code

  const { docs: entries } = await payload.find({
    collection: 'waitlist-entries',
    where: {
      waitlist: { equals: waitlistId },
      status: { not_equals: 'notified' },
    },
    limit: 1000,
    overrideAccess: true,
  })

  // Filter entries that have email (from customer relation)
  const emailEntries = entries
    .map((e) => {
      const customer = typeof e.customer === 'object' ? e.customer : null
      return {
        ...e,
        email: customer?.email,
      }
    })
    .filter((e) => e.email?.trim())

  if (emailEntries.length === 0) {
    return { sent: 0, failed: 0, total: 0 }
  }

  return sendBulkEmail({
    recipients: emailEntries.map((e) => ({ email: e.email!, name: e.name ?? undefined })),
    subject: `📦 ${product.title} Sudah Tersedia Kembali!`,
    buildText: (r) => {
      const name = r.name?.trim() || 'Kak'
      return [
        `Halo ${name},`,
        '',
        `Kabar baik! Produk yang Anda tunggu sekarang sudah tersedia kembali:`,
        `${product.title}`,
        '',
        voucherCode ? `Bonus Spesial! Gunakan kode voucher: ${voucherCode} untuk diskon eksklusif.` : '',
        '',
        `Buruan order sekarang sebelum habis lagi!`,
        `Lihat produk: ${productUrl}`,
        '',
        'Terima kasih sudah sabar menunggu! 🙏',
      ].filter(Boolean).join('\n')
    },
    buildHtml: (r) =>
      buildWaitlistEmailHtml({
        productName: product.title,
        productUrl,
        customerName: r.name,
        voucherCode,
      }),
    context: 'info',
    delayMs: 500,
    logger: payload.logger,
  })
}

export const emailPromoBlast = async ({
  products,
  payload,
}: {
  products: Array<{
    id: number | string
    inventory?: number
    isFeatured?: boolean
    priceInIDR?: number
    shortDescription?: string
    title: string
  }>
  payload: Payload
}) => {
  if (!isEmailConfigured()) {
    return { sent: 0, failed: 0, total: 0 }
  }

  // Collect all customers with email
  const recipients: Array<Pick<User, 'email' | 'id' | 'name' | 'roles'>> = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const batch = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      select: {
        email: true,
        name: true,
        roles: true,
      },
      where: {
        email: { exists: true },
      },
    })

    const docs = batch.docs as Array<Pick<User, 'email' | 'id' | 'name' | 'roles'>>
    recipients.push(
      ...docs.filter((user) => {
        const roles = Array.isArray(user.roles) ? user.roles : []
        return roles.includes('customer') && Boolean(user.email)
      }),
    )

    hasNextPage = batch.hasNextPage
    page += 1
  }

  if (recipients.length === 0) {
    return { sent: 0, failed: 0, total: 0 }
  }

  return sendBulkEmail({
    recipients: recipients.map((r) => ({ email: r.email, name: r.name ?? undefined })),
    subject: `☀️ Produk Digital Siap Pakai Hari Ini — ${STORE_NAME}`,
    buildText: (r) => {
      const name = r.name?.trim() || 'Kak'
      const productLines = products
        .slice(0, 5)
        .map((p, i) => {
          const price = p.priceInIDR ? ` — ${formatCurrency(p.priceInIDR, 'IDR')}` : ''
          const stock = p.inventory ? ` (sisa ${p.inventory})` : ''
          return `${i + 1}. ${p.title}${price}${stock}`
        })
        .join('\n')
      return [
        `Selamat pagi ${name}!`,
        '',
        `Ada produk digital siap pakai hari ini di ${STORE_NAME}:`,
        '',
        productLines,
        products.length > 5 ? `\n...dan ${products.length - 5} produk lainnya!` : '',
        '',
        `Lihat semua produk: ${SITE_URL}/shop`,
        '',
        `Terima kasih sudah menjadi pelanggan setia ${STORE_NAME}! 🙏`,
      ].filter(Boolean).join('\n')
    },
    buildHtml: (r) => buildPromoBlastEmailHtml(products, r.name?.trim() || 'Kak'),
    context: 'promo',
    delayMs: 500,
    logger: payload.logger,
  })
}
