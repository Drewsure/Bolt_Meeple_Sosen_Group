import { ImagePlus, LockKeyhole, RefreshCcw } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGamesNeedingImages, updateGameImage } from '../lib/games';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';

const MOCK_ADMIN_CODE = 'preview-curator';

export function ImageAdmin() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (unlocked) {
      getGamesNeedingImages().then(setGames);
    }
  }, [unlocked]);

  const unlock = (event: FormEvent) => {
    event.preventDefault();
    if (code === MOCK_ADMIN_CODE) {
      setUnlocked(true);
      setMessage('');
    } else {
      setMessage('Preview code not recognized.');
    }
  };

  const saveImage = async (game: Game) => {
    const imageUrl = urls[game.id]?.trim();
    if (!imageUrl) return;
    try {
      await updateGameImage(game.id, imageUrl);
      setGames((current) => current.filter((item) => item.id !== game.id));
      setMessage(`Image saved for ${game.title}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save image.');
    }
  };

  return (
    <main className="page-shell">
      <div className="container-shell max-w-5xl">
        <p className="eyebrow">Administration / Image Coverage</p>
        <h1 className="display-title mt-5 text-7xl sm:text-8xl">BGG Image Fetcher</h1>
        {!unlocked ? (
          <section className="paper-panel mt-10 max-w-lg p-8">
            <LockKeyhole className="text-[#cf612d]" size={27} />
            <h2 className="font-display mt-7 text-4xl tracking-wider">Admin Preview Gate</h2>
            <p className="mt-3 text-sm leading-6 text-[#665d52]">This curation interface is hidden behind a mock review gate. Database updates still require an authenticated user permitted by Supabase policies.</p>
            <form onSubmit={unlock} className="mt-7 space-y-3">
              <input type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Preview admin code" className="w-full border border-[#dccfbe] bg-white p-3 text-sm outline-none focus:border-[#cf612d]" />
              <button className="rule-button rule-button-primary w-full">Unlock Preview</button>
            </form>
            {message && <p className="mt-4 text-sm text-[#cf612d]">{message}</p>}
          </section>
        ) : (
          <section className="paper-panel mt-10 p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-[#eadfce] pb-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-4xl tracking-wider">Missing Cover Images</h2>
                <p className="line-label mt-2">{games.length} records awaiting review</p>
              </div>
              <p className="text-xs text-[#776d62]">{isSupabaseConfigured && user ? 'Writes enabled by authenticated policy' : 'Preview only until authenticated'}</p>
            </div>
            <div className="mt-6 space-y-4">
              {games.map((game) => (
                <article key={game.id} className="grid gap-4 border border-[#eadfce] p-5 md:grid-cols-[1fr_2fr_auto] md:items-center">
                  <div>
                    <p className="font-bold">{game.title}</p>
                    <p className="line-label mt-2">BGG {game.bgg_id ?? 'Pending'}</p>
                  </div>
                  <input
                    value={urls[game.id] || ''}
                    onChange={(event) => setUrls((current) => ({ ...current, [game.id]: event.target.value }))}
                    placeholder="https://... image URL"
                    className="border border-[#dccfbe] bg-white p-3 text-sm outline-none focus:border-[#cf612d]"
                  />
                  <button onClick={() => saveImage(game)} className="rule-button px-4"><ImagePlus size={15} /> Save</button>
                </article>
              ))}
              {!games.length && <div className="flex items-center justify-center gap-3 py-16 text-[#776d62]"><RefreshCcw size={18} /> All known images are covered.</div>}
            </div>
            {message && <p className="mt-5 text-sm text-[#cf612d]">{message}</p>}
          </section>
        )}
      </div>
    </main>
  );
}
