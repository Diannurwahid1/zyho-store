import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { productId, phone, quantity, name } = body

    if (!productId || !phone) {
      return Response.json({ error: 'Product ID dan Nomor WhatsApp wajib diisi' }, { status: 400 })
    }

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
      const newWaitlist = await payload.create({
        collection: 'waitlists',
        data: {
          product: productId,
          status: 'active',
          totalEntries: 0,
        },
        overrideAccess: true,
      })
      waitlistId = newWaitlist.id
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
          quantity: (existingEntry.docs[0].quantity || 0) + (quantity || 1),
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
    await payload.create({
      collection: 'waitlist-entries',
      data: {
        waitlist: waitlistId,
        phone,
        name: name || 'Guest',
        quantity: quantity || 1,
        status: 'waiting',
        customer: customerId,
      },
      overrideAccess: true,
    })

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Waitlist join error:', error)
    return Response.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
