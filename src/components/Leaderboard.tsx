import { Target, Trophy, Zap } from 'lucide-react';
import type { Section } from '../App';

export function Leaderboard(_props: { onNavigate: (section: Section) => void }) {
  return (
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <h1 className="compact-title">Global Leaderboard</h1>
        <p className="mt-4 text-xs text-[#71685d]">Compete anonymously. Rise through the ranks. Dominate the Guild.</p>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-9">
        <div className="grid gap-4 sm:grid-cols-3">
          {[{ icon: Trophy, label: 'Total XP', color: 'text-[#e88d15] border-[#efc779]' }, { icon: Zap, label: 'Victories', color: 'text-[#27b764] border-[#aae4c1]' }, { icon: Target, label: 'Deployment', color: 'text-[#407fe7] border-[#accefc]' }].map(({ icon: Icon, label, color }) => (
            <article key={label} className={`rounded-lg border bg-white/80 p-7 text-center ${color.split(' ')[1]}`}><Icon className={`mx-auto ${color.split(' ')[0]}`} /><p className="font-display mt-4 text-lg">{label}</p><span className="text-xl">–</span></article>
          ))}
        </div>
        <section className="reference-panel mt-8 overflow-hidden">
          <div className="grid grid-cols-5 bg-[#f9e4c8] px-5 py-3 font-display text-xs text-[#ab531c]"><span>Rank</span><span>Agent</span><span>XP</span><span>Wins</span><span>Games</span></div>
          <div className="flex min-h-52 flex-col items-center justify-center text-center">
            <Trophy className="text-[#ecaf38]" size={40} />
            <h2 className="font-display mt-4 text-lg">The Leaderboard Is Being Populated.</h2>
            <p className="mt-2 text-xs text-[#84796e]">Be the first to join the Guild.</p>
          </div>
        </section>
        <section className="mt-8 rounded-lg border border-[#edb444] bg-[#fff2cb] p-8 text-center">
          <h2 className="font-display text-2xl">Rise To The Top</h2>
          <p className="mt-3 text-xs text-[#766a5d]">Play games, earn victories, and become a leader in the Guild.</p>
          <div className="mt-5 flex justify-center gap-2 text-[10px]"><span className="rounded border border-[#edba55] p-2">Game Played<br /><b>+10 XP</b></span><span className="rounded border border-[#9ce1ba] p-2">Victory<br /><b>+50 XP</b></span><span className="rounded border border-[#c2aff8] p-2">Master Level<br /><b>+100 XP</b></span></div>
        </section>
      </div>
    </main>
  );
}
