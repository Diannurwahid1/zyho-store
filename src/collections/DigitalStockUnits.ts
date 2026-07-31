import { adminOrManager, staffOnly } from '@/access/roles'
import CryptoJS from 'crypto-js'
import type { CollectionConfig } from 'payload'

const getEncryptionKey = () => {
  const encryptionKey = process.env.ENCRYPTION_KEY
  if (!encryptionKey) throw new Error('ENCRYPTION_KEY is required.')
  return encryptionKey
}

const encryptValue = (value: unknown) => {
  if (!value || typeof value !== 'string') return value
  return CryptoJS.AES.encrypt(value, getEncryptionKey()).toString()
}

const decryptValue = (value: unknown) => {
  if (!value || typeof value !== 'string') return value
  const decrypted = CryptoJS.AES.decrypt(value, getEncryptionKey()).toString(CryptoJS.enc.Utf8)

  return decrypted || value
}

const generateUnitCode = () =>
  `DSTK-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

export const DigitalStockUnits: CollectionConfig = {
  slug: 'digital-stock-units',
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: staffOnly,
    update: adminOrManager,
  },
  admin: {
    group: 'Digital Commerce',
    useAsTitle: 'unitCode',
    defaultColumns: ['unitCode', 'product', 'status', 'accountEmail', 'order'],
    listSearchableFields: ['unitCode', 'accountEmail', 'accountUsername', 'referenceCode', 'label'],
    description:
      'Stok digital per unit, misalnya akun email/password, catatan akses, atau file per stok.',
  },
  fields: [
    {
      name: 'unitCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [({ value }) => value || generateUnitCode()],
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'variant',
      type: 'text',
      index: true,
      admin: {
        description: 'Variant ID jika stok unit ini khusus untuk variant tertentu.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      index: true,
      options: ['available', 'reserved', 'assigned', 'archived'],
    },
    {
      name: 'deliveryType',
      type: 'select',
      required: true,
      defaultValue: 'credentials',
      options: ['credentials', 'file', 'text'],
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Label internal, misalnya Slot 1, Akun batch Juli, atau PDF pack.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'accountEmail', type: 'text' },
        { name: 'accountUsername', type: 'text' },
      ],
    },
    {
      name: 'accountPassword',
      type: 'textarea',
      hooks: {
        beforeChange: [({ value }) => encryptValue(value)],
        afterRead: [({ value }) => decryptValue(value)],
      },
      admin: {
        condition: (_, siblingData) => siblingData?.deliveryType === 'credentials',
      },
    },
    {
      name: 'loginUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.deliveryType === 'credentials',
      },
    },
    {
      name: 'referenceCode',
      type: 'text',
      admin: {
        description: 'Kode internal atau catatan singkat lain yang mau ikut dikirim.',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      hooks: {
        beforeChange: [({ value }) => encryptValue(value)],
        afterRead: [({ value }) => decryptValue(value)],
      },
      admin: {
        description: 'Catatan bebas: OTP backup, instruksi aktivasi, teks lisensi, dll.',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.deliveryType === 'file',
      },
    },
    {
      name: 'reservationId',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'assignedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'manualOrderAction',
      type: 'ui',
      admin: {
        components: {
          Field: '@/collections/DigitalStockUnits/ManualOrderField#ManualOrderField',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
