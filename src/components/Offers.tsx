import { ArrowRight, BookOpen, Briefcase, CalendarDays, CheckCircle2, Crown, Heart, Mail, Sparkles, Users } from 'lucide-react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';

const contactEmail = 'ministarenglish@mail.com';

function mailto(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const copy = {
  en: {
    eyebrow: 'Join, Book, Or Partner',
    title: 'Turn The Table Into A Real Offer',
    subtitle: 'Meeple Sosen can earn through local sessions, Silver Circle groups, private coaching, school/community bookings, and weekly briefing-card products.',
    primary: 'Ask About A Session',
    secondary: 'See Weekly Briefings',
    best: 'Best first monetization path',
    bestCopy: 'Start with local paid sessions and Silver Circle memberships. They are easiest to explain, easiest to deliver, and create proof for schools, community partners, and downloadable products later.',
    productsTitle: 'Commercial Offers',
    funnelTitle: 'Simple Revenue Ladder',
    funnelCopy: 'Free useful content brings trust. Trial tables create experience. Membership and group bookings create recurring income. Briefing cards turn the method into a product.',
    partnerTitle: 'Partner Paths',
    partnerCopy: 'The strongest long-term route is not only individual learners. It is local institutions: community halls, senior groups, schools, family programs, cafes, libraries, and English teachers who need ready-made table activities.',
    products: [
      {
        icon: Heart,
        name: 'Silver Circle Membership',
        price: '¥3,000 / month',
        audience: 'Seniors, retired adults, local families',
        value: 'Gentle English board game sessions for conversation, confidence, and community participation.',
        cta: 'Ask about Silver Circle',
        subject: 'Silver Circle membership',
        body: 'I am interested in Silver Circle membership.\n\nName:\nPreferred area/day:\nQuestions:',
        bullets: ['Monthly recurring income', 'Easy local story', 'Strong referral potential'],
      },
      {
        icon: Users,
        name: 'English Game Table',
        price: '¥1,500 / session',
        audience: 'Beginners, parents, casual learners',
        value: 'A friendly drop-in table where players learn practical English while playing simple games.',
        cta: 'Book a trial table',
        subject: 'English game table trial',
        body: 'I would like to try an English game table.\n\nName:\nNumber of people:\nPreferred date:',
        bullets: ['Low-friction entry', 'Good for first-time visitors', 'Feeds membership'],
      },
      {
        icon: Crown,
        name: 'Private Strategy English Coaching',
        price: '¥5,000 / session',
        audience: 'Adults, executives, advanced learners',
        value: 'One-to-one or small-group English practice using strategic games, briefing cards, and review notes.',
        cta: 'Request coaching',
        subject: 'Private strategy English coaching',
        body: 'I am interested in private strategy English coaching.\n\nName:\nGoal:\nPreferred time:',
        bullets: ['Higher margin', 'Deep method proof', 'Creates testimonials'],
      },
      {
        icon: Briefcase,
        name: 'School / Community Workshop',
        price: 'From ¥15,000',
        audience: 'Schools, community halls, libraries, cafes',
        value: 'A prepared English-through-games workshop with game setup, phrase cards, and a simple session flow.',
        cta: 'Plan a workshop',
        subject: 'Workshop booking inquiry',
        body: 'I would like to discuss a Meeple Sosen workshop.\n\nOrganization:\nAudience:\nPossible date:\nBudget:',
        bullets: ['Institutional income', 'Local credibility', 'Scales beyond one table'],
      },
      {
        icon: BookOpen,
        name: 'Weekly Briefing Card Library',
        price: 'Future: ¥500-¥1,000 / month',
        audience: 'Teachers, parents, game groups',
        value: 'Printable English briefing cards for individual games: theme, useful phrases, prompts, and mission flow.',
        cta: 'Join briefing waitlist',
        subject: 'Briefing card library waitlist',
        body: 'Please add me to the briefing card library waitlist.\n\nName:\nI am a teacher / parent / learner / game group:',
        bullets: ['Digital product', 'SEO content engine', 'Can become subscription'],
      },
      {
        icon: CalendarDays,
        name: 'Seasonal Event Table',
        price: 'From ¥2,000 / person',
        audience: 'Families, groups, local events',
        value: 'A themed event such as beginner game night, parent-child English game day, or Silver Circle open table.',
        cta: 'Discuss an event',
        subject: 'Seasonal event table',
        body: 'I would like to discuss a seasonal event table.\n\nGroup size:\nTheme:\nPreferred date:',
        bullets: ['Campaign-friendly', 'Good for referrals', 'Creates local photos and stories'],
      },
    ],
    ladder: [
      ['Free', 'Weekly briefing cards, SEO pages, useful phrase samples'],
      ['Trial', 'Free or low-cost first table for hesitant people'],
      ['Core', 'Monthly Silver Circle and regular English game sessions'],
      ['Premium', 'Private coaching, workshops, group bookings'],
      ['Product', 'Printable cards, teacher packs, future subscription library'],
    ],
    partners: ['Community halls', 'Senior groups', 'Libraries', 'Schools', 'Cafes', 'English teachers', 'Family programs', 'Local wellness groups'],
  },
  ja: {
    eyebrow: '参加・予約・提携',
    title: 'テーブルを、実際のサービスへ',
    subtitle: 'Meeple Sosen は、地域セッション、Silver Circle、個別コーチング、学校・地域ワークショップ、週刊ブリーフィングカードで収益化できます。',
    primary: 'セッションについて相談する',
    secondary: '週刊ブリーフィングを見る',
    best: '最初に強い収益化ルート',
    bestCopy: 'まずは地域の有料セッションと Silver Circle の月会費から始めるのが自然です。説明しやすく、提供しやすく、後の学校・地域提携や教材販売の実績になります。',
    productsTitle: 'サービス内容',
    funnelTitle: '収益の階段',
    funnelCopy: '無料コンテンツで信頼を作り、体験テーブルで参加しやすくし、月会費と団体予約で継続収益を作ります。ブリーフィングカードは、方法そのものを商品にできます。',
    partnerTitle: '提携の方向性',
    partnerCopy: '長期的に強いのは個人だけではありません。公民館、シニア団体、学校、親子プログラム、カフェ、図書館、英語講師など、すぐ使えるテーブル活動を必要とする場所です。',
    products: [
      {
        icon: Heart,
        name: 'Silver Circle 月会費',
        price: '月 ¥3,000',
        audience: 'シニア、退職後の方、地域のご家族',
        value: '英語ボードゲームを通じて、会話・自信・地域参加を支えるやさしいセッションです。',
        cta: 'Silver Circle を相談する',
        subject: 'Silver Circle 月会費について',
        body: 'Silver Circle に興味があります。\n\nお名前：\n希望地域・曜日：\n質問：',
        bullets: ['継続収益になりやすい', '地域で説明しやすい', '紹介につながりやすい'],
      },
      {
        icon: Users,
        name: '英語ゲームテーブル',
        price: '1回 ¥1,500',
        audience: '初心者、保護者、気軽に学びたい方',
        value: 'シンプルなゲームを遊びながら、実用的な英語を少しずつ使う参加しやすいテーブルです。',
        cta: '体験を予約する',
        subject: '英語ゲームテーブル体験',
        body: '英語ゲームテーブルを体験したいです。\n\nお名前：\n人数：\n希望日：',
        bullets: ['参加のハードルが低い', '初回向き', '月会費につながる'],
      },
      {
        icon: Crown,
        name: '個別ストラテジー英語',
        price: '1回 ¥5,000',
        audience: '大人、経営者、中上級者',
        value: '戦略ゲーム、ブリーフィングカード、振り返りを使った個別または少人数の英語練習です。',
        cta: '個別相談する',
        subject: '個別ストラテジー英語について',
        body: '個別ストラテジー英語に興味があります。\n\nお名前：\n目標：\n希望時間：',
        bullets: ['単価が高い', '方法の実績になる', '感想を集めやすい'],
      },
      {
        icon: Briefcase,
        name: '学校・地域ワークショップ',
        price: '¥15,000 から',
        audience: '学校、公民館、図書館、カフェ',
        value: 'ゲーム準備、フレーズカード、進行表を含む英語ボードゲームのワークショップです。',
        cta: 'ワークショップ相談',
        subject: 'ワークショップ相談',
        body: 'Meeple Sosen のワークショップについて相談したいです。\n\n団体名：\n対象者：\n希望日：\n予算：',
        bullets: ['団体収益', '地域での信頼', '一つのテーブルを超えて広がる'],
      },
      {
        icon: BookOpen,
        name: '週刊ブリーフィングカード',
        price: '将来: 月 ¥500-¥1,000',
        audience: '英語講師、保護者、ゲーム会',
        value: 'ゲームごとのテーマ、使える英語、会話プロンプト、ミッションをまとめた印刷用カードです。',
        cta: '教材の案内を受け取る',
        subject: 'ブリーフィングカード教材について',
        body: 'ブリーフィングカード教材の案内を希望します。\n\nお名前：\n英語講師 / 保護者 / 学習者 / ゲーム会：',
        bullets: ['デジタル商品', 'SEO記事になる', 'サブスク化できる'],
      },
      {
        icon: CalendarDays,
        name: '季節イベントテーブル',
        price: '1人 ¥2,000 から',
        audience: '家族、グループ、地域イベント',
        value: '初心者ゲーム会、親子英語ゲームデー、Silver Circle 体験会などのテーマ型イベントです。',
        cta: 'イベント相談',
        subject: '季節イベントテーブルについて',
        body: '季節イベントテーブルについて相談したいです。\n\n人数：\nテーマ：\n希望日：',
        bullets: ['告知しやすい', '紹介につながる', '地域の写真や実績になる'],
      },
    ],
    ladder: [
      ['無料', '週刊ブリーフィング、SEOページ、使える英語サンプル'],
      ['体験', '不安な人が参加しやすい無料・低価格の初回テーブル'],
      ['中心', 'Silver Circle 月会費と定期英語ゲームセッション'],
      ['高単価', '個別コーチング、ワークショップ、団体予約'],
      ['商品', '印刷カード、講師パック、将来の教材サブスク'],
    ],
    partners: ['公民館', 'シニア団体', '図書館', '学校', 'カフェ', '英語講師', '親子プログラム', '地域ウェルネス団体'],
  },
} as const;

export function Offers({ language, onNavigate }: { language: Language; onNavigate: (section: Section) => void }) {
  const t = copy[language];
  const generalLink = mailto(
    language === 'ja' ? 'Meeple Sosen セッション相談' : 'Meeple Sosen session inquiry',
    language === 'ja' ? 'Meeple Sosen のセッションについて相談したいです。\n\nお名前：\n興味のある内容：\n希望日：' : 'I would like to ask about a Meeple Sosen session.\n\nName:\nOffer I am interested in:\nPreferred date:'
  );

  return (
    <main className="page-shell">
      <header className="tactical-banner py-14 text-center">
        <p className="eyebrow justify-center">{t.eyebrow}</p>
        <h1 className="compact-title mt-2">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#71685d]">{t.subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={generalLink} className="rule-button rule-button-primary px-7 py-3"><Mail size={14} /> {t.primary}</a>
          <button onClick={() => onNavigate('briefings')} className="rule-button px-7 py-3"><BookOpen size={14} /> {t.secondary}</button>
        </div>
      </header>

      <section className="container-shell py-10">
        <article className="reference-panel grid gap-5 p-6 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <Sparkles className="text-[#d87522]" size={30} />
            <h2 className="font-display mt-4 text-3xl tracking-wide text-[#bd5c24]">{t.best}</h2>
          </div>
          <p className="text-sm leading-7 text-[#62584f]">{t.bestCopy}</p>
        </article>

        <h2 className="font-display mt-12 text-center text-4xl tracking-wide text-[#bd5c24]">{t.productsTitle}</h2>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {t.products.map((product) => {
            const Icon = product.icon;
            const link = mailto(product.subject, product.body);
            return (
              <article key={product.name} className="reference-panel flex flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <Icon className="text-[#d87522]" size={27} />
                  <span className="rounded-full border border-[#efd39d] bg-[#fff8ea] px-3 py-1 text-xs font-bold text-[#bd5c24]">{product.price}</span>
                </div>
                <h3 className="font-display mt-5 text-2xl tracking-wide text-[#3d332b]">{product.name}</h3>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[#9a7560]">{product.audience}</p>
                <p className="mt-4 flex-1 text-sm leading-7 text-[#62584f]">{product.value}</p>
                <div className="mt-5 grid gap-2">
                  {product.bullets.map((bullet) => (
                    <p key={bullet} className="text-xs leading-5 text-[#5f675c]"><CheckCircle2 className="mr-2 inline text-[#35a765]" size={14} />{bullet}</p>
                  ))}
                </div>
                <a href={link} className="rule-button rule-button-primary mt-6 justify-center py-3">
                  {product.cta} <ArrowRight size={13} />
                </a>
              </article>
            );
          })}
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <article className="reference-panel p-6">
            <h2 className="font-display text-3xl tracking-wide text-[#bd5c24]">{t.funnelTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#62584f]">{t.funnelCopy}</p>
            <div className="mt-6 grid gap-3">
              {t.ladder.map(([stage, detail], index) => (
                <div key={stage} className="flex gap-4 rounded-xl border border-[#efd39d] bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0ce] font-display text-[#bd5c24]">{index + 1}</span>
                  <p className="text-sm leading-6 text-[#62584f]"><strong className="text-[#3d332b]">{stage}</strong><br />{detail}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="reference-panel p-6">
            <h2 className="font-display text-3xl tracking-wide text-[#bd5c24]">{t.partnerTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#62584f]">{t.partnerCopy}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.partners.map((partner) => (
                <span key={partner} className="rounded-full border border-[#bde8c9] bg-[#f7fff8] px-3 py-2 text-xs font-bold text-[#2e7c44]">{partner}</span>
              ))}
            </div>
            <a href={generalLink} className="rule-button mt-7 justify-center py-3">
              <Mail size={14} /> {t.primary}
            </a>
          </article>
        </section>
      </section>
    </main>
  );
}
