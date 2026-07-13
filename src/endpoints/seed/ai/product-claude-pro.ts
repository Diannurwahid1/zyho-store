import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productClaudePro = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'Claude Pro Account',
  slug: 'claude-pro-account',
  shortDescription:
    'Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.',
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
              text: 'Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.',
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
    title: 'Claude Pro Account | Citra Commerce',
    image: metaImage,
    description:
      'Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 139000,
  productType: 'digital',
  licenseType: 'personal',
  version: '1.0',
  isFeatured: true,
  badge: 'new',
  includedFiles: [
    { label: 'Panduan Aktivasi Claude Pro (PDF)', format: 'PDF', size: '1.8 MB' },
    { label: 'Prompt Template Claude untuk Bisnis', format: 'PDF', size: '2.2 MB' },
  ],
  productFAQ: [
    { question: 'Apa bedanya Claude Pro dan ChatGPT Plus?', answer: 'Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.' },
    { question: 'Berapa lama garansi akun?', answer: 'Garansi 30 hari penggantian jika akun bermasalah.' },
    { question: 'Bisa upload file?', answer: 'Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.' },
  ],
  inventory: 40,
})
