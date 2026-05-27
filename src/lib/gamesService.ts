import { supabase } from './supabase';
import { PUBLIC_GAME_COLUMNS } from './games';

export interface Game {
  id: string;
  title: string;
  bgg_rank: number | null;
  complexity_level: string;
  weight: number;
  year_published: number;
  min_players: number;
  max_players: number;
  duration_minutes: number;
  cover_image_url: string | null;
}

export const getAllGames = async (): Promise<Game[]> => {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('item_type', 'standalone')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }

  return (data || []) as Game[];
};

export const getGamesByComplexity = async (complexity: string): Promise<Game[]> => {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('complexity_level', complexity)
    .eq('item_type', 'standalone')
    .order('bgg_rank', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching games by complexity:', error);
    return [];
  }

  return (data || []) as Game[];
};

export const searchGames = async (query: string): Promise<Game[]> => {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('item_type', 'standalone')
    .ilike('title', `%${query}%`)
    .order('bgg_rank', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error searching games:', error);
    return [];
  }

  return (data || []) as Game[];
};

export const getArmoryGames = async (): Promise<Record<string, Game[]>> => {
  const { data, error } = await supabase
    .from('games')
    .select(PUBLIC_GAME_COLUMNS)
    .eq('item_type', 'standalone')
    .not('bgg_rank', 'is', null)
    .lte('bgg_rank', 1000)
    .order('bgg_rank', { ascending: true });

  if (error) {
    console.error('Error fetching armory games:', error);
    return { Foundation: [], Intermediate: [], Advanced: [], Master: [] };
  }

  const games = (data || []) as Game[];

  // Group by complexity
  const grouped = games.reduce((acc, game) => {
    const complexity = game.complexity_level;
    if (!acc[complexity]) acc[complexity] = [];
    acc[complexity].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  // Limit to top games per category
  return {
    Foundation: (grouped.Foundation || []).slice(0, 4),
    Intermediate: (grouped.Intermediate || []).slice(0, 4),
    Advanced: (grouped.Advanced || []).slice(0, 5),
    Master: (grouped.Master || []).slice(0, 5),
  };
};
