import { sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/** Idempotent schema patches for databases created before Drizzle migrations caught up. */
export async function applyLegacySchemaPatches(db: PostgresJsDatabase): Promise<void> {
  await db.execute(sql`ALTER TABLE ghosts DROP COLUMN IF EXISTS classification`);

  await db.execute(sql`
    ALTER TABLE ghosts
    ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[] NOT NULL
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'ghosts'
          AND column_name = 'image_url'
      ) THEN
        UPDATE ghosts
        SET images = ARRAY[image_url]
        WHERE image_url IS NOT NULL
          AND image_url <> ''
          AND cardinality(images) = 0;

        ALTER TABLE ghosts DROP COLUMN image_url;
      END IF;
    END $$;
  `);

  await db.execute(sql`
    ALTER TABLE ghosts
    ADD COLUMN IF NOT EXISTS gender text DEFAULT 'Unknown' NOT NULL
  `);
}
