import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productMidjourney = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Midjourney Access Bundle',
  slug: 'midjourney-access-bundle',
  shortDescription:
    'Akses Midjourney untuk generate gambar AI berkualitas tinggi. Termasuk panduan lengkap dan 500+ prompt siap pakai.',
  description: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Midjourney adalah tool AI image generation terbaik saat ini. Dengan bundle ini, Anda mendapat akses dan panduan lengkap mulai dari dasar hingga teknik advanced seperti style mixing, multi-prompt, dan parameter tuning. Termasuk 500+ prompt template untuk berbagai use case.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  gallery: [{ image: galleryImage }],
  meta: {
    title: 'Midjourney Access Bundle | Citra Commerce',
    image: metaImage,
    description:
      'Akses Midjourney + panduan lengkap + 500+ prompt template untuk AI image generation profesional.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 199000,
  productType: 'digital',
  licenseType: 'standard',
  version: '2.0',
  isFeatured: true,
  badge: 'best_seller',
  includedFiles: [
    { label: 'Panduan Midjourney Lengkap (PDF)', format: 'PDF', size: '5 MB' },
    { label: '500+ Prompt Template (PDF)', format: 'PDF', size: '3 MB' },
    { label: 'Cheat Sheet Parameter (PDF)', format: 'PDF', size: '1 MB' },
  ],
  productFAQ: [
    { question: 'Apakah ini akun Midjourney?', answer: 'Ini adalah bundle akses + panduan + prompt template. Detail akses diberikan setelah pembelian.' },
    { question: 'Untuk siapa produk ini?', answer: 'Cocok untuk desainer, content creator, marketer, dan siapa saja yang butuh gambar AI berkualitas tinggi.' },
    { question: 'Apakah prompt bisa diedit?', answer: 'Ya, semua prompt template bisa dimodifikasi sesuai kebutuhan Anda.' },
  ],
  inventory: 100,
})
