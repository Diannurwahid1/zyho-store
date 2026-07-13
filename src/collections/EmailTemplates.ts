import { adminOrManager } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: adminOrManager,
    update: adminOrManager,
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['welcome', 'order_paid', 'payment_pending', 'download_ready', 'license_created', 'support_reply', 'password_reset'],
    },
    { name: 'status', type: 'select', defaultValue: 'active', options: ['active', 'inactive'], required: true },
  ],
}
