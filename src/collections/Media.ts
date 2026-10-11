import type { CollectionConfig, Where } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'
import { moveMediaFilesToPrivateStorage } from '@/utilities/privateMedia'

const canReadSupportAttachments = (user: any) =>
  checkRole(['admin', 'manager', 'support'], user)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Content',
  },
  slug: 'media',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: ({ req: { user } }) => {
      if (canReadSupportAttachments(user)) return true

      if (user?.id) {
        return {
          or: [
            {
              and: [
                { isSupportAttachment: { not_equals: true } },
                { isProtectedDigitalAsset: { not_equals: true } },
              ],
            },
            {
              uploadedBy: {
                equals: user.id,
              },
            },
          ],
        } as Where
      }

      return {
        and: [
          { isSupportAttachment: { not_equals: true } },
          { isProtectedDigitalAsset: { not_equals: true } },
        ],
      } as Where
    },
    update: adminOnly,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.isSupportAttachment || doc.isProtectedDigitalAsset) {
          await moveMediaFilesToPrivateStorage(doc as Record<string, any>)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isSupportAttachment',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isProtectedDigitalAsset',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
  },
}
