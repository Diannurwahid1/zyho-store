import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_checkout_sessions_status" AS ENUM('creating', 'pending', 'completed', 'cancelled', 'expired');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_checkout_sessions_currency" AS ENUM('IDR', 'USD');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_checkout_sessions_payment_method" AS ENUM('pakasir', 'nowpayments');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "checkout_sessions" (
      "id" serial PRIMARY KEY NOT NULL,
      "session_id" varchar NOT NULL,
      "active_key" varchar,
      "customer_id" integer NOT NULL,
      "status" "enum_checkout_sessions_status" DEFAULT 'creating' NOT NULL,
      "expires_at" timestamp(3) with time zone NOT NULL,
      "reservation_id" varchar,
      "cart_id" varchar,
      "currency" "enum_checkout_sessions_currency" NOT NULL,
      "payment_method" "enum_checkout_sessions_payment_method" NOT NULL,
      "payment_data" jsonb,
      "order_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "membership_points" numeric DEFAULT 0;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "points_earned" numeric DEFAULT 0;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_reference" varchar;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "checkout_sessions_id" integer;

    DO $$ BEGIN
      ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_customer_id_users_id_fk"
        FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_order_id_orders_id_fk"
        FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_checkout_sessions_fk"
        FOREIGN KEY ("checkout_sessions_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "checkout_sessions_session_id_idx" ON "checkout_sessions" ("session_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "checkout_sessions_active_key_idx" ON "checkout_sessions" ("active_key");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_customer_idx" ON "checkout_sessions" ("customer_id");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_status_idx" ON "checkout_sessions" ("status");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_expires_at_idx" ON "checkout_sessions" ("expires_at");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_reservation_id_idx" ON "checkout_sessions" ("reservation_id");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_order_idx" ON "checkout_sessions" ("order_id");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_updated_at_idx" ON "checkout_sessions" ("updated_at");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_created_at_idx" ON "checkout_sessions" ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_checkout_sessions_id_idx" ON "payload_locked_documents_rels" ("checkout_sessions_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "orders_payment_reference_idx" ON "orders" ("payment_reference");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "orders_payment_reference_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_checkout_sessions_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "checkout_sessions_id";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "payment_reference";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "points_earned";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "membership_points";
    DROP TABLE IF EXISTS "checkout_sessions" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_checkout_sessions_status";
    DROP TYPE IF EXISTS "public"."enum_checkout_sessions_currency";
    DROP TYPE IF EXISTS "public"."enum_checkout_sessions_payment_method";
  `)
}
