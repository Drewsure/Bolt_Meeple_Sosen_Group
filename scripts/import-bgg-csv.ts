import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

type CsvRow = Record<string, string>;

interface GameImportRow {
  bgg_id: number;
  title: string;
  original_name: string | null;
  bgg_average: number | null;
  average_rating: number | null;
  weight: number | null;
  bgg_rank: number | null;
  min_players: number | null;
  max_players: number | null;
  duration_minutes: number | null;
  min_playtime_minutes: number | null;
  max_playtime_minutes: number | null;
  year_published: number | null;
  language_dependence: string | null;
  image_id: number | null;
  source_collection: string;
  item_type: string;
  complexity_level: string | null;
  player_count: string | null;
  raw_data: CsvRow;
}

const BATCH_SIZE = 100;

function asNumber(value: string | undefined): number | null {
  if (!value?.trim()) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function asText(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function complexityFromWeight(weight: number | null): string | null {
  if (weight === null) return null;
  if (weight < 2) return 'Foundation';
  if (weight < 3) return 'Intermediate';
  if (weight < 3.7) return 'Advanced';
  return 'Master';
}

function mapRow(row: CsvRow, sourceCollection: string): GameImportRow {
  const bggId = asNumber(row.objectid);
  const title = asText(row.objectname);

  if (bggId === null || title === null) {
    throw new Error('Each BGG collection row must include objectid and objectname.');
  }

  const weight = asNumber(row.avgweight);
  const minPlayers = asNumber(row.minplayers);
  const maxPlayers = asNumber(row.maxplayers);

  return {
    bgg_id: bggId,
    title,
    original_name: asText(row.originalname),
    bgg_average: asNumber(row.baverage),
    average_rating: asNumber(row.average),
    weight,
    bgg_rank: asNumber(row.rank),
    min_players: minPlayers,
    max_players: maxPlayers,
    duration_minutes: asNumber(row.playingtime),
    min_playtime_minutes: asNumber(row.minplaytime),
    max_playtime_minutes: asNumber(row.maxplaytime),
    year_published: asNumber(row.yearpublished),
    language_dependence: asText(row.bgglanguagedependence),
    image_id: asNumber(row.imageid),
    source_collection: sourceCollection,
    item_type: asText(row.itemtype) ?? 'standalone',
    complexity_level: complexityFromWeight(weight),
    player_count: minPlayers !== null && maxPlayers !== null ? `${minPlayers}-${maxPlayers}` : null,
    raw_data: row,
  };
}

async function importBggCsv(filePath: string, sourceCollection: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the server environment before importing.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const input = await readFile(resolve(filePath), 'utf8');
  const rows = parse(input, {
    bom: true,
    columns: true,
    relax_quotes: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
  const games = rows.map((row) => mapRow(row, sourceCollection));

  // Link legacy seeded records by title before bgg_id becomes the import key.
  for (const game of games) {
    const { error } = await supabase
      .from('games')
      .update({ bgg_id: game.bgg_id })
      .eq('title', game.title)
      .is('bgg_id', null);

    if (error) {
      throw new Error(`Unable to link existing game "${game.title}": ${error.message}`);
    }
  }

  for (let start = 0; start < games.length; start += BATCH_SIZE) {
    const batch = games.slice(start, start + BATCH_SIZE);
    const { error } = await supabase
      .from('games')
      .upsert(batch, { onConflict: 'bgg_id' });

    if (error) {
      throw new Error(`Unable to import rows ${start + 1}-${start + batch.length}: ${error.message}`);
    }
  }

  console.log(`Imported ${games.length} games from "${sourceCollection}".`);
}

const [filePath, sourceCollection] = process.argv.slice(2);

if (!filePath || !sourceCollection) {
  console.error('Usage: npm run import:bgg -- <csv-file> <source_collection>');
  process.exitCode = 1;
} else {
  await importBggCsv(filePath, sourceCollection);
}
