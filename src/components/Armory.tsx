import { Clock, Target, Users } from 'lucide-react';

type ArmoryGame = {
  title: string;
  level: string;
  players: string;
  duration: number;
  mechanics: string[];
  focus: string[];
  difficulty: string;
  featured?: boolean;
};

const games: ArmoryGame[] = [
  { title: 'Carcassonne', level: 'Foundation', players: '2-5', duration: 45, difficulty: 'Moderate', mechanics: ['Tile Placement', 'Area Control'], focus: ['Language Focus', 'Tactical Communication'] },
  { title: 'Modern Art', level: 'Intermediate', players: '3-5', duration: 45, difficulty: 'Expert', mechanics: ['Auction', 'Set Collection'], focus: ['Negotiation'] },
  { title: 'High Society', level: 'Intermediate', players: '3-5', duration: 30, difficulty: 'Moderate', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Language Focus', 'Tactical Communication'] },
  { title: 'Airlines Europe', level: 'Intermediate', players: '2-5', duration: 75, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Negotiation'] },
  { title: 'Smartphone Inc.', level: 'Intermediate', players: '1-5', duration: 90, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Business Terminology'], featured: true },
  { title: 'Brass: Birmingham', level: 'Advanced', players: '2-4', duration: 120, difficulty: 'Heavy', mechanics: ['Network Building', 'Economic Management'], focus: ['Strategic Planning'] },
  { title: 'Power Grid', level: 'Advanced', players: '2-6', duration: 120, difficulty: 'Expert', mechanics: ['Network Building', 'Economic Management'], focus: ['Strategic Planning'] },
  { title: 'RA', level: 'Advanced', players: '2-5', duration: 60, difficulty: 'Expert', mechanics: ['Auction', 'Set Collection'], focus: ['Tactical Communication'] },
  { title: 'La Granja', level: 'Advanced', players: '1-4', duration: 120, difficulty: 'Heavy', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Strategic Planning'] },
  { title: 'Acquire', level: 'Advanced', players: '2-6', duration: 90, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Tactical Communication'] },
  { title: 'Terraforming Mars', level: 'Master', players: '1-5', duration: 120, difficulty: 'Expert', mechanics: ['Economic Simulation', 'Resource Management'], focus: ['Strategic Planning'] },
  { title: 'Great Western Trail', level: 'Master', players: '2-4', duration: 150, difficulty: 'Heavy', mechanics: ['Economic Simulation', 'Strategy'], focus: ['Strategic Planning'] },
];

const sectionMeta: Record<string, { note: string; color: string }> = {
  Foundation: { note: 'Begin your strategic journey', color: 'border-[#b7c6d7] bg-white' },
  Intermediate: { note: 'Develop tactical precision', color: 'border-[#37d177] bg-[#37d177]' },
  Advanced: { note: 'Master economic simulation', color: 'border-[#efbd3d] bg-[#efbd3d]' },
  Master: { note: 'Command complex ecosystems', color: 'border-[#ef3232] bg-[#ef3232]' },
};

export function Armory() {
  return (
    <main className="page-shell">
      <div className="container-shell py-10">
        <header className="text-center">
          <h1 className="compact-title">The Armory</h1>
          <p className="mt-4 text-sm text-[#746b60]">Elite strategic simulations. From foundational tactics to master-level economic warfare.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['All Tiers', 'Foundation', 'Intermediate', 'Advanced', 'Master'].map((label, index) => (
              <span key={label} className={`rounded border border-[#ebba63] px-5 py-2 text-[10px] font-bold uppercase ${index === 0 ? 'bg-[#ed941d] text-white' : 'bg-white text-[#665d52]'}`}>{label}</span>
            ))}
          </div>
        </header>
        {Object.keys(sectionMeta).map((level) => (
          <section key={level} className="mt-10">
            <div className="mb-4 flex items-center gap-3 border-l border-[#e8a744] pl-4">
              <span className={`h-5 w-5 rounded-full border ${sectionMeta[level].color}`} />
              <div>
                <h2 className="font-display text-2xl tracking-wide">{level}</h2>
                <p className="text-[11px] text-[#81766b]">{sectionMeta[level].note}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {games.filter((game) => game.level === level).map((game) => (
                <article key={game.title} className="tactical-card overflow-hidden">
                  {game.featured && <div className="flex h-28 items-center justify-center bg-gradient-to-b from-[#242938] to-[#edf0f4] font-display text-4xl text-[#e9a140]">Smartphone Inc.</div>}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-lg tracking-wide">{game.title}</h3>
                      <span className="pill pill-blue">Strategy</span>
                    </div>
                    <p className="mt-3 text-[11px] leading-5 text-[#766d62]">A strategic strategy game emphasizing negotiation and economic decision-making.</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Users className="mx-auto mb-1 text-[#e38a1b]" size={13} />{game.players}<br />PLAYERS</span>
                      <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Clock className="mx-auto mb-1 text-[#448ce1]" size={13} />{game.duration}m<br />DURATION</span>
                      <span className="rounded border border-[#f1d38d] p-3 text-center text-[10px]"><Target className="mx-auto mb-1 text-[#7a7064]" size={13} />{game.difficulty}<br />DIFFICULTY</span>
                    </div>
                    <p className="mt-4 text-[10px] text-[#756b60]">⚄ Core Mechanics</p>
                    <div className="mt-1 flex flex-wrap gap-1">{game.mechanics.map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div>
                    <p className="mt-2 text-[10px] text-[#756b60]">◇ Language Focus</p>
                    <div className="mt-1 flex flex-wrap gap-1">{game.focus.map((tag) => <span className="pill pill-green" key={tag}>{tag}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
