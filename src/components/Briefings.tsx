import { ArrowRight, BookOpen, Brain, CalendarDays, Download, HelpCircle, MapPin, MessageCircle, Search, Sparkles, Users } from 'lucide-react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';

type Briefing = {
  slug: string;
  title: string;
  jpTitle: string;
  audience: string;
  jpAudience: string;
  level: string;
  jpLevel: string;
  theme: string;
  jpTheme: string;
  why: string;
  jpWhy: string;
  mission: string;
  jpMission: string;
  phrases: string[];
  prompts: string[];
  jpPrompts: string[];
  silverFit: string;
  jpSilverFit: string;
};

const briefings: Briefing[] = [
  {
    slug: 'camel-up-english-briefing-card',
    title: 'Camel Up English Briefing Card',
    jpTitle: 'キャメルアップ 英語ブリーフィングカード',
    audience: 'Beginners, families, Silver Circle tables',
    jpAudience: '初心者、家族、シルバーサークル向け',
    level: 'Beginner friendly',
    jpLevel: '初心者向け',
    theme: 'A lively camel race where players predict which camel will win, fall behind, or surprise the table.',
    jpTheme: 'ラクダのレースを予想する、明るくて笑いやすいゲームです。',
    why: 'The race gives natural reasons to predict, react, and change your mind. It is excellent for short English phrases and emotional reactions.',
    jpWhy: '予想する、反応する、考えを変える理由が自然に生まれます。短い英語表現にとても向いています。',
    mission: 'Before placing a bet, say one prediction and one reason.',
    jpMission: '賭ける前に、予想と理由を一つずつ言う。',
    phrases: ['I think the blue camel will win.', 'Maybe red will fall behind.', 'That was a surprise.', 'I changed my mind because...', 'It is risky, but I choose...'],
    prompts: ['Which camel do you trust now?', 'What changed after that roll?', 'Was your bet safe or risky?'],
    jpPrompts: ['今、どのラクダを信じますか？', 'そのサイコロで何が変わりましたか？', 'その賭けは安全でしたか、リスクがありましたか？'],
    silverFit: 'Very strong. It is visual, funny, fast, and easy to support with Japanese.',
    jpSilverFit: 'とても合います。見てわかりやすく、笑いやすく、短時間で遊べます。',
  },
  {
    slug: 'azul-english-briefing-card',
    title: 'Azul English Briefing Card',
    jpTitle: 'アズール 英語ブリーフィングカード',
    audience: 'Calm beginner tables, visual thinkers, seniors',
    jpAudience: '落ち着いた初心者テーブル、視覚的に考える人、シニア向け',
    level: 'Beginner to light intermediate',
    jpLevel: '初心者〜初級中級',
    theme: 'Players draft beautiful tiles and build a patterned wall while avoiding wasted pieces.',
    jpTheme: '美しいタイルを選び、無駄を避けながら模様を作るゲームです。',
    why: 'Azul creates careful choice language: colors, patterns, avoiding waste, and explaining simple strategy.',
    jpWhy: '色、模様、無駄を避ける、簡単な作戦を説明する英語が自然に出てきます。',
    mission: 'Explain your tile choice using color, pattern, and one risk.',
    jpMission: '色、模様、リスクを使って、選んだ理由を説明する。',
    phrases: ['I need this color.', 'This row is almost finished.', 'I want to avoid waste.', 'This choice blocks you.', 'My pattern is getting better.'],
    prompts: ['Which color do you need most?', 'What are you trying to avoid?', 'Did you help yourself or block someone?'],
    jpPrompts: ['一番必要な色は何ですか？', '何を避けようとしていますか？', '自分を助けましたか、それとも誰かを止めましたか？'],
    silverFit: 'Strong. Beautiful components and calm turns make it reassuring for slower conversation.',
    jpSilverFit: 'よく合います。見た目が美しく、落ち着いたターンで会話しやすいです。',
  },
  {
    slug: 'carcassonne-english-briefing-card',
    title: 'Carcassonne English Briefing Card',
    jpTitle: 'カルカソンヌ 英語ブリーフィングカード',
    audience: 'Beginner strategy tables, families, gentle competition',
    jpAudience: '初心者戦略テーブル、家族、やさしい競争向け',
    level: 'Beginner friendly',
    jpLevel: '初心者向け',
    theme: 'Players build a shared landscape of cities, roads, farms, and monasteries one tile at a time.',
    jpTheme: '都市、道、草原、修道院をタイルで少しずつ作るゲームです。',
    why: 'Every tile placement creates a clear reason to speak: here, next to, because, connect, block, finish.',
    jpWhy: 'タイルを置くたびに、場所、理由、つなげる、止める、完成させる表現が使えます。',
    mission: 'When placing a tile, say where it goes and why it helps.',
    jpMission: 'タイルを置く時に、どこに置くか、なぜ役に立つかを言う。',
    phrases: ['I place this tile here.', 'This connects to my road.', 'I want to finish this city.', 'This blocks your farm.', 'I get points because...'],
    prompts: ['Why did you place it there?', 'What are you trying to finish?', 'Did you help yourself or block someone?'],
    jpPrompts: ['なぜそこに置きましたか？', '何を完成させようとしていますか？', '自分を助けましたか、誰かを止めましたか？'],
    silverFit: 'Good. Use fewer rules at first and focus on roads and cities.',
    jpSilverFit: '合います。最初はルールを少なくして、道と都市に集中すると安心です。',
  },
  {
    slug: 'sushi-go-english-briefing-card',
    title: 'Sushi Go! English Briefing Card',
    jpTitle: 'すしゴー 英語ブリーフィングカード',
    audience: 'Children, parents, beginners, quick warm-up tables',
    jpAudience: '子ども、保護者、初心者、短いウォームアップ向け',
    level: 'Very beginner friendly',
    jpLevel: 'とても初心者向け',
    theme: 'A fast card-drafting game about choosing sushi combinations before the cards pass away.',
    jpTheme: '回ってくる寿司カードから組み合わせを選ぶ、短くて楽しいゲームです。',
    why: 'It is perfect for food words, simple preference language, quick reactions, and prediction.',
    jpWhy: '食べ物、好き嫌い、短い反応、予想の英語にぴったりです。',
    mission: 'Say what you want, what you pass, and one reason.',
    jpMission: '欲しいカード、渡すカード、理由を一つ言う。',
    phrases: ['I want tempura.', 'I pass this card.', 'I need one more.', 'This is good for points.', 'I think you want pudding.'],
    prompts: ['What food do you want?', 'What card are you waiting for?', 'Can you predict another player?'],
    jpPrompts: ['どの食べ物が欲しいですか？', 'どのカードを待っていますか？', '他の人の狙いを予想できますか？'],
    silverFit: 'Good as a short warm-up, but the passing can feel fast. Slow mode is recommended.',
    jpSilverFit: '短いウォームアップに良いです。ただし少し速いので、ゆっくりモードがおすすめです。',
  },
];

