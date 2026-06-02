import { Award, Compass, Lightbulb, Users } from 'lucide-react';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';

const copy = {
  en: {
    intro: 'Drew Smith is building a practical approach to language confidence: small tables, real decisions, useful phrases, and repeatable community sessions.',
    doctrine: [
      ['Philosophy', 'English is not only a subject to memorize. It is a tool for participation, friendship, negotiation, and everyday confidence.'],
      ['Vision', 'Create welcoming tables where adults, retirees, parents, and strategists can practise English through shared play.'],
      ['Method', 'The Sosen approach turns board games into gentle language missions: choose a game, use one focus, play, and reflect.'],
    ],
    standards: ['Authentic Mastery', 'Cognitive Precision', 'Community Confidence', 'Gentle Progress'],
    quote: 'This is not about performing perfect English. It is about becoming comfortable enough to participate.',
    footer: 'Start small. Speak once. Build from there.',
  },
  ja: {
    intro: 'Drew Smith は、英語への自信を育てるために、小さなテーブル、実際の判断、使えるフレーズ、継続できる地域セッションを組み合わせています。',
    doctrine: [
      ['考え方', '英語は暗記する科目だけではありません。参加する、友人を作る、相談する、自信を持つための道具です。'],
      ['ビジョン', '大人、退職後の方、保護者、戦略ゲームが好きな人が、安心して英語を練習できるテーブルを作ります。'],
      ['方法', '創戦の方法は、ボードゲームをやさしい英語ミッションに変えます。ゲームを選び、一つのフォーカスで遊び、ふり返ります。'],
    ],
    standards: ['本物の習得', '考える力', '地域の安心感', '小さな成長'],
    quote: '完璧な英語を見せる場所ではありません。参加できる安心感を育てる場所です。',
    footer: '小さく始める。一度話す。そこから育てる。',
  },
} as const;

export function Dossier({ language }: { language: Language }) {
  const t = ui[language].dossier;
  const local = copy[language];
  const icons = [Lightbulb, Compass, Users];

  return (
    <main className="page-shell">
      <div className="tactical-banner h-32" />
      <div className="mx-auto max-w-3xl px-5 pb-16">
        <header className="-mt-10 text-center">
          <h1 className="compact-title">{t.title}</h1>
          <p className="mt-3 text-xs uppercase tracking-wide text-[#655b51]">{t.subtitle}</p>
        </header>
        <section className="reference-panel mt-10 p-7">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea8a16] font-display text-2xl text-white">DS</span>
            <div><h2 className="font-display text-2xl">Drew Smith</h2><span className="rounded bg-[#fff0bc] px-2 py-1 text-[9px] font-bold text-[#bd6c17]">FOUNDER</span></div>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#61574d]">{local.intro}</p>
        </section>
        <div className="mt-6 space-y-5">
          {local.doctrine.map(([title, body], index) => {
            const Icon = icons[index];
            return (
              <section key={title}>
                <h2 className={`mb-2 flex items-center gap-2 font-display text-xl ${['text-[#eb8e1d]', 'text-[#3989ec]', 'text-[#24ac68]'][index]}`}><Icon size={18} />{title}</h2>
                <p className={`rounded-lg border bg-white/70 p-5 text-xs leading-6 text-[#61574d] ${['border-[#efc779]', 'border-[#b4d5fe]', 'border-[#9fe1bb]'][index]}`}>{body}</p>
              </section>
            );
          })}
        </div>
        <h2 className="mt-8 text-center font-display text-2xl text-[#b65923]">{t.standard}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {local.standards.map((title, index) => (
            <article key={title} className={`rounded border p-4 text-xs ${['border-[#efc779]', 'border-[#aed1ff]', 'border-[#dfc3fd]', 'border-[#a6e4c1]'][index]}`}>
              <strong className="block font-display text-base">{title}</strong>
              {language === 'ja' ? '練習を、安心して使える会話に変えます。' : 'Practice becomes calm, usable table communication.'}
            </article>
          ))}
        </div>
        <blockquote className="mt-6 rounded-lg border border-[#f1bd57] bg-[#fff4d6] p-6 text-sm italic leading-7 text-[#554a42]">
          {local.quote}
          <footer className="mt-3 text-xs font-bold text-[#bf5c23]">- Drew Smith</footer>
        </blockquote>
        <p className="mt-7 text-center font-display text-lg text-[#c86122]"><Award className="mr-2 inline" size={17} /> {local.footer}</p>
      </div>
    </main>
  );
}
