import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_creator_promotion_allowed_angles" AS ENUM('promo', 'education', 'comparison', 'use_case', 'restock', 'low_stock', 'featured');
  CREATE TYPE "public"."enum__products_v_version_creator_promotion_allowed_angles" AS ENUM('promo', 'education', 'comparison', 'use_case', 'restock', 'low_stock', 'featured');
  CREATE TABLE "products_creator_promotion_allowed_angles" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum_products_creator_promotion_allowed_angles",
    "id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "_products_v_version_creator_promotion_allowed_angles" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum__products_v_version_creator_promotion_allowed_angles",
    "id" serial PRIMARY KEY NOT NULL
  );

  ALTER TABLE "coupons" ADD COLUMN "public_promotion_enabled" boolean DEFAULT false;
  ALTER TABLE "coupons" ADD COLUMN "public_promotion_show_code" boolean DEFAULT false;
  ALTER TABLE "coupons" ADD COLUMN "public_promotion_marketing_notes" varchar;
  ALTER TABLE "products" ADD COLUMN "creator_promotion_enabled" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "creator_promotion_priority" numeric DEFAULT 0;
  ALTER TABLE "products" ADD COLUMN "creator_promotion_claim_notes" varchar;
  ALTER TABLE "products" ADD COLUMN "creator_promotion_cta_label" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_creator_promotion_enabled" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_creator_promotion_priority" numeric DEFAULT 0;
  ALTER TABLE "_products_v" ADD COLUMN "version_creator_promotion_claim_notes" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_creator_promotion_cta_label" varchar;
  ALTER TABLE "products_creator_promotion_allowed_angles" ADD CONSTRAINT "products_creator_promotion_allowed_angles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_creator_promotion_allowed_angles" ADD CONSTRAINT "_products_v_version_creator_promotion_allowed_angles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_creator_promotion_allowed_angles_order_idx" ON "products_creator_promotion_allowed_angles" USING btree ("order");
  CREATE INDEX "products_creator_promotion_allowed_angles_parent_idx" ON "products_creator_promotion_allowed_angles" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_creator_promotion_allowed_angles_order_idx" ON "_products_v_version_creator_promotion_allowed_angles" USING btree ("order");
  CREATE INDEX "_products_v_version_creator_promotion_allowed_angles_parent_idx" ON "_products_v_version_creator_promotion_allowed_angles" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_creator_promotion_allowed_angles" CASCADE;
  DROP TABLE "_products_v_version_creator_promotion_allowed_angles" CASCADE;
  ALTER TABLE "coupons" DROP COLUMN "public_promotion_enabled";
  ALTER TABLE "coupons" DROP COLUMN "public_promotion_show_code";
  ALTER TABLE "coupons" DROP COLUMN "public_promotion_marketing_notes";
  ALTER TABLE "products" DROP COLUMN "creator_promotion_enabled";
  ALTER TABLE "products" DROP COLUMN "creator_promotion_priority";
  ALTER TABLE "products" DROP COLUMN "creator_promotion_claim_notes";
  ALTER TABLE "products" DROP COLUMN "creator_promotion_cta_label";
  ALTER TABLE "_products_v" DROP COLUMN "version_creator_promotion_enabled";
  ALTER TABLE "_products_v" DROP COLUMN "version_creator_promotion_priority";
  ALTER TABLE "_products_v" DROP COLUMN "version_creator_promotion_claim_notes";
  ALTER TABLE "_products_v" DROP COLUMN "version_creator_promotion_cta_label";
  DROP TYPE "public"."enum_products_creator_promotion_allowed_angles";
  DROP TYPE "public"."enum__products_v_version_creator_promotion_allowed_angles";`)
}
