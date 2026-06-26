import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { applyLegacySchemaPatches } from './patches';
import { normalizeStoredRegions } from './normalize-regions';
import { setupSearch } from '../lib/search';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

async function main() {
  const client = postgres(connectionString!, { max: 1 });
  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Applying schema patches...');
  await applyLegacySchemaPatches(db);
  console.log('Normalizing region labels...');
  await normalizeStoredRegions();
  console.log('Setting up full-text search...');
  await setupSearch();
  console.log('Database ready.');
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
