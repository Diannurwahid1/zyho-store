import { getServerSideURL } from '@/utilities/getURL'
import type { Coupon, Media, User } from '@/payload-types'
import type { Payload } from 'payload'

const WA_BLAST_API_URL = process.env.WA_BLAST_API_URL || ''
const WA_BLAST_SESSION_ID = process.env.WA_BLAST_SESSION_ID || ''
const WA_BLAST_TOKEN = process.env.WA_BLAST_TOKEN || ''

type WhatsAppSendResult = {
  error?: string
  messageId?: string
  recipient: string
  success: boolean
}

type WhatsAppMessagePayload =
  | {
      recipient_type?: 'group' | 'individual'
      text: { body: string }
      to: string
      type: 'text'
    }
  | {
      document: { filename?: string; link: string; mimetype?: string }
      recipient_type?: 'group' | 'individual'
      to: string
      type: 'document'
    }
  | {
      image: { caption?: string; link: string }
      recipient_type?: 'group' | 'individual'
      to: string
      type: 'image'
    }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const isWhatsAppConfigured = () =>
  Boolean(WA_BLAST_API_URL && WA_BLAST_SESSION_ID && WA_BLAST_TOKEN)

export const getWhatsAppSessionStatus = async () => {
  if (!isWhatsAppConfigured()) {
    return { error: 'WhatsApp blast is not configured.', success: false as const }
  }

  try {
    const response = await fetch(`${WA_BLAST_API_URL}/sessions/${WA_BLAST_SESSION_ID}/status`, {
      headers: {
        Authorization: `Bearer ${WA_BLAST_TOKEN}`,
      },
      method: 'GET',
    })

    const result = await response.json().catch(() => ({}))
    const status = result?.data?.status || result?.status
    const isConnected = result?.data?.isConnected === true

    return {
      isConnected,
      raw: result,
      status,
      success: response.ok,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to check WhatsApp session status.',
      success: false as const,
    }
  }
}

export const formatWhatsAppNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('0')) {
    cleaned = `62${cleaned.slice(1)}`
  }

  if (cleaned && !cleaned.startsWith('62')) {
    cleaned = `62${cleaned}`
  }

  return cleaned
}

export const getAbsoluteMediaURL = (media?: Media | null) => {
  if (!media?.url) return null
  if (media.url.startsWith('http://') || media.url.startsWith('https://')) return media.url
  return `${getServerSideURL()}${media.url}`
}

const sendWhatsAppRequest = async (
  body: WhatsAppMessagePayload | WhatsAppMessagePayload[],
): Promise<WhatsAppSendResult[]> => {
  const messages = Array.isArray(body) ? body : [body]
  const recipients = messages.map((message) => message.to)

  if (!isWhatsAppConfigured()) {
    return recipients.map((recipient) => ({
      error: 'WhatsApp blast is not configured.',
      recipient,
      success: false,
    }))
  }

  const sessionStatus = await getWhatsAppSessionStatus()
  if (!sessionStatus.success) {
    return recipients.map((recipient) => ({
      error: sessionStatus.error || 'Unable to verify WhatsApp session status.',
      recipient,
      success: false,
    }))
  }

  if (!sessionStatus.isConnected) {
    return recipients.map((recipient) => ({
      error: `WhatsApp session ${WA_BLAST_SESSION_ID} is not connected (${sessionStatus.status || 'unknown'}).`,
      recipient,
      success: false,
    }))
  }

  try {
    const response = await fetch(`${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WA_BLAST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => ({}))
    const rows = Array.isArray(result) ? result : [result]

    return recipients.map((recipient, index) => {
      const row = rows[index] || rows[0] || {}
      const success = response.ok || row?.status === 'success'
      const errorMessage =
        row?.message ||
        result?.message ||
        result?.error ||
        `Failed to send WhatsApp message (HTTP ${response.status}).`

      return {
        error: success ? undefined : errorMessage,
        messageId: row?.messageId || row?.id,
        recipient,
        success,
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send WhatsApp message.'

    return recipients.map((recipient) => ({
      error: message,
      recipient,
      success: false,
    }))
  }
}

export const sendWhatsAppText = async (phone: string, message: string) => {
  const recipient = formatWhatsAppNumber(phone)
  const [result] = await sendWhatsAppRequest({
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: {
      body: message,
    },
  })

  return result
}

export const sendWhatsAppDocument = async ({
  caption,
  filename,
  mimetype,
  phone,
  url,
}: {
  caption?: string
  filename?: string
  mimetype?: string
  phone: string
  url: string
}) => {
  const recipient = formatWhatsAppNumber(phone)
  const payload: WhatsAppMessagePayload[] = []

  if (caption) {
    payload.push({
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        body: caption,
      },
    })
  }

  payload.push({
    recipient_type: 'individual',
    to: recipient,
    type: 'document',
    document: {
      filename,
      link: url,
      mimetype,
    },
  })

  const results = await sendWhatsAppRequest(payload)
  return results[results.length - 1] || results[0]
}

export const sendWhatsAppImage = async ({
  caption,
  phone,
  url,
}: {
  caption?: string
  phone: string
  url: string
}) => {
  const recipient = formatWhatsAppNumber(phone)
  const [result] = await sendWhatsAppRequest({
    recipient_type: 'individual',
    to: recipient,
    type: 'image',
    image: {
      caption,
      link: url,
    },
  })

  return result
}

export const buildVoucherBlastMessage = (coupon: Coupon, user?: Pick<User, 'memberTier' | 'name'>) => {
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
    `Kode voucher: *${coupon.code}*`,
    `Benefit: ${benefit}${minimumSpend}${expiresAt}`,
    '',
    'Terima kasih sudah belanja bersama kami. Voucher bisa langsung dipakai saat checkout.',
  ].join('\n')
}

export const collectCustomerRecipients = async (
  payload: Payload,
  allowedTiers?: Coupon['allowedTiers'],
) => {
  const recipients: Array<Pick<User, 'email' | 'id' | 'memberTier' | 'name' | 'phone' | 'roles'>> = []
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
        phone: true,
        roles: true,
      },
      where: {
        phone: {
          exists: true,
        },
      },
    })

    const docs = batch.docs as Array<Pick<
      User,
      'email' | 'id' | 'memberTier' | 'name' | 'phone' | 'roles'
    >>

    recipients.push(
      ...docs.filter((user) => {
        const roles = Array.isArray(user.roles) ? user.roles : []
        const hasCustomerRole = roles.includes('customer')
        const tierAllowed =
          !allowedTiers?.length || (user.memberTier ? allowedTiers.includes(user.memberTier) : false)

        return hasCustomerRole && Boolean(user.phone) && tierAllowed
      }),
    )

    hasNextPage = batch.hasNextPage
    page += 1
  }

  return recipients
}

export const sendVoucherBlast = async ({
  coupon,
  payload,
}: {
  coupon: Coupon
  payload: Payload
}) => {
  const recipients = await collectCustomerRecipients(payload, coupon.allowedTiers)
  let failed = 0
  let sent = 0

  for (const recipient of recipients) {
    if (!recipient.phone) continue

    const result = await sendWhatsAppText(
      recipient.phone,
      buildVoucherBlastMessage(coupon, recipient),
    )

    if (result.success) {
      sent += 1
    } else {
      failed += 1
      payload.logger.error(
        {
          couponID: coupon.id,
          error: result.error,
          phone: recipient.phone,
          userID: recipient.id,
        },
        '[WhatsApp] Voucher blast failed',
      )
    }

    await wait(2500)
  }

  return {
    failed,
    sent,
    total: recipients.length,
  }
}
