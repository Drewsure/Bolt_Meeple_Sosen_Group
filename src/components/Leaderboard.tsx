import { ArrowUpRight, Crown, Medal, Sparkles, Target, Trophy, Users, Zap } from 'lucide-react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';

type Agent = {
  rank: number;
  callsign: string;
  title: string;
  xp: number;
  wins: number;
  games: number;
  deployment: number;
  specialty: string;
  trend: string;
};

const agents: Agent[] = [
  { rank: 1, callsign: 'Agent Orange-01', title: 'Grand Strategist', xp: 860, wins: 11, games: 24, deployment: 94, specialty: 'Economic Warfare', trend: '+120 XP' },
  { rank: 2, callsign: 'Agent Sakura-07', title: 'Guild Commander', xp: 720, wins: 9, games: 21, deployment: 88, specialty: 'Negotiation', trend: '+80 XP' },
  { rank: 3, callsign: 'Agent Lantern-12', title: 'Strategic Architect', xp: 645, wins: 8, games: 18, deployment: 83, specialty: 'Formal Briefing', trend: '+65 XP' },
  { rank: 4, callsign: 'Agent Canal-04', title: 'Industrial Operator', xp: 510, wins: 6, games: 16, deployment: 76, specialty: 'Network Planning', trend: '+40 XP' },
  { rank: 5, callsign: 'Agent Clover-19', title: 'Field Strategist', xp: 390, wins: 4, games: 13, deployment: 69, specialty: 'Team Communication', trend: '+30 XP' },
  { rank: 6, callsign: 'Agent Ember-23', title: 'Guild Recruit', xp: 220, wins: 2, games: 9, deployment: 54, specialty: 'Tactical English', trend: '+20 XP' },
];

const rankTiers = [
  { title: 'Recruit', range: '0-249 XP', copy: 'Learning the command language.' },
  { title: 'Strategist', range: '250-499 XP', copy: 'Completes missions and explains decisions clearly.' },
  { title: 'Commander', range: '500-749 XP', copy: 'Leads briefings, negotiations, and after-action reports.' },
  { title: 'Grand Master', range: '750+ XP', copy: 'Dominates complex simulations with precise English.' },
];

const scoring = [
  ['Game Deployed', '+10 XP', 'Complete a recorded session.'],
  ['Mission Brief', '+25 XP', 'Deliver a pre-game English objective.'],
  ['Victory', '+50 XP', 'Win or meet the challenge condition.'],
  ['Guild Tip', '+35 XP', 'Submit a useful strategy or language tip.'],
  ['Master Simulation', '+100 XP', 'Complete a Master-level game mission.'],
];

const leaderboardTranslations = {
  en: {
    anonymousRank: 'Anonymous Guild Rank',
    rankTiers: 'Rank Tiers',
    rankTiersCopy: 'Anonymous progression ladder for the Guild.',
    rankHeaders: ['Rank', 'Agent', 'XP', 'Wins', 'Games', 'Deploy'],
    tiers: rankTiers,
  },
  ja: {
    anonymousRank: '匿名ギルドランク',
    rankTiers: 'ランク段階',
    rankTiersCopy: 'コミュニティ内の匿名進捗ステップです。',
    rankHeaders: ['順位', 'エージェント', 'XP', '勝利', 'ゲーム', '実行'],
    tiers: [
      { title: 'リクルート', range: '0-249 XP', copy: 'テーブルで使う言葉に慣れていく段階です。' },
      { title: 'ストラテジスト', range: '250-499 XP', copy: 'ミッションを完了し、判断をはっきり説明できます。' },
      { title: 'コマンダー', range: '500-749 XP', copy: '説明、交渉、ふり返りをリードできます。' },
      { title: 'グランドマスター', range: '750+ XP', copy: '複雑なゲームでも、落ち着いて英語を使えます。' },
    ],
  },
} as const;

