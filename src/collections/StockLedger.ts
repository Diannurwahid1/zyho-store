import { adminOrManager, staffOnly } from '@/access/roles'
import type { CollectionConfig } from 'payload'

/**
 * StockLedger — Kartu stok permanen (history perubahan inventory).
 *
 * Setiap perubahan stok dicatat di sini:
 *  - `in`       : Stok masuk (restock / penambahan manual)
 *  - `out`      : Stok keluar (pembayaran dikonfirmasi)
 *  - `reserved` : Stok dipesan sementara (pending payment)
 *  - `released` : Reservasi dibatalkan / expired → stok kembali
 *  - `adjust`   : Penyesuaian manual oleh admin
 *
 * Kolom `stockAfter` mencatat saldo stok setelah transaksi ini.
 */
export const StockLedger: CollectionConfig = {
  slug: 'stock-ledger',
  access: {
    create: staffOnly,
    delete: adminOrManager,
    read: staffOnly,
    update: () => false, // ledger tidak boleh diedit — append-only
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'referenceId',
    defaultColumns: ['createdAt', 'product', 'type', 'qty', 'stockAfter', 'costPerUnit', 'totalCost', 'referenceId'],
    description: 'Kartu stok permanen — riwayat semua perubahan inventory produk.',
    listSearchableFields: ['referenceId', 'notes'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
      admin: {
        description: 'Produk yang stoknya berubah.',
      },
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
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: '📦 Stok Masuk (Restock)', value: 'in' },
        { label: '✅ Stok Keluar (Terjual)', value: 'out' },
        { label: '🔒 Dipesan (Reserved)', value: 'reserved' },
        { label: '🔓 Dilepas (Released)', value: 'released' },
        { label: '✏️ Penyesuaian Manual', value: 'adjust' },
      ],
      admin: {
        description: 'Jenis perubahan stok.',
      },
    },
    {
      name: 'qty',
      type: 'number',
      required: true,
      admin: {
        description:
          'Jumlah perubahan. Positif = stok bertambah, negatif = stok berkurang.',
      },
    },
    {
      name: 'stockBefore',
      type: 'number',
      required: true,
      admin: {
        description: 'Saldo stok SEBELUM transaksi ini.',
        readOnly: true,
      },
    },
    {
      name: 'stockAfter',
      type: 'number',
      required: true,
      admin: {
        description: 'Saldo stok SETELAH transaksi ini.',
        readOnly: true,
      },
    },
    {
      name: 'referenceId',
      type: 'text',
      index: true,
      admin: {
        description:
          'ID referensi (reservationId, orderId, atau keterangan manual).',
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      index: true,
      admin: {
        description: 'Order terkait (jika ada).',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        description: 'Customer terkait (jika ada).',
      },
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      admin: {
        description: 'Admin/staff yang melakukan perubahan (untuk penyesuaian manual).',
      },
    },
    {
      name: 'costPerUnit',
      type: 'number',
      admin: {
        description: 'Harga modal per unit (Rp). Diisi saat restock untuk mencatat pengeluaran.',
      },
    },
    {
      name: 'totalCost',
      type: 'number',
      admin: {
        description: 'Total pengeluaran modal (costPerUnit × qty). Otomatis dihitung.',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Catatan tambahan.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-hitung totalCost = costPerUnit × |qty|
        const cost = Number(data.costPerUnit ?? 0)
        const qty = Math.abs(Number(data.qty ?? 0))
        if (cost > 0 && qty > 0) {
          data.totalCost = cost * qty
        } else {
          data.totalCost = null
        }
        return data
      },
    ],
  },
  timestamps: true,
}
