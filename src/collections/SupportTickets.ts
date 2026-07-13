import { ownerOrStaff } from '@/access/roles'
import type { CollectionConfig } from 'payload'

const generateTicketNumber = () => `TICKET-${Date.now().toString(36).toUpperCase()}`

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ownerOrStaff('customer'),
    read: ownerOrStaff('customer'),
    update: ownerOrStaff('customer'),
  },
  admin: {
    group: 'Support',
    useAsTitle: 'subject',
    defaultColumns: ['ticketNumber', 'customer', 'subject', 'priority', 'status', 'chatAction'],
    components: {
      views: {
        edit: {
          chat: {
            path: '/chat',
            Component: '@/collections/SupportTickets/AdminChatView#AdminChatView',
            tab: {
              label: 'Chat',
              href: '/chat',
            },
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'chatAction',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/collections/SupportTickets/ChatButtonCell#ChatButtonCell',
        },
      },
    },
    {
      name: 'ticketNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true },
      hooks: { beforeValidate: [({ value }) => value || generateTicketNumber()] },
    },
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'relatedOrder', type: 'relationship', relationTo: 'orders' },
    { name: 'relatedProduct', type: 'relationship', relationTo: 'products' },
    { name: 'subject', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'payment_issue',
        'download_problem',
        'license_key_problem',
        'product_access_problem',
        'refund_request',
        'technical_support',
        'general_question',
      ],
    },
    { name: 'priority', type: 'select', defaultValue: 'medium', options: ['low', 'medium', 'high', 'urgent'], required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: ['open', 'waiting_customer', 'in_progress', 'resolved', 'closed'],
      required: true,
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
  ],
}
