import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { sortProducts } from '@/utilities/sortProducts'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  description: 'Jelajahi produk digital premium untuk bisnis, developer, dan kreator Indonesia.',
  title: 'Produk Digital',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const normalizedSearchValue = Array.isArray(searchValue) ? searchValue[0] : searchValue
  const normalizedSort = Array.isArray(sort) ? sort[0] : sort
  const normalizedCategory = Array.isArray(category) ? category[0] : category
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      inventory: true,
      enableVariants: true,
      variants: true,
      priceInIDR: true,
      priceInUSD: true,
      shortDescription: true,
      badge: true,
      soldCount: true,
      promo: true,
    },
    ...(normalizedSort ? { sort: normalizedSort } : {}),
    limit: 100,
    ...(normalizedSearchValue || normalizedCategory
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(normalizedSearchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: normalizedSearchValue,
                          },
                        },
                        {
                          shortDescription: {
                            like: normalizedSearchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(normalizedCategory
                ? [
                    {
                      categories: {
                        contains: normalizedCategory,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  return (
    <div className="container py-1 md:py-8">
      {products.docs?.length === 0 ? (
        <div className="rounded-3xl border bg-card p-10 text-center text-muted-foreground">
          Produk belum ditemukan. Coba keyword atau filter lain.
        </div>
      ) : (
        <Grid className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
          {(normalizedSort ? products.docs : sortProducts(products.docs)).map((product) => <ProductGridItem key={product.id} product={product} />)}
        </Grid>
      )}
    </div>
  )
}
