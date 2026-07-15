import { adminOrManager } from '@/access/roles'
import { generateVoucherCode, normalizeCouponCode, resolveCouponExpiry } from '@/lib/vouchers'
import type { CollectionConfig } from 'payload'
import { sendVoucherBlastAfterChange } from './Coupons/hooks/sendVoucherBlast'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: adminOrManager,
    update: adminOrManager,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'amount', 'allowedTiers', 'usedCount', 'usageLimit', 'status'],
  },
  hooks: {
    afterChange: [sendVoucherBlastAfterChange],
    beforeValidate: [
      ({ data, operation, originalDoc }) => {
        if (!data) return data

        const nextData = { ...data }
        const shouldAutoGenerate = nextData.codeMode === 'auto' || !nextData.code

        if (shouldAutoGenerate) {
          nextData.code = generateVoucherCode(nextData.codePrefix)
        } else {
          nextData.code = normalizeCouponCode(nextData.code)
        }

        nextData.expiresAt = resolveCouponExpiry({
          createdAt: originalDoc?.createdAt,
          existingExpiresAt: originalDoc?.expiresAt,
          expiresAt: nextData.expiresAt,
          startsAt: nextData.startsAt || originalDoc?.startsAt,
          ttlHours: nextData.ttlHours,
        })

        if (operation === 'create' && typeof nextData.usedCount !== 'number') {
          nextData.usedCount = 0
        }

        return nextData
      },
    ],
  },
  labels: {
    plural: 'Vouchers',
    singular: 'Voucher',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'benefitSummary',
      type: 'text',
      label: 'Benefit Summary',
    },
    {
      name: 'codeMode',
      type: 'select',
      defaultValue: 'manual',
      options: [
        {
          label: 'Ketik manual',
          value: 'manual',
        },
        {
          label: 'Generate otomatis',
          value: 'auto',
        },
      ],
      required: true,
    },
    {
      name: 'codePrefix',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.codeMode === 'auto',
        description: 'Prefix untuk kode otomatis, mis. MEMBER atau GOLD.',
      },
    },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'discountType', type: 'select', options: ['percentage', 'fixed'], required: true },
    { name: 'amount', type: 'number', required: true, min: 0 },
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
        description: 'Pilih produk yang bisa menggunakan voucher ini.',
      },
    },
    {
      name: 'allowedTiers',
      type: 'select',
      hasMany: true,
      options: ['bronze', 'silver', 'gold', 'diamond'],
    },
    { name: 'minimumSpend', type: 'number', min: 0, defaultValue: 0 },
    { name: 'usageLimit', type: 'number', min: 0 },
    { name: 'perUserLimit', type: 'number', min: 1, defaultValue: 1 },
    { name: 'usedCount', type: 'number', defaultValue: 0, min: 0, admin: { readOnly: true } },
    { name: 'startsAt', type: 'date' },
    { name: 'ttlHours', type: 'number', min: 1, label: 'TTL (hours)' },
    { name: 'expiresAt', type: 'date' },
    { name: 'status', type: 'select', defaultValue: 'active', options: ['active', 'inactive', 'expired'], required: true },
    {
      name: 'sendWhatsAppBlast',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Centang lalu simpan untuk kirim voucher ini ke semua customer/member yang punya nomor WhatsApp.',
      },
      label: 'Kirim blast WhatsApp sekarang',
    },
    {
      name: 'whatsAppBlastSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'WhatsApp Blast Sent At',
    },
    {
      name: 'whatsAppBlastRecipientCount',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'WhatsApp Blast Recipient Count',
      min: 0,
    },
  ],
}
