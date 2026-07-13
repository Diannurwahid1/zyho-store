import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import type { CollectionConfig } from 'payload'

export const PromoBanners: CollectionConfig = {
  slug: 'promo-banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'priority', 'updatedAt'],
    group: 'Marketing',
  },
  access: {
    create: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Banner Title',
      admin: {
        description: 'Internal title for admin reference',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
      admin: {
        description: 'Recommended size: 1920x400px (wide banner)',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link URL',
      admin: {
        description: 'Optional link when banner is clicked',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Display Priority',
      defaultValue: 0,
      admin: {
        description: 'Higher number = shown first (0 = lowest priority)',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
      admin: {
        description: 'When should this banner start showing?',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      admin: {
        description: 'When should this banner stop showing?',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
