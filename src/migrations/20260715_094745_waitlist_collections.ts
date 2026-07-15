import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_waitlists_status" AS ENUM('active', 'closed');
  CREATE TYPE "public"."enum_waitlist_entries_status" AS ENUM('waiting', 'notified', 'purchased', 'cancelled');
  CREATE TABLE "waitlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"status" "enum_waitlists_status" DEFAULT 'active' NOT NULL,
  	"voucher_id" integer,
  	"notify_message" varchar,
  	"total_entries" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "waitlist_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"waitlist_id" integer NOT NULL,
  	"customer_id" integer,
  	"name" varchar,
  	"phone" varchar NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"status" "enum_waitlist_entries_status" DEFAULT 'waiting' NOT NULL,
  	"notified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "waitlists_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "waitlist_entries_id" integer;
  ALTER TABLE "waitlists" ADD CONSTRAINT "waitlists_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "waitlists" ADD CONSTRAINT "waitlists_voucher_id_coupons_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_waitlist_id_waitlists_id_fk" FOREIGN KEY ("waitlist_id") REFERENCES "public"."waitlists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "waitlists_product_idx" ON "waitlists" USING btree ("product_id");
  CREATE INDEX "waitlists_voucher_idx" ON "waitlists" USING btree ("voucher_id");
  CREATE INDEX "waitlists_updated_at_idx" ON "waitlists" USING btree ("updated_at");
  CREATE INDEX "waitlists_created_at_idx" ON "waitlists" USING btree ("created_at");
  CREATE INDEX "waitlist_entries_waitlist_idx" ON "waitlist_entries" USING btree ("waitlist_id");
  CREATE INDEX "waitlist_entries_customer_idx" ON "waitlist_entries" USING btree ("customer_id");
  CREATE INDEX "waitlist_entries_phone_idx" ON "waitlist_entries" USING btree ("phone");
  CREATE INDEX "waitlist_entries_updated_at_idx" ON "waitlist_entries" USING btree ("updated_at");
  CREATE INDEX "waitlist_entries_created_at_idx" ON "waitlist_entries" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlists_fk" FOREIGN KEY ("waitlists_id") REFERENCES "public"."waitlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlist_entries_fk" FOREIGN KEY ("waitlist_entries_id") REFERENCES "public"."waitlist_entries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_waitlists_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlists_id");
  CREATE INDEX "payload_locked_documents_rels_waitlist_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlist_entries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "waitlists" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "waitlist_entries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "waitlists" CASCADE;
  DROP TABLE "waitlist_entries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_waitlists_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_waitlist_entries_fk";
  
  DROP INDEX "payload_locked_documents_rels_waitlists_id_idx";
  DROP INDEX "payload_locked_documents_rels_waitlist_entries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "waitlists_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "waitlist_entries_id";
  DROP TYPE "public"."enum_waitlists_status";
  DROP TYPE "public"."enum_waitlist_entries_status";`)
}
