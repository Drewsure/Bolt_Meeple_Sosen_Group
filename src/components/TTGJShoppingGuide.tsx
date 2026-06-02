import {
  ArrowRight,
  BadgeJapaneseYen,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Gift,
  Globe2,
  Languages,
  MapPin,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { TTGJCatalogEntry } from '../lib/ttgjCatalog';

type ShoppingMode = 'new' | 'used' | 'indie' | 'nearby' | 'ship';

const shoppingModes: Array<{ key: ShoppingMode; label: string; copy: string; icon: typeof Store }> = [
  { key: 'new', label: 'Buy new', copy: 'Specialists, publisher-direct stores, and broad marketplaces.', icon: ShoppingBag },
  { key: 'used', label: 'Find used', copy: 'Secondhand treasure routes for value, rarity, and collectors.', icon: RefreshCw },
  { key: 'indie', label: 'Discover indie', copy: 'Find Japanese doujin games and small-publisher releases.', icon: Sparkles },
  { key: 'nearby', label: 'Shop nearby', copy: 'Use the TTGJ map to add physical stores to your itinerary.', icon: MapPin },
  { key: 'ship', label: 'Ship home', copy: 'Plan online ordering and international purchase paths.', icon: PackageCheck },
];

const shoppingSignals = [
  ['Passport', 'Bring your original passport for tax-free purchases where the retailer offers the service.', BadgeJapaneseYen],
  ['Condition', 'Check completeness and look for Rank A, unopened, or excellent-condition labels when browsing used games.', Tags],
  ['Language', 'Check whether the box, rules, and cards are Japanese-only or language-light.', Languages],
  ['Luggage', 'Compact Japanese games make excellent souvenirs. Plan shipping for larger boxes.', Gift],
] as const;

const shoppingEssentials = [
  {
    title: 'Tax-Free Shopping',
    eyebrow: 'Bring your passport',
    description:
      'Mandarake confirms tax-free shopping at all stores for eligible visitors. Bring your original passport. For Surugaya and other retailers, confirm tax-free availability with the branch before travel.',
    Icon: BadgeJapaneseYen,
  },
  {
    title: 'Condition Grading',
    eyebrow: 'Inspect the listing',
    description:
      'Used retailers describe condition differently. Look for 未開封 (mikaifu / unopened), 美品 (bihin / excellent condition), or Rank A where letter grades are used, and check that components are complete.',
    Icon: Tags,
  },
  {
    title: 'Indie Scene',
    eyebrow: 'Find small-publisher games',
    description:
      'Yellow Submarine is a verified route for new, used, and doujin board games. Pair it with Game Market discovery for compact releases and games you are unlikely to find at home.',
    Icon: Sparkles,
  },
] as const;

const glossary = [
  ['新品', 'Shinpin', 'New'],
  ['中古', 'Chuko', 'Used'],
  ['未開封', 'Mikaifu', 'Unopened'],
  ['美品', 'Bihin', 'Excellent condition'],
  ['在庫', 'Zaiko', 'In stock'],
  ['取り寄せ', 'Toriyose', 'Order from another branch'],
] as const;

function routeMatches(mode: ShoppingMode, item: TTGJCatalogEntry) {
  const haystack = [item.title, item.meta, item.description, ...item.tags].join(' ').toLowerCase();
  if (mode === 'new') return !haystack.includes('secondhand') && !haystack.includes('resale');
  if (mode === 'used') return ['secondhand', 'rare', 'collector', 'resale', 'vintage'].some((term) => haystack.includes(term));
  if (mode === 'indie') return ['indie', 'doujin', 'publisher', 'original', 'specialist'].some((term) => haystack.includes(term));
  if (mode === 'ship') return ['shipping', 'international', 'online', 'marketplace', 'delivery'].some((term) => haystack.includes(term));
  return true;
}

function RetailCard({ item, kind, onFindNearby }: { item: TTGJCatalogEntry; kind: 'online' | 'store'; onFindNearby: () => void }) {
  const Icon = kind === 'online' ? Globe2 : Store;
  const isAffiliateActive = item.affiliateStatus === 'active' && Boolean(item.affiliateUrl);
  const externalUrl = isAffiliateActive ? item.affiliateUrl : item.websiteUrl;
  return (
    <article className="group rounded-xl border border-white/80 bg-white/68 p-4 shadow-[0_12px_30px_rgba(114,91,62,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#d7b67c] hover:bg-white hover:shadow-[0_18px_34px_rgba(114,91,62,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff1d8] text-[#bc4937]"><Icon size={18} /></span>
        <span className="rounded bg-[#edf8f5] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[#2d6b5e]">English guide</span>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7560]">{item.meta}</p>
      <h3 className="mt-1.5 text-lg font-black leading-tight">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[#6d6258]">{item.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded bg-[#f7f3ed] px-2 py-1 text-[9px] font-black uppercase text-[#756454]">{tag}</span>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {externalUrl && (
          <a href={externalUrl} target="_blank" rel={isAffiliateActive ? 'noreferrer sponsored' : 'noreferrer'} className="inline-flex items-center gap-1 rounded bg-[#a60000] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white">
            {isAffiliateActive ? 'PR · Shop via TTGJ' : 'Official site'} <ExternalLink size={12} />
          </a>
        )}
        <button type="button" onClick={onFindNearby} className="inline-flex items-center gap-1 rounded border border-[#dfc99f] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#a60000]">
          {kind === 'online' ? 'Compare route' : 'Find stores'} <ArrowRight size={12} />
        </button>
      </div>
      {isAffiliateActive && <p className="mt-3 text-[10px] font-semibold leading-4 text-[#8a5b29]">PR: TTGJ may earn a commission if you purchase through this link.</p>}
      {item.affiliateStatus === 'pending' && <p className="mt-3 text-[10px] font-semibold leading-4 text-[#756454]">This button opens the retailer&apos;s official site.</p>}
    </article>
  );
}

