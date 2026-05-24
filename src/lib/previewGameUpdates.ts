import type { Game } from '../types/database';

const STORAGE_KEY = 'meeple-sosen-preview-game-updates';

export type PreviewGameUpdate = Partial<Pick<Game, 'cover_image_url' | 'description'>> & {
  id: string;
  deleted?: boolean;
  requirement?: string;
  updated_at?: string;
};

function readUpdates(): PreviewGameUpdate[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as PreviewGameUpdate[] : [];
  } catch {
    return [];
  }
}

export function applyPreviewGameUpdates(games: Game[]) {
  const updates = new Map(readUpdates().map((update) => [update.id, update]));
  if (!updates.size) return games;

  return games
    .filter((game) => !updates.get(game.id)?.deleted)
    .map((game) => {
      const update = updates.get(game.id);
      return update ? { ...game, ...update } : game;
    });
}

export function getPreviewGameUpdate(id: string) {
  return readUpdates().find((update) => update.id === id) ?? null;
}

export function savePreviewGameUpdate(update: PreviewGameUpdate) {
  if (typeof window === 'undefined') return [];

  const updates = readUpdates().filter((current) => current.id !== update.id);
  const next = [...updates, { ...update, updated_at: new Date().toISOString() }];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('meeple-sosen-preview-game-updates'));
  return next;
}

export function clearPreviewGameUpdate(id: string) {
  if (typeof window === 'undefined') return [];

  const next = readUpdates().filter((current) => current.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('meeple-sosen-preview-game-updates'));
  return next;
}

export function subscribeToPreviewGameUpdates(listener: () => void) {
  if (typeof window === 'undefined') return () => undefined;

  const sync = () => listener();
  window.addEventListener('storage', sync);
  window.addEventListener('meeple-sosen-preview-game-updates', sync);

  return () => {
    window.removeEventListener('storage', sync);
    window.removeEventListener('meeple-sosen-preview-game-updates', sync);
  };
}
