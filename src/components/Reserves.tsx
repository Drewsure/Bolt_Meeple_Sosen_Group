import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getGames } from '../lib/games';
import type { Game } from '../types/database';

const selectLabels = ['English Level', 'Complexity', 'Player Count', 'Play Time', 'BGG Ranking', 'Type', 'Appeals To'];

export function Reserves() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getGames().then(setGames).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => games.filter((game) => game.title.toLowerCase().includes(query.toLowerCase())), [games, query]);

  return (
    <main className="page-shell">
      <div className="container-shell py-11">
        <header className="text-center">
          <h1 className="compact-title">Game Database</h1>
          <p className="mt-4 text-sm text-[#756c60]">Discover Your Next Strategic Adventure</p>
          <Sparkles className="mx-auto mt-4 text-[#ed941d]" size={19} />
        </header>
        <label className="relative mx-auto mt-9 block max-w-md">
          <Search className="absolute left-4 top-3.5 text-[#d9821d]" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games..." className="w-full rounded border border-[#e9bd64] bg-white py-3 pl-11 pr-4 text-sm outline-none" />
        </label>
        <section className="reference-panel mt-7 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg tracking-wide"><SlidersHorizontal size={15} className="text-[#dc791d]" /> Filters</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {selectLabels.map((label, index) => (
              <label key={label} className={index === 6 ? 'lg:col-span-2' : ''}>
                <span className="mb-1 block text-[10px] text-[#766d62]">{label}</span>
                <select className="w-full rounded border border-[#f0cf8c] bg-[#fffefb] p-2 text-[11px] text-[#746a60]"><option>All</option></select>
              </label>
            ))}
          </div>
        </section>
        <p className="mt-6 text-center text-sm text-[#736a60]"><span className="font-display text-2xl text-[#e2811d]">{loading ? '...' : filtered.length}</span> results</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {filtered.map((game) => (
            <article key={game.id} className="tactical-card overflow-hidden">
              <div className="relative h-32 bg-[#fff0ce]">
                {game.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-3xl text-[#ae6d3f]">{game.title}</div>}
                <span className="pill pill-blue absolute left-2 top-2">{game.complexity_level || 'Beginner'}</span>
              </div>
              <div className="p-4">
                <h2 className="font-display text-lg tracking-wide text-[#3d332b]">{game.title}</h2>
                <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-[#70665b]">{game.description || 'A carefully selected strategy title for table conversation and confident play.'}</p>
                <div className="mt-4 flex justify-between text-[10px] text-[#936f46]">
                  <span>♟ {game.min_players}-{game.max_players}</span>
                  <span>◷ {game.duration_minutes}m</span>
                  <span>⚖ {game.weight?.toFixed(1) ?? '-'}</span>
                  <span>🏆 {game.bgg_rank ? `#${game.bgg_rank}` : '-'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
