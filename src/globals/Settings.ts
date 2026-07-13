import { adminOnly } from '@/access/adminOnly'
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'storeName', type: 'text', defaultValue: 'zyho', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'primaryColor', type: 'text', defaultValue: '#111827' },
    { name: 'supportEmail', type: 'email' },
    { name: 'paymentConfig', type: 'json' },
    { name: 'emailConfig', type: 'json' },
    { name: 'storageConfig', type: 'json' },
    {
      name: 'commerce',
      type: 'group',
      label: 'Commerce Settings',
      fields: [
        {
          name: 'enableUSD',
          type: 'checkbox',
          label: 'Aktifkan checkout USD',
          defaultValue: false,
          admin: {
            description:
              'Saat nonaktif, switch USD disembunyikan di frontend dan checkout USD ditolak backend.',
          },
        },
      ],
    },
    {
      name: 'trustBadges',
      type: 'group',
      label: 'Homepage Trust Badges',
      fields: [
        {
          name: 'totalUsers',
          type: 'text',
          label: 'Total Users',
          defaultValue: '10,000+',
          admin: {
            description: 'Display value for total users (e.g., "10,000+")',
          },
        },
        {
          name: 'satisfactionRate',
          type: 'text',
          label: 'Satisfaction Rate',
          defaultValue: '99%',
          admin: {
            description: 'Customer satisfaction percentage',
          },
        },
        {
          name: 'supportAvailability',
          type: 'text',
          label: 'Support Availability',
          defaultValue: '24/7',
          admin: {
            description: 'Support hours (e.g., "24/7")',
          },
        },
        {
          name: 'partnerLogos',
          type: 'array',
          label: 'Partner Logos',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Partner Name',
            },
          ],
        },
      ],
    },
    {
      name: 'legalPages',
      type: 'group',
      fields: [
        { name: 'termsPage', type: 'relationship', relationTo: 'pages' },
        { name: 'privacyPage', type: 'relationship', relationTo: 'pages' },
        { name: 'refundPage', type: 'relationship', relationTo: 'pages' },
      ],
    },
  ],
}
