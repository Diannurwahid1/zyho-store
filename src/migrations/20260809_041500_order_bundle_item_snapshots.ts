import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders_items"
      ADD COLUMN IF NOT EXISTS "bundle_parent_product_id" integer,
      ADD COLUMN IF NOT EXISTS "bundle_parent_title" varchar,
      ADD COLUMN IF NOT EXISTS "bundle_discount_percent" numeric,
      ADD COLUMN IF NOT EXISTS "bundle_unit_price_in_i_d_r" numeric,
      ADD COLUMN IF NOT EXISTS "bundle_unit_price_in_u_s_d" numeric;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'orders_items_bundle_parent_product_id_products_id_fk'
      ) THEN
        ALTER TABLE "orders_items"
          ADD CONSTRAINT "orders_items_bundle_parent_product_id_products_id_fk"
          FOREIGN KEY ("bundle_parent_product_id") REFERENCES "public"."products"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "orders_items_bundle_parent_product_idx"
      ON "orders_items" USING btree ("bundle_parent_product_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders_items"
      DROP CONSTRAINT IF EXISTS "orders_items_bundle_parent_product_id_products_id_fk";

    DROP INDEX IF EXISTS "orders_items_bundle_parent_product_idx";

    ALTER TABLE "orders_items"
      DROP COLUMN IF EXISTS "bundle_parent_product_id",
      DROP COLUMN IF EXISTS "bundle_parent_title",
      DROP COLUMN IF EXISTS "bundle_discount_percent",
      DROP COLUMN IF EXISTS "bundle_unit_price_in_i_d_r",
      DROP COLUMN IF EXISTS "bundle_unit_price_in_u_s_d";
  `)
}
