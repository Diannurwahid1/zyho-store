/**
 * Script untuk generate SQL INSERT statement untuk admin user
 * Tidak perlu initialize Payload, hanya hash password dan generate SQL
 * 
 * Usage:
 * node src/scripts/create-admin-sql.js
 */

import bcrypt from 'bcrypt'

async function generateAdminSQL() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Admin User'

  if (!email || !password || password.length < 16) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD with at least 16 characters are required.')
  }
  
  // Hash password dengan bcrypt (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(password, 10)
  
  console.log('\n=================================================')
  console.log('SQL STATEMENT UNTUK CREATE ADMIN USER')
  console.log('=================================================\n')
  
  console.log('-- Copy dan paste SQL di bawah ini ke psql:\n')
  
  // Generate SQL INSERT statement
  const sql = `
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
`
  
  console.log(sql)
  
  console.log('\n=================================================')
  console.log('CREDENTIALS:')
  console.log('=================================================')
  console.log('Email:', email)
  console.log('Password: set via ADMIN_PASSWORD')
  console.log('=================================================\n')
  
  console.log('Cara pakai:')
  console.log('1. Buka terminal psql:')
  console.log('   psql -U your_username -d your_database_name')
  console.log('2. Copy paste SQL statement di atas')
  console.log('3. Login ke /admin dengan credentials di atas\n')
}

generateAdminSQL().catch(console.error)
