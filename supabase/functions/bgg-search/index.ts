import { XMLParser } from 'fast-xml-parser';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function primaryName(item: Record<string, unknown>) {
  const names = asArray(item.name as Record<string, string> | Record<string, string>[] | undefined);
  return names.find((name) => name['@_type'] === 'primary')?.['@_value'] ?? names[0]?.['@_value'] ?? 'Untitled game';
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const token = Deno.env.get('BGG_API_TOKEN');
  if (!token) return json({ error: 'BGG server authorization has not been configured yet.' }, 503);

  const { query } = await request.json().catch(() => ({ query: '' }));
  const normalized = typeof query === 'string' ? query.trim().slice(0, 80) : '';
  if (normalized.length < 2) return json({ results: [] });

  const url = new URL('https://boardgamegeek.com/xmlapi2/search');
  url.searchParams.set('query', normalized);
  url.searchParams.set('type', 'boardgame,boardgameexpansion');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'TableTop-Games-Japan/1.0',
    },
  });

  if (!response.ok) return json({ error: 'BoardGameGeek search is temporarily unavailable.' }, response.status);

  const parsed = parser.parse(await response.text());
  const items = asArray(parsed.items?.item as Record<string, unknown> | Record<string, unknown>[] | undefined);
  const now = new Date().toISOString();
  const results = items.slice(0, 40).map((item) => ({
    id: `bgg-${item['@_id']}`,
    bgg_id: Number(item['@_id']),
    title: primaryName(item),
    original_name: null,
    bgg_average: null,
    average_rating: null,
    weight: null,
    bgg_rank: null,
    min_players: null,
    max_players: null,
    duration_minutes: null,
    min_playtime_minutes: null,
    max_playtime_minutes: null,
    year_published: item.yearpublished?.['@_value'] ? Number(item.yearpublished['@_value']) : null,
    language_dependence: null,
    image_id: null,
    cover_image_url: null,
    source_collection: 'boardgamegeek',
    item_type: String(item['@_type'] ?? 'boardgame'),
    complexity_level: null,
    player_count: null,
    description: null,
    is_featured: false,
    is_silver_circle: false,
    created_at: now,
    updated_at: now,
  }));

  return json({ results });
});
