import { Award, Crown, Lightbulb, Shield, Swords, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';
import { loadSessionProgress } from '../lib/sessionProgress';
import type { SessionProgressRecord } from '../lib/sessionProgress';

const badges = [
  { icon: Swords, name: 'Master Negotiator', detail: 'Submitted tips for Negotiation Challenges' },
  { icon: TrendingUp, name: 'Industrial Tycoon', detail: 'Submitted tips for Trade & Economic Challenges' },
  { icon: Swords, name: 'Strategic Commander', detail: 'Submitted tips for Leadership Challenges' },
  { icon: Lightbulb, name: 'Linguistic Architect', detail: 'Submitted tips for Formal Writing Challenges' },
  { icon: Users, name: 'Grand Diplomat', detail: 'Submitted tips for Diplomacy Challenges' },
  { icon: Target, name: 'Silver Tongue', detail: 'Submitted tips with Persuasion focus' },
  { icon: Shield, name: 'Guild Pioneer', detail: 'First tip ever submitted' },
  { icon: Crown, name: 'Master Strategist', detail: 'Completed a Master-level challenge' },
];

const dashboardTranslations = {
  en: {
    stats: ['Challenges Done', 'Tips Submitted', 'Votes Earned', 'Badges Earned'],
    ranks: ['Recruit', 'Strategist', 'Operative', 'Commander', 'Grand Master'],
    nextRank: 'Next: Strategist (5 XP to go)',
    earned: 'earned',
    emptyProgress: 'Use How It Works to pick a focus, use a conversation card, and save one session note.',
    conversationCard: 'Conversation Card',
    badges,
  },
  ja: {
    stats: ['完了したチャレンジ', '投稿したヒント', '獲得した票', '獲得バッジ'],
    ranks: ['リクルート', 'ストラテジスト', 'オペレーター', 'コマンダー', 'グランドマスター'],
    nextRank: '次: ストラテジスト（あと5 XP）',
    earned: '獲得',
    emptyProgress: '使い方ページでフォーカスを選び、会話カードを使い、セッション記録を一つ保存してください。',
    conversationCard: '会話カード',
    badges: [
      { name: '交渉マスター', detail: '交渉チャレンジのヒントを投稿' },
      { name: '産業戦略家', detail: '取引・経済チャレンジのヒントを投稿' },
      { name: '戦略コマンダー', detail: 'リーダーシップチャレンジのヒントを投稿' },
      { name: '言語設計者', detail: 'フォーマルライティングのヒントを投稿' },
      { name: '外交名人', detail: '外交チャレンジのヒントを投稿' },
      { name: '説得の達人', detail: '説得フォーカスのヒントを投稿' },
      { name: 'ギルド開拓者', detail: '最初のヒントを投稿' },
      { name: 'マスター戦略家', detail: 'マスターレベルのチャレンジを完了' },
    ],
  },
} as const;

export function Dashboard({ onJoin: _onJoin, language }: { onJoin: () => void; language: Language }) {
  const { profile, user } = useAuth();
  const [sessionRecords, setSessionRecords] = useState<SessionProgressRecord[]>([]);
  const name = profile?.display_name || (user ? 'Guild Member' : 'Preview Member');
  const email = user?.email || 'Sign in to view member details';
  const t = ui[language].profile;
  const common = ui[language].common;
  const local = dashboardTranslations[language];
  const sessionsCompleted = sessionRecords.length;
  const uniqueGames = new Set(sessionRecords.map((record) => record.gameTitle)).size;
  const usefulPhrases = sessionRecords.filter((record) => record.usefulPhrase.trim()).length;
  const calculatedXp = sessionsCompleted * 10 + usefulPhrases * 5 + uniqueGames * 5;
  const xp = Math.max(profile?.xp_points || 0, calculatedXp);
  const nextRankTarget = xp >= 100 ? 200 : xp >= 50 ? 100 : 50;
  const rankIndex = xp >= 200 ? 4 : xp >= 100 ? 3 : xp >= 50 ? 2 : xp >= 20 ? 1 : 0;
  const progressPercent = Math.min(100, Math.round((xp / nextRankTarget) * 100));
  const earnedBadgeCount = [
    sessionsCompleted >= 1,
    sessionsCompleted >= 3,
    uniqueGames >= 3,
    usefulPhrases >= 5,
    sessionRecords.some((record) => record.focusTitle.toLowerCase().includes('suggest') || record.focusTitle.toLowerCase().includes('negotiate')),
    sessionRecords.some((record) => record.focusTitle.toLowerCase().includes('explain')),
    sessionRecords.some((record) => record.focusTitle.toLowerCase().includes('review')),
    sessionsCompleted >= 10,
  ].filter(Boolean).length;

  useEffect(() => {
    setSessionRecords(loadSessionProgress());
  }, []);

  return (
    <main className="page-shell bg-[radial-gradient(circle_at_center,#fff7e7,#fbf7ef)]">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <h1 className="font-display text-3xl tracking-wide">{name}</h1>
        <p className="mt-1 text-xs text-[#71675c]">{email}</p>
        <span className="mt-2 inline-flex rounded border border-[#ebbd66] bg-[#fff4d5] px-2 py-1 text-[10px] font-bold text-[#d16a21]">{user ? 'Member' : 'Preview'}</span>
        <div className="mt-9 grid gap-4 sm:grid-cols-4">
          {[Swords, Lightbulb, TrendingUp, Target].map((Icon, index) => {
            const label = local.stats[index];
            const values = [sessionsCompleted, usefulPhrases, uniqueGames, earnedBadgeCount];
            return (
            <article key={label} className="reference-panel py-6 text-center"><Icon className="mx-auto text-[#d46a20]" size={21} /><p className="font-display mt-2 text-2xl">{values[index]}</p><p className="text-[10px] text-[#746b61]">{label}</p></article>
            );
          })}
        </div>
        <h2 className="font-display mt-10 text-2xl tracking-wide">{t.growth}</h2>
        <section className="reference-panel mt-4 p-7">
          <div className="flex justify-between"><div><p className="text-[10px] text-[#82766b]">{t.currentRank}</p><p className="font-display text-3xl text-[#d06122]">{local.ranks[rankIndex]}</p></div><div className="text-right"><p className="text-[10px] text-[#82766b]">{t.totalPoints}</p><p className="font-display text-3xl">{xp} XP</p></div></div>
          <div className="mt-6 h-4 rounded-full border border-[#dedad4] bg-white"><div className="h-full rounded-full bg-[#d56a22]" style={{ width: `${progressPercent}%` }} /></div>
          <p className="mt-3 text-right text-[10px] font-bold text-[#e07521]">{xp >= 200 ? 'Grand Master progress is active' : `${Math.max(nextRankTarget - xp, 0)} XP to next rank`}</p>
          <div className="mt-5 grid grid-cols-5 gap-2 text-center font-display text-[10px] text-[#a29a91]">{local.ranks.map((rank, index) => <span key={rank} className={`border-t-4 pt-2 ${index <= rankIndex ? 'border-[#d56a22] text-[#554b42]' : 'border-[#dedad5]'}`}>{rank}</span>)}</div>
        </section>
        <div className="mt-10 flex justify-between"><h2 className="font-display text-2xl tracking-wide">{t.badges}</h2><span className="text-xs text-[#776e63]">{earnedBadgeCount} / 8 {local.earned}</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {badges.map(({ icon: Icon }, index) => {
            const earned = index < earnedBadgeCount;
            return (
              <article key={local.badges[index].name} className={`rounded-xl border p-5 text-center ${earned ? 'border-[#efc779] bg-[#fff7e7] text-[#d46a20]' : 'border-[#e1ded7] bg-[#f8f7f4] text-[#989997]'}`}><Icon className="mx-auto" size={30} /><h3 className="font-display mt-4 text-sm text-[#36312d]">{local.badges[index].name}</h3><p className="mt-2 text-[10px] leading-4">{local.badges[index].detail}</p></article>
            );
          })}
        </div>
        <h2 className="font-display mt-10 text-2xl tracking-wide">{common.profileProgress}</h2>
        <section className="reference-panel mt-4 overflow-hidden">
          {sessionRecords.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="mx-auto text-[#f0c457]" size={42} />
              <h3 className="font-display mt-4 text-lg text-[#71685e]">{common.noSessionNotes}</h3>
              <p className="mt-2 text-xs text-[#92897f]">{local.emptyProgress}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f3dfba]">
              {sessionRecords.map((record) => (
                <article key={record.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl tracking-wide text-[#bd5c24]">{record.gameTitle}</p>
                      <p className="mt-1 text-xs text-[#776d62]">{new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full border border-[#bde8c9] bg-[#f7fff8] px-3 py-1 text-[10px] font-bold uppercase text-[#2e7c44]">{record.focusTitle}</span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded border border-[#efd39d] bg-[#fffaf0] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a7563]">{local.conversationCard}</p>
                      <p className="mt-1 text-sm text-[#453b34]">{record.conversationCard}</p>
                    </div>
                    <div className="rounded border border-[#b9d2fb] bg-[#f7fbff] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#506d9a]">{common.usefulPhrase}</p>
                      <p className="mt-1 text-sm text-[#453b34]">{record.usefulPhrase}</p>
                    </div>
                    <div className="rounded border border-[#ead4fa] bg-[#fdf8ff] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#75518e]">{common.nextTime}</p>
                      <p className="mt-1 text-sm text-[#453b34]">{record.nextTime}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#62584f]">{record.whatHappened}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
