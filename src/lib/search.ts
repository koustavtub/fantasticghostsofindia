import { db } from '../db';
import { sql } from 'drizzle-orm';

export async function setupSearch(): Promise<void> {
  await db.execute(sql`
    ALTER TABLE ghosts
    ADD COLUMN IF NOT EXISTS search_vector tsvector
  `);

  await db.execute(sql`
    CREATE OR REPLACE FUNCTION ghosts_search_vector_update() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(array_to_string(NEW.alternate_names, ' '), '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.region, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.gender, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.appearance, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.behavior, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.lore, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(NEW.protection, '')), 'D');
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql
  `);

  await db.execute(sql`
    DROP TRIGGER IF EXISTS ghosts_search_vector_trigger ON ghosts
  `);

  await db.execute(sql`
    CREATE TRIGGER ghosts_search_vector_trigger
    BEFORE INSERT OR UPDATE ON ghosts
    FOR EACH ROW EXECUTE FUNCTION ghosts_search_vector_update()
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS ghosts_search_vector_idx
    ON ghosts USING GIN (search_vector)
  `);

  await db.execute(sql`
    UPDATE ghosts SET updated_at = updated_at
  `);
}
