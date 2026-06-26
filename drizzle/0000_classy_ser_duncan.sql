CREATE TABLE "ghosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"alternate_names" text[] DEFAULT '{}' NOT NULL,
	"classification" text NOT NULL,
	"region" text NOT NULL,
	"summary" text NOT NULL,
	"appearance" text NOT NULL,
	"behavior" text NOT NULL,
	"lore" text NOT NULL,
	"protection" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ghosts_slug_unique" UNIQUE("slug")
);