const pageCopy = {
  en: {
    eyebrow: 'Weekly English Game Briefings',
    title: 'A Blog That Works Like A Teaching Library',
    subtitle: 'Each week, publish one simple game briefing card. It helps search engines, AI answers, local discovery, and real people preparing for a table session.',
    seoTitle: 'Why this helps SEO + GEO + AEO',
    seoBullets: [
      'SEO: each game creates a searchable page for “game name + English conversation”.',
      'GEO: Fukuoka and Nishi-ku local wording connects the content to place.',
      'AEO: clear questions, answers, phrases, and summaries help AI answer engines quote the site.',
    ],
    cadence: 'Recommended publishing rhythm',
    cadenceCopy: 'Release one briefing every week, then collect four into a monthly guide such as “Best Beginner Board Games For English Conversation In Fukuoka.”',
    audience: 'Best For',
    theme: 'Theme Brief',
    why: 'Why It Works For English',
    mission: 'Table Mission',
    phrases: 'Useful Phrases',
    prompts: 'Conversation Prompts',
    silver: 'Silver Circle Fit',
    read: 'Open Briefing',
    cta: 'Use These In A Session',
  },
  ja: {
    eyebrow: '毎週の英語ゲーム・ブリーフィング',
    title: 'ブログではなく、使える教材ライブラリーへ',
    subtitle: '毎週一つ、シンプルなゲーム別ブリーフィングカードを公開します。検索、AI回答、地域発見、そして実際のセッション準備に役立ちます。',
    seoTitle: 'SEO + GEO + AEO に効く理由',
    seoBullets: [
      'SEO: 「ゲーム名 + 英会話」で検索されるページを増やせます。',
      'GEO: 福岡・西区など地域の言葉を入れることで、場所との関係が強くなります。',
      'AEO: 質問、答え、フレーズ、要約を明確にすると、AI回答にも拾われやすくなります。',
    ],
    cadence: 'おすすめ公開リズム',
    cadenceCopy: '毎週一つ公開し、月末に「福岡で英会話に使いやすい初心者向けボードゲーム」のようなまとめ記事にします。',
    audience: 'おすすめ対象',
    theme: 'テーマ説明',
    why: '英語に向いている理由',
    mission: 'テーブルミッション',
    phrases: '使えるフレーズ',
    prompts: '会話プロンプト',
    silver: 'シルバーサークル適性',
    read: 'ブリーフィングを見る',
    cta: 'セッションで使う',
  },
} as const;

