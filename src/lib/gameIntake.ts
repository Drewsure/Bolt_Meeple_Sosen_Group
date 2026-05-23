import { parse } from 'csv-parse/browser/esm/sync';
import { PUBLIC_GAME_COLUMNS } from './games';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Game } from '../types/database';

type CsvRow = Record<string, string>;

export interface GameIntakeDraft {
  key: string;
  title: string;
  bggId: number | null;
  coverFile: File | null;
  coverPreviewUrl: string | null;
  duplicate: boolean;
  warnings: string[];
  record: {
    bgg_id: number | null;
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
    source_collection: string;
    item_type: string;
    complexity_level: string | null;
    player_count: string | null;
    description: string | null;
    is_featured: boolean;
    is_silver_circle: boolean;
  };
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
}

function valuesByLowerCase(row: CsvRow) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value.trim()]));
}

function getText(row: Record<string, string>, ...keys: string[]) {
  const value = keys.map((key) => row[key.toLowerCase()]).find((candidate) => candidate?.trim());
  return value?.trim() || null;
}

function getNumber(row: Record<string, string>, ...keys: string[]) {
  const value = getText(row, ...keys);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function complexityFromWeight(weight: number | null) {
  if (weight === null) return null;
  if (weight <= 1.8) return 'Beginner';
  if (weight <= 2.6) return 'Intermediate';
  if (weight <= 3.4) return 'Advanced';
  return 'Master';
}

function fileExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
}

function findCover(files: File[], title: string, bggId: number | null) {
  const titleKey = normalize(title);
  return files.find((file) => bggId !== null && file.name.includes(String(bggId)))
    ?? files.find((file) => {
      const fileKey = normalize(file.name.replace(/\.[^.]+$/, ''));
      return fileKey === titleKey || fileKey.includes(titleKey) || titleKey.includes(fileKey);
    })
    ?? null;
}

export async function prepareGameIntake(files: File[], existingGames: Game[]) {
  const csv = files.find((file) => file.name.toLowerCase().endsWith('.csv'));
  if (!csv) {
    throw new Error('Drop one CSV file together with any cover images.');
  }

  const imageFiles = files.filter((file) => file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name));
  const rows = parse(await csv.text(), {
    bom: true,
    columns: true,
    relax_quotes: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  if (!rows.length) {
    throw new Error('The submitted CSV does not contain any game records.');
  }

  const knownIds = new Set(existingGames.flatMap((game) => game.bgg_id === null ? [] : [game.bgg_id]));
  const knownTitles = new Set(existingGames.map((game) => normalize(game.title)));

  return rows.map((sourceRow, index): GameIntakeDraft => {
    const row = valuesByLowerCase(sourceRow);
    const title = getText(row, 'title', 'objectname', 'name') ?? `Untitled row ${index + 1}`;
    const bggId = getNumber(row, 'bgg_id', 'objectid');
    const weight = getNumber(row, 'weight', 'avgweight');
    const minimum = getNumber(row, 'min_players', 'minplayers');
    const maximum = getNumber(row, 'max_players', 'maxplayers');
    const duration = getNumber(row, 'duration_minutes', 'playingtime');
    const itemType = getText(row, 'item_type', 'itemtype') ?? 'standalone';
    const coverFile = findCover(imageFiles, title, bggId);
    const duplicate = (bggId !== null && knownIds.has(bggId)) || knownTitles.has(normalize(title));
    const warnings = [
      ...(duplicate ? ['Already present in the game database.'] : []),
      ...(coverFile ? [] : ['No matching cover image was dropped.']),
      ...(bggId === null ? ['No BGG ID provided; title will be used for duplicate protection.'] : []),
    ];

    return {
      key: bggId ? String(bggId) : `row-${index}-${normalize(title)}`,
      title,
      bggId,
      coverFile,
      coverPreviewUrl: coverFile ? URL.createObjectURL(coverFile) : null,
      duplicate,
      warnings,
      record: {
        bgg_id: bggId,
        title,
        original_name: getText(row, 'original_name', 'originalname') ?? title,
        bgg_average: getNumber(row, 'bgg_average', 'baverage'),
        average_rating: getNumber(row, 'average_rating', 'average'),
        weight,
        bgg_rank: getNumber(row, 'bgg_rank', 'rank'),
        min_players: minimum,
        max_players: maximum,
        duration_minutes: duration,
        min_playtime_minutes: getNumber(row, 'min_playtime_minutes', 'minplaytime') ?? duration,
        max_playtime_minutes: getNumber(row, 'max_playtime_minutes', 'maxplaytime') ?? duration,
        year_published: getNumber(row, 'year_published', 'yearpublished'),
        language_dependence: getText(row, 'language_dependence', 'bgglanguagedependence'),
        source_collection: getText(row, 'source_collection') ?? 'admin-intake',
        item_type: itemType,
        complexity_level: getText(row, 'complexity_level') ?? complexityFromWeight(weight),
        player_count: minimum !== null && maximum !== null ? `${minimum}-${maximum}` : null,
        description: getText(row, 'description'),
        is_featured: false,
        is_silver_circle: itemType === 'standalone' && (weight ?? 99) < 2.3 && (duration ?? 999) <= 45,
      },
    };
  });
}

export async function publishGameIntake(drafts: GameIntakeDraft[]) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured for permanent intake publishing.');
  }

  const ready = drafts.filter((draft) => !draft.duplicate);
  const records = [];

  for (const draft of ready) {
    let coverImageUrl: string | null = null;
    if (draft.coverFile) {
      const identity = draft.bggId ?? normalize(draft.title);
      const path = `intake/${identity}-${crypto.randomUUID()}.${fileExtension(draft.coverFile)}`;
      const { error: uploadError } = await supabase.storage.from('game-covers').upload(path, draft.coverFile, {
        cacheControl: '3600',
        contentType: draft.coverFile.type,
        upsert: false,
      });
      if (uploadError) {
        throw new Error(`Could not upload the cover for ${draft.title}: ${uploadError.message}`);
      }
      const { data } = supabase.storage.from('game-covers').getPublicUrl(path);
      coverImageUrl = data.publicUrl;
    }
    records.push({ ...draft.record, cover_image_url: coverImageUrl });
  }

  const { data, error } = await supabase
    .from('games')
    .insert(records)
    .select(PUBLIC_GAME_COLUMNS);

  if (error) {
    throw new Error(`Intake was not published: ${error.message}`);
  }

  return (data ?? []) as Game[];
}
