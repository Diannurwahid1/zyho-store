import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "products_bundle_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"quantity" numeric DEFAULT 1,
  	"discount_percent" numeric DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS "_products_v_version_bundle_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"quantity" numeric DEFAULT 1,
  	"discount_percent" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bundle_enabled" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_bundle_enabled" boolean DEFAULT false;

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'products_bundle_items_product_id_products_id_fk'
    ) THEN
      ALTER TABLE "products_bundle_items"
        ADD CONSTRAINT "products_bundle_items_product_id_products_id_fk"
        FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'products_bundle_items_parent_id_fk'
    ) THEN
      ALTER TABLE "products_bundle_items"
        ADD CONSTRAINT "products_bundle_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = '_products_v_version_bundle_items_product_id_products_id_fk'
    ) THEN
      ALTER TABLE "_products_v_version_bundle_items"
        ADD CONSTRAINT "_products_v_version_bundle_items_product_id_products_id_fk"
        FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = '_products_v_version_bundle_items_parent_id_fk'
    ) THEN
      ALTER TABLE "_products_v_version_bundle_items"
        ADD CONSTRAINT "_products_v_version_bundle_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "products_bundle_items_order_idx" ON "products_bundle_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_bundle_items_parent_id_idx" ON "products_bundle_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_bundle_items_product_idx" ON "products_bundle_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "_products_v_version_bundle_items_order_idx" ON "_products_v_version_bundle_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_products_v_version_bundle_items_parent_id_idx" ON "_products_v_version_bundle_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_products_v_version_bundle_items_product_idx" ON "_products_v_version_bundle_items" USING btree ("product_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "products_bundle_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_bundle_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "products_bundle_items" CASCADE;
  DROP TABLE IF EXISTS "_products_v_version_bundle_items" CASCADE;
  ALTER TABLE "products" DROP COLUMN IF EXISTS "bundle_enabled";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_bundle_enabled";`)
}
