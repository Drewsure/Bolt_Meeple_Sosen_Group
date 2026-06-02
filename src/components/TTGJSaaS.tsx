import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Compass,
  Crown,
  Database,
  Dices,
  Dog,
  Filter,
  Gamepad2,
  Globe2,
  MapPinned,
  Navigation,
  Recycle,
  Search,
  ShoppingBag,
  Sparkles,
  Sword,
  Users,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { TTGJCatalogItem } from '../data/ttgjCatalog';
import { ttgjVenues } from '../data/ttgjVenues';
import type { Language } from '../lib/i18n';
import { fallbackTTGJCatalog, getPublicTTGJCatalog } from '../lib/ttgjCatalog';
import { TTGJAbout } from './TTGJAbout';
import { TTGJEventCalendar } from './TTGJEventCalendar';
import { TTGJGameJourney } from './TTGJGameJourney';
import { TTGJGameMarketGuide } from './TTGJGameMarketGuide';
import { TTGJItineraries } from './TTGJItineraries';
import { TTGJJapaneseGames } from './TTGJJapaneseGames';
import { TTGJShoppingGuide } from './TTGJShoppingGuide';
import { TTGJSpecialInterestPortals } from './TTGJSpecialInterestPortals';

const TTGJVenueMap = lazy(() => import('./TTGJVenueMap').then(({ TTGJVenueMap }) => ({ default: TTGJVenueMap })));

interface TTGJSaaSProps {
  language: Language;
  onToggleLanguage: () => void;
}

const pricing = [
  {
    name: 'Free Listing',
    price: 'JPY 0',
    note: 'For every real venue',
    features: ['Directory profile', 'Name and address on map', 'Business hours display', 'Appear in search results'],
  },
  {
    name: 'Verified Partner',
    price: 'JPY 4,980/mo',
    note: 'For cafes and stores ready to convert visitors',
    features: ['Claimed listing', 'Photo gallery', 'Offers and coupons', 'Multilingual description', 'Analytics dashboard'],
    highlighted: true,
  },
  {
    name: 'Featured Network',
    price: 'JPY 14,980/mo',
    note: 'For chains, publishers, tourism, and campaigns',
    features: ['Homepage spotlight', 'Dedicated blog feature', 'Event promotion support', 'Social cross-promotion', 'Managed listing support'],
  },
];

const journeyModes = [
  { key: 'visitor', label: 'Visitor', copy: 'Find a place, understand the vibe, and know how to walk in.' },
  { key: 'solo', label: 'Solo', copy: 'See whether joining alone is normal, welcomed, and supported.' },
  { key: 'owner', label: 'Owner', copy: 'Claim the profile, publish events, and improve conversion.' },
];

const platformAreas = [
  { label: 'Map', target: 'ttgj-directory', note: 'Search by area, venue type, and confidence cues.' },
  { label: 'Cafes', target: 'ttgj-cafes', note: 'Compare places to play before making a first visit.' },
  { label: 'Events', target: 'ttgj-events', note: 'Find recurring beginner tables and solo-friendly entry points.' },
  { label: 'Creators', target: 'ttgj-creators', note: 'Surface publishers, designers, and community voices.' },
  { label: 'Groups', target: 'ttgj-groups', note: 'Make regular tables and newcomer-friendly communities visible.' },
  { label: 'Online Sales', target: 'ttgj-buy-games', note: 'Connect players to trusted online sellers.' },
  { label: 'Retailers', target: 'ttgj-buy-games', note: 'Map stores, stockists, and in-person discovery.' },
  { label: 'Game List', target: 'ttgj-games', note: 'Answer where a particular game can be played or bought.' },
  { label: 'Trading Cards', target: 'ttgj-special-interests', note: 'Connect card players to shops, tournaments, singles, and play spaces.' },
  { label: 'Mystery Games', target: 'ttgj-special-interests', note: 'Package mystery, puzzle, and booking-ready experiences.' },
  { label: 'Japanese Games', target: 'ttgj-japanese-games', note: 'Connect traditional games, Japanese-made releases, and recommendations.' },
  { label: 'Experiences', target: 'ttgj-experiences', note: 'Package play, travel, and local tabletop culture.' },
  { label: 'Itineraries', target: 'ttgj-itineraries', note: 'Shape self-guided tabletop routes across Japan.' },
  { label: 'Game Market Guide', target: 'ttgj-game-market-guide', note: 'Prepare for Japan tabletop conventions.' },
  { label: 'Blog', target: 'ttgj-content', note: 'Publish useful answers for players planning a visit.' },
  { label: 'For Shops', target: 'ttgj-partners', note: 'Claim a profile, improve listing quality, and publish events.' },
  { label: 'Pricing', target: 'ttgj-pricing', note: 'Offer a simple partner path for independent venues and networks.' },
  { label: 'About Us', target: 'ttgj-about', note: 'Explain the TTGJ mission, values, and community invitation.' },
  { label: 'Japanese Board Games', target: 'ttgj-japanese-games', note: 'Build a focused guide to games, makers, and places to discover them.' },
];

