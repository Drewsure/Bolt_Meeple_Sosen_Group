import { Clock, Layers3, Users } from 'lucide-react';

const tracks = [
  { level: 'Foundation', title: 'Welcome Table', games: 'Ticket to Ride / Cascadia', focus: 'Introductions, route planning and clear turns', time: '45-60 min', players: '2-5' },
  { level: 'Intermediate', title: 'Market Table', games: 'Acquire / 7 Wonders', focus: 'Trading, bidding and comparison language', time: '60-90 min', players: '3-6' },
  { level: 'Advanced', title: 'Council Table', games: 'Dune: Imperium / Root', focus: 'Influence, persuasion and conditional deals', time: '90-120 min', players: '3-5' },
  { level: 'Master', title: 'Founder Table', games: 'Brass: Birmingham', focus: 'Economic argument and strategic presentation', time: '120 min', players: '2-4' },
];

export function Armory() {
  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Armory / Curriculum</p>
        <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h1 className="display-title text-7xl sm:text-8xl">Choose Your Table</h1>
          <p className="max-w-sm text-sm leading-6 text-[#665d52]">Four designed progression tracks pair language goals with playable tactical depth.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {tracks.map((track, index) => (
            <article key={track.level} className="paper-panel p-7">
              <div className="flex justify-between">
                <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {track.level}</p>
                <Layers3 className="text-[#cf612d]" size={20} />
              </div>
              <h2 className="font-display mt-8 text-4xl tracking-wider text-[#2d2923]">{track.title}</h2>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#cf612d]">{track.games}</p>
              <p className="mt-5 border-t border-[#e8dccd] pt-5 text-sm leading-6 text-[#665d52]">{track.focus}</p>
              <div className="mt-6 flex gap-6 text-xs font-bold uppercase tracking-[0.12em] text-[#776d62]">
                <span className="flex items-center gap-2"><Clock size={14} />{track.time}</span>
                <span className="flex items-center gap-2"><Users size={14} />{track.players}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
