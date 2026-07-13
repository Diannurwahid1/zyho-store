import type { Category, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  galleryImage: Media
  metaImage: Media
  categories: Category[]
}

export const productWorkflowKit = ({
  galleryImage,
  metaImage,
  categories,
}: Args): RequiredDataFromCollectionSlug<'products'> => ({
  title: 'AI Workflow Automation Kit',
  slug: 'ai-workflow-automation-kit',
  shortDescription:
    'Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.',
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
              text: 'Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.',
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
    title: 'AI Workflow Automation Kit | Citra Commerce',
    image: metaImage,
    description:
      '50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.',
  },
  _status: 'published',
  layout: [],
  categories,
  relatedProducts: [],
  priceInUSDEnabled: true,
  priceInUSD: 249000,
  productType: 'digital',
  licenseType: 'commercial',
  version: '1.5',
  isFeatured: false,
  badge: 'new',
  includedFiles: [
    { label: '50+ Workflow Templates (JSON)', format: 'JSON', size: '2 MB' },
    { label: 'Panduan Setup & Import (PDF)', format: 'PDF', size: '4 MB' },
    { label: 'Video Tutorial (MP4)', format: 'MP4', size: '500 MB' },
  ],
  productFAQ: [
    { question: 'Platform apa saja yang didukung?', answer: 'n8n (self-hosted & cloud), Make (Integromat), dan Zapier.' },
    { question: 'Apakah butuh skill coding?', answer: 'Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.' },
    { question: 'Bisa request workflow custom?', answer: 'Ya, ada layanan kustomisasi workflow dengan biaya tambahan.' },
  ],
  inventory: 50,
})
