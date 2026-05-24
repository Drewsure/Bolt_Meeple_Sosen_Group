import { RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames } from '../lib/games';
import type { Game } from '../types/database';

type Filters = {
  english: string;
  complexity: string;
  players: string;
  duration: string;
  ranking: string;
  type: string;
  appeal: string;
};

const initialFilters: Filters = {
  english: 'all',
  complexity: 'all',
  players: 'all',
  duration: 'all',
  ranking: 'all',
  type: 'all',
  appeal: 'all',
};

const filterFields: Array<{ key: keyof Filters; label: string; options: Array<{ value: string; label: string }> }> = [
  {
    key: 'english',
    label: 'English Level',
    options: [
      { value: 'all', label: 'All' },
      { value: 'no-text', label: 'No Necessary Text' },
      { value: 'light-text', label: 'Light Text' },
      { value: 'moderate-text', label: 'Moderate Text' },
      { value: 'heavy-text', label: 'Extensive Text' },
      { value: 'unknown', label: 'Not Rated' },
    ],
  },
  {
    key: 'complexity',
    label: 'Complexity',
    options: [
      { value: 'all', label: 'All' },
      { value: 'foundation', label: 'Foundation / Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
      { value: 'Master', label: 'Master' },
    ],
  },
  {
    key: 'players',
    label: 'Player Count',
    options: [
      { value: 'all', label: 'All' },
      { value: 'solo', label: 'Solo Playable' },
      { value: 'two', label: '2 Players' },
      { value: 'three-four', label: '3-4 Players' },
      { value: 'five-plus', label: '5+ Players' },
    ],
  },
  {
    key: 'duration',
    label: 'Play Time',
    options: [
      { value: 'all', label: 'All' },
      { value: 'quick', label: 'Up to 30 min' },
      { value: 'standard', label: '31-60 min' },
      { value: 'long', label: 'Over 60 min' },
    ],
  },
  {
    key: 'ranking',
    label: 'BGG Ranking',
    options: [
      { value: 'all', label: 'All' },
      { value: 'top-100', label: 'Top 100' },
      { value: 'top-500', label: 'Top 500' },
      { value: 'top-1000', label: 'Top 1000' },
      { value: 'unranked', label: 'Unranked' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All' },
      { value: 'standalone', label: 'Base Games' },
      { value: 'expansion', label: 'Expansions' },
    ],
  },
  {
    key: 'appeal',
    label: 'Appeals To',
    options: [
      { value: 'all', label: 'All' },
      { value: 'silver-circle', label: 'Silver Circle' },
      { value: 'gateway', label: 'Gateway Friendly' },
      { value: 'strategists', label: 'Strategists' },
      { value: 'language-light', label: 'Language Light' },
    ],
  },
];

function matchesEnglish(game: Game, selected: string) {
  const dependence = game.language_dependence || '';
  if (selected === 'no-text') return dependence.includes('No necessary');
  if (selected === 'light-text') return dependence.includes('Some necessary');
  if (selected === 'moderate-text') return dependence.includes('Moderate');
  if (selected === 'heavy-text') return dependence.includes('Extensive') || dependence.includes('Unplayable');
  if (selected === 'unknown') return !dependence;
  return true;
}

function matchesComplexity(game: Game, selected: string) {
  if (selected === 'foundation') return game.complexity_level === 'Beginner' || game.complexity_level === 'Foundation';
  return selected === 'all' || game.complexity_level === selected;
}

function matchesPlayers(game: Game, selected: string) {
  const minimum = game.min_players ?? 0;
  const maximum = game.max_players ?? 0;
  if (selected === 'solo') return minimum <= 1 && maximum >= 1;
  if (selected === 'two') return minimum <= 2 && maximum >= 2;
  if (selected === 'three-four') return minimum <= 4 && maximum >= 3;
  if (selected === 'five-plus') return maximum >= 5;
  return true;
}

function matchesDuration(game: Game, selected: string) {
  const duration = game.duration_minutes;
  if (!duration) return selected === 'all';
  if (selected === 'quick') return duration <= 30;
  if (selected === 'standard') return duration > 30 && duration <= 60;
  if (selected === 'long') return duration > 60;
  return true;
}

function matchesRanking(game: Game, selected: string) {
  const rank = game.bgg_rank;
  if (selected === 'unranked') return !rank;
  if (!rank) return selected === 'all';
  if (selected === 'top-100') return rank <= 100;
  if (selected === 'top-500') return rank <= 500;
  if (selected === 'top-1000') return rank <= 1000;
  return true;
}

function matchesAppeal(game: Game, selected: string) {
  if (selected === 'silver-circle') return game.is_silver_circle;
  if (selected === 'gateway') return (game.weight ?? 99) <= 1.8 && (game.duration_minutes ?? 999) <= 45;
  if (selected === 'strategists') return (game.weight ?? 0) >= 2.5;
  if (selected === 'language-light') return (game.language_dependence || '').includes('No necessary');
  return true;
}

export function Reserves() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    getGames().then(setGames).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => games.filter((game) => {
    const searchMatches = game.title.toLowerCase().includes(query.trim().toLowerCase());
    const typeMatches = filters.type === 'all' || game.item_type === filters.type;

    return searchMatches
      && matchesComplexity(game, filters.complexity)
      && typeMatches
      && matchesEnglish(game, filters.english)
      && matchesPlayers(game, filters.players)
      && matchesDuration(game, filters.duration)
      && matchesRanking(game, filters.ranking)
      && matchesAppeal(game, filters.appeal);
  }), [filters, games, query]);

  const activeFilters = Object.values(filters).filter((value) => value !== 'all').length + (query.trim() ? 1 : 0);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setQuery('');
  };

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
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-lg tracking-wide"><SlidersHorizontal size={15} className="text-[#dc791d]" /> Filters</h2>
            <button onClick={clearFilters} disabled={!activeFilters} className="inline-flex items-center gap-2 text-[11px] font-bold text-[#c86122] disabled:cursor-default disabled:text-[#b7ad9f]">
              <RotateCcw size={12} /> Reset {activeFilters ? `(${activeFilters})` : ''}
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filterFields.map(({ key, label, options }, index) => (
              <label key={key} className={index === 6 ? 'lg:col-span-2' : ''}>
                <span className="mb-1 block text-[10px] text-[#766d62]">{label}</span>
                <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)} className="w-full rounded border border-[#f0cf8c] bg-[#fffefb] p-2 text-[11px] text-[#746a60]">
                  {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </section>
        <p className="mt-6 text-center text-sm text-[#736a60]"><span className="font-display text-2xl text-[#e2811d]">{loading ? '...' : filtered.length}</span> results</p>
        {!loading && filtered.length === 0 && (
          <section className="reference-panel mx-auto mt-6 max-w-xl px-8 py-12 text-center">
            <Search className="mx-auto text-[#e1a340]" size={30} />
            <h2 className="font-display mt-4 text-xl tracking-wide">No Games Match These Filters</h2>
            <p className="mt-2 text-xs text-[#776d62]">Reset filters or broaden the mission parameters.</p>
            <button onClick={clearFilters} className="rule-button rule-button-primary mt-6 px-6 py-3"><RotateCcw size={13} /> Reset Filters</button>
          </section>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {filtered.map((game) => (
            <article key={game.id} className="tactical-card overflow-hidden">
              <div className="relative h-32 bg-[#fff0ce]">
                {game.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-4 text-center font-display text-3xl text-[#ae6d3f]">{game.title}</div>}
                <span className="pill pill-blue absolute left-2 top-2">{game.complexity_level || 'Beginner'}</span>
              </div>
              <div className="p-4">
                <h2 className="font-display text-lg tracking-wide text-[#3d332b]">{game.title}</h2>
                <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-[#70665b]">{buildGameBrief(game)}</p>
                <div className="mt-4 flex justify-between gap-2 text-[10px] text-[#936f46]">
                  <span>{game.min_players ?? '-'}-{game.max_players ?? '-'} players</span>
                  <span>{game.duration_minutes ?? '-'}m</span>
                  <span>{game.weight?.toFixed(1) ?? '-'} wt</span>
                  <span>{game.bgg_rank ? `#${game.bgg_rank}` : '-'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
