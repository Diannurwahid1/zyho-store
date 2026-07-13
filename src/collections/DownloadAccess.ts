import { ownerOrStaff, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const DownloadAccess: CollectionConfig = {
  slug: 'download-access',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: ownerOrStaff('customer'),
    update: staffOnly,
  },
  admin: {
    group: 'Digital Commerce',
    useAsTitle: 'id',
    defaultColumns: ['customer', 'product', 'asset', 'status', 'downloadCount', 'maxDownloads'],
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'product', type: 'relationship', relationTo: 'products', required: true, index: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    { name: 'asset', type: 'relationship', relationTo: 'digital-assets', required: true, index: true },
    { name: 'status', type: 'select', defaultValue: 'active', options: ['active', 'expired', 'revoked'], required: true },
    { name: 'maxDownloads', type: 'number', defaultValue: 10, min: 0 },
    { name: 'downloadCount', type: 'number', defaultValue: 0, min: 0, admin: { readOnly: true } },
    { name: 'expiresAt', type: 'date' },
  ],
}
