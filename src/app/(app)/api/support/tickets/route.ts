import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { auditLog, buildAuditMeta, enforceRateLimit } from '@/utilities/security'

export async function GET() {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (user.roles ?? []).includes('admin')

    const tickets = await payload.find({
      collection: 'support-tickets',
      where: isAdmin ? {} : { customer: { equals: user.id } },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
    })

    return NextResponse.json(tickets)
  } catch (err) {
    console.error('[support/tickets GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimited = enforceRateLimit({
      limit: 8,
      request: req,
      responseMessage: 'Too many support ticket submissions',
      windowMs: 10 * 60_000,
    })
    if (rateLimited) return rateLimited

    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) {
      auditLog({
        level: 'warn',
        logger: payload.logger,
        message: '[Security] Unauthorized support ticket creation blocked',
        meta: buildAuditMeta(req),
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { subject, category, message, priority } = body

    if (!subject || !category || !message) {
      return NextResponse.json({ error: 'subject, category, and message are required' }, { status: 400 })
    }

    const ticket = await payload.create({
      collection: 'support-tickets',
      data: {
        customer: user.id,
        subject,
        category,
        priority: priority || 'medium',
        status: 'open',
      },
    })

    await payload.create({
      collection: 'support-messages',
      data: {
        ticket: ticket.id,
        sender: user.id,
        senderRole: 'customer',
        message,
      },
    })

    auditLog({
      logger: payload.logger,
      message: '[Audit] Support ticket created',
      meta: buildAuditMeta(req, {
        category,
        priority: priority || 'medium',
        ticketID: ticket.id,
        userID: user.id,
      }),
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (err) {
    console.error('[support/tickets POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
