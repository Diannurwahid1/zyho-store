import { adminOrFinance, adminOrManager } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const Expenses: CollectionConfig = {
  slug: 'expenses',
  labels: {
    singular: 'Kas Keluar',
    plural: 'Kas Keluar',
  },
  access: {
    create: adminOrManager,
    delete: adminOrManager,
    read: adminOrFinance,
    update: adminOrManager,
  },
  admin: {
    group: 'Keuangan',
    useAsTitle: 'description',
    defaultColumns: ['date', 'category', 'description', 'amount', 'paymentMethod'],
    listSearchableFields: ['description', 'notes', 'referenceNumber'],
    description: 'Catatan pengeluaran / kas keluar toko.',
  },
  defaultSort: '-date',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Tanggal',
          defaultValue: () => new Date().toISOString(),
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'Kategori',
          defaultValue: 'operational',
          options: [
            { label: 'Operasional', value: 'operational' },
            { label: 'Pembelian Stok / Modal', value: 'stock_purchase' },
            { label: 'Marketing / Iklan', value: 'marketing' },
            { label: 'Gaji / Upah', value: 'salary' },
            { label: 'Langganan / Subscription', value: 'subscription' },
            { label: 'Server / Hosting', value: 'server' },
            { label: 'Refund', value: 'refund' },
            { label: 'Lainnya', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Keterangan',
      admin: {
        placeholder: 'Contoh: Beli 10 akun Gemini Pro dari supplier',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Jumlah (Rp)',
          min: 0,
          admin: {
            width: '50%',
            placeholder: '0',
          },
        },
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          label: 'Metode Pembayaran',
          defaultValue: 'transfer',
          options: [
            { label: 'Transfer Bank', value: 'transfer' },
            { label: 'Cash', value: 'cash' },
            { label: 'E-Wallet (GoPay/OVO/Dana)', value: 'ewallet' },
            { label: 'QRIS', value: 'qris' },
            { label: 'Kartu Kredit', value: 'credit_card' },
            { label: 'Lainnya', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'referenceNumber',
      type: 'text',
      label: 'No. Referensi / Bukti Transfer',
      admin: {
        placeholder: 'Opsional — nomor invoice, bukti transfer, dll',
      },
    },
    {
      name: 'receipt',
      type: 'upload',
      relationTo: 'media',
      label: 'Bukti / Struk',
      admin: {
        description: 'Upload foto struk atau bukti pembayaran (opsional).',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan Tambahan',
    },
    {
      name: 'recordedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Dicatat oleh',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            if (!value && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
  ],
}
