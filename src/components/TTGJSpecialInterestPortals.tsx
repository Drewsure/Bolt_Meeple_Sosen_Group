import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  MapPinned,
  PackageSearch,
  Puzzle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';

type PortalKey = 'trading-cards' | 'mystery-games';

const portalTabs = [
  {
    key: 'trading-cards' as const,
    label: 'Trading Cards',
    copy: 'Stores, play spaces, tournaments, sealed products, and singles.',
    Icon: Ticket,
  },
  {
    key: 'mystery-games' as const,
    label: 'Mystery Games',
    copy: 'Murder mysteries, puzzle experiences, and visitor-ready booking paths.',
    Icon: Puzzle,
  },
];

const tradingCardFamilies = [
  ['Pokémon', 'Singles, sealed products, casual play, and tournaments.'],
  ['One Piece Card Game', 'Popular Japanese releases, store events, and collector routes.'],
  ['Yu-Gi-Oh!', 'Specialist inventory, competitive play, and secondhand discovery.'],
  ['Magic: The Gathering', 'English-friendly play opportunities and international community overlap.'],
] as const;

const mysteryFormats = [
  ['Murder mystery', 'Hosted narrative sessions where a group investigates, deduces, and performs a role.', Users],
  ['Escape and puzzle', 'Timed clue-solving experiences with clear booking, language, and group-size notes.', Puzzle],
  ['Detective tabletop', 'Mystery board games and compact cases that can be played at a cafe or taken home.', PackageSearch],
] as const;

export function TTGJSpecialInterestPortals({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [activePortal, setActivePortal] = useState<PortalKey>('trading-cards');
  const isTradingCards = activePortal === 'trading-cards';

  return (
    <section id="ttgj-special-interests" className="border-y border-[#ddc89f] bg-[#fffaf0]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">Choose your tabletop lane</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Two useful portals beyond the board-game shelf.</h2>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-[#6d6258]">
              These visitors arrive with different questions. Give each one a focused starting point, then connect them back to maps, events, stores, and practical English guidance.
            </p>
            <div className="mt-6 grid gap-3">
              {portalTabs.map(({ key, label, copy, Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActivePortal(key)}
                  className={`rounded-xl border p-4 text-left transition ${activePortal === key ? 'border-[#bc4937] bg-white shadow-md' : 'border-[#dfc99f] bg-white/55 hover:bg-white'}`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${activePortal === key ? 'bg-[#a60000] text-white' : 'bg-[#f0e3c8] text-[#754a21]'}`}>
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong className="block text-base font-black">{label}</strong>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-[#756454]">{copy}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#d9c598] bg-white shadow-[0_18px_40px_rgba(92,62,31,0.12)]">
            <div className="bg-[#1a1a2e] p-5 text-white sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e8bf68]">{isTradingCards ? 'Trading cards portal' : 'Mystery games portal'}</p>
              <h3 className="mt-2 text-3xl font-black uppercase">{isTradingCards ? 'Find cards, stores, and a table.' : 'Find a mystery worth solving.'}</h3>
              <p className="mt-3 max-w-2xl text-xs font-semibold leading-6 text-[#d8d0c7]">
                {isTradingCards
                  ? 'Start with the game you follow, then choose whether you want to buy, play, trade, or attend an event.'
                  : 'Start with the experience you want, then check language support, booking requirements, group size, and location.'}
              </p>
            </div>

            {isTradingCards ? (
              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {tradingCardFamilies.map(([title, copy]) => (
                    <article key={title} className="rounded-lg border border-[#ead8b4] bg-[#fffaf0] p-4">
                      <Ticket size={17} className="text-[#bc4937]" />
                      <h4 className="mt-3 text-sm font-black">{title}</h4>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['Find card shops', Store, 'ttgj-directory'],
                    ['Browse events', Trophy, 'ttgj-events'],
                    ['Shop new and used', ShoppingBag, 'ttgj-buy-games'],
                    ['Meet players', Users, 'ttgj-groups'],
                  ].map(([label, Icon, target]) => {
                    const ActionIcon = Icon as typeof Store;
                    return (
                      <button type="button" key={label as string} onClick={() => scrollTo(target as string)} className="inline-flex items-center justify-between gap-2 rounded-lg border border-[#dfc99f] bg-white px-3 py-3 text-left text-[11px] font-black uppercase text-[#754a21] transition hover:border-[#bc4937] hover:text-[#a60000]">
                        {label as string} <ActionIcon size={15} />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex gap-3 rounded-lg border border-[#b9d5ca] bg-[#edf8f5] p-4">
                  <ShieldCheck size={18} className="shrink-0 text-[#237243]" />
                  <p className="text-xs font-semibold leading-5 text-[#24584f]">Choose the right stop: compare retail stock, singles, play space, casual nights, and tournament support before adding a card shop to your route.</p>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {mysteryFormats.map(([title, copy, Icon]) => (
                    <article key={title} className="rounded-lg border border-[#ead8b4] bg-[#fffaf0] p-4">
                      <Icon size={17} className="text-[#bc4937]" />
                      <h4 className="mt-3 text-sm font-black">{title}</h4>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['Browse experiences', Compass, 'ttgj-experiences'],
                    ['Check events', CalendarDays, 'ttgj-events'],
                    ['Find nearby venues', MapPinned, 'ttgj-directory'],
                    ['Plan an itinerary', Ticket, 'ttgj-itineraries'],
                  ].map(([label, Icon, target]) => {
                    const ActionIcon = Icon as typeof Compass;
                    return (
                      <button type="button" key={label as string} onClick={() => scrollTo(target as string)} className="inline-flex items-center justify-between gap-2 rounded-lg border border-[#dfc99f] bg-white px-3 py-3 text-left text-[11px] font-black uppercase text-[#754a21] transition hover:border-[#bc4937] hover:text-[#a60000]">
                        {label as string} <ActionIcon size={15} />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex gap-3 rounded-lg border border-[#ead8b4] bg-[#fff7e7] p-4">
                  <CheckCircle2 size={18} className="shrink-0 text-[#bc4937]" />
                  <p className="text-xs font-semibold leading-5 text-[#754a21]">Choose with confidence: compare language support, booking details, duration, group size, price, and location before adding a mystery experience to your trip.</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ead8b4] bg-[#fffaf0] px-5 py-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7560]">
                <Sparkles size={14} className="text-[#bc4937]" /> Start focused, then join the wider TTGJ journey
              </span>
              <button type="button" onClick={() => scrollTo(isTradingCards ? 'ttgj-directory' : 'ttgj-experiences')} className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#a60000]">
                Open next step <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
