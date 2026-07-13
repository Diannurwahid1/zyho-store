/**
 * Generate SQL untuk create admin user
 * Usage: node --loader ts-node/esm src/scripts/generate-admin-sql.ts
 */

import bcrypt from 'bcrypt'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME || 'Admin User'

if (!email || !password || password.length < 16) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD with at least 16 characters are required.')
}

async function generateSQL() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log('\n' + '='.repeat(60))
    console.log('SQL UNTUK CREATE ADMIN USER')
    console.log('='.repeat(60) + '\n')
    
    const sql = `
-- Copy paste SQL ini ke psql atau pgAdmin

INSERT INTO users (
  email,
  password,
  roles,
  name,
  "updatedAt",
  "createdAt"
) VALUES (
  '${email}',
  '${hashedPassword}',
  '["admin"]',
  '${name}',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  password = EXCLUDED.password,
  roles = EXCLUDED.roles,
  "updatedAt" = NOW();

-- CREDENTIALS:
-- Email: ${email}
-- Password: set via ADMIN_PASSWORD
`
    
    console.log(sql)
    console.log('='.repeat(60))
    console.log('\nCara pakai:')
    console.log('1. Copy SQL statement di atas')
    console.log('2. Connect ke PostgreSQL:')
    console.log('   psql -U postgres -d nama_database')
    console.log('3. Paste dan execute SQL')
    console.log('4. Login ke /admin dengan credentials di atas\n')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

generateSQL()
