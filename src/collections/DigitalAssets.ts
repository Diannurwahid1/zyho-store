import { adminOrManager, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const DigitalAssets: CollectionConfig = {
  slug: 'digital-assets',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: staffOnly,
    update: adminOrManager,
  },
  admin: {
    group: 'Digital Commerce',
    useAsTitle: 'fileName',
    defaultColumns: ['fileName', 'product', 'version', 'status', 'protected'],
  },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true, index: true },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'fileName', type: 'text', required: true },
    { name: 'fileSize', type: 'number', admin: { description: 'File size in bytes' } },
    { name: 'version', type: 'text', defaultValue: '1.0.0' },
    { name: 'changelog', type: 'textarea' },
    { name: 'protected', type: 'checkbox', defaultValue: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
      required: true,
    },
  ],
}
