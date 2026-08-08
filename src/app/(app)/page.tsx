import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductShowcase } from '@/components/ProductShowcase'
import { PromoBanner } from '@/components/PromoBanner'
import { PromoSection } from '@/components/PromoSection'
import { Testimonials } from '@/components/Testimonials'
import { homeStaticData } from '@/endpoints/seed/home-static'
import { getNormalizedBundleItems } from '@/lib/bundles'
import { getProductArtworkImages } from '@/lib/productArtwork'
import { generateMeta } from '@/utilities/generateMeta'
import { getClientLanguage } from '@/utilities/getClientLanguage'
import { sortProducts } from '@/utilities/sortProducts'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import type { Page } from '@/payload-types'

export default async function Page() {
  const slug = 'home'
  
  // Detect language based on IP
  const language = await getClientLanguage()

  let page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page) {
    page = homeStaticData() as Page
  }

  if (!page) {
    return null
  }

  const { hero, layout } = page

  // Fetch all homepage data
  const payload = await getPayload({ config: configPromise })
  
  // 1. Fetch promo banners
  const { docs: promoBanners } = await payload.find({
    collection: 'promo-banners',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-priority',
    limit: 10,
  })

  // 2. Get product count for hero
  const { totalDocs: productCount } = await payload.find({
    collection: 'products',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 0, // We only need the count
  })

  // 3. Get featured products for showcase
  const { docs: rawProducts } = await payload.find({
    collection: 'products',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
  })
  const products = sortProducts(rawProducts).slice(0, 6)

  // 4. Get testimonials
  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-priority',
    limit: 10,
  })

  // 5. Get settings (for trust badges)
  const settings = await payload.findGlobal({
    slug: 'settings',
  })

  // Transform banners for component
  const bannerData = promoBanners.map((banner) => ({
    id: String(banner.id),
    title: banner.title,
    image: {
      url: typeof banner.image === 'object' ? banner.image.url || '' : '',
      alt: typeof banner.image === 'object' ? banner.image.alt || banner.title : banner.title,
    },
    link: banner.link || undefined,
  }))

  // Transform products for showcase
  const showcaseProducts = products.map((product) => {
    const firstImage = product.gallery?.[0]
    const imageUrl = typeof firstImage?.image === 'object' ? firstImage.image.url : ''
    const artworkImages = getProductArtworkImages(product as any, 4)

    return {
      id: product.id,
      title: product.title,
      slug: product.slug || '',
      priceInIDR: typeof product.priceInIDR === 'number' ? product.priceInIDR : undefined,
      priceInUSD: typeof product.priceInUSD === 'number' ? product.priceInUSD : undefined,
      inventory: product.inventory || 0,
      soldCount: typeof (product as any).soldCount === 'number' ? (product as any).soldCount : 0,
      badge: typeof (product as any).badge === 'string' ? (product as any).badge : undefined,
      customBadge:
        typeof (product as any).customBadge === 'string' ? (product as any).customBadge : undefined,
      enableVariants: product.enableVariants || false,
      variants: product.variants?.docs
        ?.filter((variant) => typeof variant === 'object' && variant !== null)
        .map((variant) => ({
          id: variant.id,
          inventory: variant.inventory,
        })),
      image: imageUrl || '',
      artworkImages,
      isBundle: getNormalizedBundleItems(product as any).length > 0,
      description:
        product.shortDescription ||
        (language === 'id'
          ? 'Produk digital premium siap checkout dan langsung dipakai.'
          : 'Premium digital product ready for fast checkout and instant use.'),
    }
  })

  // Transform testimonials
  const testimonialData = testimonials.map((testimonial) => {
    const avatarUrl = typeof testimonial.avatar === 'object' ? testimonial.avatar?.url : ''
    
    return {
      id: String(testimonial.id),
      name: testimonial.name,
      role: testimonial.role,
      commentId: testimonial.commentId,
      commentEn: testimonial.commentEn,
      rating: testimonial.rating,
      avatar: avatarUrl || '',
    }
  })

  return (
    <article className="relative overflow-hidden bg-background text-foreground">
      <div className="relative z-10">
        <PromoBanner banners={bannerData} />
        <PromoSection language={language} />
        <ProductShowcase language={language} products={showcaseProducts} />
        <PromoBanner banners={bannerData} />
        <Testimonials language={language} testimonials={testimonialData} />
        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug: 'home',
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}
