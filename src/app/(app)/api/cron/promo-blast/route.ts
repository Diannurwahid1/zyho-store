import { collectCustomerRecipients, sendWhatsAppText } from '@/lib/whatsapp'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const CRON_SECRET = process.env.CRON_SECRET
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://zyho.store'

/**
 * GET /api/cron/promo-blast
 *
 * Cron endpoint — setiap pagi jam 6 WIB (23:00 UTC sehari sebelumnya)
 * otomatis WA blast promosi produk yang tersedia ke semua customer.
 *
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  if (!CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  const secret = authHeader?.replace('Bearer ', '')

  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Ambil produk yang published dan stoknya > 0
    const productsResult = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 50,
      overrideAccess: true,
      sort: '-createdAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { inventory: { greater_than: 0 } },
        ],
      },
      select: {
        title: true,
        priceInIDR: true,
        priceInUSD: true,
        inventory: true,
        shortDescription: true,
        isFeatured: true,
      },
    })

    const products = productsResult.docs as Array<{
      id: number | string
      inventory?: number
      isFeatured?: boolean
      priceInIDR?: number
      priceInUSD?: number
      shortDescription?: string
      title: string
    }>

    if (products.length === 0) {
      payload.logger.info('[PromoBlast] Tidak ada produk tersedia, skip blast.')
      return NextResponse.json({ message: 'No products available', sent: 0 })
    }

    // Bangun pesan promosi
    const message = buildPromoMessage(products)

    // Ambil semua customer yang punya nomor WA
    const recipients = await collectCustomerRecipients(payload)

    if (recipients.length === 0) {
      payload.logger.info('[PromoBlast] Tidak ada customer dengan nomor WA, skip blast.')
      return NextResponse.json({ message: 'No recipients', sent: 0 })
    }

    let sent = 0
    let failed = 0

    for (const recipient of recipients) {
      if (!recipient.phone) continue

      const personalMessage = personalizeMessage(message, recipient.name || '')

      try {
        const result = await sendWhatsAppText(recipient.phone, personalMessage)

        if (result.success) {
          sent += 1
        } else {
          failed += 1
          payload.logger.warn(
            { error: result.error, phone: recipient.phone },
            '[PromoBlast] Gagal kirim ke customer',
          )
        }
      } catch (err) {
        failed += 1
        payload.logger.error({ err, phone: recipient.phone }, '[PromoBlast] Error kirim WA')
      }

      // Delay 1.5 detik antar pesan agar tidak kena rate limit
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    payload.logger.info({ failed, sent, total: recipients.length }, '[PromoBlast] Blast selesai')

    return NextResponse.json({
      success: true,
      sent,
      failed,
      totalRecipients: recipients.length,
      totalProducts: products.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[PromoBlast] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

// ─── Helper Functions ────────────────────────────────────────────

function personalizeMessage(message: string, name: string): string {
  const greeting = name.trim() || 'Kak'
  return message.replace('{{name}}', greeting)
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

function buildPromoMessage(
  products: Array<{
    id: number | string
    inventory?: number
    isFeatured?: boolean
    priceInIDR?: number
    shortDescription?: string
    title: string
  }>,
): string {
  // Prioritaskan featured products, lalu sort by terbaru
  const sorted = [...products].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return 0
  })

  // Ambil max 5 produk untuk ditampilkan
  const featured = sorted.slice(0, 5)

  const productLines = featured
    .map((p, i) => {
      const price = p.priceInIDR ? ` — ${formatRupiah(p.priceInIDR)}` : ''
      const stock = p.inventory ? ` (sisa ${p.inventory})` : ''
      return `${getEmoji(i)} *${p.title}*${price}${stock}`
    })
    .join('\n')

  const sisaProduk = products.length > 5 ? `\n...dan ${products.length - 5} produk lainnya!` : ''

  const lines = [
    `Selamat pagi {{name}}! ☀️`,
    '',
    `Ada produk digital siap pakai hari ini di *Zyho Store*:`,
    '',
    productLines,
    sisaProduk,
    '',
    `🛒 Langsung cek & order di sini ya:`,
    `${SITE_URL}/shop`,
    '',
    `Terima kasih sudah jadi bagian dari Zyho Store 🙏`,
  ]

  return lines.join('\n')
}

function getEmoji(index: number): string {
  const emojis = ['🔥', '⭐', '💎', '🎯', '✨']
  return emojis[index] || '📦'
}
