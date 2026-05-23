import { ArrowRight, Brain, Handshake, MessageSquare, Target } from 'lucide-react';
import type { Section } from '../App';

export function SituationRoom({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Situation Room</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h1 className="display-title text-7xl sm:text-8xl">Strategic Language, Applied.</h1>
            <p className="font-editorial mt-6 text-xl leading-relaxed text-[#62594d]">
              Leave workbook English behind. Every decision at a Meeple Sosen table has stakes,
              timing and a voice.
            </p>
            <button onClick={() => onNavigate('challenges')} className="rule-button rule-button-primary mt-9">
              View Missions <ArrowRight size={15} />
            </button>
          </div>
          <div className="paper-panel grid gap-px overflow-hidden bg-[#dccfbe] sm:grid-cols-2">
            {[
              { icon: MessageSquare, title: 'Negotiate', copy: 'Frame offers, refuse cleanly and build persuasive alliances.' },
              { icon: Brain, title: 'Calculate', copy: 'Explain odds, tradeoffs and tactical reasoning in real time.' },
              { icon: Handshake, title: 'Collaborate', copy: 'Practice group decisions with shared objectives and roles.' },
              { icon: Target, title: 'Debrief', copy: 'Turn every match into a precise vocabulary review.' },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="bg-[#fffdf8] p-7">
                <Icon className="mb-10 text-[#cf612d]" size={25} strokeWidth={1.5} />
                <h2 className="font-display text-3xl tracking-wider text-[#cf612d]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#665d52]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="paper-panel mt-12 grid gap-8 p-7 md:grid-cols-3">
          {[
            ['01 / Brief', 'Language targets and game role assigned before play.'],
            ['02 / Deploy', 'Guided play uses English for genuine table decisions.'],
            ['03 / Record', 'XP, badges and useful phrases captured afterward.'],
          ].map(([title, copy]) => (
            <article key={title}>
              <p className="eyebrow">{title}</p>
              <p className="font-editorial mt-4 text-lg leading-7 text-[#544c42]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
