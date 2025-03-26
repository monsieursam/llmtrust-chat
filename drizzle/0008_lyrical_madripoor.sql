ALTER TABLE "ai_app" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_app" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_app" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key" ALTER COLUMN "name" SET DEFAULT 'default';--> statement-breakpoint
ALTER TABLE "api_key" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "llm" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "llm" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ALTER COLUMN "rating" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "api_key" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "llm" ADD COLUMN "pricing_input" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "llm" ADD COLUMN "pricing_output" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar_url";--> statement-breakpoint
ALTER TABLE "ai_app" ADD CONSTRAINT "ai_app_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "llm" ADD CONSTRAINT "llm_slug_unique" UNIQUE("slug");