export function TTGJShoppingGuide({ retailers, onlineSales, scrollTo }: { retailers: TTGJCatalogEntry[]; onlineSales: TTGJCatalogEntry[]; scrollTo: (id: string) => void }) {
  const [mode, setMode] = useState<ShoppingMode>('new');
  const [gameQuery, setGameQuery] = useState('');
  const routes = useMemo(() => {
    const source = mode === 'nearby' ? retailers : [...onlineSales, ...retailers];
    const filtered = source.filter((item) => routeMatches(mode, item));
    return (filtered.length ? filtered : source).slice(0, 6);
  }, [mode, onlineSales, retailers]);

  const openGameSearch = () => {
    if (gameQuery.trim()) window.dispatchEvent(new CustomEvent('ttgj:game-search', { detail: gameQuery.trim() }));
    scrollTo('ttgj-games');
  };

  return (
    <section id="ttgj-buy-games" className="border-y border-[#e2d4bd] bg-[#f4ead7]">
      <div className="bg-[#1a1a2e] text-white">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 md:px-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#e8bf68]">English-first shopping guide</p>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-7xl">Buy games <span className="text-[#d42519]">new</span> &amp; used</h2>
            <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#d8d0c7]">
              Start with the game you want or the shopping experience you need. TTGJ turns Japan&apos;s specialist stores, secondhand routes, indie scene, and ship-home options into a clear visitor path.
            </p>
            <div className="mt-7 flex max-w-2xl gap-2 rounded-lg border border-white/15 bg-white/10 p-2">
              <label className="flex flex-1 items-center gap-2 rounded bg-white px-3 py-3">
                <Search size={17} className="text-[#bc4937]" />
                <input value={gameQuery} onChange={(event) => setGameQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') openGameSearch(); }} placeholder="Search a game, then find the best buying route..." className="w-full bg-transparent text-sm font-semibold text-[#35200d] outline-none" />
              </label>
              <button type="button" onClick={openGameSearch} className="rounded bg-[#d42519] px-4 text-xs font-black uppercase text-white">Find game</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/15 bg-white/10 p-3 shadow-xl">
            <img src="/images/ttgj-game-market.jpeg" alt="Board game pieces on a tabletop" className="aspect-[16/10] w-full rounded-md object-cover" />
            <p className="mt-3 px-1 text-xs font-semibold leading-5 text-[#d8d0c7]">From a compact Japanese souvenir to a rare collector find, choose the route that suits your trip.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-8 flex gap-3 rounded-lg border border-[#d8b579] bg-[#fff7e7] px-4 py-3">
          <BadgeJapaneseYen size={18} className="shrink-0 text-[#bc4937]" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a60000]">PR / Affiliate disclosure</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#6d6258]">Some shopping links may be affiliate links. When a link is marked `PR`, TTGJ may receive a commission without increasing your purchase price. Unmarked buttons open ordinary official retailer sites.</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Choose your shopping route</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {shoppingModes.map(({ key, label, copy, icon: Icon }) => (
              <button type="button" key={key} onClick={() => setMode(key)} className={`rounded-lg border p-4 text-left transition ${mode === key ? 'border-[#bc4937] bg-white shadow-sm' : 'border-[#dfc99f] bg-white/55 hover:bg-white'}`}>
                <Icon size={18} className={mode === key ? 'text-[#bc4937]' : 'text-[#8a7560]'} />
                <strong className="mt-3 block text-sm font-black uppercase">{label}</strong>
                <span className="mt-1 block text-xs font-semibold leading-5 text-[#756454]">{copy}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_260px]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Recommended paths</p>
                <h3 className="mt-2 text-3xl font-black uppercase">{shoppingModes.find((item) => item.key === mode)?.label}</h3>
              </div>
              {mode === 'nearby' && <button type="button" onClick={() => scrollTo('ttgj-directory')} className="rounded bg-[#a60000] px-4 py-3 text-xs font-black uppercase text-white">Open store map</button>}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {routes.map((item) => <RetailCard key={`${mode}-${item.id}`} item={item} kind={onlineSales.some((entry) => entry.id === item.id) ? 'online' : 'store'} onFindNearby={() => scrollTo(mode === 'nearby' ? 'ttgj-directory' : 'ttgj-games')} />)}
            </div>
          </div>

          <aside className="self-start rounded-lg border border-[#ddc89f] bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">Visitor shopping kit</p>
            <div className="mt-4 space-y-4">
              {shoppingSignals.map(([title, copy, Icon]) => (
                <div key={title} className="border-b border-[#eee2cc] pb-4 last:border-0 last:pb-0">
                  <Icon size={17} className="text-[#bc4937]" />
                  <strong className="mt-2 block text-sm font-black uppercase">{title}</strong>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Before you shop</p>
          <h3 className="mt-2 text-2xl font-black uppercase sm:text-3xl">Useful notes for visitors</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {shoppingEssentials.map(({ title, eyebrow, description, Icon }) => (
              <article key={title} className="rounded-xl border border-white/80 bg-white/68 p-5 shadow-[0_12px_30px_rgba(114,91,62,0.08)] backdrop-blur-xl">
                <Icon size={20} className="text-[#bc4937]" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#a67024]">{eyebrow}</p>
                <h4 className="mt-1 text-lg font-black">{title}</h4>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-[#dfc99f] bg-[#fffaf0] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">In-store confidence</p>
            <h3 className="mt-2 text-2xl font-black uppercase">Useful Japanese shopping terms</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {glossary.map(([japanese, romaji, meaning]) => (
                <div key={japanese} className="flex items-center gap-3 rounded border border-[#ead8b4] bg-white p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-[#1a1a2e] text-sm font-black text-white">{japanese}</span>
                  <span><strong className="block text-xs uppercase text-[#a60000]">{romaji}</strong><span className="text-xs font-semibold text-[#756454]">{meaning}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#dfc99f] bg-[#172b30] p-5 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e8bf68]">The tourist buying pipeline</p>
            <div className="mt-5 space-y-3">
              {[
                ['1', 'Search the title', 'Use the BGG-backed TTGJ game identity.'],
                ['2', 'Choose the route', 'New, used, indie, nearby, or ship home.'],
                ['3', 'Check the practical notes', 'Language, condition, tax-free service, and luggage.'],
                ['4', 'Add it to your tabletop itinerary', 'Pair the purchase with a cafe, event, or neighborhood route.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="flex gap-3 rounded border border-white/15 bg-white/5 p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d42519] text-xs font-black">{number}</span>
                  <span><strong className="block text-sm uppercase">{title}</strong><span className="mt-1 block text-xs font-semibold leading-5 text-[#d8d0c7]">{copy}</span></span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={openGameSearch} className="inline-flex items-center gap-2 rounded bg-[#d42519] px-4 py-3 text-xs font-black uppercase text-white"><FileSearch size={15} /> Start with a game</button>
              <button type="button" onClick={() => scrollTo('ttgj-directory')} className="inline-flex items-center gap-2 rounded border border-white/30 px-4 py-3 text-xs font-black uppercase text-white"><MapPin size={15} /> Find nearby stores</button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-[#b9d5ca] bg-[#edf8f5] px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0 text-[#237243]" />
          <p className="text-xs font-bold leading-5 text-[#24584f]">Retailer links, inventory, tax-free availability, and seller terms can change. Confirm important details with the retailer before purchasing.</p>
          <ExternalLink size={15} className="ml-auto shrink-0 text-[#237243]" />
        </div>
      </div>
    </section>
  );
}
