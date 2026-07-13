declare module '@nowpaymentsio/nowpayments-sdk-nodejs' {
  export class NowPaymentsSDK {
    constructor(config: {
      apiKey?: string
      cancelUrl?: string
      email?: string
      ipnCallbackUrl?: string
      ipnSecret?: string
      password?: string
      successUrl?: string
    })

    createDirectPayment(input: {
      amount: number
      currency: string
      ipnCallbackUrl?: string
      orderId: string
      payCurrency?: string
    }): Promise<{
      actually_paid?: number
      id?: string
      order_id?: string
      pay_address?: string
      pay_amount?: number
      pay_currency?: string
      payment_id?: string
      payment_status?: string
      purchase_id?: string
      status?: string
    }>

    getPaymentStatus(paymentId: string): Promise<{
      order_id?: string
      pay_address?: string
      pay_amount?: number
      pay_currency?: string
      payment_id?: string
      payment_status?: string
      price_amount?: number
      price_currency?: string
      status?: string
    }>

    parseWebhook(
      payload: unknown,
      signature: string | string[] | undefined,
    ): {
      payment: {
        order_id?: string
        payment_id?: string
        payment_status?: string
        status?: string
      }
      type: string
    }
  }
}
