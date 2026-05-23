import { supabase } from './supabase';
import type { Game } from '../types/database';

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

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function searchGames(query: string): Promise<Game[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return getGames();
  }

  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .ilike('title', `%${normalizedQuery}%`)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function getGameByBggId(bggId: number): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('bgg_id', bggId)
    .maybeSingle();

  throwIfError(error);
  return data as Game | null;
}

export async function getFeaturedGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('is_featured', true)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function getSilverCircleGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('is_silver_circle', true)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function getGamesNeedingImages(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .is('cover_image_url', null)
    .order('title', { ascending: true });

  throwIfError(error);
  return (data ?? []) as Game[];
}

export async function updateGameImage(gameId: string, imageUrl: string): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update({ cover_image_url: imageUrl })
    .eq('id', gameId)
    .select(PUBLIC_GAME_COLUMNS)
    .single();

  throwIfError(error);
  return data as Game;
}
