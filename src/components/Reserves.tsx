import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getGames } from '../lib/games';
import type { Game } from '../types/database';

const levels = ['All', 'Foundation', 'Intermediate', 'Advanced', 'Master'];

export function Reserves() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    getGames().then(setGames).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => games.filter((game) => {
    const titleMatches = game.title.toLowerCase().includes(query.toLowerCase());
    const levelMatches = level === 'All' || game.complexity_level === level;
    return titleMatches && levelMatches;
  }), [games, level, query]);

  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Game Database / BoardGameGeek Collection</p>
        <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h1 className="display-title text-7xl sm:text-8xl">The Catalogue</h1>
          <p className="max-w-sm text-sm leading-6 text-[#665d52]">Supabase catalogue when available, backed by curated preview titles for an empty collection.</p>
        </div>

        <div className="paper-panel mt-9 flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-[#cf612d]" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title..." className="w-full border border-[#dccfbe] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#cf612d]" />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="mr-2 text-[#776d62]" size={17} />
            {levels.map((option) => (
              <button key={option} onClick={() => setLevel(option)} className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${level === option ? 'bg-[#cf612d] text-white' : 'border border-[#dccfbe] text-[#665d52]'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <p className="line-label mb-5 mt-7">{loading ? 'Loading catalogue...' : `${filtered.length} game records / ${games.length} available`}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((game) => (
            <article key={game.id} className="paper-panel overflow-hidden">
              <div className="h-36 border-b border-[#dccfbe] bg-[#eee1d0]">
                {game.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center line-label">Image Pending</div>}
              </div>
              <div className="p-5">
                <div className="flex justify-between gap-4">
                  <h2 className="font-display text-3xl leading-none tracking-wider text-[#2d2923]">{game.title}</h2>
                  <span className="line-label whitespace-nowrap">{game.bgg_rank ? `#${game.bgg_rank}` : 'New'}</span>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#cf612d]">{game.complexity_level || 'Unrated'}</p>
                <div className="mt-5 grid grid-cols-3 border-t border-[#eadfce] pt-4 text-center">
                  <div><p className="line-label">Players</p><p className="mt-1 text-sm font-bold">{game.min_players}-{game.max_players}</p></div>
                  <div><p className="line-label">Time</p><p className="mt-1 text-sm font-bold">{game.duration_minutes}m</p></div>
                  <div><p className="line-label">Weight</p><p className="mt-1 text-sm font-bold">{game.weight?.toFixed(1) ?? '-'}</p></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
