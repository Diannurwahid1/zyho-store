import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'
import type { CollectionConfig } from 'payload'

export const PaymentWebhookEvents: CollectionConfig = {
  slug: 'payment-webhook-events',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: ({ req: { user } }) => checkRole(['admin', 'manager', 'finance'], user),
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['externalId', 'provider', 'eventType', 'status', 'processedAt', 'createdAt'],
    group: 'Commerce',
    useAsTitle: 'externalId',
  },
  fields: [
    { name: 'externalId', type: 'text', required: true, unique: true, index: true },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: ['sumopod', 'nowpayments'],
    },
    { name: 'eventType', type: 'text', required: true, index: true },
    { name: 'payloadHash', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'processing',
      index: true,
      options: ['processing', 'processed', 'failed'],
    },
    {
      name: 'paymentAttempt',
      type: 'relationship',
      relationTo: 'payment-attempts',
      index: true,
    },
    { name: 'processedAt', type: 'date' },
    { name: 'error', type: 'textarea' },
  ],
  timestamps: true,
}
