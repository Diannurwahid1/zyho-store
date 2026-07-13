import { adminOrManager } from '@/access/roles'
import { getWhatsAppSessionStatus, sendWhatsAppText } from '@/lib/whatsapp'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

const ensureAdminAccess = async (req: NextRequest) => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  const allowed = adminOrManager({ req: { user } as any })

  if (!user || !allowed) {
    return { payload, user: null }
  }

  return { payload, user }
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await ensureAdminAccess(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = await getWhatsAppSessionStatus()

    return NextResponse.json({ status })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await ensureAdminAccess(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''

    if (!phone) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: 'Pesan WhatsApp wajib diisi.' }, { status: 400 })
    }

    const result = await sendWhatsAppText(phone, message)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Gagal mengirim WhatsApp.',
          result,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      message: 'Pesan WhatsApp test berhasil dikirim.',
      result,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
