'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'
import { createOrderAccessToken } from '@/utilities/orderAccessToken'
import { enforceRateLimit, getClientIP } from '@/utilities/security'
import { headers as getHeaders } from 'next/headers'

type SendOrderAccessEmailArgs = {
  email: string
  orderID: string
}

type SendOrderAccessEmailResult = {
  success: boolean
  error?: string
}

export async function sendOrderAccessEmail({
  email,
  orderID,
}: SendOrderAccessEmailArgs): Promise<SendOrderAccessEmailResult> {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedOrderID = orderID.trim()
  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    !/^\d{1,20}$/.test(normalizedOrderID)
  ) {
    return { success: true }
  }

  const requestHeaders = await getHeaders()
  const rateLimitRequest = new Request(`${getServerSideURL()}/find-order`, {
    headers: requestHeaders,
    method: 'POST',
  })
  const rateLimited = enforceRateLimit({
    key: `find-order:${getClientIP(rateLimitRequest)}`,
    limit: 5,
    request: rateLimitRequest,
    windowMs: 60 * 60_000,
  })
  if (rateLimited) return { success: true }

  const payload = await getPayload({ config: configPromise })

  try {
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { id: { equals: normalizedOrderID } },
          { customerEmail: { equals: normalizedEmail } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    const order = orders[0]

    if (!order) {
      return { success: true }
    }

    const serverURL = getServerSideURL()
    const accessToken = createOrderAccessToken({ email: normalizedEmail, orderID: order.id })
    const orderURL = `${serverURL}/orders/${order.id}?accessToken=${encodeURIComponent(accessToken)}`

    const emailBody = `
        <h1>View Your Order</h1>
        <p>Click the link below to view your order details:</p>
        <p><a href="${orderURL}">View Order #${order.id}</a></p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${orderURL}</p>
        <p>This link will give you access to view your order details.</p>
      `

    await payload.sendEmail({
      to: normalizedEmail,
      subject: `Access your order #${order.id}`,
      html: emailBody,
    })

    return { success: true }
  } catch (err) {
    payload.logger.error({ msg: 'Failed to send order access email', err })
    return { success: true }
  }
}
