import { CalendarDays, Clock3, Gamepad2, Languages, MapPin, Search, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchBggCatalog } from '../lib/bgg';
import type { Game } from '../types/database';

function playersLabel(game: Game) {
  if (game.player_count) return game.player_count;
  if (!game.min_players && !game.max_players) return 'Players available after selection';
  if (game.min_players === game.max_players) return `${game.min_players} players`;
  return `${game.min_players ?? '?'}-${game.max_players ?? '?'} players`;
}

function languageLabel(game: Game) {
  if (!game.language_dependence) return 'TTGJ language guidance pending';
  const value = game.language_dependence.toLowerCase();
  if (value.includes('no necessary') || value.includes('none')) return 'Low language dependence';
  if (value.includes('some necessary') || value.includes('moderate')) return 'Some translated help useful';
  if (value.includes('extensive') || value.includes('unplayable')) return 'Translation support recommended';
  return game.language_dependence;
}

function complexityLabel(game: Game) {
  return game.complexity_level || (game.weight ? `Weight ${game.weight.toFixed(1)}` : 'TTGJ complexity notes pending');
}

export function TTGJGameJourney({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setGames([]);
      setSelectedId('');
      setSearchError('');
      setIsSearching(false);
      return undefined;
    }

    setIsSearching(true);
    setSearchError('');
    const timeout = window.setTimeout(() => {
      searchBggCatalog(normalized)
        .then((items) => {
          setGames(items);
          setSelectedId(items[0]?.id ?? '');
        })
        .catch(() => {
          setGames([]);
          setSelectedId('');
          setSearchError('Game search is temporarily unavailable. Please try again shortly.');
        })
        .finally(() => setIsSearching(false));
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const updateQuery = (event: Event) => {
      const nextQuery = (event as CustomEvent<string>).detail;
      if (typeof nextQuery === 'string' && nextQuery.trim()) setQuery(nextQuery.trim());
    };
    window.addEventListener('ttgj:game-search', updateQuery);
    return () => window.removeEventListener('ttgj:game-search', updateQuery);
  }, []);

  const selected = games.find((game) => game.id === selectedId) ?? games[0];
  const actions = [
    ['Find where to play', 'See cafes, stores, and map context.', MapPin, 'ttgj-directory'],
    ['Check upcoming events', 'Look for open tables and community dates.', CalendarDays, 'ttgj-events'],
    ['Buy new or secondhand', 'Compare trusted shopping paths.', ShoppingBag, 'ttgj-buy-games'],
    ['Explore Japanese games', 'Discover creators and locally made titles.', Sparkles, 'ttgj-japanese-games'],
  ] as const;

  return (
    <section id="ttgj-games" className="border-y border-[#e1cfac] bg-[#f5ecd9]">
      <div className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e8bf68]">The game-led journey</p>
          <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            Start with a <span className="text-[#d42519]">game</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#d8d0c7]">
            Search the global BoardGameGeek catalogue, then use TTGJ to find the useful Japan-specific next step: where to play, where to buy, and how to build a tabletop day around it.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:px-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-lg border border-[#dfc99f] bg-white p-4 shadow-sm">
          <label className="flex items-center gap-2 rounded border border-[#dfc99f] bg-[#fffaf0] px-3 py-3">
            <Search size={18} className="text-[#bc4937]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the BoardGameGeek catalogue..." className="w-full bg-transparent text-sm font-semibold outline-none" />
          </label>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7560]">
              {isSearching ? 'Searching BoardGameGeek...' : query.trim().length < 2 ? 'Enter at least two letters' : `${games.length} BGG titles found`}
            </p>
            {query && <button type="button" onClick={() => setQuery('')} className="text-[10px] font-black uppercase text-[#a60000]">Clear search</button>}
          </div>
          <div className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {games.map((game) => (
              <button type="button" key={game.id} onClick={() => setSelectedId(game.id)} className={`w-full rounded border-l-4 p-3 text-left transition ${selected?.id === game.id ? 'border-l-[#a60000] border-y-[#ddc89f] border-r-[#ddc89f] bg-[#fff7e7]' : 'border-l-[#d3a968] border-y-[#ead8b4] border-r-[#ead8b4] bg-white hover:bg-[#fffaf0]'}`}>
                <span className="block text-sm font-black text-[#171717]">{game.title}</span>
                <span className="mt-1 block text-[11px] font-semibold text-[#8a7560]">{game.year_published || 'Year TBC'} · BoardGameGeek #{game.bgg_id}</span>
              </button>
            ))}
            {searchError && <p className="rounded border border-[#e7c4a8] bg-[#fff7e7] p-4 text-sm font-semibold leading-6 text-[#7b4c2c]">{searchError}</p>}
            {!searchError && !isSearching && query.trim().length < 2 && <p className="rounded bg-[#fffaf0] p-4 text-sm font-semibold leading-6 text-[#6d6258]">Begin with any title. TTGJ will use the BGG result as the identity, then attach Japan-specific venue, event, language, and shopping guidance.</p>}
            {!searchError && !isSearching && query.trim().length >= 2 && games.length === 0 && <p className="rounded bg-[#fffaf0] p-4 text-sm font-semibold text-[#6d6258]">No BGG match found. Try another spelling.</p>}
          </div>
          <a href="https://boardgamegeek.com" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded border border-[#ead8b4] bg-[#fffaf0] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#6d4c13]">
            <span className="rounded bg-[#1a1a2e] px-2 py-1 text-white">BGG</span>
            Powered by BoardGameGeek
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#dfc99f] bg-white shadow-[0_18px_38px_rgba(91,67,35,0.14)]">
          {selected ? (
            <>
              <div className="grid md:grid-cols-[210px_1fr]">
                <div className="min-h-56 bg-[#efe4ce]">
                  {selected.cover_image_url ? <img src={selected.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full min-h-56 place-items-center p-6 text-center"><Gamepad2 size={52} className="text-[#bc4937]" /><span className="mt-3 text-xs font-black uppercase text-[#8a7560]">TTGJ enrichment pending</span></div>}
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#bc4937]">BoardGameGeek title selected</p>
                  <h3 className="mt-2 text-3xl font-black leading-tight text-[#171717]">{selected.title}</h3>
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#6d6258]">{selected.description || 'Use this title to explore places to play, shopping routes, events, and visitor guidance across Japan.'}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <span className="flex items-center gap-2 rounded bg-[#fffaf0] p-3 text-xs font-black text-[#6d4c13]"><Users size={15} /> {playersLabel(selected)}</span>
                    <span className="flex items-center gap-2 rounded bg-[#fffaf0] p-3 text-xs font-black text-[#6d4c13]"><Clock3 size={15} /> Check play time on BGG</span>
                    <span className="flex items-center gap-2 rounded bg-[#edf8f5] p-3 text-xs font-black text-[#2d6b5e]"><Languages size={15} /> {languageLabel(selected)}</span>
                    <span className="flex items-center gap-2 rounded bg-[#edf8f5] p-3 text-xs font-black text-[#2d6b5e]"><Gamepad2 size={15} /> {complexityLabel(selected)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#ead8b4] bg-[#fffaf0] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Choose the next step</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {actions.map(([title, copy, Icon, target]) => (
                    <button type="button" key={title} onClick={() => scrollTo(target)} className="rounded-lg border border-[#ead8b4] bg-white p-4 text-left transition hover:border-[#bc4937] hover:shadow-sm">
                      <Icon size={17} className="text-[#bc4937]" />
                      <span className="mt-3 block text-sm font-black uppercase text-[#171717]">{title}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-[#7b6b5b]">{copy}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => scrollTo('ttgj-itineraries')} className="mt-3 w-full rounded bg-[#1a1a2e] px-4 py-3 text-xs font-black uppercase tracking-wide text-white">Build an itinerary around this game</button>
              </div>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center p-8 text-center">
              <div className="max-w-md">
                <Gamepad2 size={54} className="mx-auto text-[#bc4937]" />
                <p className="mt-5 text-lg font-black uppercase text-[#171717]">Choose the game first</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#6d6258]">Search the global BGG catalogue. Once a title is selected, TTGJ becomes the Japan-specific guide around it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
