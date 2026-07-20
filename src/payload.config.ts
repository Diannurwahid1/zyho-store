import { postgresAdapter } from '@payloadcms/db-postgres'
import {
    BoldFeature,
    EXPERIMENTAL_TableFeature,
    IndentFeature,
    ItalicFeature,
    LinkFeature,
    OrderedListFeature,
    UnderlineFeature,
    UnorderedListFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { CheckoutSessions } from '@/collections/CheckoutSessions'
import { Coupons } from '@/collections/Coupons'
import { DigitalAssets } from '@/collections/DigitalAssets'
import { DigitalStockUnits } from '@/collections/DigitalStockUnits'
import { DownloadAccess } from '@/collections/DownloadAccess'
import { DownloadLogs } from '@/collections/DownloadLogs'
import { EmailTemplates } from '@/collections/EmailTemplates'
import { Licenses } from '@/collections/Licenses'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { PaymentTransactions } from '@/collections/PaymentTransactions'
import { PromoBanners } from '@/collections/PromoBanners'
import { StockLedger } from '@/collections/StockLedger'
import { StockReservations } from '@/collections/StockReservations'
import { SupportMessages } from '@/collections/SupportMessages'
import { SupportTickets } from '@/collections/SupportTickets'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { WaitlistEntries } from '@/collections/WaitlistEntries'
import { Waitlists } from '@/collections/Waitlists'
import { AdminWhatsAppBlast } from '@/globals/AdminWhatsAppBlast'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Settings } from '@/globals/Settings'
import { StockAdjustment } from '@/globals/StockAdjustment'
import { plugins } from './plugins'
// Remove this import since we're not using it in config
// import { WaitlistBlastPage } from '@/app/(payload)/waitlist-blast/page'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const payloadSecret = process.env.PAYLOAD_SECRET

if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET is required.')
}

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- zyho admin',
    },
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
      afterNavLinks: [
        '@/components/AdminReportsNavLink#AdminReportsNavLink',
      ],
      graphics: {
        Icon: '@/components/Logo/Logo#Icon',
        Logo: '@/components/Logo/Logo#Logo',
      },
    },
    user: Users.slug,
  },
  routes: {
    admin: '/mlebu',
  },
  collections: [
    Users,
    CheckoutSessions,
    Pages,
    Categories,
    Media,
    DigitalAssets,
    DigitalStockUnits,
    DownloadAccess,
    DownloadLogs,
    Licenses,
    PaymentTransactions,
    Coupons,
    PromoBanners,
    Testimonials,
    SupportTickets,
    SupportMessages,
    EmailTemplates,
    StockReservations,
    StockLedger,
    Waitlists,
    WaitlistEntries,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  //email: nodemailerAdapter(),
  endpoints: [],
  globals: [Header, Footer, Settings, StockAdjustment, AdminWhatsAppBlast],
  plugins,
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
