import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productPromptPack = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'AI Prompt Pack Premium',
  slug: 'ai-prompt-pack-premium',
  shortDescription:
    'Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.',
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
              text: 'Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.',
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
    title: 'AI Prompt Pack Premium | Citra Commerce',
    image: metaImage,
    description:
      '1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 79000,
  productType: 'prompt_pack',
  licenseType: 'commercial',
  version: '3.0',
  isFeatured: true,
  badge: 'best_seller',
  includedFiles: [
    { label: '1000+ Prompt Pack (Notion Template)', format: 'Notion', size: '5 MB' },
    { label: 'PDF Version Lengkap', format: 'PDF', size: '8 MB' },
    { label: 'Bonus: Prompt Engineering Guide', format: 'PDF', size: '3 MB' },
  ],
  productFAQ: [
    { question: 'Untuk AI apa saja prompt ini?', answer: 'Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.' },
    { question: 'Bisa dipakai untuk klien?', answer: 'Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.' },
    { question: 'Apakah update gratis?', answer: 'Ya, semua update prompt baru akan dikirim ke email pembeli.' },
  ],
  inventory: 999,
})
