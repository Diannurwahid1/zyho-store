import { adminOrManager } from '@/access/roles'
import type { GlobalConfig } from 'payload'

/**
 * Stock Adjustment Global
 * Tool untuk admin melakukan adjustment stok manual (restock / koreksi).
 * Muncul di sidebar admin dalam group "Commerce".
 */
export const StockAdjustment: GlobalConfig = {
  slug: 'stock-adjustment',
  access: {
    read: adminOrManager,
    update: adminOrManager,
  },
  admin: {
    group: 'Commerce',
    description: 'Tool untuk adjust stok produk (restock, koreksi, dll)',
  },
  fields: [
    {
      type: 'ui',
      name: 'stockAdjustmentTool',
      admin: {
        components: {
          Field: '@/components/StockAdjustmentField#StockAdjustmentField',
        },
      },
    },
  ],
}
