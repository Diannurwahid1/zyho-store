import { adminOrManager, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

/**
 * StockReservations — kartu stok sementara.
 *
 * Lifecycle:
 *  1. `pending`   — dibuat saat user mulai proses pembayaran (initiatePayment).
 *  2. `confirmed` — diubah ke confirmed saat pembayaran berhasil (confirmOrder).
 *                   Stok fisik baru dikurangi di sini.
 *  3. `released`  — diubah ke released jika pembayaran expired / dibatalkan.
 *                   Stok dikembalikan ke pool.
 *
 * Reservasi pending otomatis expire setelah 10 menit (dihandle oleh cron endpoint).
 */
export const StockReservations: CollectionConfig = {
  slug: 'stock-reservations',
  access: {
    create: staffOnly,
    delete: adminOrManager,
    read: staffOnly,
    update: staffOnly,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'reservationId',
    defaultColumns: ['reservationId', 'product', 'variant', 'quantity', 'status', 'expiresAt', 'order'],
    description: 'Kartu stok sementara — reservasi stok selama proses pembayaran.',
  },
  fields: [
    {
      name: 'reservationId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID unik reservasi (biasanya = paymentIntentID / cartID + timestamp)',
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
        description: 'Variant ID jika produk menggunakan variant. Kosong jika tidak.',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      index: true,
      options: [
        { label: 'Pending (menunggu pembayaran)', value: 'pending' },
        { label: 'Confirmed (pembayaran berhasil)', value: 'confirmed' },
        { label: 'Released (dibatalkan / expired)', value: 'released' },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        description: 'Waktu reservasi expired. Default: 10 menit dari waktu dibuat.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm:ss',
        },
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      index: true,
      admin: {
        description: 'Diisi setelah pembayaran berhasil.',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'cartId',
      type: 'text',
      index: true,
      admin: {
        description: 'Cart ID yang memicu reservasi ini.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Catatan tambahan (misal: alasan release).',
      },
    },
  ],
  timestamps: true,
}
