import {
  ArrowLeft,
  CheckCircle2,
  Coffee,
  ExternalLink,
  FileSpreadsheet,
  Gamepad2,
  Globe2,
  Languages,
  MapPin,
  Plus,
  Save,
  Search,
  Send,
  ShieldCheck,
  Store,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ttgjVenues, type TTGJVenue } from '../data/ttgjVenues';
import { searchBggCatalog } from '../lib/bgg';
import type { Game } from '../types/database';

type OwnerStep = 'claim' | 'profile' | 'games' | 'publish';
type AvailabilityType = 'playable' | 'retail_stock' | 'orderable' | 'event_only';
type LibrarySizeBand = 'under_100' | '100_plus' | '300_plus' | '500_plus';
type GameCatalogStatus = 'not_supplied' | 'library_size_confirmed' | 'featured_games_only' | 'full_searchable_library';

interface VenueGameDraft {
  id: string;
  bggId: number;
  title: string;
  availabilityType: AvailabilityType;
  englishRulesAvailable: boolean;
}

const ownerSteps: Array<{ id: OwnerStep; label: string; copy: string }> = [
  { id: 'claim', label: 'Claim venue', copy: 'Find the imported listing and request ownership.' },
  { id: 'profile', label: 'Confirm listing', copy: 'Check the public details visitors will rely on.' },
  { id: 'games', label: 'Optional games', copy: 'Add signature titles or upload an existing list.' },
  { id: 'publish', label: 'Publish', copy: 'Send the confirmed listing for TTGJ review.' },
];

function venueKindIcon(venue: TTGJVenue) {
  const category = venue.category.toLowerCase();
  return category.includes('shop') || category.includes('store') || category.includes('retail') ? Store : Coffee;
}

function draftKey(venue: TTGJVenue) {
  return `ttgj-owner-games:${venue.sourceId}`;
}

function loadDrafts(venue: TTGJVenue): VenueGameDraft[] {
  try {
    return JSON.parse(window.localStorage.getItem(draftKey(venue)) || '[]') as VenueGameDraft[];
  } catch {
    return [];
  }
}

function initialVenue() {
  const sourceId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('venue');
  return ttgjVenues.find((venue) => venue.sourceId === sourceId) ?? ttgjVenues[0];
}

function initialLibrarySize(venue: TTGJVenue): LibrarySizeBand {
  const text = venue.specialties.join(' ');
  if (text.includes('500')) return '500_plus';
  if (text.includes('300')) return '300_plus';
  if (text.includes('100') || text.includes('200')) return '100_plus';
  return 'under_100';
}

