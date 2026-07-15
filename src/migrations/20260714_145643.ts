import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "cara_penggunaan" jsonb;
   ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "garansi" jsonb;
   ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_cara_penggunaan" jsonb;
   ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_garansi" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN IF EXISTS "cara_penggunaan";
   ALTER TABLE "products" DROP COLUMN IF EXISTS "garansi";
   ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_cara_penggunaan";
   ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_garansi";
  `)
}
