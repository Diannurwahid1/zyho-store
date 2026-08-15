import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

export const pakasirAdapterClient = (): PaymentAdapterClient => {
  return {
    name: 'pakasir',
    label: 'SumoPod QRIS',
    confirmOrder: true,
    initiatePayment: true,
  }
}
