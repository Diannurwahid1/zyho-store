import { ownerOrStaff } from '@/access/roles'
import { checkRole } from '@/access/utilities'
import type { CollectionConfig, Where } from 'payload'

const STAFF_ROLES = ['admin', 'manager', 'support'] as const

const isStaff = (user: any) => checkRole([...STAFF_ROLES], user)

export const SupportMessages: CollectionConfig = {
  slug: 'support-messages',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ownerOrStaff('sender'),
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isStaff(user)) return true

      return {
        and: [
          {
            'ticket.customer': {
              equals: user.id,
            },
          },
          {
            isInternalNote: {
              not_equals: true,
            },
          },
        ],
      } as Where
    },
    update: ownerOrStaff('sender'),
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if ((operation !== 'create' && operation !== 'update') || !data || !req.user) {
          return data
        }

        const ticketID =
          typeof data.ticket === 'object' && data.ticket !== null ? data.ticket.id : data.ticket

        if (!ticketID) {
          throw new Error('Ticket is required.')
        }

        const ticket = await req.payload.findByID({
          collection: 'support-tickets',
          id: ticketID,
          depth: 0,
          overrideAccess: true,
          req,
        })

        const customerID =
          typeof ticket.customer === 'object' && ticket.customer !== null
            ? ticket.customer.id
            : ticket.customer

        if (!isStaff(req.user) && String(customerID) !== String(req.user.id)) {
          throw new Error('You are not allowed to add messages to this ticket.')
        }

        if (!isStaff(req.user)) {
          data.sender = req.user.id
          data.senderRole = 'customer'
          data.isInternalNote = false
        }

        return data
      },
    ],
  },
  admin: {
    group: 'Support',
    useAsTitle: 'id',
    defaultColumns: ['ticket', 'sender', 'senderRole', 'isInternalNote', 'createdAt'],
  },
  fields: [
    { name: 'ticket', type: 'relationship', relationTo: 'support-tickets', required: true, index: true },
    { name: 'sender', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'senderRole', type: 'select', options: ['customer', 'admin', 'support'], required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'attachments',
      type: 'array',
      fields: [{ name: 'file', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'isInternalNote', type: 'checkbox', defaultValue: false },
  ],
}
