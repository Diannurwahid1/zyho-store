import type { Media, Order } from '@/payload-types'
import type { Metadata } from 'next'

import { AddressItem } from '@/components/addresses/AddressItem'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { ProductItem } from '@/components/ProductItem'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { WhatsAppSupportCard } from '@/components/WhatsAppSupportCard'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ accessToken?: string; email?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const resolvedSearchParams = await searchParams
  const accessToken = resolvedSearchParams?.accessToken
  const emailFromQuery = resolvedSearchParams?.email

  if (!user && !accessToken) {
    redirect(`/login?redirect=${encodeURIComponent(`/orders/${id}`)}`)
  }

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      depth: 2,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        id: {
          equals: id,
        },
      },
      select: {
        accessToken: true,
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
        digitalDeliveries: true,
      },
    })

    if (orderResult) {
      const customerID =
        typeof orderResult.customer === 'object' && orderResult.customer
          ? orderResult.customer.id
          : orderResult.customer

      const normalizedOrderEmail = String(orderResult.customerEmail || '').toLowerCase()
      const normalizedUserEmail = String(user?.email || '').toLowerCase()
      const normalizedQueryEmail = String(emailFromQuery || '').toLowerCase()

      const hasMatchingUser =
        Boolean(user) &&
        ((customerID && customerID === user?.id) ||
          (normalizedOrderEmail &&
            normalizedUserEmail &&
            normalizedOrderEmail === normalizedUserEmail))

      const hasMatchingAccessToken =
        Boolean(accessToken) &&
        Boolean(orderResult.accessToken) &&
        accessToken === orderResult.accessToken &&
        (!normalizedOrderEmail ||
          !normalizedQueryEmail ||
          normalizedOrderEmail === normalizedQueryEmail)

      if (hasMatchingUser || hasMatchingAccessToken) {
        order = orderResult
      }
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  // Fetch product details (caraPenggunaan & garansi) for each item in the order
  const productIds: string[] = []
  if (order.items) {
    for (const item of order.items) {
      const productId = typeof item.product === 'object' ? item.product?.id : item.product
      const productIdStr = productId != null ? String(productId) : null
      if (productIdStr && !productIds.includes(productIdStr)) {
        productIds.push(productIdStr)
      }
    }
  }

  type ProductGuide = {
    id: string
    title?: string | null
    caraPenggunaan?: any
    garansi?: any
  }

  let productGuides: ProductGuide[] = []
  if (productIds.length > 0) {
    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 0,
        limit: productIds.length,
        overrideAccess: true,
        pagination: false,
        where: { id: { in: productIds } },
        select: { title: true, caraPenggunaan: true, garansi: true },
      })
      productGuides = docs as ProductGuide[]
    } catch (e) {
      console.error('Failed to fetch product guides', e)
    }
  }

  const hasCaraPenggunaan = productGuides.some((p) => p.caraPenggunaan)
  const hasGaransi = productGuides.some((p) => p.garansi)

  return (
    <div className="">
      <div className="flex gap-8 justify-between items-center mb-6">
        {user ? (
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/orders">
                <ChevronLeftIcon />
                All orders
              </Link>
            </Button>
          </div>
        ) : (
          <div></div>
        )}

        <h1 className="text-sm uppercase font-mono px-2 bg-primary/10 rounded tracking-[0.07em]">
          <span className="">{`Order #${order.id}`}</span>
        </h1>
      </div>

      <div className="bg-card border rounded-lg px-6 py-4 flex flex-col gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="">
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Order Date</p>
            <p className="text-lg">
              <time dateTime={order.createdAt}>
                {formatDateTime({ date: order.createdAt, format: 'MMMM dd, yyyy' })}
              </time>
            </p>
          </div>

          <div className="">
            <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Total</p>
            {order.amount && (
              <Price
                className="text-lg"
                amount={order.amount}
                currencyCode={order.currency ?? undefined}
              />
            )}
          </div>

          {order.status && (
            <div className="grow max-w-1/3">
              <p className="font-mono uppercase text-primary/50 mb-1 text-sm">Status</p>
              <OrderStatus className="text-sm" status={order.status} />
            </div>
          )}
        </div>

        {order.items && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">Items</h2>
            <ul className="flex flex-col gap-6">
              {order.items?.map((item, index) => {
                if (typeof item.product === 'string') {
                  return null
                }

                if (!item.product || typeof item.product !== 'object') {
                  return <div key={index}>This item is no longer available.</div>
                }

                const variant =
                  item.variant && typeof item.variant === 'object' ? item.variant : undefined

                return (
                  <li key={item.id}>
                    <ProductItem
                      currencyCode={order.currency ?? undefined}
                      product={item.product}
                      quantity={item.quantity}
                      variant={variant}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {order.shippingAddress && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">
              {order.shippingAddress.phone ? 'WhatsApp' : 'Shipping Address'}
            </h2>

            {order.shippingAddress.phone &&
            order.shippingAddress.addressLine1 === 'WhatsApp checkout' ? (
              <p className="text-lg">{order.shippingAddress.phone}</p>
            ) : (
              // @ts-expect-error - some kind of type hell
              <AddressItem address={order.shippingAddress} hideActions />
            )}
          </div>
        )}

        {Array.isArray((order as any).digitalDeliveries) &&
          (order as any).digitalDeliveries.length > 0 && (
            <div>
              <h2 className="mb-4 font-mono text-sm uppercase text-primary/50">Digital Delivery</h2>

              <div className="space-y-4">
                {(order as any).digitalDeliveries.map((delivery: any, deliveryIndex: number) => (
                  <div
                    key={`${delivery.productTitle || delivery.product}-${deliveryIndex}`}
                    className="rounded-xl border bg-background/40 p-4"
                  >
                    <div className="mb-3">
                      <p className="text-lg font-semibold">
                        {delivery.productTitle || 'Digital Product'}
                      </p>
                      {delivery.variantTitle && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {delivery.variantTitle}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      {(delivery.units || []).map((unit: any, unitIndex: number) => {
                        const file =
                          unit.file && typeof unit.file === 'object' ? (unit.file as Media) : null

                        return (
                          <div
                            key={`${unit.unitCode || 'unit'}-${unitIndex}`}
                            className="rounded-lg border border-border/60 bg-card p-4"
                          >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-xs uppercase tracking-[0.16em]">
                                {unit.deliveryType || 'credentials'}
                              </span>
                              {unit.unitCode && (
                                <span className="font-mono text-xs text-muted-foreground">
                                  {unit.unitCode}
                                </span>
                              )}
                            </div>

                            {unit.label && <p className="font-medium">{unit.label}</p>}
                            {unit.accountEmail && <p>Email: {unit.accountEmail}</p>}
                            {unit.accountUsername && <p>Username: {unit.accountUsername}</p>}
                            {unit.accountPassword && <p>Password: {unit.accountPassword}</p>}
                            {unit.loginUrl && (
                              <p>
                                Login URL:{' '}
                                <a
                                  href={unit.loginUrl}
                                  className="underline"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {unit.loginUrl}
                                </a>
                              </p>
                            )}
                            {unit.referenceCode && <p>Reference: {unit.referenceCode}</p>}
                            {unit.content && (
                              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {unit.content}
                              </p>
                            )}
                            {file?.url && (
                              <p>
                                File:{' '}
                                <a
                                  href={file.url}
                                  className="underline"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {file.filename || 'Download file'}
                                </a>
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {hasCaraPenggunaan && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">Cara Penggunaan</h2>
            <div className="space-y-4">
              {productGuides
                .filter((p) => p.caraPenggunaan)
                .map((p) => (
                  <div key={p.id} className="rounded-xl border bg-background/40 p-4">
                    {productGuides.length > 1 && p.title && (
                      <p className="mb-2 text-sm font-semibold text-muted-foreground">{p.title}</p>
                    )}
                    <RichText data={p.caraPenggunaan} enableGutter={false} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {hasGaransi && (
          <div>
            <h2 className="font-mono text-primary/50 mb-4 uppercase text-sm">Garansi</h2>
            <div className="space-y-4">
              {productGuides
                .filter((p) => p.garansi)
                .map((p) => (
                  <div key={p.id} className="rounded-xl border bg-background/40 p-4">
                    {productGuides.length > 1 && p.title && (
                      <p className="mb-2 text-sm font-semibold text-muted-foreground">{p.title}</p>
                    )}
                    <RichText data={p.garansi} enableGutter={false} />
                  </div>
                ))}
            </div>
          </div>
        )}

        <WhatsAppSupportCard
          description="Jika ada kendala akses akun, file digital, atau status pesanan, langsung hubungi admin kami lewat WhatsApp agar cepat ditangani."
          title="Butuh Bantuan Order?"
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Order ${id}`,
  }
}
