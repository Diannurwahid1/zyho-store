import { ownerOrStaff, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

const generateLicenseKey = () =>
  `CITRA-${crypto.randomUUID().replace(/-/g, '').slice(0, 20).toUpperCase()}`

export const Licenses: CollectionConfig = {
  slug: 'licenses',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: ownerOrStaff('customer'),
    update: staffOnly,
  },
  admin: {
    group: 'Digital Commerce',
    useAsTitle: 'licenseKey',
    defaultColumns: ['licenseKey', 'customer', 'product', 'status', 'activationCount', 'maxActivations'],
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'product', type: 'relationship', relationTo: 'products', required: true, index: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, index: true },
    {
      name: 'licenseKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [({ value }) => value || generateLicenseKey()],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'inactive', 'expired', 'revoked'],
      required: true,
    },
    { name: 'maxActivations', type: 'number', defaultValue: 1, min: 0 },
    { name: 'activationCount', type: 'number', defaultValue: 0, min: 0, admin: { readOnly: true } },
    { name: 'expiresAt', type: 'date' },
  ],
}
