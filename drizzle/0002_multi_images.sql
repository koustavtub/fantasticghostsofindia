ALTER TABLE "ghosts" ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
UPDATE "ghosts" SET "images" = ARRAY["image_url"] WHERE "image_url" IS NOT NULL AND "image_url" <> '';--> statement-breakpoint
ALTER TABLE "ghosts" DROP COLUMN IF EXISTS "image_url";
