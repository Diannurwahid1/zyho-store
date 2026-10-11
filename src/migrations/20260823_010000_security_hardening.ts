import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payment_attempts_provider" AS ENUM('sumopod', 'nowpayments');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payment_attempts_currency" AS ENUM('IDR', 'USD');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payment_attempts_status" AS ENUM(
        'initiated', 'creating', 'pending', 'completed', 'finalizing', 'failed', 'expired', 'cancelled', 'consumed'
      );
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payment_webhook_events_provider" AS ENUM('sumopod', 'nowpayments');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payment_webhook_events_status" AS ENUM('processing', 'processed', 'failed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "payment_attempts" (
      "id" serial PRIMARY KEY NOT NULL,
      "attempt_id" varchar NOT NULL,
      "checkout_session_id" integer NOT NULL,
      "customer_id" integer NOT NULL,
      "cart_id" varchar NOT NULL,
      "provider" "enum_payment_attempts_provider" NOT NULL,
      "provider_order_id" varchar NOT NULL,
      "provider_payment_id" varchar,
      "expected_amount" numeric NOT NULL,
      "paid_amount" numeric,
      "currency" "enum_payment_attempts_currency" NOT NULL,
      "status" "enum_payment_attempts_status" DEFAULT 'initiated' NOT NULL,
      "snapshot" jsonb NOT NULL,
      "provider_data" jsonb,
      "verified_at" timestamp(3) with time zone,
      "consumed_at" timestamp(3) with time zone,
      "order_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payment_webhook_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "external_id" varchar NOT NULL,
      "provider" "enum_payment_webhook_events_provider" NOT NULL,
      "event_type" varchar NOT NULL,
      "payload_hash" varchar NOT NULL,
      "status" "enum_payment_webhook_events_status" DEFAULT 'processing' NOT NULL,
      "payment_attempt_id" integer,
      "processed_at" timestamp(3) with time zone,
      "error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "checkout_sessions" ADD COLUMN IF NOT EXISTS "payment_attempt_id" integer;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "is_protected_digital_asset" boolean DEFAULT false;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payment_attempts_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payment_webhook_events_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_checkout_session_id_checkout_sessions_id_fk"
        FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE restrict ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_customer_id_users_id_fk"
        FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_order_id_orders_id_fk"
        FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payment_webhook_events" ADD CONSTRAINT "payment_webhook_events_payment_attempt_id_payment_attempts_id_fk"
        FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_payment_attempt_id_payment_attempts_id_fk"
        FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_attempts_fk"
        FOREIGN KEY ("payment_attempts_id") REFERENCES "public"."payment_attempts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_webhook_events_fk"
        FOREIGN KEY ("payment_webhook_events_id") REFERENCES "public"."payment_webhook_events"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_attempt_id_idx" ON "payment_attempts" ("attempt_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_checkout_session_idx" ON "payment_attempts" ("checkout_session_id");
    CREATE INDEX IF NOT EXISTS "payment_attempts_customer_idx" ON "payment_attempts" ("customer_id");
    CREATE INDEX IF NOT EXISTS "payment_attempts_cart_id_idx" ON "payment_attempts" ("cart_id");
    CREATE INDEX IF NOT EXISTS "payment_attempts_provider_idx" ON "payment_attempts" ("provider");
    CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_provider_order_id_idx" ON "payment_attempts" ("provider_order_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_provider_payment_id_idx" ON "payment_attempts" ("provider_payment_id");
    CREATE INDEX IF NOT EXISTS "payment_attempts_status_idx" ON "payment_attempts" ("status");
    CREATE INDEX IF NOT EXISTS "payment_attempts_order_idx" ON "payment_attempts" ("order_id");
    CREATE INDEX IF NOT EXISTS "payment_attempts_updated_at_idx" ON "payment_attempts" ("updated_at");
    CREATE INDEX IF NOT EXISTS "payment_attempts_created_at_idx" ON "payment_attempts" ("created_at");

    CREATE UNIQUE INDEX IF NOT EXISTS "payment_webhook_events_external_id_idx" ON "payment_webhook_events" ("external_id");
    CREATE INDEX IF NOT EXISTS "payment_webhook_events_event_type_idx" ON "payment_webhook_events" ("event_type");
    CREATE INDEX IF NOT EXISTS "payment_webhook_events_status_idx" ON "payment_webhook_events" ("status");
    CREATE INDEX IF NOT EXISTS "payment_webhook_events_payment_attempt_idx" ON "payment_webhook_events" ("payment_attempt_id");
    CREATE INDEX IF NOT EXISTS "payment_webhook_events_updated_at_idx" ON "payment_webhook_events" ("updated_at");
    CREATE INDEX IF NOT EXISTS "payment_webhook_events_created_at_idx" ON "payment_webhook_events" ("created_at");
    CREATE INDEX IF NOT EXISTS "checkout_sessions_payment_attempt_idx" ON "checkout_sessions" ("payment_attempt_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_attempts_id_idx" ON "payload_locked_documents_rels" ("payment_attempts_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_webhook_events_id_idx" ON "payload_locked_documents_rels" ("payment_webhook_events_id");

    UPDATE "media"
      SET "is_protected_digital_asset" = true
      WHERE "id" IN (
        SELECT "file_id" FROM "digital_assets" WHERE "file_id" IS NOT NULL AND "protected" IS NOT false
        UNION
        SELECT "file_id" FROM "digital_stock_units" WHERE "file_id" IS NOT NULL AND "delivery_type" = 'file'
      );

    WITH ranked AS (
      SELECT "id", row_number() OVER (
        PARTITION BY "reservation_id"
        ORDER BY CASE "status" WHEN 'confirmed' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END, "created_at", "id"
      ) AS row_number
      FROM "stock_reservations"
      WHERE "reservation_id" IS NOT NULL
    )
    DELETE FROM "stock_reservations"
      WHERE "id" IN (SELECT "id" FROM ranked WHERE row_number > 1);

    DROP INDEX IF EXISTS "stock_reservations_reservation_id_idx";
    CREATE UNIQUE INDEX "stock_reservations_reservation_id_idx" ON "stock_reservations" ("reservation_id");

    WITH ranked_waitlist_entries AS (
      SELECT "id", row_number() OVER (
        PARTITION BY "waitlist_id", "phone"
        ORDER BY "created_at", "id"
      ) AS row_number
      FROM "waitlist_entries"
      WHERE "status" = 'waiting'
    )
    DELETE FROM "waitlist_entries"
      WHERE "id" IN (SELECT "id" FROM ranked_waitlist_entries WHERE row_number > 1);

    UPDATE "waitlists"
      SET "total_entries" = (
        SELECT count(*) FROM "waitlist_entries" WHERE "waitlist_id" = "waitlists"."id"
      );

    CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_entries_waiting_phone_idx"
      ON "waitlist_entries" ("waitlist_id", "phone") WHERE "status" = 'waiting';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "waitlist_entries_waiting_phone_idx";
    DROP INDEX IF EXISTS "stock_reservations_reservation_id_idx";
    CREATE INDEX "stock_reservations_reservation_id_idx" ON "stock_reservations" ("reservation_id");

    ALTER TABLE "checkout_sessions" DROP CONSTRAINT IF EXISTS "checkout_sessions_payment_attempt_id_payment_attempts_id_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payment_attempts_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payment_webhook_events_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_attempts_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_webhook_events_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_attempts_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_webhook_events_id";
    ALTER TABLE "checkout_sessions" DROP COLUMN IF EXISTS "payment_attempt_id";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "is_protected_digital_asset";
    DROP TABLE IF EXISTS "payment_webhook_events" CASCADE;
    DROP TABLE IF EXISTS "payment_attempts" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_payment_webhook_events_status";
    DROP TYPE IF EXISTS "public"."enum_payment_webhook_events_provider";
    DROP TYPE IF EXISTS "public"."enum_payment_attempts_status";
    DROP TYPE IF EXISTS "public"."enum_payment_attempts_currency";
    DROP TYPE IF EXISTS "public"."enum_payment_attempts_provider";
  `)
}
