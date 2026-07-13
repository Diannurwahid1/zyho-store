import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productCopilotAccount = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'GitHub Copilot Account',
  slug: 'github-copilot-account',
  shortDescription:
    'Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.',
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
              text: 'GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.',
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
    title: 'GitHub Copilot Account | Citra Commerce',
    image: metaImage,
    description:
      'Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 99000,
  productType: 'digital',
  licenseType: 'personal',
  version: '1.0',
  isFeatured: false,
  badge: 'new',
  includedFiles: [
    { label: 'Panduan Setup Copilot (PDF)', format: 'PDF', size: '1.5 MB' },
    { label: 'Tips Copilot untuk Developer', format: 'PDF', size: '1 MB' },
  ],
  productFAQ: [
    { question: 'Bekerja di editor apa saja?', answer: 'Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.' },
    { question: 'Berapa lama masa aktif?', answer: '1 tahun penuh. Diperpanjang otomatis jika diperlukan.' },
    { question: 'Bisa untuk bahasa pemrograman apa?', answer: 'Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.' },
  ],
  inventory: 30,
})
