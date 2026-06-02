import { ArrowRight, BookOpen, Clock, RotateCcw, Search, SlidersHorizontal, Sparkles, Star, Trophy, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { briefings } from './Briefings';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames } from '../lib/games';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
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

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesSearchQuery(game: Game, query: string) {
  const normalizedQuery = normalizeTitle(query.trim());
  if (!normalizedQuery) return true;

  const normalizedTitle = normalizeTitle(game.title);
  return normalizedTitle === normalizedQuery
    || normalizedTitle.startsWith(normalizedQuery)
    || normalizedTitle.includes(normalizedQuery);
}

function getBriefingForGame(game: Game) {
  const normalizedGameTitle = normalizeTitle(game.title);
  return briefings.find((briefing) => normalizedGameTitle.includes(normalizeTitle(briefing.gameTitle)));
}

function queryFromHash() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  return params.get('q') || '';
}

function gameCardKey(game: Game) {
  return `${game.id}-${game.bgg_id ?? 'no-bgg'}-${game.title}`;
}

export function Reserves({ language }: { language: Language }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(queryFromHash);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const t = ui[language].games;
  const common = ui[language].common;
  const filterLabels: Record<keyof Filters, string> = {
    english: t.level,
    complexity: t.complexity,
    players: t.playerCount,
    duration: t.playTime,
    ranking: t.bggRanking,
    type: t.type,
    appeal: t.appeal,
  };

  useEffect(() => {
    const loadGames = () => {
      getGames().then(setGames).finally(() => setLoading(false));
    };
    loadGames();
    return subscribeToPreviewGameUpdates(loadGames);
  }, []);

  useEffect(() => {
    const syncHashQuery = () => {
      if (window.location.hash.startsWith('#games')) {
        setQuery(queryFromHash());
      }
    };
    window.addEventListener('hashchange', syncHashQuery);
    return () => window.removeEventListener('hashchange', syncHashQuery);
  }, []);

  const filtered = useMemo(() => games.filter((game) => {
    const searchMatches = matchesSearchQuery(game, query);
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
          <h1 className="compact-title">{t.title}</h1>
          <p className="mt-4 text-sm text-[#756c60]">{t.subtitle}</p>
          <Sparkles className="mx-auto mt-4 text-[#ed941d]" size={19} />
        </header>
        <label className="relative mx-auto mt-9 block max-w-md">
          <Search className="absolute left-4 top-3.5 text-[#d9821d]" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={common.searchGames} className="w-full rounded border border-[#e9bd64] bg-white py-3 pl-11 pr-4 text-sm outline-none" />
        </label>
        <section className="reference-panel mt-7 p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-lg tracking-wide"><SlidersHorizontal size={15} className="text-[#dc791d]" /> {common.filters}</h2>
            <button onClick={clearFilters} disabled={!activeFilters} className="inline-flex items-center gap-2 text-[11px] font-bold text-[#c86122] disabled:cursor-default disabled:text-[#b7ad9f]">
              <RotateCcw size={12} /> {common.reset} {activeFilters ? `(${activeFilters})` : ''}
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filterFields.map(({ key, label, options }, index) => (
              <label key={key} className={index === 6 ? 'lg:col-span-2' : ''}>
                <span className="mb-1 block text-[10px] text-[#766d62]">{filterLabels[key] || label}</span>
                <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)} className="w-full rounded border border-[#f0cf8c] bg-[#fffefb] p-2 text-[11px] text-[#746a60]">
                  {options.map((option) => <option key={option.value} value={option.value}>{option.value === 'all' ? common.all : option.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </section>
        <p className="mt-6 text-center text-sm text-[#736a60]"><span className="font-display text-2xl text-[#e2811d]">{loading ? '...' : filtered.length}</span> {common.results}</p>
        {!loading && filtered.length === 0 && (
          <section className="reference-panel mx-auto mt-6 max-w-xl px-8 py-12 text-center">
            <Search className="mx-auto text-[#e1a340]" size={30} />
            <h2 className="font-display mt-4 text-xl tracking-wide">No Games Match These Filters</h2>
            <p className="mt-2 text-xs text-[#776d62]">Reset filters or broaden the mission parameters.</p>
            <button onClick={clearFilters} className="rule-button rule-button-primary mt-6 px-6 py-3"><RotateCcw size={13} /> Reset Filters</button>
          </section>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {filtered.map((game) => {
            const linkedBriefing = getBriefingForGame(game);
            return (
            <button key={gameCardKey(game)} type="button" onClick={() => setSelectedGame(game)} className="tactical-card overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#e28a24]">
              <div className="relative h-32 bg-[#fff0ce]">
                {game.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-4 text-center font-display text-3xl text-[#ae6d3f]">{game.title}</div>}
                <span className="pill pill-blue absolute left-2 top-2">{game.complexity_level || 'Beginner'}</span>
                {linkedBriefing && <span className="absolute right-2 top-2 rounded-full bg-[#fff5f8] px-2 py-1 text-[9px] font-bold uppercase text-[#ef3d66]">Briefing</span>}
              </div>
              <div className="p-4">
                <h2 className="font-display text-lg tracking-wide text-[#3d332b]">{game.title}</h2>
                <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-[#70665b]">{buildGameBrief(game)}</p>
                {linkedBriefing && <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-[#ef3d66]">{language === 'ja' ? '英語ブリーフィングあり' : 'English briefing linked'}</p>}
                <div className="mt-4 flex justify-between gap-2 text-[10px] text-[#936f46]">
                  <span>{game.min_players ?? '-'}-{game.max_players ?? '-'} players</span>
                  <span>{game.duration_minutes ?? '-'}m</span>
                  <span>{game.weight?.toFixed(1) ?? '-'} wt</span>
                  <span>{game.bgg_rank ? `#${game.bgg_rank}` : '-'}</span>
                </div>
              </div>
            </button>
            );
          })}
        </div>
      </div>

      {selectedGame && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2b2119]/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="game-detail-title">
          <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#e7bd70] bg-[#fffdf8] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#efd49d] bg-[#fff4df] px-6 py-5">
              <div>
                <p className="eyebrow">{t.detailsTitle}</p>
                <h2 id="game-detail-title" className="font-display mt-2 text-4xl tracking-wide text-[#bf5b24]">{selectedGame.title}</h2>
                {selectedGame.original_name && selectedGame.original_name !== selectedGame.title && <p className="mt-1 text-sm text-[#7b7065]">Original title: {selectedGame.original_name}</p>}
              </div>
              <button type="button" onClick={() => setSelectedGame(null)} className="rounded-full border border-[#e5bb73] bg-white p-2 text-[#af5b24]" aria-label="Close game detail">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
              <div>
                <div className="overflow-hidden rounded-xl border border-[#ecd29d] bg-[#fff0ce]">
                  {selectedGame.cover_image_url ? (
                    <img src={selectedGame.cover_image_url} alt="" className="h-80 w-full object-cover" />
                  ) : (
                    <div className="flex h-80 items-center justify-center px-5 text-center font-display text-5xl tracking-wide text-[#ae6d3f]">{t.noImage}</div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Users className="mx-auto text-[#dd8424]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedGame.min_players ?? '-'}-{selectedGame.max_players ?? '-'} players</p></div>
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Clock className="mx-auto text-[#4b86d9]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedGame.duration_minutes ?? '-'} minutes</p></div>
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Star className="mx-auto text-[#e0a328]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedGame.weight?.toFixed(2) ?? '-'} weight</p></div>
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Trophy className="mx-auto text-[#d06a2c]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedGame.bgg_rank ? `#${selectedGame.bgg_rank}` : 'Unranked'}</p></div>
                </div>
              </div>

              <div>
                <div className="rounded-xl border border-[#efd49d] bg-white p-5">
                  <h3 className="flex items-center gap-2 font-display text-2xl tracking-wide text-[#3d332b]"><BookOpen size={18} className="text-[#d06a2c]" /> Brief</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f655a]">{buildGameBrief(selectedGame)}</p>
                </div>
                {getBriefingForGame(selectedGame) && (
                  <a
                    href={`#briefings/${getBriefingForGame(selectedGame)?.slug}`}
                    className="mt-4 flex items-center justify-between rounded-xl border border-[#ffbdce] bg-[#fff7fa] p-4 text-left text-[#ef3d66] transition hover:bg-[#ffeef4]"
                  >
                    <span>
                      <span className="block font-display text-xl tracking-wide">{language === 'ja' ? '英語ブリーフィングカード' : 'English Briefing Card'}</span>
                      <span className="mt-1 block text-xs text-[#7a655f]">{language === 'ja' ? 'レベル別フレーズと会話プロンプトを見る' : 'Open leveled phrases and conversation prompts'}</span>
                    </span>
                    <ArrowRight size={18} />
                  </a>
                )}

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ['Complexity', selectedGame.complexity_level || 'Not rated'],
                    ['Language Dependence', selectedGame.language_dependence || 'Not rated'],
                    ['Type', selectedGame.item_type || 'Game'],
                    ['Year Published', selectedGame.year_published?.toString() || 'Unknown'],
                    ['BGG ID', selectedGame.bgg_id?.toString() || 'Not stored'],
                    ['BGG Average', selectedGame.bgg_average?.toFixed(2) || selectedGame.average_rating?.toFixed(2) || 'Not rated'],
                    ['Playtime Range', `${selectedGame.min_playtime_minutes ?? selectedGame.duration_minutes ?? '-'}-${selectedGame.max_playtime_minutes ?? selectedGame.duration_minutes ?? '-'} minutes`],
                    ['Source', selectedGame.source_collection || 'Catalogue'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded border border-[#efd49d] bg-[#fffaf1] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7652]">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-[#3f352d]">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedGame.raw_data && Object.keys(selectedGame.raw_data).length > 0 && (
                  <details className="mt-4 rounded-xl border border-[#e5d0a8] bg-white p-4">
                    <summary className="cursor-pointer font-display text-xl tracking-wide text-[#bf5b24]">Imported Collection Notes</summary>
                    <dl className="mt-4 grid gap-2 text-xs text-[#6f655a] md:grid-cols-2">
                      {Object.entries(selectedGame.raw_data).slice(0, 12).map(([key, value]) => (
                        <div key={key} className="rounded bg-[#fff9ee] p-3">
                          <dt className="font-bold uppercase tracking-wide text-[#9b7652]">{key}</dt>
                          <dd className="mt-1 break-words">{value || '-'}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
