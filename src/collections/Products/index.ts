import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import {
  calculateBundleAvailability,
  calculateBundleUnitPrice,
  getNormalizedBundleItems,
  isBundleProduct,
} from '@/lib/bundles'
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

const STAFF_ROLES = new Set(['admin', 'manager', 'finance', 'support'])

type BundleConfigInputItem = {
  discountPercent: number
  productId: number
  quantity: number
}

const normalizeBundleConfigInput = (value: unknown) => {
  if (!value || typeof value !== 'object') return null

  const raw = value as {
    enabled?: unknown
    items?: unknown
  }

  const items: BundleConfigInputItem[] = Array.isArray(raw.items)
    ? raw.items
        .map((item) => {
          if (!item || typeof item !== 'object') return null

          const row = item as {
            discountPercent?: unknown
            product?: unknown
            productId?: unknown
            quantity?: unknown
          }

          const productValue =
            typeof row.product === 'object' && row.product && 'id' in row.product
              ? (row.product as { id?: unknown }).id
              : row.product

          const productId = Number(row.productId ?? productValue)
          if (!Number.isFinite(productId) || productId <= 0) return null

          const quantity = Math.max(1, Math.floor(Number(row.quantity || 1) || 1))
          const discountPercent = Math.min(
            100,
            Math.max(0, Number(row.discountPercent || 0) || 0),
          )

          return {
            discountPercent,
            productId,
            quantity,
          }
        })
        .filter((item): item is BundleConfigInputItem => Boolean(item))
    : []

  if (items.length === 0) return null

  return {
    enabled: raw.enabled !== false,
    items,
  }
}

const shouldUseManualSoldCountOnly = (req: any) => {
  const roles = Array.isArray(req?.user?.roles) ? req.user.roles : []
  return roles.some((role: string) => STAFF_ROLES.has(role))
}

const getSoldCountCache = async (req: any) => {
  if (!req?.context) req.context = {}
  if (req.context.productSoldCountCache) return req.context.productSoldCountCache as Record<string, number>

  const { docs: orders } = await req.payload.find({
    collection: 'orders',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      status: {
        equals: 'completed',
      },
    },
  })

  const soldCountByProduct: Record<string, number> = {}

  for (const order of orders as any[]) {
    const items = Array.isArray(order?.items) ? order.items : []
    for (const item of items) {
      const productId = typeof item?.product === 'object' ? item.product?.id : item?.product
      const quantity = typeof item?.quantity === 'number' && item.quantity > 0 ? item.quantity : 0

      if (!productId || quantity <= 0) continue

      const key = String(productId)
      soldCountByProduct[key] = (soldCountByProduct[key] || 0) + quantity
    }
  }

  req.context.productSoldCountCache = soldCountByProduct
  return soldCountByProduct
}

const getPerUnitInventoryCache = async (req: any) => {
  if (!req?.context) req.context = {}
  if (req.context.productPerUnitInventoryCache) {
    return req.context.productPerUnitInventoryCache as {
      byProduct: Record<string, number>
      byVariant: Record<string, number>
    }
  }

  const { docs: units } = await req.payload.find({
    collection: 'digital-stock-units',
    depth: 0,
    limit: 5000,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      and: [
        { status: { equals: 'available' } },
        {
          or: [
            { redeemEnabled: { exists: false } },
            { redeemEnabled: { equals: false } },
          ],
        },
      ],
    } as any,
  })

  const byProduct: Record<string, number> = {}
  const byVariant: Record<string, number> = {}

  for (const unit of units as any[]) {
    const productId = typeof unit?.product === 'object' ? unit.product?.id : unit?.product
    if (!productId) continue

    const productKey = String(productId)
    byProduct[productKey] = (byProduct[productKey] || 0) + 1

    if (unit?.variant) {
      const variantKey = `${productKey}:${String(unit.variant)}`
      byVariant[variantKey] = (byVariant[variantKey] || 0) + 1
    }
  }

  const cache = { byProduct, byVariant }
  req.context.productPerUnitInventoryCache = cache
  return cache
}

