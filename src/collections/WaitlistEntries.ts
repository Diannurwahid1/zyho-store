import { adminOrManager, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const WaitlistEntries: CollectionConfig = {
  slug: 'waitlist-entries',
  access: {
    create: staffOnly,
    delete: adminOrManager,
    read: staffOnly,
    update: adminOrManager,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'phone',
    defaultColumns: ['waitlist', 'customer', 'phone', 'quantity', 'status', 'createdAt'],
  },
  labels: {
    plural: 'Waitlist Entries',
    singular: 'Waitlist Entry',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        // Increment totalEntries on parent waitlist
        const waitlistId =
          typeof doc.waitlist === 'object' ? doc.waitlist?.id : doc.waitlist
        if (!waitlistId) return

        try {
          await req.payload.db.updateOne({
            collection: 'waitlists' as any,
            data: {
              totalEntries: { $inc: 1 },
            },
            req,
            where: { id: { equals: waitlistId } },
          })
        } catch (err) {
          req.payload.logger.warn({ err }, '[WaitlistEntry] Failed to update totalEntries')
        }
      },
    ],
  },
  fields: [
    {
      name: 'waitlist',
      type: 'relationship',
      relationTo: 'waitlists',
      required: true,
      index: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        description: 'User yang terdaftar (jika login).',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Nama customer (untuk guest atau display).',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Nomor WhatsApp untuk notifikasi saat stok tersedia.',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
      admin: {
        description: 'Jumlah unit yang diinginkan.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'waiting',
      options: [
        { label: 'Waiting', value: 'waiting' },
        { label: 'Notified', value: 'notified' },
        { label: 'Purchased', value: 'purchased' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'notifiedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
