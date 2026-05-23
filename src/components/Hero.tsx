import { ArrowRight, BookOpen, Crown, Database, Swords, Trophy } from 'lucide-react';
import type { Section } from '../App';

interface HeroProps {
  onNavigate: (section: Section) => void;
}

const briefs = [
  { label: 'Active Catalogue', value: '549', detail: 'BGG records prepared' },
  { label: 'Training Routes', value: '04', detail: 'Foundation to Master' },
  { label: 'Open Challenges', value: '03', detail: 'Guild operations' },
];

export function Hero({ onNavigate }: HeroProps) {
  return (
    <main className="page-shell">
      <section className="container-shell grid gap-8 pt-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="border-l-2 border-[#cf612d] py-7 pl-6 md:pl-10">
          <p className="eyebrow mb-5">Board Dashboard / Season 01</p>
          <h1 className="display-title text-7xl sm:text-8xl lg:text-[7.6rem]">
            Play Well.
            <br />
            Speak Boldly.
          </h1>
          <p className="font-editorial mt-7 max-w-xl text-xl leading-relaxed text-[#5a5046]">
            Strategic board games become a living English laboratory: negotiate, calculate,
            persuade and build your guild record one table at a time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('games')} className="rule-button rule-button-primary">
              Explore Games <ArrowRight size={15} />
            </button>
            <button onClick={() => onNavigate('challenges')} className="rule-button">
              Enter Challenge
            </button>
          </div>
        </div>

        <div className="paper-panel relative overflow-hidden p-5 md:p-7">
          <div className="absolute right-0 top-0 h-24 w-24 bg-[#cf612d]" />
          <p className="line-label mb-6">Command Board / Live Preview</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="border border-[#dccfbe] bg-[#f7efe2] p-5 sm:col-span-2">
              <Swords className="mb-6 text-[#cf612d]" size={31} strokeWidth={1.4} />
              <p className="font-display text-4xl tracking-wider text-[#2d2923]">Founder's Table</p>
              <p className="mt-2 text-sm text-[#776d62]">Tonight / Brass: Birmingham / Negotiation intensive</p>
            </article>
            <article className="border border-[#dccfbe] bg-white p-4">
              <Trophy className="mb-5 text-[#cf612d]" size={20} />
              <p className="line-label">Next Badge</p>
              <p className="mt-2 font-bold">Table Diplomat</p>
              <div className="mt-4 h-1 bg-[#eadfce]"><div className="h-full w-2/3 bg-[#cf612d]" /></div>
            </article>
            <article className="border border-[#dccfbe] bg-white p-4">
              <BookOpen className="mb-5 text-[#cf612d]" size={20} />
              <p className="line-label">Vocabulary</p>
              <p className="mt-2 font-bold">Auction & Alliance</p>
              <p className="mt-4 text-xs text-[#776d62]">18 phrases ready</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container-shell mt-10 grid gap-4 md:grid-cols-3">
        {briefs.map((brief) => (
          <div key={brief.label} className="paper-panel flex items-center justify-between p-6">
            <div>
              <p className="line-label">{brief.label}</p>
              <p className="mt-1 text-sm text-[#776d62]">{brief.detail}</p>
            </div>
            <span className="metric">{brief.value}</span>
          </div>
        ))}
      </section>

      <section className="container-shell mt-10 grid gap-4 lg:grid-cols-3">
        {[
          { icon: Database, title: 'Game Database', body: 'Search the imported BGG catalogue with player count, depth and image coverage.', section: 'games' as Section },
          { icon: Crown, title: 'Guild Challenges', body: 'Complete table missions and build conversational confidence under pressure.', section: 'challenges' as Section },
          { icon: Trophy, title: 'Ranking Board', body: 'Badges and contribution ranks wait for the guild launch roster.', section: 'ranking' as Section },
        ].map((card) => (
          <button key={card.title} onClick={() => onNavigate(card.section)} className="paper-panel p-6 text-left transition hover:border-[#cf612d]">
            <card.icon className="mb-8 text-[#cf612d]" size={25} strokeWidth={1.5} />
            <h2 className="font-display text-3xl tracking-wider text-[#cf612d]">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#665d52]">{card.body}</p>
          </button>
        ))}
      </section>
    </main>
  );
}
