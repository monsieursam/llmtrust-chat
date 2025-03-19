ALTER TABLE "ai_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_participants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ai_models" CASCADE;--> statement-breakpoint
DROP TABLE "conversation_participants" CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_user_id_users_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'conversations'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "conversations" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "user_id";