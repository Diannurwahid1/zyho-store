import { formatWhatsAppNumber, isWhatsAppConfigured, sendWhatsAppText } from '@/lib/whatsapp'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { phone } = body as { phone?: string }

  if (!phone || typeof phone !== 'string') {
    return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 })
  }

  // Basic format validation
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 10 || cleaned.length > 15) {
    return NextResponse.json(
      { error: 'Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx.' },
      { status: 400 },
    )
  }

  if (!isWhatsAppConfigured()) {
    // If WA not configured, skip verification but still accept
    return NextResponse.json({
      success: true,
      skipped: true,
      message: 'Verifikasi dilewati (WhatsApp tidak dikonfigurasi).',
    })
  }

  const formatted = formatWhatsAppNumber(phone)

  try {
    const greeting = `Halo! 👋\n\nTerima kasih sudah berbelanja di *zyho.store*.\nNomor WhatsApp kamu berhasil diverifikasi ✅\n\nKami akan menghubungi kamu di nomor ini untuk konfirmasi order dan pengiriman produk digital.\n\nSelamat berbelanja! 🛒`

    const result = await sendWhatsAppText(formatted, greeting)

    if (result?.success) {
      return NextResponse.json({
        success: true,
        message: 'Pesan verifikasi berhasil dikirim ke WhatsApp kamu.',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            'Nomor WhatsApp tidak valid atau tidak terdaftar. Pastikan nomor yang kamu masukkan benar dan aktif di WhatsApp.',
        },
        { status: 422 },
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengirim pesan verifikasi. Coba lagi nanti.' },
      { status: 500 },
    )
  }
}
