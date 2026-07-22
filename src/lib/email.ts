import nodemailer from 'nodemailer'
import type { Payload } from 'payload'

// ─── ENV Config ──────────────────────────────────────────────────
const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10)
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false' // default true (SSL)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const SMTP_DOMAIN = process.env.SMTP_DOMAIN || 'zyho.store'
const STORE_NAME = process.env.SMTP_STORE_NAME || 'Zyho Store'

// ─── Sender Contexts ────────────────────────────────────────────
export type EmailContext =
  | 'order'       // order@domain — order confirmations, payment status
  | 'promo'       // promo@domain — voucher blasts, promo blasts
  | 'support'     // support@domain — support replies
  | 'noreply'     // noreply@domain — verification, password reset
  | 'info'        // info@domain — general notifications, waitlist

const SENDER_MAP: Record<EmailContext, { name: string; prefix: string }> = {
  order:   { name: `${STORE_NAME} Order`,   prefix: 'order' },
  promo:   { name: `${STORE_NAME} Promo`,   prefix: 'promo' },
  support: { name: `${STORE_NAME} Support`, prefix: 'support' },
  noreply: { name: STORE_NAME,              prefix: 'noreply' },
  info:    { name: STORE_NAME,              prefix: 'info' },
}

const getSender = (context: EmailContext) => {
  const { name, prefix } = SENDER_MAP[context]
  return `"${name}" <${prefix}@${SMTP_DOMAIN}>`
}

// ─── Transporter (lazy singleton) ────────────────────────────────
let _transporter: nodemailer.Transporter | null = null

const getTransporter = () => {
  if (_transporter) return _transporter

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  return _transporter
}

export const isEmailConfigured = () =>
  Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

// ─── Types ───────────────────────────────────────────────────────
export type EmailSendResult = {
  success: boolean
  messageId?: string
  error?: string
  recipient: string
}

// ─── Core Send Function ──────────────────────────────────────────
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  context = 'info',
}: {
  to: string
  subject: string
  text: string
  html?: string
  context?: EmailContext
}): Promise<EmailSendResult> => {
  if (!to?.trim()) {
    return { success: false, error: 'No recipient email', recipient: '' }
  }

  const transporter = getTransporter()
  if (!transporter) {
    return { success: false, error: 'Email SMTP is not configured', recipient: to }
  }

  try {
    const info = await transporter.sendMail({
      from: getSender(context),
      to,
      subject,
      text,
      html: html || textToHtml(text),
    })

    return {
      success: true,
      messageId: info.messageId,
      recipient: to,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
      recipient: to,
    }
  }
}

// ─── Bulk Send (with delay to avoid rate limiting) ───────────────
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const sendBulkEmail = async ({
  recipients,
  subject,
  buildText,
  buildHtml,
  context = 'info',
  delayMs = 500,
  logger,
}: {
  recipients: Array<{ email: string; name?: string; [key: string]: any }>
  subject: string
  buildText: (recipient: { email: string; name?: string; [key: string]: any }) => string
  buildHtml?: (recipient: { email: string; name?: string; [key: string]: any }) => string
  context?: EmailContext
  delayMs?: number
  logger?: Payload['logger']
}): Promise<{ sent: number; failed: number; total: number }> => {
  let sent = 0
  let failed = 0

  for (const recipient of recipients) {
    if (!recipient.email?.trim()) continue

    const text = buildText(recipient)
    const html = buildHtml ? buildHtml(recipient) : undefined

    const result = await sendEmail({
      to: recipient.email,
      subject,
      text,
      html,
      context,
    })

    if (result.success) {
      sent += 1
    } else {
      failed += 1
      logger?.error(
        { email: recipient.email, error: result.error },
        '[Email] Bulk send failed',
      )
    }

    if (recipients.length > 1) await wait(delayMs)
  }

  return { sent, failed, total: recipients.length }
}

// ─── Text → HTML Converter ───────────────────────────────────────
const textToHtml = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Convert *bold* to <strong>
  const withBold = escaped.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')

  // Convert newlines to <br>
  const withBreaks = withBold.replace(/\n/g, '<br>')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #111; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 20px; }
    .content { background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; padding: 16px; color: #999; font-size: 12px; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <div class="header"><h1>${STORE_NAME}</h1></div>
  <div class="content">${withBreaks}</div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
  </div>
</body>
</html>`
}
