import { ArrowRight, Brain, Gamepad2, Heart, Sparkles, TrendingUp, Users } from 'lucide-react';
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
    { icon: Brain, number: '01', title: 'A Gentle First Table', copy: 'Japanese support available. No board game experience needed.' },
    { icon: Heart, number: '02', title: 'No Test, No Pressure', copy: 'Listen first, try short phrases, and build confidence slowly.' },
    { icon: Users, number: '03', title: `${gameCount ?? '...'} Games`, copy: 'A growing collection for relaxed trial tables and deeper sessions.' },
  ];

  return (
    <main className="page-shell relative overflow-hidden">
      <span className="absolute left-[7%] top-40 h-2 w-2 rounded-full bg-[#eaa23e]" />
      <span className="absolute right-[9%] top-72 h-4 w-4 rounded-full bg-[#edaf4c] blur-[1px]" />
      <section className="container-shell flex flex-col items-center pb-9 pt-11 text-center">
        <h1 className="compact-title">The Meeple Sosen Group</h1>
        <Gamepad2 className="mt-5 text-[#e58921]" size={31} />
        <p className="font-display mt-5 text-xl tracking-wide text-[#443d37]">English Through Board Games In Fukuoka</p>
        <p className="mt-6 text-sm font-semibold text-[#c45a25]">A small, friendly table for people who want to speak a little more naturally.</p>
        <div className="mt-4 max-w-xl space-y-4 text-xs leading-6 text-[#675c50]">
          <p>No tests. No pressure. No need to be good at games.</p>
          <p>We use board games to create real reasons to speak: explaining, asking, deciding, laughing, and trying again.</p>
          <p>Start with a supported trial table. When you are ready, the deeper session tools help turn each game into useful English practice.</p>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary px-8 py-3">
            <Sparkles size={13} /> See How It Works <ArrowRight size={13} />
          </button>
          <button onClick={() => onNavigate('games')} className="rounded border border-[#e8a33e] bg-white px-8 py-3 text-xs font-bold uppercase text-[#d06720] shadow-sm hover:bg-[#fff6e6]">
            Browse Games
          </button>
        </div>
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
            <p className="font-display text-base tracking-wide text-[#9c4b22]">A First Table Might Include</p>
            <button onClick={() => onNavigate('board')} className="text-[10px] font-bold text-[#c86123]">See Flow</button>
          </div>
          {['A quick hello and warm-up phrase', 'A simple game with supported turns', 'A short review of words you used'].map((title, index) => (
            <div key={title} className="flex items-center gap-3 border-b border-[#f3e2c2] px-5 py-3 text-xs last:border-0">
              <span className={`pill ${index === 1 ? 'pill-green' : 'pill-blue'}`}>{index === 1 ? 'Play' : 'Support'}</span>
              <span className="font-bold">{title}</span>
            </div>
          ))}
        </article>
        <article className="reference-panel min-h-52">
          <div className="flex items-center justify-between border-b border-[#f1d8a5] px-5 py-3">
            <p className="font-display text-base tracking-wide text-[#9c4b22]">What Happens At The Table</p>
            <span className="text-[10px] font-bold text-[#37ac66]">LIVE</span>
          </div>
          <p className="px-8 py-12 text-center text-xs leading-6 text-[#7b7168]">You choose a game, learn a few useful phrases, play with help, and leave with something you actually said.</p>
        </article>
      </section>
      <section className="reference-panel mx-auto mt-5 max-w-md overflow-hidden">
        <div className="bg-[#e98b18] px-5 py-3 text-white"><TrendingUp className="mr-2 inline" size={14} /> <span className="font-display tracking-wide">A Simple Path</span></div>
        <p className="px-8 py-9 text-center text-xs leading-6 text-[#948878]">Trial table {'->'} beginner table {'->'} regular sessions {'->'} optional conversation challenges.</p>
      </section>
    </main>
  );
}
