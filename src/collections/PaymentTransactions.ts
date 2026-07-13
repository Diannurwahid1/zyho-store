import { adminOrFinance, staffOnly } from '@/access/roles'
import { sendPaymentTransactionWhatsAppAfterChange } from './PaymentTransactions/hooks/sendWhatsAppStatus'
import type { CollectionConfig } from 'payload'

export const PaymentTransactions: CollectionConfig = {
  slug: 'payment-transactions',
  hooks: {
    afterChange: [sendPaymentTransactionWhatsAppAfterChange],
  },
  access: {
    create: staffOnly,
    delete: adminOrFinance,
    read: staffOnly,
    update: adminOrFinance,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'providerTransactionId',
    defaultColumns: ['provider', 'providerTransactionId', 'amount', 'currency', 'status', 'customer'],
  },
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'provider', type: 'select', options: ['stripe', 'midtrans', 'xendit', 'manual', 'dummy'], required: true },
    { name: 'providerTransactionId', type: 'text', required: true, index: true },
    { name: 'amount', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'IDR', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'created',
      options: ['created', 'waiting_payment', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'refund'],
      required: true,
    },
    { name: 'rawPayload', type: 'json' },
  ],
}
