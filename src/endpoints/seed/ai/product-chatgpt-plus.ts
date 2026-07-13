import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productChatGPTPlus = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'ChatGPT Plus Account',
  slug: 'chatgpt-plus-account',
  shortDescription:
    'Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.',
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
              text: 'Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.',
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
    title: 'ChatGPT Plus Account | Citra Commerce',
    image: metaImage,
    description:
      'Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 149000,
  productType: 'digital',
  licenseType: 'personal',
  version: '1.0',
  isFeatured: true,
  badge: 'best_seller',
  includedFiles: [
    { label: 'Panduan Aktivasi Akun (PDF)', format: 'PDF', size: '2 MB' },
    { label: 'Tips Penggunaan ChatGPT Plus', format: 'PDF', size: '1.5 MB' },
  ],
  productFAQ: [
    { question: 'Apakah akun langsung aktif?', answer: 'Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.' },
    { question: 'Berapa lama garansi?', answer: 'Garansi 30 hari penggantian jika terjadi masalah pada akun.' },
    { question: 'Bisakah dipakai di mobile?', answer: 'Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.' },
  ],
  inventory: 50,
})
