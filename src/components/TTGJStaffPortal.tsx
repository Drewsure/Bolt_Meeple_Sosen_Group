import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  Database,
  ExternalLink,
  FileCheck2,
  Globe2,
  MapPinned,
  Megaphone,
  Play,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Store,
  Upload,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const automationSystems = [
  { id: 'venues', title: 'Venue verification refresh', status: 'Manual', cadence: 'Weekly', owner: 'Directory desk', copy: 'Check websites, hours, addresses, English support, and last-verified dates.', Icon: RefreshCw },
  { id: 'claims', title: 'Owner claim review', status: 'Planned', cadence: 'Daily', owner: 'Partner desk', copy: 'Approve venue ownership, publish corrections, and notify the claimant.', Icon: ShieldCheck },
  { id: 'bgg', title: 'BGG title matching', status: 'Planned', cadence: 'On upload', owner: 'Catalogue desk', copy: 'Match owner CSV uploads and featured games to stable BoardGameGeek identities.', Icon: SearchCheck },
  { id: 'events', title: 'Event expiry and recurring schedules', status: 'Planned', cadence: 'Nightly', owner: 'Events desk', copy: 'Flag past events, expand recurring dates, and request organizer confirmation.', Icon: CalendarClock },
  { id: 'retailers', title: 'Retailer and affiliate link checks', status: 'Manual', cadence: 'Monthly', owner: 'Shopping desk', copy: 'Review official URLs, disclosures, and partnership status before publication.', Icon: ExternalLink },
  { id: 'mystery', title: 'Mystery experience verification', status: 'Manual', cadence: 'Weekly', owner: 'Experiences desk', copy: 'Check language support, booking links, duration, group size, price, and location.', Icon: FileCheck2 },
] as const;

const publicationChannels = [
  ['SEO', 'Search-ready pages', 'Publish structured venue, event, game, retailer, and Japanese-game pages with stable titles and descriptions.', Globe2],
  ['GEO', 'Local discovery', 'Create city, prefecture, and neighborhood pages that connect visitors to nearby venues, stores, and itineraries.', MapPinned],
  ['AEO', 'Answer-ready guidance', 'Publish concise answers for first visits, solo play, English support, shopping, and event participation.', SearchCheck],
  ['Editorial', 'Guides and news', 'Turn verified records into useful articles, seasonal guides, and tabletop travel stories.', BookOpenText],
] as const;

const publicationQueue = [
  ['Venue landing pages', '390 records', 'SEO + GEO', 'Ready for template design'],
  ['City and prefecture guides', '47 prefectures', 'GEO', 'Needs content schedule'],
  ['Visitor answer library', 'First-visit questions', 'AEO', 'Needs editorial review'],
  ['Events and seasonal news', 'Calendar-driven', 'Editorial', 'Needs expiry automation'],
] as const;

const queues = [
  ['Venue records', '390', 'Imported listings awaiting ongoing verification', Store],
  ['Owner claims', '0', 'Connect Supabase Auth before accepting production claims', Users],
  ['Catalogue records', 'Managed', 'Use the content desk for events, guides, creators, retailers, and experiences', Database],
  ['Game-list imports', 'Assisted', 'CSV upload UI exists; server-side matching remains to be deployed', Upload],
] as const;

const launchChecks = [
  'Deploy and validate the TTGJ Supabase migrations.',
  'Enable staff authentication and role-based access before production use.',
  'Deploy the registered BGG search bridge and cache title identities.',
  'Add structured trading-card and mystery-experience records.',
  'Move venue verification into a dated review queue.',
  'Finish public legal pages and production contact routing.',
] as const;

