import { staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const CheckoutSessions: CollectionConfig = {
  slug: 'checkout-sessions',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  admin: {
    defaultColumns: ['sessionId', 'customer', 'status', 'paymentMethod', 'expiresAt'],
    group: 'Commerce',
    useAsTitle: 'sessionId',
  },
  fields: [
    { name: 'sessionId', type: 'text', required: true, unique: true, index: true },
    {
      name: 'activeKey',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'creating',
      index: true,
      options: ['creating', 'pending', 'completed', 'cancelled', 'expired'],
    },
    { name: 'expiresAt', type: 'date', required: true, index: true },
    { name: 'reservationId', type: 'text', index: true },
    { name: 'cartId', type: 'text' },
    { name: 'currency', type: 'select', required: true, options: ['IDR', 'USD'] },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: ['pakasir', 'nowpayments'],
    },
    { name: 'paymentData', type: 'json' },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
  ],
  timestamps: true,
}
