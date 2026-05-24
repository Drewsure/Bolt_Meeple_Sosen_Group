import { AlertTriangle, Check, Image, LockKeyhole } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGames, getGamesNeedingImages } from '../lib/games';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';
import { GameIntake } from './GameIntake';
import { ManualGameUpdate } from './ManualGameUpdate';

const MOCK_ADMIN_CODE = 'preview-curator';

export function ImageAdmin() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [missing, setMissing] = useState<Game[]>([]);
  const [message, setMessage] = useState('');
  const [repairFocus, setRepairFocus] = useState('');
  const previewCounts = {
    total: games.length,
    identified: games.filter((game) => game.bgg_id).length,
    missing: missing.length,
  };

  useEffect(() => {
    if (!unlocked) return;
    const loadGames = () => Promise.all([getGames(), getGamesNeedingImages()]).then(([allGames, needsImages]) => {
      setGames(allGames);
      setMissing(needsImages);
    });
    void loadGames();
    return subscribeToPreviewGameUpdates(() => { void loadGames(); });
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

  const acceptPublishedGames = (created: Game[]) => {
    setGames((current) => [...current, ...created].sort((left, right) => left.title.localeCompare(right.title)));
  };

  const acceptUpdatedGame = (updated: Game) => {
    setGames((current) => current.map((game) => game.id === updated.id ? updated : game));
    setMissing((current) => current.filter((game) => game.id !== updated.id));
  };

  return (
    <main className="page-shell min-h-screen bg-[radial-gradient(circle_at_center,#fff7e7,#fbf7ef)]">
      {!unlocked ? (
        <div className="container-shell py-12">
          <section className="paper-panel max-w-lg p-8">
            <LockKeyhole className="text-[#cf612d]" size={27} />
            <h1 className="font-display mt-7 text-4xl tracking-wider">Admin Preview Gate</h1>
            <p className="mt-3 text-sm leading-6 text-[#665d52]">This BGG image tool is hidden behind a mock admin check. Database updates still require an authenticated user permitted by Supabase policies.</p>
            <form onSubmit={unlock} className="mt-7 space-y-3">
              <input type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Preview admin code" className="w-full border border-[#dccfbe] bg-white p-3 text-sm outline-none focus:border-[#cf612d]" />
              <button className="rule-button rule-button-primary w-full">Unlock Preview</button>
            </form>
            {message && <p className="mt-4 text-sm text-[#cf612d]">{message}</p>}
          </section>
        </div>
      ) : (
        <>
          <section className="mx-auto mt-20 max-w-3xl rounded-2xl bg-[#414653] p-9 text-white shadow-xl">
            <h1 className="flex items-center gap-4 font-display text-4xl tracking-wide"><Image className="text-[#f4a51d]" /> BGG Image Fetcher</h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl">{previewCounts.total}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Total Games</p></article>
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl text-[#f2ab1e]">{previewCounts.identified}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Have BGG ID</p></article>
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl text-[#50db90]">{previewCounts.missing}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Need Images</p></article>
            </div>
            <button onClick={() => setMessage(isSupabaseConfigured && user ? 'Authenticated image sync is ready for selected records.' : 'Preview mode: sign in with permitted access before fetching or saving images.')} className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-[#a87a36] py-4 font-display text-xl text-[#d9d5cc]"><Image size={18} /> Fetch Real Images From BGG</button>
            <div className="mt-7 space-y-3 text-sm text-[#9ba2af]"><p><Check className="mr-2 inline text-[#4bd589]" size={16} />Pulls official box-art from BoardGameGeek API</p><p><Check className="mr-2 inline text-[#4bd589]" size={16} />Only updates games with a stored BGG ID</p><p><AlertTriangle className="mr-2 inline text-[#f2a821]" size={16} />Rate-limited to 1.2 s/game — large libraries take several minutes</p></div>
            {message && <p className="mt-6 rounded border border-[#657184] bg-[#303846] p-4 text-sm text-[#dce1eb]">{message}</p>}
          </section>
          <section className="reference-panel mx-auto mt-8 max-w-5xl bg-[#fffdf9] p-7">
            <div className="md:flex md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Image Work Queue</p>
                <h2 className="font-display mt-2 text-3xl tracking-wide text-[#c55c27]">Cards Missing Images</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70665b]">These are the cards behind the "Need Images" count. Pick a title to send it straight into the manual repair panel below.</p>
              </div>
              <span className="mt-4 inline-flex rounded border border-[#e7bd69] bg-[#fff4d9] px-3 py-2 text-xs font-bold text-[#9b5b1c] md:mt-0">{missing.length} need images</span>
            </div>

            {missing.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {missing.map((game) => (
                  <article key={game.id} className="rounded border border-[#ecd29e] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl tracking-wide text-[#3f352d]">{game.title}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-[#8a7b6b]">BGG ID: {game.bgg_id ?? 'Not stored'} - {game.item_type ?? 'Game'}</p>
                      </div>
                      <button type="button" aria-label={`Repair ${game.title}`} onClick={() => setRepairFocus(game.title)} className="rounded border border-[#e39b43] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#b45a19]">
                        Repair
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded border border-[#dbe9d4] bg-[#f6fff4] p-5 text-sm text-[#4d6948]">All visible catalogue cards currently have images.</div>
            )}
          </section>
          <ManualGameUpdate games={games} onUpdated={acceptUpdatedGame} focusTitle={repairFocus} onFocusHandled={() => setRepairFocus('')} />
          <GameIntake games={games} onPublished={acceptPublishedGames} />
          <footer className="mt-12 flex justify-between border-t border-[#f1d392] bg-[#fffdfa] px-5 py-8 text-sm text-[#6f6458]"><span><strong className="font-display text-[#b85422]">Meeple Sosen Group</strong><br />Nishi-ku, Fukuoka, Japan</span><span className="text-right">Contact<br /><b className="text-[#c75b22]">ministarenglish@mail.com</b></span></footer>
        </>
      )}
    </main>
  );
}