export function Leaderboard({ onNavigate, language }: { onNavigate: (section: Section) => void; language: Language }) {
  const t = ui[language].ranking;
  const local = leaderboardTranslations[language];
  const totals = {
    xp: agents.reduce((sum, agent) => sum + agent.xp, 0),
    victories: agents.reduce((sum, agent) => sum + agent.wins, 0),
    games: agents.reduce((sum, agent) => sum + agent.games, 0),
    deployment: Math.round(agents.reduce((sum, agent) => sum + agent.deployment, 0) / agents.length),
  };

  return (
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <p className="eyebrow justify-center">{local.anonymousRank}</p>
        <h1 className="compact-title mt-2">{t.title}</h1>
        <p className="mt-4 text-xs text-[#71685d]">{t.subtitle}</p>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-9">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { icon: Trophy, label: 'Total XP', value: totals.xp.toLocaleString(), color: 'text-[#e88d15] border-[#efc779]' },
            { icon: Zap, label: 'Victories', value: totals.victories.toString(), color: 'text-[#27b764] border-[#aae4c1]' },
            { icon: Target, label: 'Deployment', value: `${totals.deployment}%`, color: 'text-[#407fe7] border-[#accefc]' },
            { icon: Users, label: 'Active Agents', value: agents.length.toString(), color: 'text-[#9a59df] border-[#dcc4fb]' },
          ].map(({ icon: Icon, label, value, color }) => (
            <article key={label} className={`rounded-lg border bg-white/80 p-7 text-center ${color.split(' ')[1]}`}>
              <Icon className={`mx-auto ${color.split(' ')[0]}`} />
              <p className="font-display mt-4 text-lg">{label}</p>
              <span className="font-display text-3xl text-[#3d332b]">{value}</span>
            </article>
          ))}
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="reference-panel overflow-hidden">
            <div className="grid grid-cols-[60px_1.4fr_0.7fr_0.6fr_0.6fr_0.8fr] bg-[#f9e4c8] px-5 py-3 font-display text-xs text-[#ab531c]">
              {local.rankHeaders.map((header) => <span key={header}>{header}</span>)}
            </div>
            <div className="divide-y divide-[#f1dec0]">
              {agents.map((agent) => (
                <div key={agent.callsign} className="grid grid-cols-[60px_1.4fr_0.7fr_0.6fr_0.6fr_0.8fr] items-center px-5 py-4 text-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#edbd64] bg-[#fff5dc] font-display text-lg text-[#b85b20]">{agent.rank}</span>
                  <span>
                    <span className="block font-display text-lg tracking-wide text-[#3d332b]">{agent.callsign}</span>
                    <span className="block text-[10px] uppercase tracking-wide text-[#81766b]">{agent.title} - {agent.specialty}</span>
                  </span>
                  <span className="font-display text-xl text-[#d06122]">{agent.xp}</span>
                  <span>{agent.wins}</span>
                  <span>{agent.games}</span>
                  <span>
                    <span className="font-bold text-[#407fe7]">{agent.deployment}%</span>
                    <span className="mt-1 block text-[10px] text-[#2ca65d]">{agent.trend}</span>
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
              <p className="eyebrow">Top Agent</p>
              <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">Current Champion</h2>
            </div>
            <div className="p-6 text-center">
              <Crown className="mx-auto text-[#e5a51c]" size={48} />
              <p className="font-display mt-4 text-3xl tracking-wide text-[#3d332b]">{agents[0].callsign}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#8b7d70]">{agents[0].title}</p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#6f655a]">Dominates through economic missions, clean after-action summaries, and high deployment scores.</p>
              <button onClick={() => onNavigate('challenges')} className="rule-button rule-button-primary mt-6 w-full justify-center py-3">
                <Sparkles size={14} /> Challenge the Table
              </button>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-[#edb444] bg-[#fff2cb] p-8">
            <h2 className="font-display text-2xl">{t.rise}</h2>
            <p className="mt-3 text-xs leading-5 text-[#766a5d]">{t.riseCopy}</p>
            <div className="mt-5 grid gap-2 text-[10px] sm:grid-cols-2">
              {scoring.map(([label, xp, copy]) => (
                <div key={label} className="rounded border border-[#edba55] bg-white/70 p-3">
                  <p className="font-bold uppercase tracking-wide text-[#955722]">{label}</p>
                  <p className="font-display text-xl text-[#d06122]">{xp}</p>
                  <p className="text-[#74685d]">{copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] px-6 py-4">
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">{local.rankTiers}</p>
              <p className="mt-1 text-xs text-[#7a7065]">{local.rankTiersCopy}</p>
            </div>
            <div className="grid gap-3 p-5">
              {local.tiers.map(({ title, range, copy }, index) => (
                <div key={title} className="flex gap-4 rounded border border-[#efd39d] bg-white p-4">
                  <Medal className={`${index === local.tiers.length - 1 ? 'text-[#d06122]' : 'text-[#e5a51c]'}`} size={24} />
                  <span>
                    <span className="font-display text-lg tracking-wide text-[#3d332b]">{title}</span>
                    <span className="ml-2 text-[10px] font-bold uppercase text-[#a36b2c]">{range}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#70665b]">{copy}</span>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="reference-panel mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display text-2xl tracking-wide text-[#bd5c24]">No real submissions yet</p>
            <p className="mt-1 text-xs text-[#70665b]">These are preview rows so the finished system has structure. Real anonymous entries can replace them when challenge submissions start.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate('profile')} className="rounded border border-[#ebba63] bg-white px-4 py-3 text-[11px] font-bold uppercase text-[#b85d1f]">View Profile</button>
            <button onClick={() => onNavigate('challenges')} className="rule-button rule-button-primary px-5 py-3">Start Mission <ArrowUpRight size={14} /></button>
          </div>
        </section>
      </div>
    </main>
  );
}
