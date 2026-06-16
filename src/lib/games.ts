import { supabase } from './supabase';
import type { Game } from '../types/database';
import { isSupabaseConfigured } from './supabase';
import { GAMES as localGames } from '../data/games';
import { applyPreviewGameUpdates } from './previewGameUpdates';

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

const removedCollectionBggIds = new Set([2961, 164847]);

const collectionCorrections: Record<number, Partial<Game>> = {
  230802: {
    title: 'Azul Mini',
    original_name: 'Azul Mini',
    cover_image_url: '/images/collection/230802.jpg',
    description: 'Azul Mini is the portable version of Azul, an abstract tile-drafting game about choosing colorful Portuguese-style tiles and placing them carefully to complete scoring patterns.',
  },
  255262: {
    title: 'Agricola: All Creatures Big and Small - The Big Box',
    original_name: 'Agricola: All Creatures Big and Small - The Big Box',
    description: 'Agricola: All Creatures Big and Small - The Big Box is a two-player farming game about expanding pastures, building farm spaces, and raising animals through tight worker-placement choices.',
  },
  336718: {
    title: 'Clover Bouquet',
    original_name: 'Clover Bouquet',
    description: 'Clover Bouquet is a light two-player Japanese card game with a gentle flower theme, useful for quick table talk around choosing, matching, and timing.',
  },
  8203: {
    title: 'Hey, That\'s My Fish!',
    original_name: 'Hey, That\'s My Fish!',
    description: 'Hey, That\'s My Fish! is a quick penguin movement game about claiming fish tiles while the ice floes disappear, creating simple English around routes, blocking, and counting.',
  },
  353152: {
    title: 'Framework',
    original_name: 'Framework',
    description: 'Framework is a calm tile-laying puzzle game about matching colors, completing task frames, and building a shared-looking pattern with quiet tactical choices.',
  },
};

const manualCollectionGames: Game[] = [
  {
    id: 'manual-azul-board-game',
    bgg_id: null,
    title: 'Azul',
    original_name: 'Azul',
    bgg_average: null,
    average_rating: null,
    weight: 1.774,
    bgg_rank: 99,
    min_players: 2,
    max_players: 4,
    duration_minutes: 45,
    min_playtime_minutes: 30,
    max_playtime_minutes: 45,
    year_published: 2017,
    language_dependence: 'No necessary in-game text',
    image_id: null,
    cover_image_url: '/images/collection/azul-board-game.jpg',
    source_collection: 'manual-preview',
    item_type: 'standalone',
    complexity_level: 'Beginner',
    player_count: '2-4',
    description: 'Azul is an abstract tile-drafting game about decorating a palace wall with patterned Portuguese tiles, creating useful table talk about colors, placement, patterns, and choices.',
    is_featured: false,
    is_silver_circle: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'manual-roller-coaster-challenge',
    bgg_id: null,
    title: 'Roller Coaster Challenge',
    original_name: 'Roller Coaster Challenge',
    bgg_average: null,
    average_rating: null,
    weight: 1.2,
    bgg_rank: null,
    min_players: 1,
    max_players: 1,
    duration_minutes: 20,
    min_playtime_minutes: 15,
    max_playtime_minutes: 30,
    year_published: 2017,
    language_dependence: 'No necessary in-game text',
    image_id: null,
    cover_image_url: '/images/collection/roller-coaster-challenge.jpg',
    source_collection: 'manual-preview',
    item_type: 'standalone',
    complexity_level: 'Beginner',
    player_count: '1-1',
    description: 'Roller Coaster Challenge is a solo logic puzzle about building a working coaster track, making it useful for simple English around position, direction, height, and problem solving.',
    is_featured: false,
    is_silver_circle: true,
    created_at: '',
    updated_at: '',
  },
];

function applyCollectionCorrections(games: Game[], includeManual = true): Game[] {
  const corrected = games
    .filter((game) => !removedCollectionBggIds.has(game.bgg_id ?? -1) && game.title !== 'Clover' && game.title !== 'Confusion: Espionage and Deception in the Cold War')
    .map((game) => {
      const correction = game.bgg_id ? collectionCorrections[game.bgg_id] : undefined;
      return correction ? { ...game, ...correction } : game;
    });

  if (includeManual) {
    const existingTitles = new Set(corrected.map((game) => game.title.toLowerCase()));
    for (const manualGame of manualCollectionGames) {
      if (!existingTitles.has(manualGame.title.toLowerCase())) {
        corrected.push(manualGame);
      }
    }
  }

  return corrected.sort((a, b) => a.title.localeCompare(b.title));
}

let localCollectionPromise: Promise<Game[]> | null = null;

async function getFallbackGames(): Promise<Game[]> {
  if (!localCollectionPromise) {
    localCollectionPromise = fetch('/data/collection-preview.json')
      .then(async (response) => {
        if (!response.ok) {
          return applyCollectionCorrections(fallbackGames);
        }
        const games = await response.json() as Game[];
        return games.length ? applyPreviewGameUpdates(applyCollectionCorrections(games)) : applyPreviewGameUpdates(applyCollectionCorrections(fallbackGames));
      })
      .catch(() => applyPreviewGameUpdates(applyCollectionCorrections(fallbackGames)));
  }

  return localCollectionPromise.then((games) => applyPreviewGameUpdates(applyCollectionCorrections(games)));
}

async function queryGames(query: () => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>): Promise<Game[]> {
  if (!isSupabaseConfigured) {
    return getFallbackGames();
  }

  try {
    const { data, error } = await query();
    throwIfError(error);
    const games = (data ?? []) as Game[];
    return games.length ? applyPreviewGameUpdates(applyCollectionCorrections(games)) : getFallbackGames();
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

  return applyCollectionCorrections([data as Game], false)[0] ?? null;
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
  return applyPreviewGameUpdates(applyCollectionCorrections((data ?? []) as Game[])).filter((game) => !game.cover_image_url);
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
