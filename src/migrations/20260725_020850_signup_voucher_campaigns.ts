import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_signup_voucher_campaigns_reward_buckets_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_signup_voucher_campaigns_status" AS ENUM('draft', 'active', 'inactive', 'ended');
  CREATE TYPE "public"."enum_signup_voucher_campaigns_applies_to" AS ENUM('all', 'specific');
  CREATE TYPE "public"."enum_signup_campaign_rewards_result" AS ENUM('pending', 'won', 'lost', 'skipped');
  CREATE TABLE "signup_voucher_campaigns_reward_buckets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"voucher_title" varchar,
  	"description" varchar,
  	"benefit_summary" varchar,
  	"is_active" boolean DEFAULT true,
  	"discount_type" "enum_signup_voucher_campaigns_reward_buckets_discount_type" NOT NULL,
  	"amount" numeric NOT NULL,
  	"probability_weight" numeric NOT NULL,
  	"max_total_winners" numeric,
  	"minimum_spend" numeric DEFAULT 0,
  	"usage_limit" numeric DEFAULT 1,
  	"per_user_limit" numeric DEFAULT 1,
  	"code_prefix" varchar,
  	"ttl_hours" numeric,
  	"expires_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "signup_voucher_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"status" "enum_signup_voucher_campaigns_status" DEFAULT 'draft' NOT NULL,
  	"priority" numeric DEFAULT 0,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"applies_to" "enum_signup_voucher_campaigns_applies_to" DEFAULT 'all' NOT NULL,
  	"code_prefix" varchar DEFAULT 'WELCOME',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "signup_voucher_campaigns_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "signup_campaign_rewards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"campaign_id" integer NOT NULL,
  	"voucher_id" integer,
  	"result" "enum_signup_campaign_rewards_result" DEFAULT 'pending' NOT NULL,
  	"bucket_i_d" varchar,
  	"bucket_label" varchar,
  	"user_campaign_key" varchar NOT NULL,
  	"claim_key" varchar,
  	"reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "coupons" ADD COLUMN "assigned_user_id" integer;
  ALTER TABLE "coupons" ADD COLUMN "signup_voucher_campaign_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "signup_voucher_campaigns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "signup_campaign_rewards_id" integer;
  ALTER TABLE "signup_voucher_campaigns_reward_buckets" ADD CONSTRAINT "signup_voucher_campaigns_reward_buckets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."signup_voucher_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "signup_voucher_campaigns_rels" ADD CONSTRAINT "signup_voucher_campaigns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."signup_voucher_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "signup_voucher_campaigns_rels" ADD CONSTRAINT "signup_voucher_campaigns_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "signup_campaign_rewards" ADD CONSTRAINT "signup_campaign_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signup_campaign_rewards" ADD CONSTRAINT "signup_campaign_rewards_campaign_id_signup_voucher_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."signup_voucher_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signup_campaign_rewards" ADD CONSTRAINT "signup_campaign_rewards_voucher_id_coupons_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "signup_voucher_campaigns_reward_buckets_order_idx" ON "signup_voucher_campaigns_reward_buckets" USING btree ("_order");
  CREATE INDEX "signup_voucher_campaigns_reward_buckets_parent_id_idx" ON "signup_voucher_campaigns_reward_buckets" USING btree ("_parent_id");
  CREATE INDEX "signup_voucher_campaigns_updated_at_idx" ON "signup_voucher_campaigns" USING btree ("updated_at");
  CREATE INDEX "signup_voucher_campaigns_created_at_idx" ON "signup_voucher_campaigns" USING btree ("created_at");
  CREATE INDEX "signup_voucher_campaigns_rels_order_idx" ON "signup_voucher_campaigns_rels" USING btree ("order");
  CREATE INDEX "signup_voucher_campaigns_rels_parent_idx" ON "signup_voucher_campaigns_rels" USING btree ("parent_id");
  CREATE INDEX "signup_voucher_campaigns_rels_path_idx" ON "signup_voucher_campaigns_rels" USING btree ("path");
  CREATE INDEX "signup_voucher_campaigns_rels_products_id_idx" ON "signup_voucher_campaigns_rels" USING btree ("products_id");
  CREATE INDEX "signup_campaign_rewards_user_idx" ON "signup_campaign_rewards" USING btree ("user_id");
  CREATE INDEX "signup_campaign_rewards_campaign_idx" ON "signup_campaign_rewards" USING btree ("campaign_id");
  CREATE INDEX "signup_campaign_rewards_voucher_idx" ON "signup_campaign_rewards" USING btree ("voucher_id");
  CREATE INDEX "signup_campaign_rewards_result_idx" ON "signup_campaign_rewards" USING btree ("result");
  CREATE INDEX "signup_campaign_rewards_bucket_i_d_idx" ON "signup_campaign_rewards" USING btree ("bucket_i_d");
  CREATE UNIQUE INDEX "signup_campaign_rewards_user_campaign_key_idx" ON "signup_campaign_rewards" USING btree ("user_campaign_key");
  CREATE UNIQUE INDEX "signup_campaign_rewards_claim_key_idx" ON "signup_campaign_rewards" USING btree ("claim_key");
  CREATE INDEX "signup_campaign_rewards_updated_at_idx" ON "signup_campaign_rewards" USING btree ("updated_at");
  CREATE INDEX "signup_campaign_rewards_created_at_idx" ON "signup_campaign_rewards" USING btree ("created_at");
  ALTER TABLE "coupons" ADD CONSTRAINT "coupons_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coupons" ADD CONSTRAINT "coupons_signup_voucher_campaign_id_signup_voucher_campaigns_id_fk" FOREIGN KEY ("signup_voucher_campaign_id") REFERENCES "public"."signup_voucher_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signup_voucher_campaigns_fk" FOREIGN KEY ("signup_voucher_campaigns_id") REFERENCES "public"."signup_voucher_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signup_campaign_rewards_fk" FOREIGN KEY ("signup_campaign_rewards_id") REFERENCES "public"."signup_campaign_rewards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "coupons_assigned_user_idx" ON "coupons" USING btree ("assigned_user_id");
  CREATE INDEX "coupons_signup_voucher_campaign_idx" ON "coupons" USING btree ("signup_voucher_campaign_id");
  CREATE INDEX "payload_locked_documents_rels_signup_voucher_campaigns_i_idx" ON "payload_locked_documents_rels" USING btree ("signup_voucher_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_signup_campaign_rewards_id_idx" ON "payload_locked_documents_rels" USING btree ("signup_campaign_rewards_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "signup_voucher_campaigns_reward_buckets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "signup_voucher_campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "signup_voucher_campaigns_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "signup_campaign_rewards" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "signup_voucher_campaigns_reward_buckets" CASCADE;
  DROP TABLE "signup_voucher_campaigns" CASCADE;
  DROP TABLE "signup_voucher_campaigns_rels" CASCADE;
  DROP TABLE "signup_campaign_rewards" CASCADE;
  ALTER TABLE "coupons" DROP CONSTRAINT "coupons_assigned_user_id_users_id_fk";
  
  ALTER TABLE "coupons" DROP CONSTRAINT "coupons_signup_voucher_campaign_id_signup_voucher_campaigns_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_signup_voucher_campaigns_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_signup_campaign_rewards_fk";
  
  
  DROP INDEX "coupons_assigned_user_idx";
  DROP INDEX "coupons_signup_voucher_campaign_idx";
  DROP INDEX "payload_locked_documents_rels_signup_voucher_campaigns_i_idx";
  DROP INDEX "payload_locked_documents_rels_signup_campaign_rewards_id_idx";
  ALTER TABLE "coupons" DROP COLUMN "assigned_user_id";
  ALTER TABLE "coupons" DROP COLUMN "signup_voucher_campaign_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "signup_voucher_campaigns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "signup_campaign_rewards_id";
  DROP TYPE "public"."enum_signup_voucher_campaigns_reward_buckets_discount_type";
  DROP TYPE "public"."enum_signup_voucher_campaigns_status";
  DROP TYPE "public"."enum_signup_voucher_campaigns_applies_to";
  DROP TYPE "public"."enum_signup_campaign_rewards_result";
  `)
}
