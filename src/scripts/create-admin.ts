import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Script untuk membuat admin user baru
 * 
 * Usage:
 * npx tsx src/scripts/create-admin.ts
 */

async function createAdmin() {
  try {
    const payload = await getPayload({ config })

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password || password.length < 16) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD with at least 16 characters are required.')
    }

    // Check if admin already exists
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log('❌ Admin user already exists with email:', email)
      console.log('Updating password...')
      
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          password,
        },
      })
      
      console.log('✅ Password updated successfully!')
    } else {
      // Create new admin user
      const admin = await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          roles: ['admin'],
          name: 'Admin User',
        },
      })

      console.log('✅ Admin user created successfully!')
      console.log('-----------------------------------')
      console.log('Email:', email)
      console.log('ID:', admin.id)
      console.log('-----------------------------------')
      console.log('⚠️  IMPORTANT: Change this password after first login!')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
