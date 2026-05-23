import { supabase } from './supabase';
import type { Game } from '../types/database';
import { isSupabaseConfigured } from './supabase';
import { GAMES as localGames } from '../data/games';

export const PUBLIC_GAME_COLUMNS = `
  id,
  bgg_id,
  title,
  original_name,
  bgg_average,
  average_rating,
  weight,
  bgg_rank,
  min_players,
  max_players,
  duration_minutes,
  min_playtime_minutes,
  max_playtime_minutes,
  year_published,
  language_dependence,
  image_id,
  cover_image_url,
  source_collection,
  item_type,
  complexity_level,
  player_count,
  description,
  is_featured,
  is_silver_circle,
  created_at,
  updated_at
`;

const throwIfError = (error: { message: string } | null) => {
  if (error) {
    throw new Error(error.message);
  }
};

const fallbackGames: Game[] = localGames.map((game, index) => ({
  id: `local-${game.id}`,
  bgg_id: null,
  title: game.nameEn,
  original_name: game.nameEn,
  bgg_average: game.rating,
  average_rating: game.rating,
  weight: game.weight,
  bgg_rank: game.bggRank,
  min_players: Number(game.players.split('-')[0]),
  max_players: Number(game.players.split('-')[1] ?? game.players.split('-')[0]),
  duration_minutes: game.duration,
  min_playtime_minutes: game.duration,
  max_playtime_minutes: game.duration,
  year_published: game.year,
  language_dependence: null,
  image_id: null,
  cover_image_url: game.imageUrl,
  source_collection: 'curated-preview',
  item_type: 'standalone',
  complexity_level: game.complexity,
  player_count: game.players,
  description: game.descriptionEn,
  is_featured: index < 3,
  is_silver_circle: index < 4 && game.weight < 3,
  created_at: '',
  updated_at: '',
}));

let localCollectionPromise: Promise<Game[]> | null = null;

async function getFallbackGames(): Promise<Game[]> {
  if (!localCollectionPromise) {
    localCollectionPromise = fetch('/data/collection-preview.json')
      .then(async (response) => {
        if (!response.ok) {
          return fallbackGames;
        }
        const games = await response.json() as Game[];
        return games.length ? games : fallbackGames;
      })
      .catch(() => fallbackGames);
  }

  return localCollectionPromise;
}

async function queryGames(query: () => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>): Promise<Game[]> {
  if (!isSupabaseConfigured) {
    return getFallbackGames();
  }

  try {
    const { data, error } = await query();
    throwIfError(error);
    const games = (data ?? []) as Game[];
    return games.length ? games : getFallbackGames();
  } catch {
    return getFallbackGames();
  }
}

export async function getGames(): Promise<Game[]> {
  return queryGames(() => supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .order('title', { ascending: true }));
}

export async function searchGames(query: string): Promise<Game[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return getGames();
  }

  const games = await queryGames(() => supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .ilike('title', `%${normalizedQuery}%`)
    .order('title', { ascending: true }));

  return games.filter((game) => game.title.toLowerCase().includes(normalizedQuery.toLowerCase()));
}

export async function getGameByBggId(bggId: number): Promise<Game | null> {
  if (!isSupabaseConfigured) {
    const games = await getFallbackGames();
    return games.find((game) => game.bgg_id === bggId) ?? null;
  }

  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('bgg_id', bggId)
    .maybeSingle();

  if (error || !data) {
    const games = await getFallbackGames();
    return games.find((game) => game.bgg_id === bggId) ?? null;
  }

  return data as Game;
}

export async function getFeaturedGames(): Promise<Game[]> {
  return queryGames(() => supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('is_featured', true)
    .order('title', { ascending: true }))
    .then((games) => games.filter((game) => game.is_featured).slice(0, 6));
}

export async function getSilverCircleGames(): Promise<Game[]> {
  return queryGames(() => supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('is_silver_circle', true)
    .order('title', { ascending: true }))
    .then((games) => games.filter((game) => game.is_silver_circle).slice(0, 6));
}

export async function getGamesNeedingImages(): Promise<Game[]> {
  if (!isSupabaseConfigured) {
    const games = await getFallbackGames();
    return games.filter((game) => !game.cover_image_url);
  }

  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .is('cover_image_url', null)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function updateGameImage(gameId: string, imageUrl: string): Promise<Game> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is required to save image changes.');
  }
  const { data, error } = await supabase
    .from('games')
    .update({ cover_image_url: imageUrl })
    .eq('id', gameId)
    .select(PUBLIC_GAME_COLUMNS)
    .single();

  throwIfError(error);
  return data as Game;
}
