import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { validateDualCurrencyPricing } from '@/utilities/validateDualCurrencyPricing'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { DefaultDocumentIDType, slugField, Where } from 'payload'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  hooks: {
    ...defaultCollection.hooks,
    beforeChange: [
      ...(defaultCollection.hooks?.beforeChange || []),
      (args) => validateDualCurrencyPricing(args, 'Produk'),
    ],
  },
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    shortDescription: true,
    productType: true,
    digitalFulfillmentMode: true,
    licenseType: true,
    version: true,
    isFeatured: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    priceInIDR: true,
    inventory: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Short storefront summary for product cards and hero sections.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
            {
              name: 'includedFiles',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'format', type: 'text' },
                { name: 'size', type: 'text' },
              ],
            },
            {
              name: 'caraPenggunaan',
              label: 'Cara Penggunaan',
              type: 'richText',
              admin: {
                description:
                  'Panduan cara penggunaan produk ini. Akan ditampilkan di halaman order setelah pembayaran berhasil.',
              },
            },
            {
              name: 'garansi',
              label: 'Garansi',
              type: 'richText',
              admin: {
                description:
                  'Informasi garansi produk. Akan ditampilkan di halaman order setelah pembayaran berhasil.',
              },
            },
            {
              name: 'productFAQ',
              type: 'array',
              labels: {
                plural: 'Product FAQs',
                singular: 'Product FAQ',
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Product Details',
        },
        {
          label: 'Digital Product',
          fields: [
            {
              name: 'productType',
              type: 'select',
              defaultValue: 'digital',
              options: [
                'digital',
                'license_key',
                'ebook',
                'template',
                'source_code',
                'ui_kit',
                'prompt_pack',
              ],
            },
            {
              name: 'digitalFulfillmentMode',
              type: 'select',
              defaultValue: 'standard',
              options: [
                {
                  label: 'Standard digital delivery',
                  value: 'standard',
                },
                {
                  label: 'Per-unit digital stock',
                  value: 'per_unit_stock',
                },
              ],
              admin: {
                description:
                  'Gunakan per-unit digital stock jika setiap stok harus punya akun/file/catatan unik sendiri.',
              },
            },
            {
              name: 'licenseType',
              type: 'select',
              defaultValue: 'standard',
              options: ['standard', 'extended', 'personal', 'commercial', 'unlimited'],
            },
            { name: 'version', type: 'text', defaultValue: '1.0.0' },
            { name: 'updatePolicy', type: 'textarea' },
            { name: 'refundPolicy', type: 'textarea' },
            { name: 'isFeatured', type: 'checkbox', defaultValue: false },
            { name: 'badge', type: 'select', options: ['new', 'best_seller', 'discount'] },
            {
              name: 'digitalAssets',
              type: 'join',
              collection: 'digital-assets',
              on: 'product',
              admin: {
                allowCreate: true,
                defaultColumns: ['fileName', 'version', 'status', 'protected'],
              },
            },
            {
              name: 'digitalStockUnits',
              type: 'join',
              collection: 'digital-stock-units',
              on: 'product',
              admin: {
                allowCreate: true,
                defaultColumns: ['unitCode', 'status', 'deliveryType', 'accountEmail', 'order'],
                condition: (data) => data?.digitalFulfillmentMode === 'per_unit_stock',
                description:
                  'Unit stok digital per akun/file. Untuk produk mode ini, stok sebaiknya ditambah lewat Stock Adjustment agar jumlah stok dan data unit tetap sinkron.',
              },
            },
          ],
        },
        {
          label: 'Promo & Flash Sale',
          fields: [
            {
              name: 'promo',
              type: 'group',
              fields: [
                {
                  name: 'isFlashSale',
                  type: 'checkbox',
                  label: 'Include in Flash Sale',
                  defaultValue: false,
                },
                {
                  name: 'discountPercent',
                  type: 'number',
                  label: 'Discount Percentage (%)',
                  min: 1,
                  max: 99,
                  admin: {
                    condition: (_, siblingData) => siblingData?.isFlashSale,
                    description: 'Enter discount percentage (1-99)',
                  },
                },
                {
                  name: 'flashSaleEndDate',
                  type: 'date',
                  label: 'Flash Sale End Date',
                  admin: {
                    condition: (_, siblingData) => siblingData?.isFlashSale,
                    date: { pickerAppearance: 'dayAndTime' },
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'stockReservations',
      type: 'join',
      collection: 'stock-reservations',
      on: 'product',
      admin: {
        position: 'sidebar',
        defaultColumns: ['reservationId', 'quantity', 'status', 'expiresAt'],
        description: 'Reservasi stok aktif untuk produk ini.',
      },
    },
    {
      name: 'stockHistory',
      type: 'join',
      collection: 'stock-ledger',
      on: 'product',
      admin: {
        position: 'sidebar',
        defaultColumns: ['createdAt', 'type', 'qty', 'stockBefore', 'stockAfter', 'referenceId'],
        description: 'Riwayat semua perubahan stok produk ini.',
      },
    },
    slugField(),
  ],
})
