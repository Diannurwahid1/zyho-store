import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

export const nowpaymentsAdapterClient = (): PaymentAdapterClient => {
  return {
    name: 'nowpayments',
    label: 'NOWPayments',
    confirmOrder: true,
    initiatePayment: true,
  }
}
