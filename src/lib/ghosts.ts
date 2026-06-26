import { db } from '../db';
import { ghosts, type Ghost, type NewGhost } from '../db/schema';
import {
  getRegionFilterLabel,
  isRegionFilterSlug,
  regionBelongsToFilter,
  REGION_FILTERS,
  type RegionFilterSlug,
} from './india-regions';
import { and, asc, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';

export async function getGhostBySlug(slug: string): Promise<Ghost | undefined> {
  const [ghost] = await db.select().from(ghosts).where(eq(ghosts.slug, slug)).limit(1);
  return ghost;
}

export async function getGhostById(id: number): Promise<Ghost | undefined> {
  const [ghost] = await db.select().from(ghosts).where(eq(ghosts.id, id)).limit(1);
  return ghost;
}

export async function listGhosts(filters?: {
  region?: string;
  tag?: string;
}): Promise<Ghost[]> {
  const conditions = [];

  if (filters?.tag) {
    conditions.push(sql`${filters.tag} = ANY(${ghosts.tags})`);
  }

  let results =
    conditions.length === 0
      ? await db.select().from(ghosts).orderBy(asc(ghosts.name))
      : await db.select().from(ghosts).where(and(...conditions)).orderBy(asc(ghosts.name));

  if (filters?.region && isRegionFilterSlug(filters.region)) {
    results = results.filter((ghost) =>
      regionBelongsToFilter(ghost.region, filters.region as RegionFilterSlug)
    );
  }

  return results;
}

export async function getFeaturedGhost(): Promise<Ghost | undefined> {
  const [ghost] = await db.select().from(ghosts).orderBy(desc(ghosts.updatedAt)).limit(1);
  return ghost;
}

export async function getGhostCount(): Promise<number> {
  const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(ghosts);
  return result?.count ?? 0;
}

export async function getRecentGhosts(limit = 5): Promise<Ghost[]> {
  return db.select().from(ghosts).orderBy(desc(ghosts.updatedAt)).limit(limit);
}

export async function getRegionFilterCounts(): Promise<
  { slug: RegionFilterSlug; label: string; count: number }[]
> {
  const rows = await db.select({ region: ghosts.region }).from(ghosts);
  const counts = new Map<RegionFilterSlug, number>();

  for (const { region } of rows) {
    for (const filter of REGION_FILTERS) {
      if (regionBelongsToFilter(region, filter.slug)) {
        counts.set(filter.slug, (counts.get(filter.slug) ?? 0) + 1);
      }
    }
  }

  return REGION_FILTERS.map((f) => ({
    slug: f.slug,
    label: f.label,
    count: counts.get(f.slug) ?? 0,
  }));
}

export async function getFilterOptions(): Promise<{
  regions: string[];
  genders: string[];
  tags: string[];
}> {
  const rows = await db.select({
    region: ghosts.region,
    gender: ghosts.gender,
    tags: ghosts.tags,
  }).from(ghosts);

  const regions = new Set<string>();
  const genders = new Set<string>();
  const tags = new Set<string>();

  for (const row of rows) {
    regions.add(row.region);
    genders.add(row.gender);
    for (const tag of row.tags) {
      tags.add(tag);
    }
  }

  return {
    regions: [...regions].sort(),
    genders: [...genders].sort(),
    tags: [...tags].sort(),
  };
}

export async function createGhost(data: NewGhost): Promise<Ghost> {
  const [ghost] = await db.insert(ghosts).values(data).returning();
  return ghost;
}

export async function updateGhost(id: number, data: Partial<NewGhost>): Promise<Ghost | undefined> {
  const [ghost] = await db
    .update(ghosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ghosts.id, id))
    .returning();
  return ghost;
}

export async function deleteGhost(id: number): Promise<boolean> {
  const result = await db.delete(ghosts).where(eq(ghosts.id, id)).returning({ id: ghosts.id });
  return result.length > 0;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const conditions = [eq(ghosts.slug, slug)];
  if (excludeId !== undefined) {
    conditions.push(ne(ghosts.id, excludeId));
  }
  const [existing] = await db
    .select({ id: ghosts.id })
    .from(ghosts)
    .where(and(...conditions))
    .limit(1);
  return Boolean(existing);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function searchGhosts(query: string, limit = 20): Promise<Ghost[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    return db
      .select()
      .from(ghosts)
      .where(
        sql`search_vector @@ plainto_tsquery('english', ${trimmed})`
      )
      .orderBy(sql`ts_rank(search_vector, plainto_tsquery('english', ${trimmed})) DESC`)
      .limit(limit);
  } catch {
    const pattern = `%${trimmed}%`;
    return db
      .select()
      .from(ghosts)
      .where(
        or(
          ilike(ghosts.name, pattern),
          ilike(ghosts.summary, pattern),
          ilike(ghosts.region, pattern),
          ilike(ghosts.gender, pattern),
          ilike(ghosts.lore, pattern),
        )
      )
      .orderBy(asc(ghosts.name))
      .limit(limit);
  }
}
