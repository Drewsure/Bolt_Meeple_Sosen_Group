import { ArrowRight, Brain, Swords, Users, Zap } from 'lucide-react';
import type { Section } from '../App';

const pillars = [
  { icon: Brain, title: 'Cognitive Depth', body: 'Euro-game mechanics demand strategic thinking that mirrors real negotiation.' },
  { icon: Swords, title: 'Linguistic Deployment', body: 'Every English phrase spoken influences your victory condition.' },
  { icon: Zap, title: 'Strategic Stakes', body: 'Win through precision. Lose through hesitation. The game demands execution.' },
  { icon: Users, title: 'Elite Community', body: 'Compete with fellow strategists. Rise through the ranks. Join the Guild.' },
];

export function SituationRoom({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <main className="page-shell">
      <header className="tactical-banner py-9 text-center">
        <h1 className="compact-title">The Situation Room</h1>
        <p className="font-display mt-3 text-sm tracking-wider text-[#b35622]">Welcome to the Sosen Command Center</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-10">
        <div className="reference-panel p-7 text-sm leading-7 text-[#5e554b]">
          You are not here to take a class. You are here to command a strategic ecosystem where English becomes your competitive weapon.
        </div>
        <section>
          <h2 className="font-display text-2xl text-[#f07067]">The Problem: “Thin Soup”</h2>
          <div className="mt-3 rounded-lg border border-[#ffb9bf] bg-white/70 p-6 text-sm leading-7 text-[#5e554b]">
            <p>Traditional English schools treat language learning like filling a soup bowl: diluted, without stakes, disconnected from real-world application.</p>
            <p className="mt-3 font-semibold text-[#c75d25]">Are you tired of the thin soup?</p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl text-[#35bd78]">The Solution: “Sosen” (創戦)</h2>
          <div className="mt-3 rounded-lg border border-[#8cdeb3] bg-white/70 p-6 text-sm leading-7 text-[#5e554b]">
            <p>Strategic Creation. We combine the world’s most sophisticated board games with a high-level English curriculum designed for strategists.</p>
            <p className="mt-3 font-semibold text-[#c75d25]">Your victory has weight. Your words have power.</p>
          </div>
        </section>
        <h2 className="pt-2 text-center font-display text-2xl text-[#bd5823]">The Pillars of Mastery</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }, index) => (
            <article key={title} className={`rounded-lg border bg-white/70 p-5 ${['border-[#d1b8fd]', 'border-[#a9d3fc]', 'border-[#ffb9bf]', 'border-[#9de1bc]'][index]}`}>
              <Icon size={24} className={['text-[#814be8]', 'text-[#3987ed]', 'text-[#ef4d56]', 'text-[#20a461]'][index]} />
              <h3 className="font-display mt-4 text-lg tracking-wide">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#655c52]">{body}</p>
            </article>
          ))}
        </div>
        <div className="rounded-lg border border-[#f2a51b] bg-[#fff8e6] p-8 text-center">
          <h2 className="font-display text-2xl">Ready To Author Your Victory?</h2>
          <p className="mt-2 text-xs text-[#766b60]">Initialize your simulation. Join the Guild. Command your strategic future.</p>
          <button onClick={() => onNavigate('challenges')} className="rule-button rule-button-primary mt-6">Initialize Simulation <ArrowRight size={13} /></button>
        </div>
      </div>
    </main>
  );
}
