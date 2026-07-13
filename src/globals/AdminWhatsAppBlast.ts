import { adminOrManager } from '@/access/roles'
import type { GlobalConfig } from 'payload'

export const AdminWhatsAppBlast: GlobalConfig = {
  slug: 'whatsapp-blast-test',
  access: {
    read: adminOrManager,
    update: adminOrManager,
  },
  admin: {
    group: 'Commerce',
    description: 'Kirim pesan WhatsApp test manual dari admin.',
  },
  fields: [
    {
      type: 'ui',
      name: 'whatsAppBlastTestTool',
      admin: {
        components: {
          Field: '@/components/AdminWhatsAppBlastField#AdminWhatsAppBlastField',
        },
      },
    },
  ],
}
