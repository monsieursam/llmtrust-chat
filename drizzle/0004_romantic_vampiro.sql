CREATE TABLE "conversations_users" (
	"conversation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "conversations_users" ADD CONSTRAINT "conversations_users_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations_users" ADD CONSTRAINT "conversations_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;