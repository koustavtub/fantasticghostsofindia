import type { APIRoute } from 'astro';
import { searchGhosts } from '../../lib/ghosts';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);

  if (!query.trim()) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const results = await searchGhosts(query.trim(), limit);
    return new Response(
      JSON.stringify({
        results: results.map((g) => ({
          slug: g.slug,
          name: g.name,
          region: g.region,
          summary: g.summary,
        })),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ results: [], error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