const getBundleProductCache = async (req: any) => {
  if (!req?.context) req.context = {}
  if (!req.context.bundleProductCache) {
    req.context.bundleProductCache = new Map<string, any>()
  }

  return req.context.bundleProductCache as Map<string, any>
}

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  hooks: {
    ...defaultCollection.hooks,
    afterRead: [
      ...(defaultCollection.hooks?.afterRead || []),
      async ({ doc, req }) => {
        if (!doc) return doc

        if (req?.context?.skipProductComputedFields) return doc

        const nextDoc = { ...doc } as any

        if (nextDoc.digitalFulfillmentMode === 'per_unit_stock' && req?.payload) {
          const inventoryCache = await getPerUnitInventoryCache(req)
          const productKey = String(nextDoc.id)

          nextDoc.inventory = inventoryCache.byProduct[productKey] || 0

          if (nextDoc.variants?.docs && Array.isArray(nextDoc.variants.docs)) {
            nextDoc.variants = {
              ...nextDoc.variants,
              docs: nextDoc.variants.docs.map((variant: any) => {
                if (!variant || typeof variant !== 'object') return variant
                const variantKey = `${productKey}:${String(variant.id)}`
                return {
                  ...variant,
                  inventory: inventoryCache.byVariant[variantKey] || 0,
                }
              }),
            }
          } else if (Array.isArray(nextDoc.variants)) {
            nextDoc.variants = nextDoc.variants.map((variant: any) => {
              if (!variant || typeof variant !== 'object') return variant
              const variantKey = `${productKey}:${String(variant.id)}`
              return {
                ...variant,
                inventory: inventoryCache.byVariant[variantKey] || 0,
              }
            })
          }
        }

        const normalizedNativeBundle = normalizeBundleConfigInput(nextDoc.bundle)
        const normalizedStoredBundle = normalizeBundleConfigInput(nextDoc.bundleConfig)
        const normalizedBundle = normalizedNativeBundle || normalizedStoredBundle

        if (normalizedBundle && req?.payload) {

          if (normalizedBundle.items.length) {
            const bundleCache = await getBundleProductCache(req)
            const enrichedItems = []

            for (const item of normalizedBundle.items) {
              const cacheKey = String(item.productId)
              let bundleProduct = bundleCache.get(cacheKey)

              if (!bundleProduct) {
                bundleProduct = await req.payload.findByID({
                  collection: 'products',
                  context: {
                    skipProductComputedFields: true,
                  },
                  id: item.productId,
                  depth: 1,
                  overrideAccess: true,
                })
                bundleCache.set(cacheKey, bundleProduct)
              }

              if (!bundleProduct || String(bundleProduct.id) === String(nextDoc.id)) continue

              enrichedItems.push({
                ...item,
                product: bundleProduct,
              })
            }

            if (enrichedItems.length > 0) {
              nextDoc.bundleConfig = {
                enabled: true,
                items: enrichedItems,
              }

              if (isBundleProduct(nextDoc)) {
                nextDoc.priceInIDR = calculateBundleUnitPrice(
                  nextDoc,
                  'IDR',
                  typeof nextDoc.priceInIDR === 'number' ? nextDoc.priceInIDR : 0,
                )
                nextDoc.priceInUSD = calculateBundleUnitPrice(
                  nextDoc,
                  'USD',
                  typeof nextDoc.priceInUSD === 'number' ? nextDoc.priceInUSD : 0,
                )
                nextDoc.inventory = calculateBundleAvailability(
                  nextDoc,
                  typeof nextDoc.inventory === 'number' ? nextDoc.inventory : 0,
                )
              }
            }
          }
        }

        if (shouldUseManualSoldCountOnly(req)) return nextDoc

        const soldCountByProduct = await getSoldCountCache(req)
        const manualSoldCount = typeof nextDoc.soldCount === 'number' ? nextDoc.soldCount : 0
        const actualSoldCount = soldCountByProduct[String(nextDoc.id)] || 0

        nextDoc.soldCount = manualSoldCount + actualSoldCount
        return nextDoc
      },
    ],
    beforeChange: [
      ...(defaultCollection.hooks?.beforeChange || []),
      async ({ data, req, originalDoc }) => {
        if (!data || typeof data !== 'object') return data

        const nextData = { ...data } as any
        const hasNativeBundleInput = Object.prototype.hasOwnProperty.call(nextData, 'bundle')
        const normalizedBundle = hasNativeBundleInput
          ? normalizeBundleConfigInput(nextData.bundle)
          : normalizeBundleConfigInput(nextData.bundleConfig)

        if (!normalizedBundle) {
          nextData.bundleConfig = null
          return nextData
        }

        const currentProductId =
          nextData.id ||
          (originalDoc && typeof originalDoc === 'object' && 'id' in originalDoc
            ? (originalDoc as { id?: unknown }).id
            : null)

        for (const item of normalizedBundle.items) {
          if (currentProductId && String(item.productId) === String(currentProductId)) {
            throw new Error('Bundle tidak boleh berisi produk itu sendiri.')
          }

          const bundleChild = await req.payload.findByID({
            collection: 'products',
            context: {
              skipProductComputedFields: true,
            },
            id: item.productId,
            depth: 0,
            overrideAccess: true,
          })

          if (!bundleChild) {
            throw new Error(`Produk bundle ${item.productId} tidak ditemukan.`)
          }

          const childBundle = normalizeBundleConfigInput((bundleChild as any).bundleConfig)
          if (childBundle?.items?.length) {
            throw new Error(
              `Produk "${(bundleChild as any).title || item.productId}" sudah berupa bundle. Nested bundle belum didukung.`,
            )
          }
        }

        nextData.bundleConfig = normalizedBundle
        return nextData
      },
      (args) => validateDualCurrencyPricing(args, 'Produk'),
    ],
  },
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'duplicateAction', 'variants.variants'],
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
    soldCount: true,
    customBadge: true,
    bundle: true,
    bundleConfig: true,
    meta: true,
  },
  fields: [
    {
      name: 'duplicateAction',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/collections/Products/DuplicateProductCell#DuplicateProductCell',
        },
      },
    },
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
                { name: 'label', type: 'text' },
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
              name: 'customBadge',
              type: 'text',
              label: 'Badge Manual',
              admin: {
                description:
                  'Isi badge custom manual untuk storefront. Jika diisi, badge ini akan menggantikan badge preset.',
              },
            },
            {
              name: 'soldCount',
              type: 'number',
              label: 'Jumlah Terjual',
              defaultValue: 0,
              min: 0,
              admin: {
                description: 'Jumlah produk yang sudah terjual. Bisa diinput manual untuk ditampilkan di storefront.',
              },
            },
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
              name: 'bundle',
              type: 'group',
              label: 'Bundle Produk',
              admin: {
                description:
                  'Pilih produk yang ingin digabung dan atur diskon masing-masing item bundle.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Aktifkan bundle untuk produk ini',
                },
                {
                  name: 'items',
                  type: 'array',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    description:
                      'Tambahkan produk yang masuk dalam bundle ini. Harga dihitung dari harga produk dikurangi diskon per item.',
                  },
                  fields: [
                    {
                      name: 'product',
                      type: 'relationship',
                      relationTo: 'products',
                      required: true,
                      filterOptions: ({ id }) => {
                        if (!id) return true

                        return {
                          id: {
                            not_equals: id,
                          },
                        }
                      },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      defaultValue: 1,
                      min: 1,
                      required: true,
                      label: 'Qty di bundle',
                    },
                    {
                      name: 'discountPercent',
                      type: 'number',
                      defaultValue: 0,
                      min: 0,
                      max: 100,
                      required: true,
                      label: 'Diskon produk (%)',
                    },
                  ],
                  labels: {
                    plural: 'Produk Bundle',
                    singular: 'Produk Bundle',
                  },
                },
              ],
            },
            {
              name: 'bundleConfig',
              type: 'json',
              admin: {
                hidden: true,
              },
            },
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
            {
              name: 'creatorPromotion',
              type: 'group',
              label: 'Creator AI Promotion',
              admin: {
                description:
                  'Kontrol produk yang aman masuk snapshot read-only untuk Jaka Creator dan konten media sosial.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Allow Creator AI promotion',
                },
                {
                  name: 'priority',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Angka lebih besar diprioritaskan sebagai topik utama.',
                  },
                },
                {
                  name: 'allowedAngles',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'Promo', value: 'promo' },
                    { label: 'Education', value: 'education' },
                    { label: 'Comparison', value: 'comparison' },
                    { label: 'Use case', value: 'use_case' },
                    { label: 'Restock', value: 'restock' },
                    { label: 'Low stock', value: 'low_stock' },
                    { label: 'Featured', value: 'featured' },
                  ],
                },
                {
                  name: 'claimNotes',
                  type: 'textarea',
                  admin: {
                    description:
                      'Klaim marketing yang sudah disetujui admin. Jangan isi klaim yang tidak bisa dipertanggungjawabkan.',
                  },
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
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
