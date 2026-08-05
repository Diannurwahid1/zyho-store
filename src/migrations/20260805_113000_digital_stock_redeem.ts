import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "digital_stock_units"
      ADD COLUMN IF NOT EXISTS "redeem_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "redeem_code" varchar,
      ADD COLUMN IF NOT EXISTS "redeem_code_lookup" varchar,
      ADD COLUMN IF NOT EXISTS "redeemed_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "redeemed_by_id" integer,
      ADD COLUMN IF NOT EXISTS "redeem_order_id" integer;

    ALTER TABLE "orders"
      ADD COLUMN IF NOT EXISTS "order_channel" varchar DEFAULT 'checkout';

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'digital_stock_units_redeemed_by_id_users_id_fk'
      ) THEN
        ALTER TABLE "digital_stock_units"
          ADD CONSTRAINT "digital_stock_units_redeemed_by_id_users_id_fk"
          FOREIGN KEY ("redeemed_by_id") REFERENCES "public"."users"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'digital_stock_units_redeem_order_id_orders_id_fk'
      ) THEN
        ALTER TABLE "digital_stock_units"
          ADD CONSTRAINT "digital_stock_units_redeem_order_id_orders_id_fk"
          FOREIGN KEY ("redeem_order_id") REFERENCES "public"."orders"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "digital_stock_units_redeem_code_lookup_idx"
      ON "digital_stock_units" USING btree ("redeem_code_lookup");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_redeemed_by_idx"
      ON "digital_stock_units" USING btree ("redeemed_by_id");
    CREATE INDEX IF NOT EXISTS "digital_stock_units_redeem_order_idx"
      ON "digital_stock_units" USING btree ("redeem_order_id");
    CREATE INDEX IF NOT EXISTS "orders_order_channel_idx"
      ON "orders" USING btree ("order_channel");

    UPDATE "orders"
    SET "order_channel" = 'checkout'
    WHERE "order_channel" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "digital_stock_units"
      DROP CONSTRAINT IF EXISTS "digital_stock_units_redeemed_by_id_users_id_fk";
    ALTER TABLE "digital_stock_units"
      DROP CONSTRAINT IF EXISTS "digital_stock_units_redeem_order_id_orders_id_fk";

    DROP INDEX IF EXISTS "digital_stock_units_redeem_code_lookup_idx";
    DROP INDEX IF EXISTS "digital_stock_units_redeemed_by_idx";
    DROP INDEX IF EXISTS "digital_stock_units_redeem_order_idx";
    DROP INDEX IF EXISTS "orders_order_channel_idx";

    ALTER TABLE "digital_stock_units"
      DROP COLUMN IF EXISTS "redeem_enabled",
      DROP COLUMN IF EXISTS "redeem_code",
      DROP COLUMN IF EXISTS "redeem_code_lookup",
      DROP COLUMN IF EXISTS "redeemed_at",
      DROP COLUMN IF EXISTS "redeemed_by_id",
      DROP COLUMN IF EXISTS "redeem_order_id";

    ALTER TABLE "orders"
      DROP COLUMN IF EXISTS "order_channel";
  `)
}
