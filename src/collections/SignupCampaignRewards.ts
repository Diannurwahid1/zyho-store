import { adminOrManager, ownerOrStaff } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const SignupCampaignRewards: CollectionConfig = {
  slug: 'signup-campaign-rewards',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: ownerOrStaff('user'),
    update: adminOrManager,
  },
  admin: {
    defaultColumns: ['user', 'campaign', 'bucketLabel', 'result', 'createdAt'],
    group: 'Commerce',
    useAsTitle: 'userCampaignKey',
  },
  labels: {
    plural: 'Signup Campaign Rewards',
    singular: 'Signup Campaign Reward',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'signup-voucher-campaigns' as any,
      required: true,
      index: true,
    },
    {
      name: 'voucher',
      type: 'relationship',
      relationTo: 'coupons',
    },
    {
      name: 'result',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: ['pending', 'won', 'lost', 'skipped'],
      index: true,
    },
    {
      name: 'bucketID',
      type: 'text',
      index: true,
    },
    {
      name: 'bucketLabel',
      type: 'text',
    },
    {
      name: 'userCampaignKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'claimKey',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'reason',
      type: 'text',
    },
  ],
  timestamps: true,
}
