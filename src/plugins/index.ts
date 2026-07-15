import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Plugin } from 'payload'

import { nowpaymentsAdapter } from '@/payments/nowpayments/index'
import { pakasirAdapter } from '@/payments/pakasir/index'

import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { CartsCollection } from '@/collections/Carts'
import {
    syncMembershipAfterOrderChange,
    syncMembershipAfterOrderDelete,
} from '@/collections/Orders/hooks/syncMembership'
import { ProductsCollection } from '@/collections/Products'
import { sendTransactionWhatsAppAfterChange } from '@/collections/Transactions/hooks/sendWhatsAppStatus'
import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { validateDualCurrencyPricing } from '@/utilities/validateDualCurrencyPricing'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | zyho` : 'zyho'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    currencies: {
      defaultCurrency: 'IDR',
      supportedCurrencies: [
        {
          code: 'IDR',
          decimals: 0,
          label: 'Rupiah',
          symbol: 'Rp',
        },
        {
          code: 'USD',
          decimals: 2,
          label: 'US Dollar',
          symbol: '$',
        },
      ],
    },
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    carts: {
      cartsCollectionOverride: CartsCollection,
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        hooks: {
          ...defaultCollection.hooks,
          afterChange: [
            ...(defaultCollection.hooks?.afterChange || []),
            syncMembershipAfterOrderChange,
          ],
          afterDelete: [
            ...(defaultCollection.hooks?.afterDelete || []),
            syncMembershipAfterOrderDelete,
          ],
        },
        fields: [
          ...defaultCollection.fields,
          {
            name: 'pointsEarned',
            type: 'number',
            defaultValue: 0,
            min: 0,
            admin: { position: 'sidebar', readOnly: true },
          },
          {
            name: 'paymentReference',
            type: 'text',
            unique: true,
            index: true,
            admin: { position: 'sidebar', readOnly: true },
          },
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
          {
            name: 'voucher',
            type: 'relationship',
            relationTo: 'coupons',
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
          },
          {
            name: 'voucherCode',
            type: 'text',
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
          },
          {
            name: 'subtotalBeforeDiscount',
            type: 'number',
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
          },
          {
            name: 'discountAmount',
            type: 'number',
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
          },
          {
            name: 'memberTierSnapshot',
            type: 'select',
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            options: ['bronze', 'silver', 'gold', 'diamond'],
          },
          {
            name: 'digitalDeliveries',
            type: 'array',
            admin: {
              description:
                'Snapshot hasil assignment stok digital per unit. Customer hanya melihat data miliknya dari order ini.',
            },
            fields: [
              {
                name: 'product',
                type: 'relationship',
                relationTo: 'products',
                required: true,
              },
              {
                name: 'productTitle',
                type: 'text',
              },
              {
                name: 'variant',
                type: 'text',
              },
              {
                name: 'variantTitle',
                type: 'text',
              },
              {
                name: 'quantity',
                type: 'number',
                required: true,
                min: 1,
              },
              {
                name: 'units',
                type: 'array',
                fields: [
                  { name: 'unitCode', type: 'text' },
                  {
                    name: 'deliveryType',
                    type: 'select',
                    options: ['credentials', 'file', 'text'],
                  },
                  { name: 'label', type: 'text' },
                  { name: 'accountEmail', type: 'text' },
                  { name: 'accountUsername', type: 'text' },
                  { name: 'accountPassword', type: 'textarea' },
                  { name: 'loginUrl', type: 'text' },
                  { name: 'referenceCode', type: 'text' },
                  { name: 'content', type: 'textarea' },
                  { name: 'file', type: 'upload', relationTo: 'media' },
                ],
              },
            ],
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        pakasirAdapter({
          apiKey: process.env.PAKASIR_API_KEY!,
          projectSlug: process.env.PAKASIR_PROJECT_SLUG!,
          isSandbox: process.env.PAKASIR_SANDBOX === 'true',
        }),
        nowpaymentsAdapter({
          apiKey: process.env.NOWPAYMENTS_API_KEY!,
          email: process.env.NOWPAYMENTS_EMAIL,
          ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET,
          password: process.env.NOWPAYMENTS_PASSWORD,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      variants: {
        variantsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          hooks: {
            ...defaultCollection.hooks,
            beforeChange: [
              ...(defaultCollection.hooks?.beforeChange || []),
              (args) => validateDualCurrencyPricing(args, 'Variant'),
            ],
          },
        }),
      },
    },
    transactions: {
      transactionsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        hooks: {
          ...defaultCollection.hooks,
          afterChange: [
            ...(defaultCollection.hooks?.afterChange || []),
            sendTransactionWhatsAppAfterChange,
          ],
        },
      }),
    },
  }),
]