const touristJourney = [
  {
    number: '1',
    title: 'Search for a game',
    accent: 'game',
    copy: 'Start with a title and instantly see where it is playable, with English-rule availability and language-dependency guidance.',
    links: [
      ['Game List', 'ttgj-games'],
      ['Japanese Games', 'ttgj-japanese-games'],
      ['Japanese Board Games', 'ttgj-japanese-games'],
      ['Creators', 'ttgj-creators'],
      ['Trading Cards', 'ttgj-special-interests'],
      ['Blog', 'ttgj-content'],
    ],
    icon: Search,
  },
  {
    number: '2',
    title: 'Visit the venue',
    accent: 'venue',
    copy: 'Open directions, hours, prices, and practical arrival notes before you walk through the door.',
    links: [
      ['Map', 'ttgj-directory'],
      ['Cafes', 'ttgj-cafes'],
      ['Events', 'ttgj-events'],
      ['Groups', 'ttgj-groups'],
      ['Experiences', 'ttgj-experiences'],
      ['Mystery Games', 'ttgj-special-interests'],
      ['Itineraries', 'ttgj-itineraries'],
      ['Game Market Guide', 'ttgj-game-market-guide'],
    ],
    icon: Navigation,
  },
  {
    number: '3',
    title: 'Find it secondhand',
    accent: 'secondhand',
    copy: 'Connect the game page to trusted resale options and nearby physical stores when a played copy becomes the souvenir.',
    links: [
      ['Retailers', 'ttgj-buy-games'],
      ['Surugaya', 'ttgj-buy-games'],
      ['Mandarake', 'ttgj-buy-games'],
    ],
    icon: Recycle,
  },
  {
    number: '4',
    title: 'Buy it brand new',
    accent: 'brand new',
    copy: 'Offer trusted online sellers and international purchase paths for visitors ready to build the collection.',
    links: [
      ['Online Sales', 'ttgj-buy-games'],
      ['Amazon JP', 'ttgj-buy-games'],
      ['ZenMarket', 'ttgj-buy-games'],
      ['For Shops', 'ttgj-partners'],
      ['Pricing', 'ttgj-pricing'],
      ['About Us', 'ttgj-about'],
    ],
    icon: ShoppingBag,
  },
];

const touristStories = [
  {
    quote: 'I used the map to find Jelly Jelly Akihabara, played for three hours, then bought a game nearby. TTGJ made my Tokyo gaming day effortless.',
    initials: 'AU',
    name: 'James M.',
    note: 'Board gamer from Melbourne · Tokyo 2024',
  },
  {
    quote: 'The itinerary gave us a lifesaver: an indie shop, an English-friendly play space, and secondhand options for the games we loved.',
    initials: 'DE',
    name: 'Lena K.',
    note: 'Tabletop enthusiast from Berlin · Kansai',
  },
  {
    quote: 'The Akihabara route is pure gold. I found a rare edition, learned where to play, and discovered stores I would never have seen alone.',
    initials: 'US',
    name: 'Tyler R.',
    note: 'Visitor exploring Tokyo game districts',
  },
];

const tabletopNews = [
  ['Events', 'Tokyo Game Market: spring discovery guide', 'Publishers, demos, and visitor planning'],
  ['New opening', 'A new cafe route opens in Osaka', 'Beginner tables and late-night play'],
  ['New game', 'Japanese indie games to watch', 'Small-box releases with English support'],
  ['Tournament', 'Mahjong and strategy events guide', 'Find local competition and open tables'],
  ['Award', 'Japanese tabletop standouts', 'Games worth finding during your trip'],
  ['Tourism', 'Tabletop itineraries across Tokyo', 'Build a gaming day around neighborhoods'],
] as const;

const visitorIntentOptions = [
  {
    key: 'place',
    label: 'Cafe / store',
    copy: 'Find a welcoming place near your route.',
    icon: Coffee,
    recommended: ['map', 'shop'],
  },
  {
    key: 'game',
    label: 'Specific game',
    copy: 'Start with the title you want to play or buy.',
    icon: Gamepad2,
    recommended: ['game', 'shop'],
  },
  {
    key: 'players',
    label: 'Meet players',
    copy: 'Find events, groups, and tables open to newcomers.',
    icon: Users,
    recommended: ['events', 'table'],
  },
] as const;

