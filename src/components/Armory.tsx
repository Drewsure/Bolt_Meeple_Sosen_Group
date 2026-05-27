import { BookOpen, Clock, Crosshair, RotateCcw, Target, Trophy, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames } from '../lib/games';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import type { Game } from '../types/database';

type ArmoryLevel = 'Foundation' | 'Intermediate' | 'Advanced' | 'Master';

type ArmoryGame = {
  title: string;
  level: ArmoryLevel;
  players: string;
  duration: number;
  mechanics: string[];
  focus: string[];
  difficulty: string;
  mission: string;
  missionStatement: string;
  fieldUse: string;
  featured?: boolean;
};

const games: ArmoryGame[] = [
  { title: 'Carcassonne', level: 'Foundation', players: '2-5', duration: 45, difficulty: 'Moderate', mechanics: ['Tile Placement', 'Area Control'], focus: ['Language Focus', 'Tactical Communication'], mission: 'Build a shared map and explain why each claim matters.', missionStatement: 'Command a medieval survey team. Your mission is to claim roads, cities, farms, and monasteries while explaining territory choices in clear tactical English.', fieldUse: 'Excellent first tactical table for spatial language and polite challenge phrases.' },
  { title: 'Modern Art', level: 'Intermediate', players: '3-5', duration: 45, difficulty: 'Expert', mechanics: ['Auction', 'Set Collection'], focus: ['Negotiation'], mission: 'Read the table, price the market, and justify every bid.', missionStatement: 'Enter the auction house as a market strategist. Your mission is to shape demand, defend prices, and persuade rivals that your valuation is the one to follow.', fieldUse: 'Sharp practice for auction language, persuasion, and confidence under time pressure.' },
  { title: 'High Society', level: 'Intermediate', players: '3-5', duration: 30, difficulty: 'Moderate', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Language Focus', 'Tactical Communication'], mission: 'Chase prestige without becoming the poorest player.', missionStatement: 'Operate inside a prestige economy. Your mission is to win status symbols, avoid financial collapse, and explain when restraint is more powerful than spending.', fieldUse: 'Good for status language, comparisons, and explaining risk in short turns.' },
  { title: 'Airlines Europe', level: 'Intermediate', players: '2-5', duration: 75, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Negotiation'], mission: 'Invest in routes and airline shares before the table sees the value.', missionStatement: 'Take command of a European aviation portfolio. Your mission is to expand routes, read shareholder incentives, and present investment logic before competitors react.', fieldUse: 'Useful for business English around growth, timing, investment, and leverage.' },
  { title: 'Smartphone Inc.', level: 'Intermediate', players: '1-5', duration: 90, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Business Terminology'], mission: 'Launch products, set prices, and dominate regions through tech strategy.', missionStatement: 'Lead a global technology firm. Your mission is to set price, upgrade features, enter markets, and explain product strategy like an executive briefing.', fieldUse: 'A strong business-English simulation for market positioning and product language.', featured: true },
  { title: 'Brass: Birmingham', level: 'Advanced', players: '2-4', duration: 120, difficulty: 'Heavy', mechanics: ['Network Building', 'Economic Management'], focus: ['Strategic Planning'], mission: 'Coordinate industry, transport, beer, coal, and timing across two eras.', missionStatement: 'Direct an industrial network through canal and rail eras. Your mission is to coordinate coal, iron, beer, factories, and timing while explaining every dependency.', fieldUse: 'Advanced practice for explaining dependencies, bottlenecks, and long-term plans.' },
  { title: 'Power Grid', level: 'Advanced', players: '2-6', duration: 120, difficulty: 'Expert', mechanics: ['Network Building', 'Economic Management'], focus: ['Strategic Planning'], mission: 'Bid for power plants and manage fuel before expanding your network.', missionStatement: 'Run a national energy operation. Your mission is to win auctions, forecast fuel pressure, expand the grid, and justify infrastructure decisions under scarcity.', fieldUse: 'Ideal for auction language, resource forecasting, and economic cause-effect talk.' },
  { title: 'RA', level: 'Advanced', players: '2-5', duration: 60, difficulty: 'Expert', mechanics: ['Auction', 'Set Collection'], focus: ['Tactical Communication'], mission: 'Control when auctions happen and decide which risks are worth the sun discs.', missionStatement: 'Stand before the dynasties of ancient Egypt. Your mission is to time auctions, weigh disasters against monuments, and explain risk with disciplined brevity.', fieldUse: 'Great for probability language, brinkmanship, and concise strategic justification.' },
  { title: 'La Granja', level: 'Advanced', players: '1-4', duration: 120, difficulty: 'Heavy', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Strategic Planning'], mission: 'Turn multi-use cards into a farm engine that delivers at the right moment.', missionStatement: 'Manage a Mallorcan farm under delivery pressure. Your mission is to convert flexible cards into production, market access, and well-timed village influence.', fieldUse: 'Useful for sequencing language, planning explanations, and trade-off vocabulary.' },
  { title: 'Acquire', level: 'Advanced', players: '2-6', duration: 90, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Tactical Communication'], mission: 'Trigger mergers, hold shares, and explain why the market is about to move.', missionStatement: 'Operate as a corporate raider in a hotel merger market. Your mission is to buy shares, provoke mergers, and defend predictions with financial English.', fieldUse: 'Excellent for finance vocabulary, prediction, and negotiation over visible incentives.' },
  { title: 'Terraforming Mars', level: 'Master', players: '1-5', duration: 120, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Resource Management'], focus: ['Strategic Planning'], mission: 'Use corporate projects to raise oceans, oxygen, heat, cities, and forests.', missionStatement: 'Represent a corporation shaping a planet. Your mission is to convert projects into oceans, heat, oxygen, cities, and forests while pitching a long-range strategy.', fieldUse: 'Master-level language for scientific plans, project pitches, and multi-step strategy.' },
  { title: 'Great Western Trail', level: 'Master', players: '2-4', duration: 150, difficulty: 'Heavy', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Strategic Planning'], mission: 'Drive cattle, improve your deck, hire workers, and deliver through the rail network.', missionStatement: 'Lead a cattle operation across the western trail. Your mission is to improve the herd, hire specialists, manage route tempo, and explain opportunity cost.', fieldUse: 'Deep practice for route planning, opportunity cost, and layered decision explanation.' },
];

const sectionMeta: Record<ArmoryLevel, { note: string; color: string; doctrine: string }> = {
  Foundation: { note: 'Begin your strategic journey', color: 'border-[#b7c6d7] bg-white', doctrine: 'Clear rules, visible choices, and fast table talk.' },
  Intermediate: { note: 'Develop tactical precision', color: 'border-[#37d177] bg-[#37d177]', doctrine: 'Negotiation, timing, and flexible business language.' },
  Advanced: { note: 'Master economic simulation', color: 'border-[#efbd3d] bg-[#efbd3d]', doctrine: 'Systems thinking, resource pressure, and strategic explanation.' },
  Master: { note: 'Command complex ecosystems', color: 'border-[#ef3232] bg-[#ef3232]', doctrine: 'Long-form planning, layered causality, and executive-level English.' },
};

const tiers: Array<'All Tiers' | ArmoryLevel> = ['All Tiers', 'Foundation', 'Intermediate', 'Advanced', 'Master'];

export function Armory() {
  const [catalogue, setCatalogue] = useState<Game[]>([]);
  const [activeTier, setActiveTier] = useState<'All Tiers' | ArmoryLevel>('All Tiers');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = () => {
      getGames().then(setCatalogue);
    };
    loadGames();
    return subscribeToPreviewGameUpdates(loadGames);
  }, []);

  const catalogueByTitle = useMemo(
    () => new Map(catalogue.map((game) => [game.title.toLowerCase(), game])),
    [catalogue],
  );

  const visibleLevels = useMemo(
    () => activeTier === 'All Tiers' ? Object.keys(sectionMeta) as ArmoryLevel[] : [activeTier],
    [activeTier],
  );

  const visibleGames = useMemo(
    () => games.filter((game) => activeTier === 'All Tiers' || game.level === activeTier),
    [activeTier],
  );

  const selectedArmoryGame = selectedTitle ? games.find((game) => game.title === selectedTitle) ?? null : null;
  const selectedCatalogueGame = selectedArmoryGame ? catalogueByTitle.get(selectedArmoryGame.title.toLowerCase()) ?? null : null;

  return (
    <main className="page-shell">
      <div className="container-shell py-10">
        <header className="text-center">
          <h1 className="compact-title">The Armory</h1>
          <p className="mt-4 text-sm text-[#746b60]">Elite strategic simulations. From foundational tactics to master-level economic warfare.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Armory tier filters">
            {tiers.map((label) => {
              const selected = activeTier === label;
              const count = label === 'All Tiers' ? games.length : games.filter((game) => game.level === label).length;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTier(label)}
                  className={`rounded border border-[#ebba63] px-5 py-2 text-[10px] font-bold uppercase transition ${selected ? 'bg-[#ed941d] text-white shadow-md' : 'bg-white text-[#665d52] hover:bg-[#fff4dc]'}`}
                  aria-pressed={selected}
                >
                  {label} <span className="ml-1 opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        </header>

        <section className="reference-panel mt-8 overflow-hidden">
          <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
            <p className="eyebrow">What “Give It A Mission” Means</p>
            <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">Turn A Game Into An English Job</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b5f54]">A mission is not extra story text. It is a clear speaking job attached to the game situation.</p>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#efd39d] bg-white p-4 text-center">
              <p className="font-display text-2xl text-[#d06122]">1</p>
              <h3 className="font-display mt-2 text-lg tracking-wide">Game Situation</h3>
              <p className="mt-1 text-xs leading-5 text-[#70665b]">What is happening on the board? A shortage, race, trade, alliance, auction, or crisis.</p>
            </div>
            <div className="rounded-xl border border-[#efd39d] bg-white p-4 text-center">
              <p className="font-display text-2xl text-[#d06122]">2</p>
              <h3 className="font-display mt-2 text-lg tracking-wide">English Action</h3>
              <p className="mt-1 text-xs leading-5 text-[#70665b]">What must the player say? Explain, negotiate, persuade, compare, predict, or summarize.</p>
            </div>
            <div className="rounded-xl border border-[#efd39d] bg-white p-4 text-center">
              <p className="font-display text-2xl text-[#d06122]">3</p>
              <h3 className="font-display mt-2 text-lg tracking-wide">Visible Output</h3>
              <p className="mt-1 text-xs leading-5 text-[#70665b]">What is produced? A short briefing, deal proposal, warning, pitch, or after-action report.</p>
            </div>
          </div>
          <div className="mx-5 mb-5 rounded-xl border border-[#efc978] bg-[#fff9e9] p-4 text-sm leading-6 text-[#6b5f54]">
            <strong className="font-display text-lg tracking-wide text-[#3d332b]">Example:</strong> In Brass: Birmingham, coal is short. The English job is: “Explain the supply problem and propose a deal.” The output is a 30-second negotiation pitch.
          </div>
        </section>

        <section className="reference-panel mt-8 grid gap-4 p-5 md:grid-cols-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#a36b2c]">Active Tier</p>
            <p className="font-display mt-1 text-2xl tracking-wide text-[#3d332b]">{activeTier}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#a36b2c]">Visible Simulations</p>
            <p className="font-display mt-1 text-2xl tracking-wide text-[#3d332b]">{visibleGames.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#a36b2c]">Image Coverage</p>
            <p className="font-display mt-1 text-2xl tracking-wide text-[#3d332b]">{visibleGames.filter((game) => catalogueByTitle.get(game.title.toLowerCase())?.cover_image_url).length}/{visibleGames.length}</p>
          </div>
          <div className="flex items-center md:justify-end">
            <button type="button" onClick={() => setActiveTier('All Tiers')} disabled={activeTier === 'All Tiers'} className="inline-flex items-center gap-2 rounded border border-[#ebba63] bg-white px-4 py-3 text-[11px] font-bold uppercase text-[#b85d1f] disabled:cursor-default disabled:opacity-40">
              <RotateCcw size={13} /> Reset Tiers
            </button>
          </div>
        </section>

        {visibleLevels.map((level) => {
          const levelGames = games.filter((game) => game.level === level);
          return (
            <section key={level} className="mt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-l border-[#e8a744] pl-4">
                <div className="flex items-center gap-3">
                  <span className={`h-5 w-5 rounded-full border ${sectionMeta[level].color}`} />
                  <div>
                    <h2 className="font-display text-2xl tracking-wide">{level}</h2>
                    <p className="text-[11px] text-[#81766b]">{sectionMeta[level].note}</p>
                  </div>
                </div>
                <p className="max-w-md text-right text-xs leading-5 text-[#766d62]">{sectionMeta[level].doctrine}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {levelGames.map((game) => {
                  const catalogueGame = catalogueByTitle.get(game.title.toLowerCase());
                  return (
                    <button key={game.title} type="button" onClick={() => setSelectedTitle(game.title)} className="tactical-card overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#e28a24]">
                      <div className="relative h-40 bg-gradient-to-b from-[#242938] to-[#edf0f4]">
                        {catalogueGame?.cover_image_url ? (
                          <img src={catalogueGame.cover_image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center px-5 text-center font-display text-4xl text-[#e9a140]">{game.title}</div>
                        )}
                        {game.featured && <span className="absolute right-3 top-3 rounded-full bg-[#ee941e] px-3 py-1 text-[10px] font-bold uppercase text-white">Field</span>}
                        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-[#a75b1d]">{game.level}</span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-display text-xl tracking-wide">{game.title}</h3>
                          <span className="pill pill-blue">Strategy</span>
                        </div>
                        <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-[#766d62]">{catalogueGame ? buildGameBrief(catalogueGame) : 'A strategic simulation emphasizing negotiation, planning, and confident English table talk.'}</p>
                        <div className="mt-3 rounded border border-[#efd08e] bg-[#fff9e9] p-3 text-[10px] leading-5 text-[#5f554c]">
                          <p className="font-bold uppercase tracking-wide text-[#bf5b24]"><Crosshair className="mr-1 inline text-[#dc7c20]" size={11} />Mission Statement</p>
                          <p className="mt-1">{game.missionStatement}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Users className="mx-auto mb-1 text-[#e38a1b]" size={13} />{game.players}<br />PLAYERS</span>
                          <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Clock className="mx-auto mb-1 text-[#448ce1]" size={13} />{game.duration}m<br />DURATION</span>
                          <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Target className="mx-auto mb-1 text-[#7a7064]" size={13} />{game.difficulty}<br />DIFFICULTY</span>
                        </div>
                        <p className="mt-4 text-[10px] text-[#756b60]">Core Mechanics</p>
                        <div className="mt-1 flex flex-wrap gap-1">{game.mechanics.map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div>
                        <p className="mt-2 text-[10px] text-[#756b60]">Language Focus</p>
                        <div className="mt-1 flex flex-wrap gap-1">{game.focus.map((tag) => <span className="pill pill-green" key={tag}>{tag}</span>)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {selectedArmoryGame && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2b2119]/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="armory-detail-title">
          <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#e7bd70] bg-[#fffdf8] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#efd49d] bg-[#fff4df] px-6 py-5">
              <div>
                <p className="eyebrow">Armory Field Dossier</p>
                <h2 id="armory-detail-title" className="font-display mt-2 text-4xl tracking-wide text-[#bf5b24]">{selectedArmoryGame.title}</h2>
                <p className="mt-1 text-sm text-[#7b7065]">{selectedArmoryGame.level} simulation - {selectedArmoryGame.difficulty} difficulty</p>
              </div>
              <button type="button" onClick={() => setSelectedTitle(null)} className="rounded-full border border-[#e5bb73] bg-white p-2 text-[#af5b24]" aria-label="Close Armory detail">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
              <div>
                <div className="overflow-hidden rounded-xl border border-[#ecd29d] bg-[#fff0ce]">
                  {selectedCatalogueGame?.cover_image_url ? (
                    <img src={selectedCatalogueGame.cover_image_url} alt="" className="h-80 w-full object-cover" />
                  ) : (
                    <div className="flex h-80 items-center justify-center px-5 text-center font-display text-5xl tracking-wide text-[#ae6d3f]">{selectedArmoryGame.title}</div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Users className="mx-auto text-[#dd8424]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedArmoryGame.players}</p></div>
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Clock className="mx-auto text-[#4b86d9]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedArmoryGame.duration}m</p></div>
                  <div className="rounded border border-[#efd49d] bg-white p-3"><Trophy className="mx-auto text-[#d06a2c]" size={17} /><p className="mt-1 text-xs text-[#776b60]">{selectedCatalogueGame?.bgg_rank ? `#${selectedCatalogueGame.bgg_rank}` : 'Rank --'}</p></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#efd49d] bg-white p-5">
                  <h3 className="flex items-center gap-2 font-display text-2xl tracking-wide text-[#3d332b]"><BookOpen size={18} className="text-[#d06a2c]" /> Strategic Brief</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f655a]">{selectedCatalogueGame ? buildGameBrief(selectedCatalogueGame) : selectedArmoryGame.fieldUse}</p>
                </div>
                <div className="rounded-xl border border-[#efd49d] bg-[#fff9e9] p-5">
                  <h3 className="font-display text-xl tracking-wide text-[#3d332b]">Mission Statement</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f655a]">{selectedArmoryGame.missionStatement}</p>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-[#9b7652]">Operational Objective</p>
                  <p className="mt-1 text-sm leading-7 text-[#6f655a]">{selectedArmoryGame.mission}</p>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-[#9b7652]">Classroom Use</p>
                  <p className="mt-3 text-sm leading-7 text-[#6f655a]">{selectedArmoryGame.fieldUse}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded border border-[#efd49d] bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7652]">Core Mechanics</p>
                    <div className="mt-2 flex flex-wrap gap-1">{selectedArmoryGame.mechanics.map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className="rounded border border-[#efd49d] bg-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#9b7652]">Language Focus</p>
                    <div className="mt-2 flex flex-wrap gap-1">{selectedArmoryGame.focus.map((tag) => <span className="pill pill-green" key={tag}>{tag}</span>)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
