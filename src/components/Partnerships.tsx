import { ArrowRight, BadgeCheck, Briefcase, Building2, CalendarDays, HeartHandshake, Mail, Megaphone, Presentation, ShieldCheck, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Language } from '../lib/i18n';

const contactEmail = 'ministarenglish@mail.com';

function mailto(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const page = {
  en: {
    eyebrow: 'Corporate Workshops + Sponsored Community Tables',
    title: 'Use Board Games To Build Communication, Confidence, And Local Participation',
    subtitle: 'Two partnership offers for organizations that want something warmer than a lecture and more structured than a casual game night.',
    workshopTitle: 'Corporate Soft-Skill Workshops',
    workshopSubtitle: 'A practical team session using modern board games to practise communication, decision-making, negotiation, leadership, and reflection.',
    sponsorTitle: 'Sponsor A Table',
    sponsorSubtitle: 'A local sponsorship model that funds Silver Circle or beginner English game tables while giving the sponsor visible community goodwill.',
    workshopCta: 'Request Workshop Proposal',
    sponsorCta: 'Ask About Sponsoring A Table',
    howItWorks: 'How It Works',
    outcomes: 'What Participants Practise',
    packages: 'Suggested Packages',
    trust: 'Why This Is Different',
    sponsorBenefits: 'Sponsor Benefits',
    sponsorPlacements: 'Sponsor Visibility',
    email: 'Email Inquiry',
    workshopMail: {
      subject: 'Corporate soft-skill workshop inquiry',
      body: 'I would like to discuss a Meeple Sosen corporate workshop.\n\nOrganization:\nTeam size:\nPreferred theme:\nPossible date:\nBudget range:\nQuestions:',
    },
    sponsorMail: {
      subject: 'Sponsor a Meeple Sosen table',
      body: 'I would like to ask about sponsoring a Meeple Sosen table.\n\nOrganization / sponsor name:\nPreferred table type:\nMonthly budget:\nQuestions:',
    },
    workshopFlow: [
      ['Choose the focus', 'Communication, negotiation, leadership, planning, or cross-cultural English.'],
      ['Play with a mission', 'Players receive simple table roles and useful language prompts before play begins.'],
      ['Reflect together', 'The session ends with a short review: what worked, what blocked communication, and what to try next.'],
    ],
    outcomeItems: ['Clear turn explanation', 'Active listening', 'Polite disagreement', 'Risk discussion', 'Team planning', 'Decision review', 'English confidence', 'Psychological safety'],
    workshopPackages: [
      ['Starter Workshop', '90 minutes', 'From JPY 30,000', 'Best for a first internal team event or English communication trial.'],
      ['Half-Day Team Lab', '3 hours', 'From JPY 75,000', 'Best for deeper communication practice, leadership roles, and structured reflection.'],
      ['Custom Program', 'Monthly', 'Quote', 'Best for organizations wanting recurring English, teamwork, or community engagement sessions.'],
    ],
    trustItems: [
      ['Not a lecture', 'People practise while making real choices, explaining ideas, and responding to pressure.'],
      ['Not just entertainment', 'Each table has a clear communication mission and simple review structure.'],
      ['Bilingual support', 'Japanese support can be used to keep the session safe, clear, and welcoming.'],
    ],
    sponsorBenefitsItems: [
      ['Fund local participation', 'Help seniors, beginners, families, or community members join a friendly table.'],
      ['Earn quiet goodwill', 'Your name appears as a supporter of a concrete local activity, not a generic ad.'],
      ['Support useful public content', 'Sponsorship can help fund free briefing cards and community session materials.'],
    ],
    sponsorTiers: [
      ['Community Supporter', 'JPY 5,000 / month', 'Name listed on one table page and sponsor footer.'],
      ['Table Sponsor', 'JPY 15,000 / month', 'Supports one recurring table with visible recognition and monthly update.'],
      ['Program Partner', 'JPY 30,000+ / month', 'Supports multiple sessions, local outreach, and co-branded community reporting.'],
    ],
    placements: ['Sponsored table page', 'Silver Circle footer', 'Monthly thank-you post', 'Briefing-card supporter line', 'Workshop handout note', 'Community update email'],
  },
  ja: {
    eyebrow: '企業ワークショップ + 地域テーブルスポンサー',
    title: 'ボードゲームで、会話力・自信・地域参加を育てる',
    subtitle: '講義より温かく、ただのゲーム会より構造がある、組織向けの二つの提携プランです。',
    workshopTitle: '企業向けソフトスキル・ワークショップ',
    workshopSubtitle: '現代ボードゲームを使い、コミュニケーション、意思決定、交渉、リーダーシップ、振り返りを実践するチームセッションです。',
    sponsorTitle: 'テーブルスポンサー',
    sponsorSubtitle: 'Silver Circle や初心者英語ゲームテーブルを支える地域スポンサー制度です。支援者は地域活動への貢献として自然に紹介されます。',
    workshopCta: 'ワークショップ相談',
    sponsorCta: 'スポンサー相談',
    howItWorks: '進め方',
    outcomes: '参加者が練習すること',
    packages: '提案パッケージ',
    trust: 'この形式の強み',
    sponsorBenefits: 'スポンサーの価値',
    sponsorPlacements: '掲載・紹介場所',
    email: 'メールで相談',
    workshopMail: {
      subject: '企業向けソフトスキル・ワークショップ相談',
      body: 'Meeple Sosen の企業ワークショップについて相談したいです。\n\n組織名：\n人数：\n希望テーマ：\n希望日：\n予算感：\n質問：',
    },
    sponsorMail: {
      subject: 'Meeple Sosen テーブルスポンサー相談',
      body: 'Meeple Sosen のテーブルスポンサーについて相談したいです。\n\n団体名・お名前：\n支援したいテーブル：\n月予算：\n質問：',
    },
    workshopFlow: [
      ['テーマを選ぶ', 'コミュニケーション、交渉、リーダーシップ、計画、異文化英語などから選びます。'],
      ['ミッション付きで遊ぶ', 'プレイ前に役割と使いやすい英語表現を渡し、目的を持って進めます。'],
      ['一緒に振り返る', '最後に、伝わったこと、詰まったこと、次に試すことを短く確認します。'],
    ],
    outcomeItems: ['ターン説明', '傾聴', '丁寧な反対意見', 'リスク相談', 'チーム計画', '意思決定の振り返り', '英語への自信', '安心して話せる場'],
    workshopPackages: [
      ['スターター', '90分', 'JPY 30,000 から', '初回の社内イベントや英語コミュニケーション体験に向いています。'],
      ['半日チームラボ', '3時間', 'JPY 75,000 から', '役割、リーダーシップ、深い振り返りまで行うプランです。'],
      ['カスタムプログラム', '月次', '見積もり', '継続的な英語・チーム作り・地域連携に向いています。'],
    ],
    trustItems: [
      ['講義ではない', '実際の選択、説明、相手への反応を通して練習します。'],
      ['ただの遊びではない', '各テーブルに会話ミッションと振り返りがあります。'],
      ['日本語サポート可能', '安心して参加できるよう、日本語で補助できます。'],
    ],
    sponsorBenefitsItems: [
      ['地域参加を支える', 'シニア、初心者、家族、地域の方が参加できる場を支援します。'],
      ['自然な信頼を得る', '広告ではなく、具体的な地域活動の支援者として紹介されます。'],
      ['無料教材を支える', 'ブリーフィングカードやセッション資料の公開継続にもつながります。'],
    ],
    sponsorTiers: [
      ['コミュニティサポーター', '月 JPY 5,000', 'テーブルページとフッターに名前を掲載。'],
      ['テーブルスポンサー', '月 JPY 15,000', '継続テーブル一つを支援し、月次報告で紹介。'],
      ['プログラムパートナー', '月 JPY 30,000+', '複数セッション、地域告知、共同レポートを支援。'],
    ],
    placements: ['スポンサーテーブルページ', 'Silver Circle フッター', '月次お礼投稿', 'ブリーフィングカード支援者表記', 'ワークショップ資料', '地域活動メール'],
  },
} as const;

export function Partnerships({ language }: { language: Language }) {
  const t = page[language];
  const workshopLink = mailto(t.workshopMail.subject, t.workshopMail.body);
  const sponsorLink = mailto(t.sponsorMail.subject, t.sponsorMail.body);

  return (
    <main className="page-shell">
      <header className="tactical-banner py-14 text-center">
        <p className="eyebrow justify-center">{t.eyebrow}</p>
        <h1 className="compact-title mt-2">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#71685d]">{t.subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={workshopLink} className="rule-button rule-button-primary px-7 py-3"><Briefcase size={14} /> {t.workshopCta}</a>
          <a href={sponsorLink} className="rule-button px-7 py-3"><HeartHandshake size={14} /> {t.sponsorCta}</a>
        </div>
      </header>

      <section className="container-shell grid gap-6 py-10 lg:grid-cols-2">
        <article className="reference-panel overflow-hidden">
          <div className="bg-[#fff8ea] p-6">
            <Presentation className="text-[#d87522]" size={32} />
            <h2 className="font-display mt-4 text-4xl tracking-wide text-[#bd5c24]">{t.workshopTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-[#62584f]">{t.workshopSubtitle}</p>
          </div>
          <div className="space-y-6 p-6">
            <SectionBlock icon={Sparkles} title={t.howItWorks}>
              <div className="grid gap-3">
                {t.workshopFlow.map(([title, body], index) => (
                  <div key={title} className="rounded-xl border border-[#efd39d] bg-white p-4">
                    <p className="font-display text-xl tracking-wide text-[#3d332b]">{index + 1}. {title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#62584f]">{body}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock icon={BadgeCheck} title={t.outcomes}>
              <div className="flex flex-wrap gap-2">
                {t.outcomeItems.map((item) => (
                  <span key={item} className="rounded-full border border-[#b9d2fb] bg-[#f7fbff] px-3 py-2 text-xs font-bold text-[#366eb4]">{item}</span>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock icon={CalendarDays} title={t.packages}>
              <div className="grid gap-3">
                {t.workshopPackages.map(([name, duration, price, detail]) => (
                  <div key={name} className="rounded-xl border border-[#efd39d] bg-[#fffdf8] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-xl tracking-wide text-[#3d332b]">{name}</p>
                      <span className="rounded-full bg-[#fff0ce] px-3 py-1 text-xs font-bold text-[#bd5c24]">{price}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#9a7560]">{duration}</p>
                    <p className="mt-3 text-sm leading-6 text-[#62584f]">{detail}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <a href={workshopLink} className="rule-button rule-button-primary w-full justify-center py-3"><Mail size={14} /> {t.email} <ArrowRight size={14} /></a>
          </div>
        </article>

        <article className="reference-panel overflow-hidden">
          <div className="bg-[#fff7fa] p-6">
            <HeartHandshake className="text-[#ef3d66]" size={34} />
            <h2 className="font-display mt-4 text-4xl tracking-wide text-[#ef3d66]">{t.sponsorTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-[#62584f]">{t.sponsorSubtitle}</p>
          </div>
          <div className="space-y-6 p-6">
            <SectionBlock icon={ShieldCheck} title={t.sponsorBenefits}>
              <div className="grid gap-3">
                {t.sponsorBenefitsItems.map(([title, body]) => (
                  <div key={title} className="rounded-xl border border-[#ffbdce] bg-[#fff7fa] p-4">
                    <p className="font-display text-xl tracking-wide text-[#3d332b]">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#62584f]">{body}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock icon={Building2} title={t.packages}>
              <div className="grid gap-3">
                {t.sponsorTiers.map(([name, price, detail]) => (
                  <div key={name} className="rounded-xl border border-[#ffbdce] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-xl tracking-wide text-[#3d332b]">{name}</p>
                      <span className="rounded-full bg-[#fff5f8] px-3 py-1 text-xs font-bold text-[#ef3d66]">{price}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#62584f]">{detail}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock icon={Megaphone} title={t.sponsorPlacements}>
              <div className="flex flex-wrap gap-2">
                {t.placements.map((item) => (
                  <span key={item} className="rounded-full border border-[#efd39d] bg-[#fffaf0] px-3 py-2 text-xs font-bold text-[#8a5d2a]">{item}</span>
                ))}
              </div>
            </SectionBlock>

            <a href={sponsorLink} className="rule-button w-full justify-center border-[#ff99b0] bg-[#fff5f8] py-3 text-[#ef3d66]"><Mail size={14} /> {t.email} <ArrowRight size={14} /></a>
          </div>
        </article>
      </section>
    </main>
  );
}

function SectionBlock({ children, icon: Icon, title }: { children: ReactNode; icon: typeof Sparkles; title: string }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 font-display text-2xl tracking-wide text-[#3d332b]">
        <Icon className="text-[#d87522]" size={20} /> {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
