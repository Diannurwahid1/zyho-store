import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { enforceRateLimit, getClientIP, readJSONBodyLimited } from '@/utilities/security'

const MAX_BODY_BYTES = 4 * 1024

export async function POST(req: Request) {
  const rateLimited = enforceRateLimit({
    key: `waitlist-join:${getClientIP(req)}`,
    limit: 5,
    request: req,
    responseMessage: 'Terlalu banyak permintaan waitlist.',
    windowMs: 60 * 60_000,
  })
  if (rateLimited) return rateLimited

  try {
    const payload = await getPayload({ config: configPromise })
    const parsed = await readJSONBodyLimited<Record<string, unknown>>(req, MAX_BODY_BYTES)
    if (parsed.response) return parsed.response
    const body = parsed.data
    const productId = String(body?.productId || '')
    const phone = String(body?.phone || '').replace(/\D/g, '')
    const quantity = Number(body?.quantity ?? 1)
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : 'Guest'

    if (
      !/^\d{1,20}$/.test(productId) ||
      phone.length < 10 ||
      phone.length > 15 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return Response.json({ error: 'Data waitlist tidak valid.' }, { status: 400 })
    }

    await payload.findByID({
      collection: 'products',
      depth: 0,
      id: productId,
      overrideAccess: true,
    })

    // 1. Cari atau buat Waitlist untuk produk ini
    let waitlistId: number | string

    const existingWaitlist = await payload.find({
      collection: 'waitlists',
      where: {
        product: { equals: productId },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existingWaitlist.docs.length > 0) {
      waitlistId = existingWaitlist.docs[0].id
      
      // Jika statusnya closed, buka kembali
      if (existingWaitlist.docs[0].status === 'closed') {
        await payload.update({
          collection: 'waitlists',
          id: waitlistId,
          data: { status: 'active' },
          overrideAccess: true,
        })
      }
    } else {
      try {
        const newWaitlist = await payload.create({
          collection: 'waitlists',
          data: { product: Number(productId), status: 'active', totalEntries: 0 },
          overrideAccess: true,
        })
        waitlistId = newWaitlist.id
      } catch {
        const raced = await payload.find({
          collection: 'waitlists',
          limit: 1,
          overrideAccess: true,
          where: { product: { equals: productId } },
        })
        if (!raced.docs[0]) throw new Error('Gagal membuat waitlist.')
        waitlistId = raced.docs[0].id
      }
    }

    // 2. Cek apakah user sudah ada di waitlist ini dengan nomor yang sama
    const existingEntry = await payload.find({
      collection: 'waitlist-entries',
      where: {
        and: [
          { waitlist: { equals: waitlistId } },
          { phone: { equals: phone } },
          { status: { equals: 'waiting' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existingEntry.docs.length > 0) {
      // Update quantity jika sudah ada
      await payload.update({
        collection: 'waitlist-entries',
        id: existingEntry.docs[0].id,
        data: {
          quantity,
        },
        overrideAccess: true,
      })
      
      return Response.json({ success: true, message: 'Quantity updated' })
    }

    // 3. Coba cari user berdasarkan phone (opsional)
    let customerId = undefined
    const users = await payload.find({
      collection: 'users',
      where: {
        phone: { equals: phone },
      },
      limit: 1,
      overrideAccess: true,
    })
    
    if (users.docs.length > 0) {
      customerId = users.docs[0].id
    }

    // 4. Buat entry baru
    try {
      await payload.create({
        collection: 'waitlist-entries',
        data: {
          waitlist: waitlistId,
          phone,
          name: name || 'Guest',
          quantity,
          status: 'waiting',
          customer: customerId,
        },
        overrideAccess: true,
      })
    } catch (error) {
      const racedEntry = await payload.find({
        collection: 'waitlist-entries',
        limit: 1,
        overrideAccess: true,
        where: {
          and: [
            { waitlist: { equals: waitlistId } },
            { phone: { equals: phone } },
            { status: { equals: 'waiting' } },
          ],
        },
      })
      if (!racedEntry.docs[0]) throw error
      await payload.update({
        collection: 'waitlist-entries',
        data: { quantity },
        id: racedEntry.docs[0].id,
        overrideAccess: true,
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Waitlist join error:', error)
    return Response.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
