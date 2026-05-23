import { CalendarDays, Flag, MessageCircle, Trophy, Users } from 'lucide-react';
import type { Section } from '../App';

const challenges = [
  { title: 'First Trade', game: 'CATAN', level: 'Foundation', xp: 120, brief: 'Propose and complete three fair trades in English.', seats: '3-4 Players', time: '60 min' },
  { title: 'Council of Influence', game: 'Dune: Imperium', level: 'Advanced', xp: 260, brief: 'Build a temporary alliance and present your reasoning.', seats: '3-4 Players', time: '100 min' },
  { title: 'Market Report', game: 'Brass: Birmingham', level: 'Master', xp: 400, brief: 'Summarize your economic engine after the final round.', seats: '2-4 Players', time: '120 min' },
];

export function GuildChallenges({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Guild Challenges / Missions</p>
        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="display-title text-7xl sm:text-8xl">Table Operations</h1>
          <button onClick={() => onNavigate('ranking')} className="rule-button"><Trophy size={15} /> See Ranking</button>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <article key={challenge.title} className="paper-panel flex flex-col p-6">
              <div className="flex justify-between">
                <p className="eyebrow">Mission {String(index + 1).padStart(2, '0')}</p>
                <Flag size={19} className="text-[#cf612d]" />
              </div>
              <h2 className="font-display mt-9 text-4xl tracking-wider">{challenge.title}</h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#cf612d]">{challenge.game} / {challenge.level}</p>
              <p className="mt-6 flex-1 border-y border-[#eadfce] py-5 text-sm leading-6 text-[#665d52]">{challenge.brief}</p>
              <div className="mt-5 space-y-3 text-xs font-bold uppercase tracking-[0.13em] text-[#776d62]">
                <p className="flex items-center gap-2"><Users size={14} />{challenge.seats}</p>
                <p className="flex items-center gap-2"><CalendarDays size={14} />{challenge.time}</p>
                <p className="flex items-center gap-2 text-[#cf612d]"><Trophy size={14} />{challenge.xp} XP Reward</p>
              </div>
              <button className="rule-button mt-6 w-full"><MessageCircle size={15} /> Join Mission</button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
