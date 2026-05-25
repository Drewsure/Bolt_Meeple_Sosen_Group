import { ArrowRight, Brain, HeartHandshake, MessageCircle, Users, Zap } from 'lucide-react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';

const copy = {
  en: {
    opening: 'This is the background idea: English becomes easier when people have a real reason to use it together.',
    problemCopy: 'Many lessons ask people to study language without context. That can feel thin, lonely, and hard to keep doing.',
    solutionCopy: 'Meeple Sosen creates a supported table. The game supplies the situation; the group supplies patience; the conversation becomes useful.',
    ctaTitle: 'Ready to see the table flow?',
    ctaCopy: 'Start with the simple process: choose a game, choose one focus, play, and review.',
    cta: 'See How It Works',
    pillars: [
      ['Cognitive Depth', 'Games ask people to plan, compare, remember, and explain.'],
      ['Useful Language', 'Each session focuses on one practical English action.'],
      ['Gentle Stakes', 'The game creates energy without turning the room into a test.'],
      ['Community', 'People return because the table feels human, useful, and safe.'],
    ],
  },
  ja: {
    opening: 'このページは背景の説明です。英語は、一緒に使う理由があると、ずっと始めやすくなります。',
    problemCopy: '多くの英語レッスンは、文脈のない勉強になりがちです。薄く感じたり、孤独だったり、続けにくいことがあります。',
    solutionCopy: 'ミープル創戦は、サポートのあるテーブルを作ります。ゲームが状況を作り、グループが安心感を作り、会話が実用的になります。',
    ctaTitle: 'テーブルの流れを見てみますか？',
    ctaCopy: 'ゲームを選ぶ、一つのフォーカスを選ぶ、遊ぶ、ふり返る。まずはシンプルな流れからです。',
    cta: '使い方を見る',
    pillars: [
      ['考える深さ', 'ゲームは計画、比較、記憶、説明を自然に使わせてくれます。'],
      ['使える英語', '毎回、一つの実用的な英語行動に集中します。'],
      ['やさしい緊張感', 'テストにせず、ゲームがほどよい集中を作ります。'],
      ['コミュニティ', '人が戻ってくるのは、テーブルが人間的で、役に立ち、安心できるからです。'],
    ],
  },
} as const;

export function SituationRoom({ onNavigate, language }: { onNavigate: (section: Section) => void; language: Language }) {
  const t = ui[language].situation;
  const local = copy[language];
  const icons = [Brain, MessageCircle, Zap, Users];

  return (
    <main className="page-shell">
      <header className="tactical-banner py-9 text-center">
        <h1 className="compact-title">{t.title}</h1>
        <p className="font-display mt-3 text-sm tracking-wider text-[#b35622]">{t.subtitle}</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-10">
        <div className="reference-panel p-7 text-sm leading-7 text-[#5e554b]">{local.opening}</div>
        <section>
          <h2 className="font-display text-2xl text-[#f07067]">{t.problem}</h2>
          <div className="mt-3 rounded-lg border border-[#ffb9bf] bg-white/70 p-6 text-sm leading-7 text-[#5e554b]">
            <p>{local.problemCopy}</p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl text-[#35bd78]">{t.solution}</h2>
          <div className="mt-3 rounded-lg border border-[#8cdeb3] bg-white/70 p-6 text-sm leading-7 text-[#5e554b]">
            <p>{local.solutionCopy}</p>
          </div>
        </section>
        <h2 className="pt-2 text-center font-display text-2xl text-[#bd5823]">{t.pillars}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {local.pillars.map(([title, body], index) => {
            const Icon = icons[index];
            return (
              <article key={title} className={`rounded-lg border bg-white/70 p-5 ${['border-[#d1b8fd]', 'border-[#a9d3fc]', 'border-[#ffb9bf]', 'border-[#9de1bc]'][index]}`}>
                <Icon size={24} className={['text-[#814be8]', 'text-[#3987ed]', 'text-[#ef4d56]', 'text-[#20a461]'][index]} />
                <h3 className="font-display mt-4 text-lg tracking-wide">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#655c52]">{body}</p>
              </article>
            );
          })}
        </div>
        <div className="rounded-lg border border-[#f2a51b] bg-[#fff8e6] p-8 text-center">
          <HeartHandshake className="mx-auto text-[#e2821d]" size={30} />
          <h2 className="font-display mt-3 text-2xl">{local.ctaTitle}</h2>
          <p className="mt-2 text-xs text-[#766b60]">{local.ctaCopy}</p>
          <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary mt-6">{local.cta} <ArrowRight size={13} /></button>
        </div>
      </div>
    </main>
  );
}