export function TTGJStaffPortal() {
  const [enabledAutomations, setEnabledAutomations] = useState<string[]>([]);
  const [automationMessage, setAutomationMessage] = useState('Preview controls only. Connect scheduled server jobs before enabling production automation.');
  const toggleAutomation = (id: string, title: string) => {
    setEnabledAutomations((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setAutomationMessage(`${title}: preview schedule ${enabledAutomations.includes(id) ? 'paused' : 'enabled'}. No production job has been changed.`);
  };
  const previewRun = (title: string) => {
    setAutomationMessage(`${title}: preview run recorded. Connect the server job and audit log before this can process live records.`);
  };

  return (
    <main className="min-h-screen bg-[#f3ead9] text-[#241d18]">
      <header className="border-b border-[#ddc89f] bg-[#1a1a2e] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e8bf68]">Private operations preview</p>
            <h1 className="mt-2 text-4xl font-black uppercase">TTGJ Staff Portal</h1>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#d8d0c7]">Monitor content quality, verification work, and automation readiness away from the visitor-facing site.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#ttgj" className="inline-flex items-center gap-2 rounded border border-white/25 px-4 py-3 text-xs font-black text-white"><ArrowLeft size={15} /> Public site</a>
            <a href="#ttgj-admin" className="inline-flex items-center gap-2 rounded bg-[#bd1121] px-4 py-3 text-xs font-black text-white"><Database size={15} /> Content desk</a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="flex gap-3 rounded-lg border border-[#d8b579] bg-[#fff7e7] p-4">
          <AlertTriangle size={19} className="shrink-0 text-[#bc4937]" />
          <p className="text-xs font-bold leading-5 text-[#754a21]">This is an operations preview. It records the intended staff workflow honestly: several automations remain manual or planned until Supabase migrations, staff authentication, and server functions are deployed.</p>
        </div>

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Operational overview</p>
          <h2 className="mt-2 text-3xl font-black">Queues that keep the visitor experience trustworthy.</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {queues.map(([title, value, copy, Icon]) => (
              <article key={title} className="rounded-xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
                <Icon size={19} className="text-[#bc4937]" />
                <p className="mt-4 text-3xl font-black text-[#172b30]">{value}</p>
                <h3 className="mt-1 text-sm font-black uppercase">{title}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Automation register</p>
              <h2 className="mt-2 text-3xl font-black">What runs, what is manual, and what comes next.</h2>
            </div>
            <Bot size={34} className="hidden text-[#bc4937] sm:block" />
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {automationSystems.map(({ id, title, status, cadence, owner, copy, Icon }) => (
              <article key={title} className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <Icon size={19} className="text-[#bc4937]" />
                  <span className={`rounded px-2 py-1 text-[10px] font-black uppercase ${status === 'Manual' ? 'bg-[#fff0cc] text-[#8a5b29]' : 'bg-[#edf1f4] text-[#5b6570]'}`}>{status}</span>
                </div>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase text-[#8a7560]">
                  <span className="rounded bg-[#f7f3ed] px-2 py-1">{cadence}</span>
                  <span className="rounded bg-[#f7f3ed] px-2 py-1">{owner}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eee2cc] pt-4">
                  <button type="button" onClick={() => toggleAutomation(id, title)} className={`rounded px-3 py-2 text-[10px] font-black uppercase ${enabledAutomations.includes(id) ? 'bg-[#237243] text-white' : 'border border-[#d2b77d] text-[#754a21]'}`}>
                    {enabledAutomations.includes(id) ? 'Preview enabled' : 'Enable preview'}
                  </button>
                  <button type="button" onClick={() => previewRun(title)} className="inline-flex items-center gap-1 rounded border border-[#d2b77d] px-3 py-2 text-[10px] font-black uppercase text-[#754a21]"><Play size={12} /> Test run</button>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-[#d8b579] bg-[#fff7e7] px-4 py-3 text-xs font-bold leading-5 text-[#754a21]">{automationMessage}</p>
        </section>

        <section className="mt-10 border-y border-[#ddc89f] bg-white/55 py-8">
          <div className="px-5 md:px-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Publication system</p>
            <h2 className="mt-2 text-3xl font-black">SEO, GEO, AEO, and editorial publishing.</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#756454]">Use verified records to publish useful traveler answers, local discovery pages, and seasonal tabletop guides. The public site shows the visitor version; this is the staff planning and automation layer.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {publicationChannels.map(([label, title, copy, Icon]) => (
                <article key={label} className="rounded-lg border border-[#dfc99f] bg-white p-5 shadow-sm">
                  <Icon size={19} className="text-[#bc4937]" />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#bc4937]">{label}</p>
                  <h3 className="mt-1 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#756454]">{copy}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-[#dfc99f] bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-[#eee2cc] px-4 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#bc4937]">Publication queue</p>
                  <h3 className="mt-1 text-lg font-black">Templates and content schedules</h3>
                </div>
                <Megaphone size={20} className="text-[#bc4937]" />
              </div>
              <div className="divide-y divide-[#eee2cc]">
                {publicationQueue.map(([title, scope, channel, status]) => (
                  <div key={title} className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_130px_95px_190px] sm:items-center">
                    <strong className="text-sm">{title}</strong>
                    <span className="text-xs font-semibold text-[#756454]">{scope}</span>
                    <span className="w-fit rounded bg-[#edf8f5] px-2 py-1 text-[10px] font-black uppercase text-[#2d6b5e]">{channel}</span>
                    <span className="text-xs font-semibold text-[#8a5b29]">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-[#172b30] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e8bf68]">Launch checklist</p>
          <h2 className="mt-2 text-3xl font-black">Systems requiring attention before production.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {launchChecks.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-white/15 bg-white/5 p-4">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#e8bf68]" />
                <p className="text-xs font-semibold leading-5 text-[#d8d0c7]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
