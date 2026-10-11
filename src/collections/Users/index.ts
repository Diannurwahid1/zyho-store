import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'
import { getMemberTier } from '@/lib/member'
import { awardSignupVoucherCampaignAfterChange } from './hooks/awardSignupVoucherCampaign'
import { decryptSensitiveValue, hashGoogleID } from '@/utilities/sensitiveData'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => true,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'email', 'memberTier', 'totalSpentIDR', 'roles'],
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 86400, // 1 day in seconds
  },
  hooks: {
    afterChange: [awardSignupVoucherCampaignAfterChange],
    beforeChange: [
      ({ data, operation }) => {
        if (!data) return data

        const nextData = { ...data }

        if (operation === 'create') {
          if (!nextData.memberSince) {
            nextData.memberSince = new Date().toISOString()
          }

          if (typeof nextData.totalSpentIDR !== 'number') {
            nextData.totalSpentIDR = 0
          }
        }

        if (typeof nextData.totalSpentIDR === 'number') {
          nextData.memberTier = getMemberTier(nextData.totalSpentIDR)
        } else if (!nextData.memberTier) {
          nextData.memberTier = 'bronze'
        }

        return nextData
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'manager',
          value: 'manager',
        },
        {
          label: 'finance',
          value: 'finance',
        },
        {
          label: 'support',
          value: 'support',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'googleId',
      type: 'text',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value && typeof value === 'string') {
              if (value.startsWith('gid:')) return value
              return hashGoogleID(value)
            }
            return value
          },
        ],
        afterRead: [
          ({ value }) => {
            if (value && typeof value === 'string') {
              if (value.startsWith('gid:')) return 'connected'
              const decrypted = decryptSensitiveValue(value)
              return decrypted === value ? 'connected' : decrypted
            }
            return value
          },
        ],
      },
    },
    {
      name: 'googleAvatarURL',
      type: 'text',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: 'active',
      options: ['active', 'inactive', 'blocked'],
    },
    {
      name: 'memberTier',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: 'bronze',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      options: ['bronze', 'silver', 'gold', 'diamond'],
    },
    {
      name: 'totalSpentIDR',
      type: 'number',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Total Spent (IDR)',
      min: 0,
    },
    {
      name: 'membershipPoints',
      type: 'number',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: 0,
      min: 0,
      label: 'Membership Points',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'memberSince',
      type: 'date',
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'deleteAccountRequestedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deleteAccountReason',
      type: 'textarea',
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
  ],
}
