import { AlertTriangle, Check, Image, LockKeyhole } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGames, getGamesNeedingImages } from '../lib/games';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';

const MOCK_ADMIN_CODE = 'preview-curator';

export function ImageAdmin() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [missing, setMissing] = useState<Game[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!unlocked) return;
    Promise.all([getGames(), getGamesNeedingImages()]).then(([allGames, needsImages]) => {
      setGames(allGames);
      setMissing(needsImages);
    });
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
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl">{games.length}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Total Games</p></article>
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl text-[#f2ab1e]">{games.filter((game) => game.bgg_id).length}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Have BGG ID</p></article>
              <article className="rounded-xl bg-[#2c3443] py-7 text-center"><strong className="font-display text-4xl text-[#50db90]">{missing.length}</strong><p className="mt-2 text-sm text-[#b3b8c1]">Need Images</p></article>
            </div>
            <button onClick={() => setMessage(isSupabaseConfigured && user ? 'Authenticated image sync is ready for selected records.' : 'Preview mode: sign in with permitted access before fetching or saving images.')} className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-[#a87a36] py-4 font-display text-xl text-[#d9d5cc]"><Image size={18} /> Fetch Real Images From BGG</button>
            <div className="mt-7 space-y-3 text-sm text-[#9ba2af]"><p><Check className="mr-2 inline text-[#4bd589]" size={16} />Pulls official box-art from BoardGameGeek API</p><p><Check className="mr-2 inline text-[#4bd589]" size={16} />Only updates games with a stored BGG ID</p><p><AlertTriangle className="mr-2 inline text-[#f2a821]" size={16} />Rate-limited to 1.2 s/game — large libraries take several minutes</p></div>
            {message && <p className="mt-6 rounded border border-[#657184] bg-[#303846] p-4 text-sm text-[#dce1eb]">{message}</p>}
          </section>
          <footer className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-[#f1d392] bg-[#fffdfa] px-5 py-8 text-sm text-[#6f6458]"><span><strong className="font-display text-[#b85422]">Meeple Sosen Group</strong><br />Nishi-ku, Fukuoka, Japan</span><span className="text-right">Contact<br /><b className="text-[#c75b22]">ministarenglish@mail.com</b></span></footer>
        </>
      )}
    </main>
  );
}
