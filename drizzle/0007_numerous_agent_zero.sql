CREATE TYPE "public"."ai_app_status" AS ENUM('active', 'inactive', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."credit_transaction_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TABLE "ai_app" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"website" text,
	"status" "ai_app_status" DEFAULT 'active',
	"slug" text,
	"image" text,
	"average_rating" numeric(3, 2),
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "ai_apps_llms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ai_app_id" uuid NOT NULL,
	"llm_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "credit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(10, 2),
	"userId" text,
	"type" "credit_transaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "llms_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"llm_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" numeric(3, 2),
	"content" jsonb,
	"llm_id" uuid,
	"ai_app_id" uuid,
	"user_id" text,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	CONSTRAINT "tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_apps_llms" ADD CONSTRAINT "ai_apps_llms_ai_app_id_ai_app_id_fk" FOREIGN KEY ("ai_app_id") REFERENCES "public"."ai_app"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_apps_llms" ADD CONSTRAINT "ai_apps_llms_llm_id_llm_id_fk" FOREIGN KEY ("llm_id") REFERENCES "public"."llm"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit" ADD CONSTRAINT "credit_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "llms_tags" ADD CONSTRAINT "llms_tags_llm_id_llm_id_fk" FOREIGN KEY ("llm_id") REFERENCES "public"."llm"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "llms_tags" ADD CONSTRAINT "llms_tags_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_llm_id_llm_id_fk" FOREIGN KEY ("llm_id") REFERENCES "public"."llm"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_ai_app_id_ai_app_id_fk" FOREIGN KEY ("ai_app_id") REFERENCES "public"."ai_app"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;