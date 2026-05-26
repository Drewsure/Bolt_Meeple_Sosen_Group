import { ArrowRight, Brain, Gamepad2, Heart, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Section } from '../App';
import { getGames } from '../lib/games';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';

interface HeroProps {
  onNavigate: (section: Section) => void;
  language: Language;
}

export function Hero({ onNavigate, language }: HeroProps) {
  const [gameCount, setGameCount] = useState<number | null>(null);
  const t = ui[language].home;
  const common = ui[language].common;

  useEffect(() => {
    getGames().then((games) => setGameCount(games.length));
  }, []);

  const benefits = [
    { icon: Brain, number: '01', title: t.benefit1, copy: t.benefit1Copy },
    { icon: Heart, number: '02', title: t.benefit2, copy: t.benefit2Copy },
    { icon: Users, number: '03', title: `${gameCount ?? '...'} ${common.games}`, copy: t.benefit3Copy },
  ];

  return (
    <main className="page-shell relative overflow-hidden">
      <span className="hero-orb left-[6%] top-36 h-3 w-3 bg-[#eaa23e]" />
      <span className="hero-orb right-[10%] top-72 h-5 w-5 bg-[#edaf4c]" />
      <span className="hero-orb left-[18%] top-[34rem] h-2 w-2 bg-[#ef6f43]" />

      <section className="container-shell hero-stage pb-10 pt-12">
        <div className="hero-card mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 text-center md:grid-cols-[1fr_0.72fr] md:px-10 md:py-14 md:text-left">
          <div className="relative z-10">
            <p className="eyebrow justify-center md:justify-start">
              {language === 'ja' ? '福岡・西区 英語ボードゲーム' : 'Fukuoka English Board Games'}
            </p>
            <h1 className="compact-title mt-4">{t.title}</h1>
            <p className="font-display mt-5 text-2xl tracking-wide text-[#443d37]">{t.subtitle}</p>
            <p className="mt-6 max-w-2xl text-sm font-semibold leading-7 text-[#c45a25]">{t.promise}</p>
            <div className="mt-5 max-w-2xl space-y-4 text-sm leading-7 text-[#675c50]">
              <p>{t.body1}</p>
              <p>{t.body2}</p>
              <p>{t.body3}</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary px-8 py-3">
                <Sparkles size={13} /> {t.how} <ArrowRight size={13} />
              </button>
              <button onClick={() => onNavigate('offers')} className="rule-button border-[#ff99b0] bg-[#fff5f8] px-8 py-3 text-[#ef3d66] hover:bg-[#ffeaf0]">
                {language === 'ja' ? '参加・料金' : 'Join / Pricing'}
              </button>
              <button onClick={() => onNavigate('games')} className="rule-button px-8 py-3">
                {t.browse}
              </button>
              <button onClick={() => onNavigate('briefings')} className="rule-button px-8 py-3">
                {language === 'ja' ? '週刊ブリーフィング' : 'Weekly Briefings'}
              </button>
            </div>
          </div>

          <aside className="relative z-10 mx-auto flex w-full max-w-sm flex-col justify-center gap-4">
            <div className="soft-stat p-5">
              <Gamepad2 className="text-[#e58921]" size={32} />
              <p className="font-display mt-4 text-5xl leading-none text-[#c75a22]">{gameCount ?? '...'}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#7b6b5b]">{common.games}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="soft-stat p-4">
                <Brain className="text-[#2f7bc9]" size={23} />
                <p className="mt-3 text-xs font-bold leading-5 text-[#3d332b]">{language === 'ja' ? '考えて話す' : 'Think + Speak'}</p>
              </div>
              <div className="soft-stat p-4">
                <Heart className="text-[#ef3d66]" size={23} />
                <p className="mt-3 text-xs font-bold leading-5 text-[#3d332b]">{language === 'ja' ? '安心の場' : 'Safe Table'}</p>
              </div>
            </div>
            <div className="soft-stat p-5">
              <p className="font-display text-2xl tracking-wide text-[#3d332b]">{t.simplePath}</p>
              <p className="mt-2 text-xs leading-6 text-[#74685d]">{t.path}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-shell grid gap-4 md:grid-cols-3">
        {benefits.map(({ icon: Icon, number, title, copy }) => (
          <article key={number} className="reference-panel relative p-6">
            <Icon className="text-[#d56821]" size={28} />
            <span className="font-display absolute right-5 top-4 text-4xl text-[#f3d28b]">{number}</span>
            <h2 className="font-display mt-6 text-lg tracking-wide">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-[#655c52]">{copy}</p>
          </article>
        ))}
      </section>

      <section className="container-shell mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
        <article className="reference-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#f1d8a5] px-5 py-3">
            <p className="font-display text-base tracking-wide text-[#9c4b22]">{t.firstTable}</p>
            <button onClick={() => onNavigate('board')} className="text-[10px] font-bold text-[#c86123]">{t.seeFlow}</button>
          </div>
          {[t.warmup, t.supportedTurns, t.reviewWords].map((title, index) => (
            <div key={title} className="flex items-center gap-3 border-b border-[#f3e2c2] px-5 py-3 text-xs last:border-0">
              <span className={`pill ${index === 1 ? 'pill-green' : 'pill-blue'}`}>{index === 1 ? t.play : t.support}</span>
              <span className="font-bold">{title}</span>
            </div>
          ))}
        </article>
        <article className="reference-panel min-h-52">
          <div className="flex items-center justify-between border-b border-[#f1d8a5] px-5 py-3">
            <p className="font-display text-base tracking-wide text-[#9c4b22]">{t.happens}</p>
            <span className="text-[10px] font-bold text-[#37ac66]">LIVE</span>
          </div>
          <p className="px-8 py-12 text-center text-xs leading-6 text-[#7b7168]">{t.happensCopy}</p>
        </article>
      </section>
    </main>
  );
}
