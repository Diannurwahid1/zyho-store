import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "bundle_config" jsonb;

    ALTER TABLE "_products_v"
      ADD COLUMN IF NOT EXISTS "version_bundle_config" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_products_v"
      DROP COLUMN IF EXISTS "version_bundle_config";

    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "bundle_config";
  `)
}
