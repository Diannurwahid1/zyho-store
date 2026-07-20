import { adminOrManager, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const Waitlists: CollectionConfig = {
  slug: 'waitlists',
  access: {
    create: () => true, // Public — anyone can join waitlist
    delete: adminOrManager,
    read: staffOnly,
    update: adminOrManager,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'id',
    defaultColumns: ['product', 'status', 'totalEntries', 'voucher', 'createdAt'],
  },
  labels: {
    plural: 'Waiting Lists',
    singular: 'Waiting List',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Produk yang sedang habis stok dan dibuka waiting list.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
      required: true,
    },
    {
      name: 'voucher',
      type: 'relationship',
      relationTo: 'coupons',
      admin: {
        description:
          'Opsional: Voucher diskon yang akan diberikan ke member waiting list saat stok tersedia kembali.',
      },
    },
    {
      name: 'notifyMessage',
      type: 'textarea',
      admin: {
        description:
          'Pesan custom yang dikirim saat stok tersedia. Gunakan {{name}}, {{product}}, {{voucher}} sebagai placeholder.',
      },
    },
    {
      name: 'entries',
      type: 'join',
      collection: 'waitlist-entries',
      on: 'waitlist',
      admin: {
        allowCreate: false,
        defaultColumns: ['customer', 'phone', 'quantity', 'status', 'createdAt'],
      },
    },
    {
      name: 'totalEntries',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'blastAction',
      type: 'ui',
      admin: {
        components: {
          Field: './Waitlists/BlastField',
        },
        position: 'sidebar',
      },
    },
  ],
}
