import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

export const pakasirAdapterClient = (): PaymentAdapterClient => {
  return {
    name: 'pakasir',
    label: 'Pakasir',
    confirmOrder: true,
    initiatePayment: true,
  }
}
