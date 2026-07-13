/**
 * Standalone AI Product Seed Script
 *
 * Usage:
 *   pnpm exec tsx src/endpoints/seed/ai/inject.ts
 *
 * This script initializes Payload, creates AI categories, uploads placeholder images,
 * creates AI digital products, and generates types — all without destroying existing data.
 */
import configPromise from '@payload-config'
import 'dotenv/config'
import { getPayload } from 'payload'

import { aiCategories } from './categories'
import { productChatGPTPlus } from './product-chatgpt-plus'
import { productClaudePro } from './product-claude-pro'
import { productCopilotAccount } from './product-copilot'
import { productMidjourney } from './product-midjourney'
import { productPromptPack } from './product-prompt-pack'
import { productWorkflowKit } from './product-workflow-kit'

import type { Category, Media } from '@/payload-types'

// ─── Placeholder image generator ────────────────────────────────────────────
// Creates a simple SVG placeholder as a Buffer to use as media upload
function createPlaceholderImage(label: string, color: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)" rx="24"/>
    <text x="600" y="400" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="48" font-weight="700">${label}</text>
    <text x="600" y="460" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="system-ui, sans-serif" font-size="24">Citra Commerce</text>
    <text x="600" y="510" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="system-ui, sans-serif" font-size="18">Produk Digital AI</text>
  </svg>`
  return Buffer.from(svg)
}

async function createPlaceholderMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  label: string,
  alt: string,
  color: string,
): Promise<Media> {
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: createPlaceholderImage(label, color),
      mimetype: 'image/svg+xml',
      name: `${label.toLowerCase().replace(/\s+/g, '-')}.svg`,
      size: createPlaceholderImage(label, color).length,
    },
  }) as Promise<Media>
}

// ─── Main injection ─────────────────────────────────────────────────────────
async function inject() {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('━━━ Injecting AI Digital Products ━━━')

  // ── 1. Create categories ────────────────────────────────────────────────
  payload.logger.info('→ Creating AI categories...')
  const createdCategories: Category[] = []

  for (const catData of aiCategories) {
    // Check if category already exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: catData.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      payload.logger.info(`  ✓ Category "${catData.title}" already exists, reusing.`)
      createdCategories.push(existing.docs[0])
    } else {
      const created = await payload.create({
        collection: 'categories',
        data: { title: catData.title, slug: catData.slug },
      })
      payload.logger.info(`  ✓ Created category: ${catData.title}`)
      createdCategories.push(created)
    }
  }

  const aiAccountCat = createdCategories.find((c) => c.slug === 'ai-account')!
  const promptPackCat = createdCategories.find((c) => c.slug === 'ai-prompt-pack')!
  const workflowCat = createdCategories.find((c) => c.slug === 'ai-workflow')!
  const toolkitCat = createdCategories.find((c) => c.slug === 'ai-toolkit')!

  // ── 2. Create placeholder images ────────────────────────────────────────
  payload.logger.info('→ Creating placeholder images...')
  const images: Media[] = []

  const imageDefs = [
    { label: 'ChatGPT Plus', alt: 'ChatGPT Plus Account - AI Assistant Premium', color: '#10a37f' },
    { label: 'Claude Pro', alt: 'Claude Pro Account - Anthropic AI Assistant', color: '#d97706' },
    { label: 'Midjourney', alt: 'Midjourney Access - AI Image Generation', color: '#5865f2' },
    { label: 'GitHub Copilot', alt: 'GitHub Copilot - AI Pair Programming', color: '#24292e' },
    { label: 'Prompt Pack', alt: 'AI Prompt Pack Premium - 1000+ Prompts', color: '#e11d48' },
    { label: 'Workflow Kit', alt: 'AI Workflow Automation Kit', color: '#7c3aed' },
  ]

  for (const def of imageDefs) {
    const img = await createPlaceholderMedia(payload, def.label, def.alt, def.color)
    images.push(img)
    payload.logger.info(`  ✓ Created image: ${def.label}`)
  }

  // ── 3. Create products ──────────────────────────────────────────────────
  payload.logger.info('→ Creating AI products...')

  const productDefs = [
    { fn: productChatGPTPlus, name: 'ChatGPT Plus Account', categories: [aiAccountCat], imgIdx: 0 },
    { fn: productClaudePro, name: 'Claude Pro Account', categories: [aiAccountCat], imgIdx: 1 },
    { fn: productMidjourney, name: 'Midjourney Access Bundle', categories: [aiAccountCat, toolkitCat], imgIdx: 2 },
    { fn: productCopilotAccount, name: 'GitHub Copilot Account', categories: [aiAccountCat], imgIdx: 3 },
    { fn: productPromptPack, name: 'AI Prompt Pack Premium', categories: [promptPackCat], imgIdx: 4 },
    { fn: productWorkflowKit, name: 'AI Workflow Automation Kit', categories: [workflowCat], imgIdx: 5 },
  ]

  for (const def of productDefs) {
    // Skip if product already exists
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: def.fn({ galleryImage: images[0], metaImage: images[0], categories: def.categories }).slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      payload.logger.info(`  ✓ Product "${def.name}" already exists, skipping.`)
      continue
    }

    const productData = def.fn({
      galleryImage: images[def.imgIdx],
      metaImage: images[def.imgIdx],
      categories: def.categories,
    })

    await payload.create({
      collection: 'products',
      depth: 0,
      data: productData,
    })

    payload.logger.info(`  ✓ Created product: ${def.name}`)
  }

  // ── 4. Create demo customer ─────────────────────────────────────────────
  payload.logger.info('→ Checking demo customer...')
  const existingCustomer = await payload.find({
    collection: 'users',
    where: { email: { equals: 'customer@example.com' } },
    limit: 1,
  })

  if (existingCustomer.docs.length === 0) {
    const demoCustomerPassword = process.env.SEED_DEMO_PASSWORD || crypto.randomUUID()
    await payload.create({
      collection: 'users',
      data: {
        name: 'Demo Customer',
        email: 'customer@example.com',
        password: demoCustomerPassword,
        roles: ['customer'],
      },
    })
    payload.logger.info(
      process.env.SEED_DEMO_PASSWORD
        ? '  ✓ Created demo customer with SEED_DEMO_PASSWORD'
        : '  ✓ Created demo customer with a random password',
    )
  } else {
    payload.logger.info('  ✓ Demo customer already exists.')
  }

  // ── 5. Update homepage globals ──────────────────────────────────────────
  payload.logger.info('→ Updating header navigation...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'Beranda', url: '/' } },
        { link: { type: 'custom', label: 'Produk', url: '/shop' } },
        { link: { type: 'custom', label: 'Akun Saya', url: '/account' } },
      ],
    } as any,
  })
  payload.logger.info('  ✓ Header navigation updated.')

  payload.logger.info('')
  payload.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  payload.logger.info('  ✅ AI Product Seed Complete!')
  payload.logger.info('')
  payload.logger.info('  Produk yang dibuat:')
  payload.logger.info('    1. ChatGPT Plus Account      — Rp 149.000')
  payload.logger.info('    2. Claude Pro Account         — Rp 139.000')
  payload.logger.info('    3. Midjourney Access Bundle   — Rp 199.000')
  payload.logger.info('    4. GitHub Copilot Account     — Rp 99.000')
  payload.logger.info('    5. AI Prompt Pack Premium     — Rp 79.000')
  payload.logger.info('    6. AI Workflow Automation Kit — Rp 249.000')
  payload.logger.info('')
  payload.logger.info('  Login demo:')
  payload.logger.info('    Email: customer@example.com')
  payload.logger.info('    Pass:  set via SEED_DEMO_PASSWORD or random per run')
  payload.logger.info('')
  payload.logger.info('  Buka: http://localhost:3000/shop')
  payload.logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  process.exit(0)
}

inject().catch((err) => {
  console.error('Seed injection failed:', err)
  process.exit(1)
})