export function Briefings({ language, onNavigate }: { language: Language; onNavigate: (section: Section) => void }) {
  const t = pageCopy[language];

  return (
    <main className="page-shell">
      <header className="tactical-banner py-12 text-center">
        <p className="eyebrow justify-center">{t.eyebrow}</p>
        <h1 className="compact-title mt-2">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#71685d]">{t.subtitle}</p>
      </header>

      <div className="container-shell py-10">
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <article className="reference-panel p-6">
            <h2 className="font-display text-3xl tracking-wide text-[#bd5c24]">{t.seoTitle}</h2>
            <div className="mt-5 grid gap-3">
              {t.seoBullets.map((bullet, index) => {
                const icons = [Search, MapPin, HelpCircle];
                const Icon = icons[index];
                return (
                  <p key={bullet} className="rounded-xl border border-[#efd39d] bg-white p-4 text-sm leading-7 text-[#62584f]">
                    <Icon className="mr-2 inline text-[#d87522]" size={17} />{bullet}
                  </p>
                );
              })}
            </div>
          </article>
          <article className="reference-panel p-6">
            <CalendarDays className="text-[#d87522]" size={28} />
            <h2 className="font-display mt-4 text-3xl tracking-wide text-[#3d332b]">{t.cadence}</h2>
            <p className="mt-4 text-sm leading-7 text-[#62584f]">{t.cadenceCopy}</p>
            <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary mt-6 px-5 py-3">
              <Sparkles size={14} /> {t.cta}
            </button>
          </article>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {briefings.map((briefing) => (
            <article key={briefing.slug} id={briefing.slug} className="reference-panel overflow-hidden">
              <div className="border-b border-[#efd39d] bg-[#fff8ea] p-5">
                <p className="eyebrow">{language === 'ja' ? briefing.jpLevel : briefing.level}</p>
                <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">{language === 'ja' ? briefing.jpTitle : briefing.title}</h2>
                <p className="mt-2 text-xs text-[#766b60]"><Users className="mr-1 inline" size={13} />{language === 'ja' ? briefing.jpAudience : briefing.audience}</p>
              </div>
              <div className="space-y-4 p-5">
                <BriefingBlock icon={BookOpen} title={t.theme} body={language === 'ja' ? briefing.jpTheme : briefing.theme} />
                <BriefingBlock icon={Brain} title={t.why} body={language === 'ja' ? briefing.jpWhy : briefing.why} />
                <BriefingBlock icon={Sparkles} title={t.mission} body={language === 'ja' ? briefing.jpMission : briefing.mission} />
                <div className="rounded-xl border border-[#efd39d] bg-[#fffaf0] p-4">
                  <h3 className="font-display text-xl tracking-wide text-[#3d332b]">{t.phrases}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {briefing.phrases.map((phrase) => (
                      <span key={phrase} className="rounded-full border border-[#e4c785] bg-white px-3 py-1 text-xs font-bold text-[#8a5d2a]">{phrase}</span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(language === 'ja' ? briefing.jpPrompts : briefing.prompts).map((prompt) => (
                    <div key={prompt} className="rounded-xl border border-[#bde8c9] bg-[#f7fff8] p-4 text-xs leading-6 text-[#536456]">
                      <MessageCircle className="mb-2 text-[#2e7c44]" size={16} />{prompt}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#ffbdce] bg-[#fff7fa] p-4">
                  <h3 className="font-display text-xl tracking-wide text-[#ef3d66]">{t.silver}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{language === 'ja' ? briefing.jpSilverFit : briefing.silverFit}</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href={`#${briefing.slug}`} className="rule-button px-4 py-2"><BookOpen size={13} /> {t.read}</a>
                  <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary px-4 py-2"><ArrowRight size={13} /> {t.cta}</button>
                  <button className="rounded border border-[#e0d2b6] bg-white px-4 py-2 text-[10px] font-bold uppercase text-[#8c7563]"><Download size={13} className="mr-1 inline" /> PDF later</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function BriefingBlock({ icon: Icon, title, body }: { icon: typeof BookOpen; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#efd39d] bg-white p-4">
      <h3 className="flex items-center gap-2 font-display text-xl tracking-wide text-[#3d332b]"><Icon className="text-[#d87522]" size={17} />{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#62584f]">{body}</p>
    </div>
  );
}
