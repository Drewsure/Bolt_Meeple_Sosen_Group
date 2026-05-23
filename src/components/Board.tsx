import { Award, Database, Shield, Target, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Section } from '../App';
import { getGames } from '../lib/games';

const commands: Array<{ icon: typeof Database; label: string; copy: string; section: Section }> = [
  { icon: Database, label: 'Game Database', copy: 'Browse the complete collection and find a mission-ready title.', section: 'games' },
  { icon: Shield, label: 'Guild Challenges', copy: 'Select a scenario and prepare an English strategy briefing.', section: 'challenges' },
  { icon: Trophy, label: 'Leaderboard', copy: 'Track the ranking table as the first missions are recorded.', section: 'ranking' },
  { icon: Award, label: 'Profile Badges', copy: 'Review progress, ranks, and strategic domain achievements.', section: 'profile' },
];

export function Board({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [gameCount, setGameCount] = useState<number | null>(null);

  useEffect(() => {
    getGames().then((games) => setGameCount(games.length));
  }, []);

  const operationStats: Array<[string, string, typeof Database]> = [
    ['Available Titles', gameCount?.toString() ?? '...', Database],
    ['Active Challenges', '5', Shield],
    ['Recorded Rankings', '0', Target],
  ];

  return (
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <h1 className="compact-title">Command Board</h1>
        <p className="mt-4 text-xs text-[#71685d]">Plan the next mission. Deploy language through strategy.</p>
      </header>
      <div className="container-shell py-10">
        <section className="grid gap-4 sm:grid-cols-3">
          {operationStats.map(([label, value, Icon]) => (
            <article key={String(label)} className="reference-panel p-6 text-center">
              <Icon className="mx-auto text-[#d56d22]" size={25} />
              <p className="font-display mt-3 text-4xl text-[#d06122]">{value}</p>
              <p className="mt-2 text-xs text-[#776d62]">{label}</p>
            </article>
          ))}
        </section>
        <h2 className="compact-title mt-12 text-center text-3xl">Operations</h2>
        <section className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-2">
          {commands.map(({ icon: Icon, label, copy, section }) => (
            <button key={label} onClick={() => onNavigate(section)} className="reference-panel flex gap-4 p-6 text-left transition-transform hover:-translate-y-0.5">
              <Icon className="shrink-0 text-[#dc791d]" size={27} />
              <span>
                <span className="block font-display text-xl tracking-wide text-[#4c4036]">{label}</span>
                <span className="mt-2 block text-xs leading-5 text-[#70665b]">{copy}</span>
              </span>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
