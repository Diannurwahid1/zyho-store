import { adminOrManager } from '@/access/roles'
import type { CollectionConfig } from 'payload'

const validateRewardBuckets = ({ data }: { data?: any }) => {
  if (!data) return data

  const rewardBuckets = Array.isArray(data.rewardBuckets) ? data.rewardBuckets : []
  const totalWeight = rewardBuckets.reduce((sum: number, bucket: any) => {
    if (bucket?.isActive === false) return sum
    return sum + Math.max(0, Number(bucket?.probabilityWeight) || 0)
  }, 0)

  if (totalWeight > 100) {
    throw new Error('Total probabilitas semua reward bucket tidak boleh melebihi 100%.')
  }

  return data
}

export const SignupVoucherCampaigns: CollectionConfig = {
  slug: 'signup-voucher-campaigns',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: adminOrManager,
    update: adminOrManager,
  },
  admin: {
    defaultColumns: ['title', 'status', 'priority', 'startsAt', 'endsAt'],
    group: 'Commerce',
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [validateRewardBuckets],
  },
  labels: {
    plural: 'Signup Voucher Campaigns',
    singular: 'Signup Voucher Campaign',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'active', 'inactive', 'ended'],
      required: true,
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Campaign dengan priority tertinggi akan dipilih saat ada lebih dari satu yang aktif.',
      },
    },
    { name: 'startsAt', type: 'date' },
    { name: 'endsAt', type: 'date' },
    {
      name: 'appliesTo',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Semua Produk', value: 'all' },
        { label: 'Produk Tertentu', value: 'specific' },
      ],
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.appliesTo === 'specific',
        description: 'Pilih produk yang berlaku untuk voucher hasil campaign ini.',
      },
    },
    {
      name: 'codePrefix',
      type: 'text',
      defaultValue: 'WELCOME',
      admin: {
        description: 'Prefix default kode voucher jika bucket tidak menentukan prefix sendiri.',
      },
    },
    {
      name: 'rewardBuckets',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'voucherTitle', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'benefitSummary', type: 'text' },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'discountType',
          type: 'select',
          options: ['percentage', 'fixed'],
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'probabilityWeight',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          admin: {
            description: 'Probabilitas bucket ini dalam persen. Sisa dari 100% dianggap zonk.',
          },
        },
        {
          name: 'maxTotalWinners',
          type: 'number',
          min: 1,
          admin: {
            description: 'Kosongkan jika hadiah ini tidak dibatasi kuota total pemenangnya.',
          },
        },
        {
          name: 'minimumSpend',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'usageLimit',
          type: 'number',
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'perUserLimit',
          type: 'number',
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'codePrefix',
          type: 'text',
        },
        {
          name: 'ttlHours',
          type: 'number',
          min: 1,
          label: 'TTL (hours)',
        },
        {
          name: 'expiresAt',
          type: 'date',
        },
      ],
    },
  ],
}
