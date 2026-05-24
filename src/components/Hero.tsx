import { ArrowRight, Brain, Gamepad2, Sparkles, Trophy, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Section } from '../App';
import { getGames } from '../lib/games';

interface HeroProps {
  onNavigate: (section: Section) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [gameCount, setGameCount] = useState<number | null>(null);

  useEffect(() => {
    getGames().then((games) => setGameCount(games.length));
  }, []);

  const benefits = [
    { icon: Brain, number: '01', title: 'Beginners Welcome', copy: 'Japanese support available. No board game experience needed.' },
    { icon: TrendingUp, number: '02', title: 'Useful English', copy: 'Learn phrases through real choices, deals, plans, and table talk.' },
    { icon: Users, number: '03', title: `${gameCount ?? '...'} Games`, copy: 'A growing collection for beginner tables and strategy sessions.' },
  ];

  return (
    <main className="page-shell relative overflow-hidden">
      <span className="absolute left-[7%] top-40 h-2 w-2 rounded-full bg-[#eaa23e]" />
      <span className="absolute right-[9%] top-72 h-4 w-4 rounded-full bg-[#edaf4c] blur-[1px]" />
      <section className="container-shell flex flex-col items-center pb-9 pt-11 text-center">
        <h1 className="compact-title">The Meeple Sosen Group</h1>
        <Gamepad2 className="mt-5 text-[#e58921]" size={31} />
        <p className="font-display mt-5 text-xl tracking-wide text-[#443d37]">Learn English Through Board Games In Fukuoka</p>
        <p className="mt-6 text-sm font-semibold text-[#c45a25]">Beginners welcome. Japanese support available. Come for one trial table.</p>
        <div className="mt-4 max-w-xl space-y-4 text-xs leading-6 text-[#675c50]">
          <p>We gather around real board games so English appears naturally: explaining a move, asking a question, making a plan, and laughing when the table changes.</p>
          <p>The first path is simple: pick a game, learn useful phrases, play with support, then review what you used.</p>
          <p>Advanced members can enter Mission Control for structured challenges, rankings, and deeper strategy work.</p>
        </div>
        <button onClick={() => onNavigate('games')} className="rule-button rule-button-primary mt-7 px-8 py-3">
          <Sparkles size={13} /> See How It Works <ArrowRight size={13} />
        </button>
      </section>

      <section className="container-shell grid gap-4 md:grid-cols-3">
        {benefits.map(({ icon: Icon, number, title, copy }) => (
          <article key={number} className="reference-panel relative p-6">
            <Icon className="text-[#d56821]" size={28} />
            <span className="font-display absolute right-5 top-4 text-4xl text-[#f3d28b]">{number}</span>
            <h2 className="font-display mt-6 text-lg tracking-wide">{title}</h2>
            <p className="mt-2 text-xs text-[#655c52]">{copy}</p>
          </article>
        ))}
      </section>

      <section className="container-shell mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
        <article className="reference-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#f1d8a5] px-5 py-3">
            <p className="font-display text-base tracking-wide text-[#9c4b22]">Recommended For You</p>
            <button onClick={() => onNavigate('games')} className="text-[10px] font-bold text-[#c86123]">View All</button>
          </div>
          {['The Coal Crisis Negotiation', 'The Catan Diplomatic Alliance', 'The Pandemic Emergency Brief'].map((title, index) => (
            <div key={title} className="flex items-center gap-3 border-b border-[#f3e2c2] px-5 py-3 text-xs last:border-0">
              <span className={`pill ${index === 1 ? 'pill-green' : 'pill-blue'}`}>{index === 1 ? 'Foundation' : 'Intermediate'}</span>
              <span className="font-bold">{title}</span>
            </div>
          ))}
        </article>
        <article className="reference-panel min-h-52">
          <div className="flex items-center justify-between border-b border-[#f1d8a5] px-5 py-3">
            <p className="font-display text-base tracking-wide text-[#9c4b22]">Recent Guild Activity</p>
            <span className="text-[10px] font-bold text-[#37ac66]">● LIVE</span>
          </div>
          <p className="py-16 text-center text-xs text-[#9b9389]">No activity yet. Be the first to complete a challenge!</p>
        </article>
      </section>
      <section className="reference-panel mx-auto mt-5 max-w-md overflow-hidden">
        <div className="bg-[#e98b18] px-5 py-3 text-white"><Trophy className="mr-2 inline" size={14} /> <span className="font-display tracking-wide">Guild Leaderboard</span></div>
        <p className="py-9 text-center text-xs text-[#948878]">No data yet</p>
      </section>
    </main>
  );
}
