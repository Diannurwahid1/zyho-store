import { sendWaitlistBlast } from '@/lib/whatsapp'
import { emailWaitlistBlast } from '@/lib/commerceEmail'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const { id: waitlistId } = await params

    if (!waitlistId) {
      return NextResponse.json(
        { error: 'Waitlist ID is required' },
        { status: 400 }
      )
    }

    // Check authentication - only admin/manager can trigger blast
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const roles = Array.isArray(user.roles) ? user.roles : []
    const isAuthorized = roles.some(role => ['admin', 'manager'].includes(role))

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or Manager role required' },
        { status: 403 }
      )
    }

    // Send the WA blast
    const result = await sendWaitlistBlast({
      waitlistId,
      payload,
    })

    // Send email blast (parallel, non-blocking)
    void emailWaitlistBlast({ waitlistId, payload })
      .then((emailResult) => {
        payload.logger.info(
          { waitlistId, emailSent: emailResult.sent, emailFailed: emailResult.failed },
          '[Waitlist] Email blast completed',
        )
      })
      .catch((err) => {
        payload.logger.error({ err, waitlistId }, '[Waitlist] Email blast error')
      })

    // Log the blast activity
    payload.logger.info(
      {
        waitlistId,
        result,
        userId: user.id,
      },
      '[Waitlist] Blast sent successfully',
    )

    return NextResponse.json({
      success: true,
      message: `WhatsApp blast sent to ${result.sent} recipients`,
      data: result,
    })
  } catch (error) {
    console.error('Error sending waitlist blast:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send waitlist blast'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    )
  }
}