export function TTGJOwnerCockpit() {
  const firstVenue = initialVenue();
  const [step, setStep] = useState<OwnerStep>('claim');
  const [venueQuery, setVenueQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<TTGJVenue>(firstVenue);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [librarySize, setLibrarySize] = useState<LibrarySizeBand>(() => initialLibrarySize(firstVenue));
  const [catalogStatus, setCatalogStatus] = useState<GameCatalogStatus>('library_size_confirmed');
  const [gameQuery, setGameQuery] = useState('');
  const [gameMatches, setGameMatches] = useState<Game[]>([]);
  const [gameDrafts, setGameDrafts] = useState<VenueGameDraft[]>(() => loadDrafts(firstVenue));
  const [gameMessage, setGameMessage] = useState('');
  const [searchingGames, setSearchingGames] = useState(false);
  const [csvTitles, setCsvTitles] = useState<string[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [published, setPublished] = useState(false);

  const venueMatches = useMemo(() => {
    const normalized = venueQuery.trim().toLowerCase();
    if (!normalized) return ttgjVenues.slice(0, 8);
    return ttgjVenues
      .filter((venue) => [venue.name, venue.nameJapanese, venue.city, venue.prefecture, venue.address].join(' ').toLowerCase().includes(normalized))
      .slice(0, 12);
  }, [venueQuery]);

  const chooseVenue = (venue: TTGJVenue) => {
    setSelectedVenue(venue);
    setGameDrafts(loadDrafts(venue));
    setClaimSubmitted(false);
    setProfileSaved(false);
    setLibrarySize(initialLibrarySize(venue));
    setCatalogStatus('library_size_confirmed');
    setCsvTitles([]);
    setCsvFileName('');
    setPublished(false);
  };

  const saveDrafts = (items: VenueGameDraft[]) => {
    setGameDrafts(items);
    window.localStorage.setItem(draftKey(selectedVenue), JSON.stringify(items));
  };

  const searchGames = async () => {
    if (gameQuery.trim().length < 2) {
      setGameMessage('Enter at least two letters before searching BGG.');
      return;
    }
    setSearchingGames(true);
    setGameMessage('');
    try {
      const results = await searchBggCatalog(gameQuery);
      setGameMatches(results);
      if (!results.length) setGameMessage('No BGG match found. Try another spelling.');
    } catch {
      setGameMatches([]);
      setGameMessage('Live BGG search will activate when the registered server connection is deployed.');
    } finally {
      setSearchingGames(false);
    }
  };

  const addGame = (game: Game) => {
    if (!game.bgg_id || gameDrafts.some((item) => item.bggId === game.bgg_id)) return;
    saveDrafts([...gameDrafts, {
      id: `draft-${game.bgg_id}`,
      bggId: game.bgg_id,
      title: game.title,
      availabilityType: 'playable',
      englishRulesAvailable: false,
    }]);
  };

  const updateGame = (id: string, patch: Partial<VenueGameDraft>) => {
    saveDrafts(gameDrafts.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const handleCsvUpload = async (file?: File) => {
    if (!file) return;
    const lines = (await file.text())
      .split(/\r?\n/)
      .map((line) => line.split(',')[0]?.replace(/^"|"$/g, '').trim())
      .filter((title): title is string => Boolean(title));
    const titles = lines[0]?.toLowerCase().includes('title') ? lines.slice(1) : lines;
    setCsvFileName(file.name);
    setCsvTitles(titles.slice(0, 5000));
    if (titles.length) setCatalogStatus('full_searchable_library');
  };

  return (
    <main className="min-h-screen bg-[#f6efe0] text-[#181818]">
      <header className="border-b border-[#dfc99f] bg-[#f8f5ef]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#ttgj" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#6d4c13]"><ArrowLeft size={15} /> TTGJ directory</a>
          <span className="rounded bg-[#1a1a2e] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">Owner onboarding preview</span>
        </div>
      </header>

      <section className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#e8bf68]">For cafes, stores, and play spaces</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] md:text-6xl">Build your TTGJ listing</h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#d8d0c7]">Claim the imported venue record, confirm practical visitor details, then connect playable or stocked games to your location.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-2 md:grid-cols-4">
          {ownerSteps.map((item, index) => (
            <button type="button" key={item.id} onClick={() => setStep(item.id)} className={`rounded-lg border p-4 text-left transition ${step === item.id ? 'border-[#bc4937] bg-white shadow-sm' : 'border-[#dfc99f] bg-white/55 hover:bg-white'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#bc4937]">Step {index + 1}</span>
              <span className="mt-2 block text-base font-black">{item.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-[#756454]">{item.copy}</span>
            </button>
          ))}
        </div>

        {step === 'claim' && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Find your imported listing</p>
              <label className="mt-4 flex items-center gap-2 rounded border border-[#dfcfb4] bg-[#fffaf0] px-3 py-3">
                <Search size={17} className="text-[#bc4937]" />
                <input value={venueQuery} onChange={(event) => setVenueQuery(event.target.value)} placeholder="Cafe, shop, city, or prefecture..." className="w-full bg-transparent text-sm font-semibold outline-none" />
              </label>
              <div className="mt-3 max-h-[470px] space-y-2 overflow-y-auto pr-1">
                {venueMatches.map((venue) => {
                  const Icon = venueKindIcon(venue);
                  return (
                    <button type="button" key={venue.sourceId} onClick={() => chooseVenue(venue)} className={`w-full rounded border p-3 text-left ${selectedVenue.sourceId === venue.sourceId ? 'border-[#bc4937] bg-[#fff7e7]' : 'border-[#eee2cc] hover:border-[#d7b67c]'}`}>
                      <span className="flex gap-2"><Icon size={16} className="shrink-0 text-[#bc4937]" /><strong className="text-sm">{venue.name}</strong></span>
                      <span className="mt-1 block text-xs font-semibold text-[#756454]">{venue.city} · {venue.prefecture} · {venue.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <VenueSummary venue={selectedVenue}>
              {claimSubmitted ? (
                <div className="mt-5 rounded border border-[#b9d5ca] bg-[#edf8f5] p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-[#237243]"><CheckCircle2 size={17} /> Claim request prepared</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#41645d]">The live version will submit this for TTGJ review. Continue now to prepare the profile details and game list.</p>
                  <button type="button" onClick={() => setStep('profile')} className="mt-4 rounded bg-[#1a1a2e] px-4 py-3 text-xs font-black uppercase text-white">Confirm listing details</button>
                </div>
              ) : (
                <button type="button" onClick={() => setClaimSubmitted(true)} className="mt-5 inline-flex items-center gap-2 rounded bg-[#a60000] px-4 py-3 text-xs font-black uppercase text-white"><ShieldCheck size={16} /> Request ownership review</button>
              )}
            </VenueSummary>
          </section>
        )}

        {step === 'profile' && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[0.76fr_1.24fr]">
            <VenueSummary venue={selectedVenue} />
            <form className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm" onSubmit={(event) => { event.preventDefault(); setProfileSaved(true); }}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Visitor-facing details</p>
              <h2 className="mt-2 text-2xl font-black">Confirm what guests should see</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input defaultValue={selectedVenue.name} className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" aria-label="Venue name" />
                <input defaultValue={selectedVenue.website} className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" aria-label="Website" placeholder="Website" />
                <input defaultValue={selectedVenue.address} className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" aria-label="Address" placeholder="Address" />
                <input defaultValue={selectedVenue.hours} className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" aria-label="Hours" placeholder="Opening hours" />
                <select defaultValue={selectedVenue.englishFriendly ? 'limited' : 'not_confirmed'} className="rounded border border-[#dfcfb4] p-3 text-sm" aria-label="English support">
                  <option value="not_confirmed">English support not confirmed</option>
                  <option value="limited">Limited English support</option>
                  <option value="available">English support available</option>
                  <option value="bilingual">Bilingual service</option>
                </select>
                <input defaultValue={selectedVenue.priceRange} className="rounded border border-[#dfcfb4] p-3 text-sm" aria-label="Price range" placeholder="Pricing notes" />
                <textarea defaultValue={selectedVenue.description} className="min-h-28 rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" aria-label="Description" placeholder="Visitor-facing description" />
              </div>
              <div className="mt-5 rounded border border-[#dfcfb4] bg-[#fffaf0] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bc4937]">Approximate library size</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  {[
                    ['under_100', 'Under 100'],
                    ['100_plus', '100+'],
                    ['300_plus', '300+'],
                    ['500_plus', '500+'],
                  ].map(([value, label]) => (
                    <label key={value} className={`cursor-pointer rounded border px-3 py-3 text-center text-xs font-black ${librarySize === value ? 'border-[#bc4937] bg-white text-[#a60000]' : 'border-[#ead8b4] bg-white/55 text-[#6d4c13]'}`}>
                      <input type="radio" name="library-size" value={value} checked={librarySize === value} onChange={() => setLibrarySize(value as LibrarySizeBand)} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded bg-[#a60000] px-4 py-3 text-xs font-black uppercase text-white"><Save size={15} /> Save profile draft</button>
                <button type="button" onClick={() => setStep('publish')} className="inline-flex items-center gap-2 rounded bg-[#237243] px-4 py-3 text-xs font-black uppercase text-white"><Send size={15} /> Quick publish</button>
                <button type="button" onClick={() => setStep('games')} className="rounded border border-[#d7b67c] px-4 py-3 text-xs font-black uppercase text-[#6d4c13]">Optional: add games</button>
                {profileSaved && <span className="text-xs font-black text-[#237243]">Draft saved locally for preview.</span>}
              </div>
            </form>
          </section>
        )}

        {step === 'games' && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">BGG-linked catalogue</p>
              <h2 className="mt-2 text-2xl font-black">Optionally add signature games</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">Skip this step, add a few titles visitors ask about, or upload an existing list. Owners do not need to build the full catalogue manually.</p>
              <div className="mt-4 rounded border border-[#dfcfb4] bg-[#fffaf0] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#bc4937]">Upload an existing list</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">CSV upload enters the assisted matching queue. TTGJ can connect the titles to BGG records for you.</p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded border border-[#d7b67c] bg-white px-4 py-3 text-xs font-black uppercase text-[#6d4c13]">
                  <FileSpreadsheet size={16} /> Upload CSV
                  <input type="file" accept=".csv,text/csv" onChange={(event) => void handleCsvUpload(event.target.files?.[0])} className="sr-only" />
                </label>
                {csvFileName && <p className="mt-3 text-xs font-black text-[#237243]">{csvFileName}: {csvTitles.length} titles ready for assisted matching.</p>}
              </div>
              <div className="mt-4 flex gap-2">
                <label className="flex flex-1 items-center gap-2 rounded border border-[#dfcfb4] bg-[#fffaf0] px-3 py-3">
                  <Search size={17} className="text-[#bc4937]" />
                  <input value={gameQuery} onChange={(event) => setGameQuery(event.target.value)} placeholder="Search BoardGameGeek..." className="w-full bg-transparent text-sm font-semibold outline-none" />
                </label>
                <button type="button" onClick={() => void searchGames()} disabled={searchingGames} className="rounded bg-[#a60000] px-4 text-xs font-black uppercase text-white disabled:opacity-50">Search</button>
              </div>
              {gameMessage && <p className="mt-3 rounded bg-[#fff7e7] p-3 text-xs font-semibold leading-5 text-[#7b4c2c]">{gameMessage}</p>}
              <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
                {gameMatches.map((game) => (
                  <div key={game.id} className="flex items-center justify-between gap-3 rounded border border-[#eee2cc] p-3">
                    <div><strong className="block text-sm">{game.title}</strong><span className="text-[11px] font-semibold text-[#756454]">BGG #{game.bgg_id} · {game.year_published || 'Year TBC'}</span></div>
                    <button type="button" onClick={() => addGame(game)} className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#1a1a2e] text-white" aria-label={`Add ${game.title}`}><Plus size={15} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Venue game list</p>
              <h2 className="mt-2 text-2xl font-black">{selectedVenue.name}</h2>
              <p className="mt-2 text-xs font-semibold text-[#756454]">{gameDrafts.length} signature titles prepared · {csvTitles.length} CSV titles queued</p>
              <label className="mt-4 block text-xs font-black uppercase tracking-[0.14em] text-[#8a7560]">
                Public library signal
                <select value={catalogStatus} onChange={(event) => setCatalogStatus(event.target.value as GameCatalogStatus)} className="mt-2 w-full rounded border border-[#dfcfb4] bg-white p-3 text-sm font-bold normal-case tracking-normal text-[#35200d]">
                  <option value="not_supplied">Game list not yet supplied</option>
                  <option value="library_size_confirmed">Library size confirmed</option>
                  <option value="featured_games_only">Featured games only</option>
                  <option value="full_searchable_library">Full searchable library</option>
                </select>
              </label>
              <div className="mt-4 space-y-2">
                {gameDrafts.map((item) => (
                  <div key={item.id} className="rounded border border-[#eee2cc] bg-[#fffaf0] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div><strong className="block text-sm">{item.title}</strong><span className="text-[11px] font-semibold text-[#756454]">BGG #{item.bggId}</span></div>
                      <button type="button" onClick={() => saveDrafts(gameDrafts.filter((game) => game.id !== item.id))} aria-label={`Remove ${item.title}`} className="text-[#a60000]"><Trash2 size={16} /></button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <select value={item.availabilityType} onChange={(event) => updateGame(item.id, { availabilityType: event.target.value as AvailabilityType })} className="rounded border border-[#dfcfb4] bg-white px-2 py-2 text-xs font-bold">
                        <option value="playable">Playable in venue</option>
                        <option value="retail_stock">Retail stock</option>
                        <option value="orderable">Orderable</option>
                        <option value="event_only">Event-only</option>
                      </select>
                      <label className="flex items-center gap-2 rounded border border-[#dfcfb4] bg-white px-2 py-2 text-xs font-bold"><input type="checkbox" checked={item.englishRulesAvailable} onChange={(event) => updateGame(item.id, { englishRulesAvailable: event.target.checked })} /> English rules</label>
                    </div>
                  </div>
                ))}
                {!gameDrafts.length && <p className="rounded bg-[#fffaf0] p-4 text-sm font-semibold leading-6 text-[#756454]">No titles added yet. Search BGG to begin the venue library.</p>}
              </div>
              <button type="button" onClick={() => setStep('publish')} className="mt-5 w-full rounded bg-[#237243] px-4 py-3 text-xs font-black uppercase text-white">Continue to publish</button>
            </div>
          </section>
        )}

        {step === 'publish' && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <VenueSummary venue={selectedVenue} />
            <div className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Ready for TTGJ review</p>
              <h2 className="mt-2 text-3xl font-black">Publish the useful basics now</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#756454]">Your venue can appear with practical visitor information immediately. A detailed BGG-linked game catalogue remains optional and can be improved later.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  ['Venue claim', claimSubmitted ? 'Prepared' : 'Start claim request'],
                  ['Public details', profileSaved ? 'Draft confirmed' : 'Imported details reviewed'],
                  ['Library size', librarySize.replace('_plus', '+').replace('_', ' ')],
                  ['Game catalogue', catalogStatus.replace(/_/g, ' ')],
                  ['Signature games', `${gameDrafts.length} selected`],
                  ['CSV upload', csvTitles.length ? `${csvTitles.length} titles queued` : 'Optional'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded border border-[#eee2cc] bg-[#fffaf0] p-3">
                    <span className="block text-[10px] font-black uppercase tracking-wide text-[#bc4937]">{label}</span>
                    <span className="mt-1 block text-sm font-bold text-[#35200d]">{value}</span>
                  </div>
                ))}
              </div>
              {published ? (
                <div className="mt-5 rounded border border-[#b9d5ca] bg-[#edf8f5] p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-[#237243]"><CheckCircle2 size={17} /> Listing prepared for TTGJ review</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#41645d]">The deployed version will submit this listing and notify the cafe when the claim is approved.</p>
                </div>
              ) : (
                <>
                  <button type="button" onClick={() => setPublished(true)} disabled={!claimSubmitted} className="mt-5 inline-flex items-center gap-2 rounded bg-[#a60000] px-5 py-3 text-xs font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-45"><Send size={15} /> Publish for review</button>
                  {!claimSubmitted && <p className="mt-3 text-xs font-semibold text-[#8a5b29]">Start the venue claim request before submitting the listing for review.</p>}
                </>
              )}
            </div>
          </section>
        )}

        <p className="mt-6 text-xs font-semibold leading-5 text-[#8a7560]">Preview mode: claim submission and profile edits remain local until the TTGJ Supabase migration and owner authentication workflow are deployed.</p>
      </div>
    </main>
  );
}

function VenueSummary({ venue, children }: { venue: TTGJVenue; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Imported venue record</p>
      <h2 className="mt-2 text-2xl font-black">{venue.name}</h2>
      <p className="mt-1 text-xs font-semibold text-[#756454]">{venue.nameJapanese}</p>
      <div className="mt-5 grid gap-3 text-xs font-semibold leading-5 text-[#5d635f]">
        <span className="flex gap-2"><MapPin size={15} className="shrink-0 text-[#bc4937]" /> {venue.address}</span>
        <span className="flex gap-2"><Globe2 size={15} className="shrink-0 text-[#bc4937]" /> {venue.website || 'Website pending'}</span>
        <span className="flex gap-2"><Languages size={15} className="shrink-0 text-[#bc4937]" /> {venue.englishFriendly || 'English support not yet confirmed'}</span>
        <span className="flex gap-2"><Gamepad2 size={15} className="shrink-0 text-[#bc4937]" /> {venue.specialties.join(' · ') || 'Game library pending'}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded bg-[#fff7e7] px-3 py-2 text-[10px] font-black uppercase text-[#8a5b29]">Imported record</span>
        <a href={venue.website || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-[#dfcfb4] px-3 py-2 text-[10px] font-black uppercase text-[#6d4c13]">Website <ExternalLink size={12} /></a>
      </div>
      {children}
    </div>
  );
}
