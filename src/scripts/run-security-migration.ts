import 'dotenv/config'
import * as securityMigration from '@/migrations/20260823_010000_security_hardening'
import { sql } from '@payloadcms/db-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const migrationName = '20260823_010000_security_hardening'

const main = async () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is required')

  const pool = new Pool({ connectionString })
  const db = drizzle({ client: pool })

  try {
    await db.transaction(async (transaction) => {
      // Older production databases predate this long-standing Users field.
      await transaction.execute(sql`
        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_avatar_url" varchar
      `)

      const existing = await transaction.execute(sql`
        SELECT 1 FROM "payload_migrations" WHERE "name" = ${migrationName} LIMIT 1
      `)

      if (existing.rows.length > 0) return

      await securityMigration.up({
        db: transaction as never,
        payload: undefined as never,
        req: undefined as never,
      })

      const nextBatch = await transaction.execute(sql`
        SELECT COALESCE(MAX("batch"), 0) + 1 AS "batch" FROM "payload_migrations"
      `)

      await transaction.execute(sql`
        INSERT INTO "payload_migrations" ("name", "batch")
        VALUES (${migrationName}, ${nextBatch.rows[0]?.batch})
      `)
    })
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Security migration failed')
  process.exitCode = 1
})
