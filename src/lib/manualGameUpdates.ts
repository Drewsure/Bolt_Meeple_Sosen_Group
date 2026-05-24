import { PUBLIC_GAME_COLUMNS } from './games';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Game } from '../types/database';

function normalize(value: string) {
  return value.normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
}

function fileExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
}

export async function publishManualGameUpdate(game: Game, imageFile: File | null, description: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured for permanent manual updates.');
  }

  let coverImageUrl = game.cover_image_url;
  if (imageFile) {
    const identity = game.bgg_id ?? normalize(game.title);
    const path = `manual-updates/${identity}-${crypto.randomUUID()}.${fileExtension(imageFile)}`;
    const { error: uploadError } = await supabase.storage.from('game-covers').upload(path, imageFile, {
      cacheControl: '3600',
      contentType: imageFile.type || 'image/jpeg',
      upsert: false,
    });

    if (uploadError) {
      throw new Error(`Could not upload the image for ${game.title}: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('game-covers').getPublicUrl(path);
    coverImageUrl = data.publicUrl;
  }

  const update: { cover_image_url?: string | null; description?: string | null } = {};
  if (imageFile) update.cover_image_url = coverImageUrl;
  if (description.trim()) update.description = description.trim();

  if (!Object.keys(update).length) {
    throw new Error('Add an image or a replacement card brief before publishing.');
  }

  const { data, error } = await supabase
    .from('games')
    .update(update)
    .eq('id', game.id)
    .select(PUBLIC_GAME_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Manual update was not saved: ${error.message}`);
  }

  return data as Game;
}
