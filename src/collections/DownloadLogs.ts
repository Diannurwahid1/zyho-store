import { ownerOrStaff, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const DownloadLogs: CollectionConfig = {
  slug: 'download-logs',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: staffOnly,
    read: ownerOrStaff('customer'),
    update: staffOnly,
  },
  admin: {
    group: 'Digital Commerce',
    useAsTitle: 'id',
    defaultColumns: ['customer', 'product', 'asset', 'ip', 'downloadedAt'],
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'product', type: 'relationship', relationTo: 'products', required: true, index: true },
    { name: 'asset', type: 'relationship', relationTo: 'digital-assets', required: true, index: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    { name: 'ip', type: 'text' },
    { name: 'userAgent', type: 'textarea' },
    { name: 'downloadedAt', type: 'date', defaultValue: () => new Date().toISOString(), admin: { readOnly: true } },
  ],
}
