ALTER TABLE "llm" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "createdAt" timestamp (3) DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "updatedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "llm" ADD COLUMN "createdAt" timestamp (3) DEFAULT now();--> statement-breakpoint
ALTER TABLE "llm" ADD COLUMN "updatedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "llm_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "createdAt" timestamp (3) DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "updatedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp (3) DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_llm_id_llm_id_fk" FOREIGN KEY ("llm_id") REFERENCES "public"."llm"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "llm" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "llm" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "llm" DROP COLUMN "llm_picture";--> statement-breakpoint
ALTER TABLE "llm" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "llm" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";