const visitorPipelineActions = [
  { key: 'map', label: 'Search map', copy: 'Browse cafes and stores by area.', icon: MapPinned, target: 'ttgj-directory' },
  { key: 'game', label: 'Search games', copy: 'Begin with a BGG title and find the next step.', icon: Gamepad2, target: 'ttgj-games' },
  { key: 'events', label: 'Browse events', copy: 'See upcoming tables and community dates.', icon: CalendarDays, target: 'ttgj-events' },
  { key: 'table', label: 'Find a table', copy: 'Discover groups and newcomer-friendly play.', icon: Users, target: 'ttgj-groups' },
  { key: 'shop', label: 'Shop games', copy: 'Compare trusted new and secondhand routes.', icon: ShoppingBag, target: 'ttgj-buy-games' },
] as const;

function VisitorNavigationPipeline({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [intent, setIntent] = useState<(typeof visitorIntentOptions)[number]['key']>('place');
  const selected = visitorIntentOptions.find((item) => item.key === intent) ?? visitorIntentOptions[0];

  return (
    <section id="ttgj-navigation-pipeline" className="border-y border-[#e5d1a9] bg-[#f6ecd8]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-lg bg-[#1a1a2e] p-6 text-white shadow-xl md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e8bf68]">Navigation flow</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] md:text-5xl">Board game enthusiast in Japan</h2>
            <p className="mt-5 text-sm font-semibold leading-7 text-[#d8d0c7]">Start with what you need today. TTGJ will point you toward the most useful next step.</p>
            <div className="mt-7 flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-[#e8bf68]">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#e8bf68]/60">1</span>
              What are you looking for?
            </div>
            <div className="mt-4 grid gap-2">
              {visitorIntentOptions.map(({ key, label, copy, icon: Icon }) => (
                <button type="button" key={key} onClick={() => setIntent(key)} className={`rounded-lg border p-4 text-left transition ${intent === key ? 'border-[#e8bf68] bg-white text-[#1a1a2e]' : 'border-white/20 bg-white/5 text-white hover:bg-white/10'}`}>
                  <span className="flex items-center gap-3">
                    <Icon size={18} className={intent === key ? 'text-[#bc4937]' : 'text-[#e8bf68]'} />
                    <span>
                      <strong className="block text-sm uppercase">{label}</strong>
                      <span className={`mt-1 block text-xs font-semibold leading-5 ${intent === key ? 'text-[#6d6258]' : 'text-[#d8d0c7]'}`}>{copy}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#ddc89f] bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-[#bc4937]">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#bc4937]/60">2</span>
              Ready?
            </div>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-[#6d6258]">Choose an action. The highlighted routes are the most useful starting points for <strong className="text-[#35200d]">{selected.label.toLowerCase()}</strong>.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {visitorPipelineActions.map(({ key, label, copy, icon: Icon, target }) => {
                const isRecommended = selected.recommended.includes(key as never);
                return (
                  <button type="button" key={key} onClick={() => scrollTo(target)} className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${isRecommended ? 'border-[#bc4937] bg-[#fff7e7]' : 'border-[#eee2cc] bg-[#fffdf8]'}`}>
                    <span className="flex items-start justify-between gap-3">
                      <Icon size={19} className={isRecommended ? 'text-[#bc4937]' : 'text-[#8a7560]'} />
                      {isRecommended && <span className="rounded bg-[#bc4937] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white">Start here</span>}
                    </span>
                    <strong className="mt-4 block text-sm font-black uppercase text-[#171717]">{label}</strong>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-[#756454]">{copy}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-[#a60000]">Open <ArrowRight size={12} /></span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#b9d5ca] bg-[#edf8f5] px-4 py-3">
              <CheckCircle2 size={18} className="shrink-0 text-[#237243]" />
              <p className="text-sm font-black text-[#24584f]">Welcome to tabletop Japan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TTGJDiceToggle({ language, onToggleLanguage, compact = false }: { language: Language; onToggleLanguage: () => void; compact?: boolean }) {
  const isJapanese = language === 'ja';
  return (
    <button
      type="button"
      onClick={onToggleLanguage}
      className={`ttgj-dice-toggle ${isJapanese ? 'ttgj-dice-toggle-ja' : ''} ${compact ? 'ttgj-dice-toggle-compact' : ''}`}
      aria-label="Toggle language between English and Japanese"
      title="Toggle language"
    >
      <svg viewBox="0 0 340 100" aria-hidden="true">
        <rect className="ttgj-dice-track" x="72" y="20" width="196" height="60" rx="30" />
        <text className="ttgj-dice-label ttgj-dice-label-en" x="38" y="50" textAnchor="middle" dominantBaseline="central">EN</text>
        <text className="ttgj-dice-label ttgj-dice-label-ja" x="302" y="50" textAnchor="middle" dominantBaseline="central">日本語</text>
        <g className="ttgj-dice-group">
          <rect className="ttgj-dice-body" x="82" y="28" width="44" height="44" rx="10" />
          <circle className="ttgj-dice-dot ttgj-dice-corner" cx="93" cy="39" r="4" />
          <circle className="ttgj-dice-dot ttgj-dice-corner" cx="115" cy="39" r="4" />
          <circle className="ttgj-dice-dot ttgj-dice-corner" cx="93" cy="61" r="4" />
          <circle className="ttgj-dice-dot ttgj-dice-corner" cx="115" cy="61" r="4" />
          <circle className="ttgj-dice-dot ttgj-dice-center" cx="104" cy="50" r="4" />
        </g>
      </svg>
    </button>
  );
}

function TTGJIconCluster() {
  return (
    <span className="ttgj-icon-cluster" aria-hidden="true">
      <Sword className="ttgj-icon-sword" size={17} />
      <Dices className="ttgj-icon-dice" size={18} />
      <Dog className="ttgj-icon-fox" size={17} />
    </span>
  );
}

function CatalogSection({
  id,
  eyebrow,
  title,
  copy,
  items,
  icon: Icon,
  tone = 'paper',
  scrollTarget,
  scrollTo,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  items: TTGJCatalogItem[];
  icon: typeof Compass;
  tone?: 'paper' | 'white';
  scrollTarget?: string;
  scrollTo?: (id: string) => void;
}) {
  return (
    <section id={id} className={tone === 'white' ? 'border-y border-[#e7ded2] bg-white' : ''}>
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">{eyebrow}</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">{title}</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7 text-[#6d6258]">{copy}</p>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-[0_12px_30px_rgba(114,91,62,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#d7b67c] hover:bg-white/80 hover:shadow-[0_18px_34px_rgba(114,91,62,0.14)]">
              <Icon size={18} className="text-[#bc4937]" />
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7560]">{item.meta}</p>
              <h3 className="mt-1.5 text-lg font-black">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[#6d6258]">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/80 bg-[#f0e3c8]/70 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[#6b5141]">{tag}</span>
                ))}
              </div>
              {scrollTarget && scrollTo && (
                <button type="button" onClick={() => scrollTo(scrollTarget)} className="mt-5 inline-flex items-center gap-1 text-xs font-black text-[#a60000]">
                  {item.action} <ArrowRight size={13} />
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TouristJourneySection({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section id="ttgj-tourist-journey" className="border-y border-[#e5d1a9] bg-[#f6ecd8]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">
            <span className="h-px w-7 bg-[#bc4937]" /> The tourist journey <span className="h-px w-7 bg-[#bc4937]" />
          </p>
          <h2 className="font-display mt-3 text-5xl uppercase leading-none text-[#171717] md:text-6xl">
            From <span className="text-[#c81727]">cafe</span> to <span className="text-[#b97d19]">collection</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#754a21]">
            Search, arrive with confidence, join a table, and take a piece of tabletop Japan home.
          </p>
        </div>

        <div className="mt-10">
          <div className="divide-y divide-[#dfc99f] border-y border-[#dfc99f]">
            {touristJourney.map((step) => {
              const StepIcon = step.icon;
              return (
                <article key={step.number} className="grid grid-cols-[44px_1fr] gap-4 py-5 sm:grid-cols-[58px_1fr]">
                  <span className="font-display text-6xl leading-none text-[#dfd2bb]">{step.number}</span>
                  <div>
                    <h3 className="font-display text-2xl uppercase text-[#171717]">
                      {step.title.replace(step.accent, '')}<span className="text-[#c81727]">{step.accent}</span>
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#754a21]">{step.copy}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.links.map(([label, target]) => (
                        <button type="button" key={label} onClick={() => scrollTo(target)} className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc99f] bg-white/65 px-3 py-1.5 text-[10px] font-black uppercase text-[#754a21] backdrop-blur transition hover:border-[#bc4937] hover:bg-white hover:text-[#a60000]">
                          <StepIcon size={12} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export function TTGJSaaS({ language, onToggleLanguage }: TTGJSaaSProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [journeyMode, setJourneyMode] = useState(journeyModes[0].key);
  const [catalog, setCatalog] = useState(fallbackTTGJCatalog);

  useEffect(() => {
    void getPublicTTGJCatalog().then(setCatalog);
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(ttgjVenues.map((venue) => venue.category).filter(Boolean))).slice(0, 8)],
    [],
  );

  const filteredVenues = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ttgjVenues.filter((venue) => {
      const matchesCategory = category === 'All' || venue.category === category;
      const searchable = [
        venue.name,
        venue.category,
        venue.city,
        venue.prefecture,
        venue.description,
        venue.notes,
        venue.specialties.join(' '),
      ].join(' ').toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query]);

  const activeVenues = ttgjVenues.filter((venue) => venue.status === 'Active');
  const englishFriendly = ttgjVenues.filter((venue) => venue.englishFriendly.toLowerCase() === 'yes');
  const featuredVenues = filteredVenues.slice(0, 3);
  const selectedJourney = journeyModes.find((mode) => mode.key === journeyMode) ?? journeyModes[0];
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#161616]">
      <header className="sticky top-0 z-40 border-b border-[#e7ded2] bg-[#f8f5ef]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <TTGJIconCluster />
            <span className="text-xl font-black tracking-tight text-[#171717]">TableTop Games Japan</span>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['Map', 'ttgj-directory'],
              ['Cafes', 'ttgj-cafes'],
              ['Events', 'ttgj-events'],
              ['Game List', 'ttgj-games'],
              ['For Shops', 'ttgj-partners'],
            ].map(([label, target]) => (
              <button type="button" key={label} onClick={() => scrollTo(target)} className="text-sm font-semibold text-[#272727] transition hover:text-[#a60000]">
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <TTGJDiceToggle language={language} onToggleLanguage={onToggleLanguage} compact />
            <a href="#ttgj-owner" className="rounded-full bg-[#a60000] px-4 py-2 text-xs font-black text-white shadow-sm">
              Claim
            </a>
          </div>
        </div>
      </header>

      <nav aria-label="Explore TableTop Games Japan" className="border-b border-[#e7ded2] bg-white">
        <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 py-3 text-xs font-black text-[#57504a] md:px-8">
          {platformAreas.map((area) => (
            <button
              type="button"
              key={area.label}
              onClick={() => scrollTo(area.target)}
              className="shrink-0 transition hover:text-[#a60000]"
            >
              {area.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="overflow-hidden bg-[#171742] py-2 text-white">
        <div className="flex min-w-max animate-[ttgj-marquee_35s_linear_infinite] gap-8 px-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#f0e3c8]">
          {['Verified partner venues', 'Japan tabletop field guide', 'Solo-friendly entry cues', 'Beginner events', 'Game-led cafe search', 'English and Japanese context'].concat(['Verified partner venues', 'Japan tabletop field guide', 'Solo-friendly entry cues']).map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#cc2200]" />{item}</span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#d8e5e4] shadow-2xl">
          <img src="/images/ttgj-hero-world.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-white/15" />
          <div className="relative grid min-h-[620px] items-center gap-8 px-8 py-14 md:grid-cols-[0.62fr_0.38fr] md:px-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-[#d8b579] bg-[#f7ead1]/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#ae7420]">
                <Sparkles size={14} className="text-[#e7448c]" /> Japan&apos;s premier tabletop gaming guide
              </span>
              <p className="mt-5 font-editorial text-xl font-bold text-[#684622]">テーブルゲームの聖地</p>
              <h1 className="font-display mt-2 max-w-[620px] text-6xl uppercase leading-[0.9] text-[#1c1c1f] md:text-8xl">
                Discover <span className="text-[#c81727]">Japan&apos;s</span> <span className="text-[#b97d19]">analog</span> gaming soul
              </h1>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[#684f35]">
                Find board game cafes, locate rare games, plan your gaming itinerary, and connect with Japan&apos;s vibrant tabletop community - all in English.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollTo('ttgj-games')} className="rounded-md bg-[#bd1121] px-6 py-4 text-sm font-black text-white shadow-lg">
                  Search Games
                </button>
                <button type="button" onClick={() => scrollTo('ttgj-directory')} className="rounded-md border border-[#ddc89f] bg-white/90 px-6 py-4 text-sm font-black text-[#333] shadow-lg">
                  Find a Cafe
                </button>
                <button type="button" onClick={() => scrollTo('ttgj-experiences')} className="rounded-md border border-[#ddc89f] bg-white/90 px-6 py-4 text-sm font-black text-[#333] shadow-lg">
                  Plan My Trip
                </button>
              </div>
              <div className="mt-8 max-w-xl rounded-xl border border-white/60 bg-white/45 p-2 backdrop-blur">
                <div className="grid grid-cols-3 gap-2">
                  {journeyModes.map((mode) => (
                    <button
                      type="button"
                      key={mode.key}
                      onClick={() => setJourneyMode(mode.key)}
                      className={`rounded-lg px-3 py-3 text-xs font-black uppercase tracking-wide transition ${
                        journeyMode === mode.key ? 'bg-[#a60000] text-white shadow-md' : 'bg-white/80 text-[#222] hover:bg-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <p className="px-3 py-3 text-sm font-semibold leading-6 text-[#3c3c3c]">{selectedJourney.copy}</p>
              </div>
            </div>
            <div className="relative hidden min-h-[390px] md:block">
              <div className="ttgj-hero-video-card absolute right-0 top-14 w-[320px] rotate-[-10deg] overflow-hidden rounded-[2rem] bg-white p-4 shadow-2xl lg:w-[360px]">
                <video
                  className="h-72 w-full rounded-[1.5rem] object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/images/ttgj-mascots.png"
                  aria-label="Animated TTGJ samurai and fox mascots"
                >
                  <source src="/images/ttgj-samurai-fox-hero.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VisitorNavigationPipeline scrollTo={scrollTo} />

      <TouristJourneySection scrollTo={scrollTo} />

      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <div className="grid gap-3 rounded-[1.5rem] border border-[#e7ded2] bg-white p-4 shadow-sm md:grid-cols-4">
          {[
            ['Venues loaded', activeVenues.length.toString()],
            ['Prefectures', '47'],
            ['English-friendly', englishFriendly.length.toString()],
            ['Partner paths', '3'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#f7f3ed] px-5 py-4">
              <p className="text-3xl font-black text-[#a60000]">{value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#6d6258]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ttgj-directory" className="border-y border-[#ddc89f] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">Discovery Layer</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Directory, map, and confidence search</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] md:w-[540px]">
              <label className="flex items-center gap-2 rounded-md border border-[#cdbb98] bg-[#fffaf0] px-3 py-2">
                <Search size={17} className="text-[#bc4937]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search city, venue, game, specialty..." className="w-full bg-transparent text-sm outline-none" />
              </label>
              <label className="flex items-center gap-2 rounded-md border border-[#cdbb98] bg-[#fffaf0] px-3 py-2">
                <Filter size={17} className="text-[#bc4937]" />
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent text-sm font-bold outline-none">
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </div>

          <Suspense fallback={<div className="mt-8 grid min-h-[560px] place-items-center rounded-lg border border-[#ddc89f] bg-[#f7f3ed] text-sm font-black text-[#6d6258]">Loading live venue map...</div>}>
            <TTGJVenueMap venues={filteredVenues} />
          </Suspense>

        </div>
      </section>

      <TTGJEventCalendar events={catalog.event} />

      <section id="ttgj-cafes" className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Recommended Places to Start</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-[#6d6258]">Start with welcoming venues and use the map to compare location, style, English-support notes, and practical details.</p>
          </div>
          <div className="inline-flex w-fit rounded-full bg-[#efe8de] p-1 text-xs font-black">
            <span className="rounded-full bg-white px-5 py-2 shadow-sm">Top Rated</span>
            <button type="button" onClick={() => scrollTo('ttgj-directory')} className="px-5 py-2 text-[#6d6258]">Nearby map</button>
          </div>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {featuredVenues.map((venue, index) => (
            <article key={`${venue.sourceId}-featured`} className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[0_12px_30px_rgba(114,91,62,0.1)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(114,91,62,0.16)]">
              <div className="relative h-56">
                <img src={index === 0 ? '/images/ttgj-game-market.jpeg' : index === 1 ? '/images/ttgj-dancing-meeples.jpeg' : '/images/ttgj-fuji-quest.png'} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-xl font-black">{venue.name}</h3>
                  <p className="mt-1 text-xs font-bold text-white/85">{venue.city}, {venue.prefecture}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-xs font-bold">
                <span className="text-[#a60000]">4.{9 - index} rating</span>
                <span className="text-[#6d6258]">{venue.priceRange || 'Mid Range'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TTGJGameMarketGuide />

      <CatalogSection
        id="ttgj-creators"
        eyebrow="Creators"
        title="Find the people shaping tabletop Japan."
        copy="Meet Japanese publishers and designers, then follow their games into shops, events, and your tabletop itinerary."
        items={catalog.creator}
        icon={Sparkles}
        scrollTarget="ttgj-games"
        scrollTo={scrollTo}
      />

      <CatalogSection
        id="ttgj-groups"
        eyebrow="Groups"
        title="Make it easier to join a table."
        copy="A useful group listing answers the human questions first: can I arrive alone, will someone teach, and is this table open to newcomers?"
        items={catalog.group}
        icon={Users}
        tone="white"
        scrollTarget="ttgj-events"
        scrollTo={scrollTo}
      />

      <TTGJShoppingGuide retailers={catalog.retailer} onlineSales={catalog.online_sale} scrollTo={scrollTo} />

      <TTGJGameJourney scrollTo={scrollTo} />

      <TTGJSpecialInterestPortals scrollTo={scrollTo} />

      <TTGJJapaneseGames games={catalog.game} />

      <CatalogSection
        id="ttgj-experiences"
        eyebrow="Experiences"
        title="Turn scattered information into practical pathways."
        copy="Experiences package the strongest local knowledge into useful routes for visitors, newcomers, and regional tabletop communities."
        items={catalog.experience}
        icon={Compass}
        scrollTarget="ttgj-itineraries"
        scrollTo={scrollTo}
      />

      <TTGJItineraries />

      <section id="ttgj-partners" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1fr] md:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">For cafes, shops, and play spaces</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Welcome more tabletop visitors.</h2>
          <p className="mt-4 text-sm leading-7 text-[#5d635f]">
            Claim your listing, share useful arrival details, publish events, and make it easier for international visitors to choose your venue with confidence.
          </p>
          <div className="mt-6 space-y-3">
            {['Claim and correct your public listing', 'Add photos and multilingual descriptions', 'Share events, offers, and beginner-friendly arrival notes', 'See which details help visitors plan a first visit'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
                <CheckCircle2 size={18} className="text-[#237243]" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>
          <a href="#ttgj-owner" className="mt-6 inline-flex rounded-md bg-[#a60000] px-4 py-3 text-xs font-black text-white shadow-sm">Claim and manage your listing</a>
        </div>

        <div className="rounded-lg border border-[#d9c598] bg-[#172b30] p-5 text-white shadow-xl">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#e8bf68]">Partner dashboard preview</p>
              <h3 className="mt-1 text-2xl font-black">Your venue at a glance</h3>
            </div>
            <Crown className="text-[#e8bf68]" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              [Globe2, 'Listing health', '82% complete'],
              [CalendarDays, 'Next beginner night', 'Needs schedule'],
              [Users, 'Lead actions', '14 this month'],
              [Database, 'Profile updates', '3 suggested'],
            ].map(([Icon, label, value]) => {
              const CardIcon = Icon as typeof Globe2;
              return (
                <div key={label as string} className="rounded-md bg-white/10 p-4">
                  <CardIcon size={18} className="text-[#e8bf68]" />
                  <p className="mt-4 text-xs uppercase tracking-wide text-[#b8c9c2]">{label as string}</p>
                  <p className="mt-1 text-lg font-black">{value as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-md bg-white p-4 text-[#1f2428]">
            <p className="text-xs font-black uppercase tracking-wide text-[#bc4937]">Next best action</p>
            <p className="mt-2 text-sm font-bold">Add solo-friendly entry instructions and publish one beginner-friendly event to improve first-visit conversion.</p>
          </div>
        </div>
      </section>

      <section id="ttgj-pricing" className="bg-[#f0e3c8]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">Pricing</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Start as a directory. Grow into a network.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5d635f]">Choose a simple listing, a verified venue profile, or a broader campaign partnership for chains, publishers, and tourism networks.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map((tier) => (
              <article key={tier.name} className={`rounded-lg border p-6 shadow-sm ${tier.highlighted ? 'border-[#bc4937] bg-white' : 'border-[#d0bd98] bg-[#fffaf0]'}`}>
                <p className="text-xs font-black uppercase tracking-wide text-[#bc4937]">{tier.note}</p>
                <h3 className="mt-4 text-2xl font-black">{tier.name}</h3>
                <p className="mt-2 text-4xl font-black">{tier.price}</p>
                <div className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={16} className="text-[#237243]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ttgj-content" className="border-b border-[#ddc89f] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1fr] md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">Findable Answers</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Practical guides for planning your tabletop Japan trip.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#6d6258]">
              Find straightforward answers about where to play, what to expect, which stores to visit, and how to join a table with confidence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Where to play', 'Compare venue listings, map locations, arrival notes, and English-support cues.'],
              ['Where to shop', 'Discover specialist retailers, secondhand routes, indie games, and ship-home options.'],
              ['How to join', 'Read plain-language guidance for beginners, solo visitors, and English-speaking players.'],
              ['What to explore', 'Connect Japanese games, local creators, events, and neighborhood itineraries.'],
            ].map(([label, copy]) => (
              <article key={label} className="rounded-md border border-[#e4d2ad] bg-[#fffdf8] p-5">
                <h3 className="text-lg font-black text-[#a60000]">{label}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#6d6258]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-4 px-5 pb-14 md:grid-cols-3 md:px-8">
          {catalog.guide.map((guide) => (
            <article key={guide.title} className="rounded-md border border-[#e4d2ad] bg-[#fffdf8] p-5">
              <BookOpenText size={21} className="text-[#bc4937]" />
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#8a7560]">{guide.meta}</p>
              <h3 className="mt-2 text-lg font-black">{guide.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6d6258]">{guide.description}</p>
            </article>
          ))}
        </div>
      </section>

      <TTGJAbout scrollTo={scrollTo} />

      <section className="border-t border-[#e5d1a9] bg-[#fffaf0]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="text-center">
            <p className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">
              <span className="h-px w-7 bg-[#bc4937]" /> Tourist stories <span className="h-px w-7 bg-[#bc4937]" />
            </p>
            <h2 className="font-display mt-3 text-5xl uppercase leading-none text-[#171717]">
              Real <span className="text-[#c81727]">experiences</span>
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {touristStories.map((story) => (
              <article key={story.name} className="rounded-md border border-[#dfc99f] bg-[#f8ead0] p-5 shadow-sm">
                <p className="text-sm font-semibold leading-6 text-[#6e4b29]">&ldquo;{story.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-[#dfc99f] pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d4a65c] text-[10px] font-black text-[#5b3510]">{story.initials}</span>
                  <span>
                    <strong className="block text-xs text-[#35200d]">{story.name}</strong>
                    <span className="mt-1 block text-[10px] font-semibold text-[#a07950]">{story.note}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfc99f] bg-[#f0d6a9]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">
                <span className="h-px w-7 bg-[#bc4937]" /> Latest news
              </p>
              <h2 className="font-display mt-3 text-4xl uppercase text-[#171717] md:text-5xl">
                Japan tabletop <span className="text-[#b97d19]">news</span>
              </h2>
            </div>
            <button type="button" onClick={() => scrollTo('ttgj-content')} className="hidden text-xs font-black text-[#a60000] sm:inline-flex">View all</button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {tabletopNews.map(([label, title, copy]) => (
              <article key={title} className="rounded border border-[#e1c999] bg-[#fff9ed] p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#bc4937]">{label}</p>
                <h3 className="mt-2 text-sm font-black leading-5 text-[#35200d]">{title}</h3>
                <p className="mt-2 text-[11px] font-semibold leading-4 text-[#a07950]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#bd1121] text-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center md:px-8">
          <h2 className="font-display text-4xl uppercase md:text-5xl">Ready to start your gaming adventure?</h2>
          <p className="mt-3 text-sm font-semibold text-[#ffe5d0]">Discover Japan&apos;s best-kept analog secrets and turn one game into a full tabletop itinerary.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => scrollTo('ttgj-games')} className="rounded bg-[#fff9ed] px-5 py-3 text-xs font-black text-[#6d3510] shadow-sm">Search Games</button>
            <button type="button" onClick={() => scrollTo('ttgj-directory')} className="rounded border border-white/50 bg-transparent px-5 py-3 text-xs font-black text-white">Find Cafes Near Me</button>
            <button type="button" onClick={() => scrollTo('ttgj-experiences')} className="rounded border border-white/50 bg-transparent px-5 py-3 text-xs font-black text-white">Plan My Itinerary</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#815514] bg-[#9a6b28] text-[#fff2d4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.35fr_1fr_1fr_1fr] md:px-8">
          <div>
            <div className="flex items-center gap-3">
              <TTGJIconCluster />
              <span className="text-lg font-black text-white">TableTop Games Japan</span>
            </div>
            <p className="mt-4 max-w-xs text-xs font-semibold leading-5 text-[#f5dcae]">Japan&apos;s English-language guide to analog gaming: play, discover, collect, and connect.</p>
            <p className="mt-5 text-[11px] font-semibold text-[#e7c27e]">&copy; 2026 TableTop Games Japan (TTGJ). All rights reserved.</p>
            <p className="mt-2 text-[11px] font-bold text-[#fff2d4]">This site uses affiliate advertisements.</p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd37c]">Discover</p>
            <div className="mt-4 grid gap-2 text-xs font-semibold">
              {[['Game index', 'ttgj-games'], ['Find venues', 'ttgj-directory'], ['Itineraries', 'ttgj-itineraries'], ['Events', 'ttgj-events']].map(([label, target]) => (
                <button key={label} type="button" onClick={() => scrollTo(target)} className="w-fit hover:text-white">{label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd37c]">Learn</p>
            <div className="mt-4 grid gap-2 text-xs font-semibold">
              {[['Japanese games', 'ttgj-japanese-games'], ['Game Market guide', 'ttgj-game-market-guide'], ['Beginner guide', 'ttgj-content'], ['News feed', 'ttgj-content']].map(([label, target]) => (
                <button key={label} type="button" onClick={() => scrollTo(target)} className="w-fit hover:text-white">{label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd37c]">Business</p>
            <div className="mt-4 grid gap-2 text-xs font-semibold">
              {[['Claim a listing', 'ttgj-partners'], ['Partner program', 'ttgj-partners'], ['Advertise', 'ttgj-pricing'], ['Contact', 'ttgj-about']].map(([label, target]) => (
                <button key={label} type="button" onClick={() => scrollTo(target)} className="w-fit hover:text-white">{label}</button>
              ))}
              <button type="button" onClick={() => scrollTo('ttgj-about')} className="w-fit hover:text-white">About TTGJ</button>
            </div>
            <div className="mt-5">
              <TTGJDiceToggle language={language} onToggleLanguage={onToggleLanguage} compact />
            </div>
          </div>
        </div>
        <div id="ttgj-legal" className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/15 px-5 py-5 text-[11px] font-semibold text-[#f5dcae] sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>Listings, prices, event details, and external retailer terms may change. Confirm important details with the venue, organizer, or retailer before travel or purchase.</p>
          <div className="flex shrink-0 gap-4">
            <a href="#ttgj-legal" className="hover:text-white">Privacy Policy</a>
            <a href="#ttgj-legal" className="hover:text-white">Terms of Use</a>
            <a href="#ttgj-about" className="hover:text-white">Contact</a>
            <a href="#ttgj-staff" className="hover:text-white">Staff</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
