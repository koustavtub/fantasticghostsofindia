import { eq } from 'drizzle-orm';
import { db } from './index';
import { ghosts } from './schema';
import { normalizeRegionInput } from '../lib/india-regions';

/** Collapse legacy free-text regions to canonical labels. */
export async function normalizeStoredRegions(): Promise<void> {
  const rows = await db.select({ id: ghosts.id, region: ghosts.region }).from(ghosts);

  for (const row of rows) {
    const normalized = normalizeRegionInput(row.region);
    if (normalized && normalized !== row.region) {
      await db.update(ghosts).set({ region: normalized }).where(eq(ghosts.id, row.id));
    }
  }
}
