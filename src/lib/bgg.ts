import { isSupabaseConfigured, supabase } from './supabase';
import type { Game } from '../types/database';

interface BggSearchPayload {
  results?: Game[];
  error?: string;
}

export async function searchBggCatalog(query: string): Promise<Game[]> {
  const normalized = query.trim();
  if (normalized.length < 2) return [];
  if (!isSupabaseConfigured) throw new Error('The BGG catalogue connection is not configured yet.');

  const timeout = new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error('The BGG catalogue connection timed out.')), 6000);
  });
  const { data, error } = await Promise.race([
    supabase.functions.invoke<BggSearchPayload>('bgg-search', { body: { query: normalized } }),
    timeout,
  ]);

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data?.results ?? [];
}
