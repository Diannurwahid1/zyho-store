import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_digital_stock_units_status" AS ENUM('available', 'reserved', 'assigned', 'archived');
  CREATE TYPE "public"."enum_digital_stock_units_delivery_type" AS ENUM('credentials', 'file', 'text');
  CREATE TYPE "public"."enum_products_digital_fulfillment_mode" AS ENUM('standard', 'per_unit_stock');
  CREATE TYPE "public"."enum__products_v_version_digital_fulfillment_mode" AS ENUM('standard', 'per_unit_stock');
  CREATE TYPE "public"."enum_orders_digital_deliveries_units_delivery_type" AS ENUM('credentials', 'file', 'text');
  CREATE TABLE "digital_stock_units" (
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
  
  CREATE TABLE "orders_digital_deliveries_units" (
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
  
  CREATE TABLE "orders_digital_deliveries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"product_title" varchar,
  	"variant" varchar,
  	"variant_title" varchar,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "whatsapp_blast_test" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products" ADD COLUMN "cara_penggunaan" jsonb;
  ALTER TABLE "products" ADD COLUMN "garansi" jsonb;
  ALTER TABLE "products" ADD COLUMN "digital_fulfillment_mode" "enum_products_digital_fulfillment_mode" DEFAULT 'standard';
  ALTER TABLE "_products_v" ADD COLUMN "version_cara_penggunaan" jsonb;
  ALTER TABLE "_products_v" ADD COLUMN "version_garansi" jsonb;
  ALTER TABLE "_products_v" ADD COLUMN "version_digital_fulfillment_mode" "enum__products_v_version_digital_fulfillment_mode" DEFAULT 'standard';
  ALTER TABLE "orders" ADD COLUMN "payment_reference" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "digital_stock_units_id" integer;
  ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "digital_stock_units" ADD CONSTRAINT "digital_stock_units_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_digital_deliveries_units" ADD CONSTRAINT "orders_digital_deliveries_units_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_digital_deliveries_units" ADD CONSTRAINT "orders_digital_deliveries_units_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_digital_deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_digital_deliveries" ADD CONSTRAINT "orders_digital_deliveries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_digital_deliveries" ADD CONSTRAINT "orders_digital_deliveries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "digital_stock_units_unit_code_idx" ON "digital_stock_units" USING btree ("unit_code");
  CREATE INDEX "digital_stock_units_product_idx" ON "digital_stock_units" USING btree ("product_id");
  CREATE INDEX "digital_stock_units_variant_idx" ON "digital_stock_units" USING btree ("variant");
  CREATE INDEX "digital_stock_units_status_idx" ON "digital_stock_units" USING btree ("status");
  CREATE INDEX "digital_stock_units_file_idx" ON "digital_stock_units" USING btree ("file_id");
  CREATE INDEX "digital_stock_units_reservation_id_idx" ON "digital_stock_units" USING btree ("reservation_id");
  CREATE INDEX "digital_stock_units_customer_idx" ON "digital_stock_units" USING btree ("customer_id");
  CREATE INDEX "digital_stock_units_order_idx" ON "digital_stock_units" USING btree ("order_id");
  CREATE INDEX "digital_stock_units_updated_at_idx" ON "digital_stock_units" USING btree ("updated_at");
  CREATE INDEX "digital_stock_units_created_at_idx" ON "digital_stock_units" USING btree ("created_at");
  CREATE INDEX "orders_digital_deliveries_units_order_idx" ON "orders_digital_deliveries_units" USING btree ("_order");
  CREATE INDEX "orders_digital_deliveries_units_parent_id_idx" ON "orders_digital_deliveries_units" USING btree ("_parent_id");
  CREATE INDEX "orders_digital_deliveries_units_file_idx" ON "orders_digital_deliveries_units" USING btree ("file_id");
  CREATE INDEX "orders_digital_deliveries_order_idx" ON "orders_digital_deliveries" USING btree ("_order");
  CREATE INDEX "orders_digital_deliveries_parent_id_idx" ON "orders_digital_deliveries" USING btree ("_parent_id");
  CREATE INDEX "orders_digital_deliveries_product_idx" ON "orders_digital_deliveries" USING btree ("product_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_digital_stock_units_fk" FOREIGN KEY ("digital_stock_units_id") REFERENCES "public"."digital_stock_units"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "orders_payment_reference_idx" ON "orders" USING btree ("payment_reference");
  CREATE INDEX "payload_locked_documents_rels_digital_stock_units_id_idx" ON "payload_locked_documents_rels" USING btree ("digital_stock_units_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "digital_stock_units" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders_digital_deliveries_units" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders_digital_deliveries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "whatsapp_blast_test" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "digital_stock_units" CASCADE;
  DROP TABLE "orders_digital_deliveries_units" CASCADE;
  DROP TABLE "orders_digital_deliveries" CASCADE;
  DROP TABLE "whatsapp_blast_test" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_digital_stock_units_fk";
  
  DROP INDEX "orders_payment_reference_idx";
  DROP INDEX "payload_locked_documents_rels_digital_stock_units_id_idx";
  ALTER TABLE "products" DROP COLUMN "cara_penggunaan";
  ALTER TABLE "products" DROP COLUMN "garansi";
  ALTER TABLE "products" DROP COLUMN "digital_fulfillment_mode";
  ALTER TABLE "_products_v" DROP COLUMN "version_cara_penggunaan";
  ALTER TABLE "_products_v" DROP COLUMN "version_garansi";
  ALTER TABLE "_products_v" DROP COLUMN "version_digital_fulfillment_mode";
  ALTER TABLE "orders" DROP COLUMN "payment_reference";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "digital_stock_units_id";
  DROP TYPE "public"."enum_digital_stock_units_status";
  DROP TYPE "public"."enum_digital_stock_units_delivery_type";
  DROP TYPE "public"."enum_products_digital_fulfillment_mode";
  DROP TYPE "public"."enum__products_v_version_digital_fulfillment_mode";
  DROP TYPE "public"."enum_orders_digital_deliveries_units_delivery_type";`)
}
