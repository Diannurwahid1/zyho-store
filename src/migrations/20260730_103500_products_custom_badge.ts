import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "custom_badge" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_custom_badge" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "custom_badge";
  ALTER TABLE "_products_v" DROP COLUMN "version_custom_badge";`)
}
