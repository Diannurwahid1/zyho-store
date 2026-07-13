import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'rating', 'status', 'priority'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Role/Title',
      admin: {
        description: 'e.g., "Marketing Manager", "Freelance Designer"',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar Image',
      admin: {
        description: 'Customer photo (optional)',
      },
    },
    {
      name: 'commentId',
      type: 'text',
      required: true,
      label: 'Comment (Indonesian)',
      admin: {
        description: 'Testimonial text in Indonesian',
      },
    },
    {
      name: 'commentEn',
      type: 'text',
      required: true,
      label: 'Comment (English)',
      admin: {
        description: 'Testimonial text in English',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      label: 'Rating (1-5 stars)',
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
        description: 'Higher number = shown first',
      },
    },
  ],
}
