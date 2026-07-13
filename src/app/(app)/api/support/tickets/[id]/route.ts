import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

type Params = { params: Promise<{ id: string }> }
const STAFF_ROLES = ['admin', 'manager', 'support'] as const

const isStaffUser = (roles: unknown) =>
  Array.isArray(roles) && roles.some((role) => STAFF_ROLES.includes(role))

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticket = await payload.findByID({
      collection: 'support-tickets',
      id: Number(id),
      depth: 1,
    })

    const isAdmin = isStaffUser(user.roles)
    const customerId = typeof ticket.customer === 'object' ? ticket.customer.id : ticket.customer
    if (!isAdmin && customerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await payload.find({
      collection: 'support-messages',
      where: {
        ticket: { equals: ticket.id },
        ...(isAdmin ? {} : { isInternalNote: { not_equals: true } }),
      },
      sort: 'createdAt',
      depth: 1,
    })

    return NextResponse.json({ ticket, messages: messages.docs })
  } catch (err) {
    console.error('[support/tickets/[id] GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const rateLimited = enforceRateLimit({
      limit: 20,
      request: req,
      responseMessage: 'Too many support replies',
      windowMs: 10 * 60_000,
    })
    if (rateLimited) return rateLimited

    const { id } = await params
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] Unauthorized support reply blocked',
        meta: buildAuditMeta(req, { ticketID: id }),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticket = await payload.findByID({
      collection: 'support-tickets',
      id: Number(id),
      depth: 0,
    })

    const isAdmin = isStaffUser(user.roles)
    const customerId = typeof ticket.customer === 'object' ? (ticket.customer as { id: number }).id : ticket.customer
    if (!isAdmin && customerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { message, attachmentIds } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const attachments =
      Array.isArray(attachmentIds) && attachmentIds.length > 0
        ? attachmentIds.map((fileId: number) => ({ file: fileId }))
        : undefined

    if (attachments?.length) {
      const attachmentChecks = await Promise.all(
        attachmentIds.map((fileId: number) =>
          payload.findByID({
            collection: 'media',
            id: fileId,
            depth: 0,
            overrideAccess: true,
          }),
        ),
      )

      const hasInvalidAttachment = attachmentChecks.some((media) => {
        const supportMedia = media as any
        const uploadedBy =
          typeof supportMedia.uploadedBy === 'object'
            ? supportMedia.uploadedBy?.id
            : supportMedia.uploadedBy
        return supportMedia.isSupportAttachment !== true || (!isAdmin && uploadedBy !== user.id)
      })

      if (hasInvalidAttachment) {
        return NextResponse.json({ error: 'Invalid attachment selection' }, { status: 400 })
      }
    }

    const msg = await payload.create({
      collection: 'support-messages',
      data: {
        ticket: ticket.id,
        sender: user.id,
        senderRole: isAdmin ? 'admin' : 'customer',
        message: message.trim(),
        ...(attachments ? { attachments } : {}),
      },
    })

    auditLog({
      logger: payload.logger,
      message: '[Audit] Support reply created',
      meta: buildAuditMeta(req, {
        messageID: msg.id,
        senderRole: isAdmin ? 'admin' : 'customer',
        ticketID: ticket.id,
        userID: user.id,
      }),
    })

    // If customer replies, reopen ticket if it was waiting
    if (!isAdmin && ticket.status === 'waiting_customer') {
      await payload.update({
        collection: 'support-tickets',
        id: ticket.id,
        data: { status: 'in_progress' },
      })
    }

    return NextResponse.json(msg, { status: 201 })
  } catch (err) {
    console.error('[support/tickets/[id] POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
