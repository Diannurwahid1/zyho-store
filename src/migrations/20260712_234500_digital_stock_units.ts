import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_products_digital_fulfillment_mode" AS ENUM('standard', 'per_unit_stock');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_digital_stock_units_status" AS ENUM('available', 'reserved', 'assigned', 'archived');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_digital_stock_units_delivery_type" AS ENUM('credentials', 'file', 'text');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_orders_digital_deliveries_units_delivery_type" AS ENUM('credentials', 'file', 'text');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "digital_stock_units" (
      "id" serial PRIMARY KEY NOT NULL,
      "unit_code" varchar NOT NULL,
      "product_id" integer NOT NULL,
      "variant" varchar,
      "status" "enum_digital_stock_units_status" DEFAULT 'available' NOT NULL,
      "delivery_type" "enum_digital_stock_units_delivery_type" DEFAULT 'credentials' NOT NULL,
      "label" varchar,
      "account_email" varchar,
      "account_username" varchar,
      "account_password" varchar,
      "login_url" varchar,
      "reference_code" varchar,
      "content" varchar,
      "file_id" integer,
      "reservation_id" varchar,
      "customer_id" integer,
      "order_id" integer,
      "assigned_at" timestamp(3) with time zone,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "digital_fulfillment_mode" "enum_products_digital_fulfillment_mode" DEFAULT 'standard';
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "digital_stock_units_id" integer;

    CREATE TABLE IF NOT EXISTS "orders_digital_deliveries" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "product_id" integer NOT NULL,
      "product_title" varchar,
      "variant" varchar,
      "variant_title" varchar,
      "quantity" numeric NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "orders_digital_deliveries_units" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "unit_code" varchar,
      "delivery_type" "enum_orders_digital_deliveries_units_delivery_type",
      "label" varchar,
      "account_email" varchar,
      "account_username" varchar,
      "account_password" varchar,
      "login_url" varchar,
      "reference_code" varchar,
      "content" varchar,
      "file_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_product_id_products_id_fk"
        FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_file_id_media_id_fk"
        FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_customer_id_users_id_fk"
        FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_order_id_orders_id_fk"
        FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_digital_stock_units_fk"
        FOREIGN KEY ("digital_stock_units_id") REFERENCES "public"."digital_stock_units"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "orders_digital_deliveries" ADD CONSTRAINT "orders_digital_deliveries_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "orders_digital_deliveries" ADD CONSTRAINT "orders_digital_deliveries_product_id_products_id_fk"
        FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "orders_digital_deliveries_units" ADD CONSTRAINT "orders_digital_deliveries_units_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_digital_deliveries"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "orders_digital_deliveries_units" ADD CONSTRAINT "orders_digital_deliveries_units_file_id_media_id_fk"
        FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "digital_stock_units_unit_code_idx" ON "digital_stock_units" ("unit_code");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_product_idx" ON "digital_stock_units" ("product_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_variant_idx" ON "digital_stock_units" ("variant");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_status_idx" ON "digital_stock_units" ("status");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_reservation_id_idx" ON "digital_stock_units" ("reservation_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_customer_idx" ON "digital_stock_units" ("customer_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_order_idx" ON "digital_stock_units" ("order_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_file_idx" ON "digital_stock_units" ("file_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_updated_at_idx" ON "digital_stock_units" ("updated_at");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_created_at_idx" ON "digital_stock_units" ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_digital_stock_units_id_idx" ON "payload_locked_documents_rels" ("digital_stock_units_id");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_order_idx" ON "orders_digital_deliveries" ("_order");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_parent_id_idx" ON "orders_digital_deliveries" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_product_idx" ON "orders_digital_deliveries" ("product_id");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_units_order_idx" ON "orders_digital_deliveries_units" ("_order");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_units_parent_id_idx" ON "orders_digital_deliveries_units" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "orders_digital_deliveries_units_file_idx" ON "orders_digital_deliveries_units" ("file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_digital_stock_units_id_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_units_file_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_units_parent_id_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_units_order_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_product_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_parent_id_idx";
    DROP INDEX IF EXISTS "orders_digital_deliveries_order_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "digital_stock_units_id";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "digital_fulfillment_mode";
    DROP TABLE IF EXISTS "orders_digital_deliveries_units" CASCADE;
    DROP TABLE IF EXISTS "orders_digital_deliveries" CASCADE;
    DROP TABLE IF EXISTS "digital_stock_units" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_orders_digital_deliveries_units_delivery_type";
    DROP TYPE IF EXISTS "public"."enum_digital_stock_units_delivery_type";
    DROP TYPE IF EXISTS "public"."enum_digital_stock_units_status";
    DROP TYPE IF EXISTS "public"."enum_products_digital_fulfillment_mode";
  `)
}
