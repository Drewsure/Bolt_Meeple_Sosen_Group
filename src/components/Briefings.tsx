import { ArrowRight, BookOpen, Brain, CalendarDays, Download, MessageCircle, Search, Sparkles, Users } from 'lucide-react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';

export type Briefing = {
  slug: string;
  gameTitle: string;
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
  phraseTiers: {
    beginner: string[];
    someExperience: string[];
    experienced: string[];
  };
  jpPhraseTiers: {
    beginner: string[];
    someExperience: string[];
    experienced: string[];
  };
  prompts: string[];
  jpPrompts: string[];
  silverFit: string;
  jpSilverFit: string;
};

export const briefings: Briefing[] = [
  {
    slug: 'camel-up-english-briefing-card',
    gameTitle: 'Camel Up',
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
    phraseTiers: {
      beginner: ["I'm choosing blue.", "I'm watching red.", "I'm betting on blue.", "I'm hoping blue wins.", "I'm surprised!"],
      someExperience: ["I'm thinking blue is winning.", "I'm watching red fall behind.", "I'm changing my mind now.", "I'm taking a safer bet."],
      experienced: ["I'm changing my mind because the race order is shifting.", "I'm choosing yellow because the odds are getting better.", "I'm not trusting blue after that roll.", "I'm taking a risk because the reward is bigger."],
    },
    jpPhraseTiers: {
      beginner: ['青を選んでいます。', '赤を見ています。', '青に賭けています。', '青が勝つと期待しています。', 'びっくりしています！'],
      someExperience: ['青が勝っていると思っています。', '赤が遅れているのを見ています。', '今、考えを変えています。', 'より安全な賭けをしています。'],
      experienced: ['レースの順番が変わっているので、考えを変えています。', 'オッズが良くなっているので、黄色を選んでいます。', 'その出目の後、もう青を信じていません。', 'リターンが大きいので、リスクを取っています。'],
    },
    prompts: ['Which camel do you trust now?', 'What changed after that roll?', 'Was your bet safe or risky?'],
    jpPrompts: ['今、どのラクダを信じますか？', 'そのサイコロで何が変わりましたか？', 'その賭けは安全でしたか、リスクがありましたか？'],
    silverFit: 'Very strong. It is visual, funny, fast, and easy to support with Japanese.',
    jpSilverFit: 'とても合います。見てわかりやすく、笑いやすく、短時間で遊べます。',
  },
  {
    slug: 'azul-english-briefing-card',
    gameTitle: 'Azul',
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
    phraseTiers: {
      beginner: ["I'm taking blue.", "I'm choosing red.", "I'm filling this row.", "I'm avoiding waste.", "I'm building my wall."],
      someExperience: ["I'm taking this color because I need it.", "I'm finishing this row.", "I'm avoiding extra tiles.", "I'm improving my pattern."],
      experienced: ["I'm taking this color because it is completing my row.", "I'm blocking you while protecting my score.", "I'm avoiding waste, even though I'm scoring less now.", "I'm choosing the safer pattern for later points."],
    },
    jpPhraseTiers: {
      beginner: ['青を取っています。', '赤を選んでいます。', 'この列を埋めています。', '無駄を避けています。', '自分の壁を作っています。'],
      someExperience: ['必要なので、この色を取っています。', 'この列を完成させています。', '余分なタイルを避けています。', '模様を良くしています。'],
      experienced: ['この列が完成するので、この色を取っています。', '自分の点を守りながら、あなたを止めています。', '今は点が少なくても、無駄を避けています。', '後の得点のために、安全な模様を選んでいます。'],
    },
    prompts: ['Which color do you need most?', 'What are you trying to avoid?', 'Did you help yourself or block someone?'],
    jpPrompts: ['一番必要な色は何ですか？', '何を避けようとしていますか？', '自分を助けましたか、それとも誰かを止めましたか？'],
    silverFit: 'Strong. Beautiful components and calm turns make it reassuring for slower conversation.',
    jpSilverFit: 'よく合います。見た目が美しく、落ち着いたターンで会話しやすいです。',
  },
  {
    slug: 'carcassonne-english-briefing-card',
    gameTitle: 'Carcassonne',
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
    phraseTiers: {
      beginner: ["I'm placing this here.", "I'm making my road.", "I'm building my city.", "I'm connecting this tile.", "I'm getting points."],
      someExperience: ["I'm placing this tile here.", "I'm connecting it to my road.", "I'm trying to finish this city.", "I'm blocking your farm."],
      experienced: ["I'm placing this tile here because it is giving me two scoring options.", "I'm connecting to my road while reducing your farm value.", "I'm trying to finish this city before someone blocks it.", "I'm keeping this area open for another tile."],
    },
    jpPhraseTiers: {
      beginner: ['これをここに置いています。', '自分の道を作っています。', '自分の都市を作っています。', 'このタイルをつなげています。', '点を取っています。'],
      someExperience: ['このタイルをここに置いています。', '自分の道につなげています。', 'この都市を完成させようとしています。', 'あなたの草原を止めています。'],
      experienced: ['得点の選択肢が二つできるので、このタイルをここに置いています。', '自分の道につなげながら、あなたの草原の価値を下げています。', '誰かに止められる前に、この都市を完成させようとしています。', '次のタイルのために、この場所を空けています。'],
    },
    prompts: ['Why did you place it there?', 'What are you trying to finish?', 'Did you help yourself or block someone?'],
    jpPrompts: ['なぜそこに置きましたか？', '何を完成させようとしていますか？', '自分を助けましたか、誰かを止めましたか？'],
    silverFit: 'Good. Use fewer rules at first and focus on roads and cities.',
    jpSilverFit: '合います。最初はルールを少なくして、道と都市に集中すると安心です。',
  },
  {
    slug: 'sushi-go-english-briefing-card',
    gameTitle: 'Sushi Go!',
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
    phraseTiers: {
      beginner: ["I'm taking tempura.", "I'm passing this.", "I'm waiting for one more.", "I'm keeping this card.", "I'm making sushi points."],
      someExperience: ["I'm passing this card.", "I'm looking for one more.", "I'm taking this for points.", "I'm guessing you want pudding."],
      experienced: ["I'm keeping this because it is working with my last card.", "I'm taking pudding because I think you want it.", "I'm saving this because it may score later.", "I'm passing this because it is not helping me now."],
    },
    jpPhraseTiers: {
      beginner: ['天ぷらを取っています。', 'これを渡しています。', 'もう一枚を待っています。', 'このカードを残しています。', '寿司で点を作っています。'],
      someExperience: ['このカードを渡しています。', 'もう一枚を探しています。', '点のためにこれを取っています。', 'あなたはプリンが欲しいと思っています。'],
      experienced: ['前のカードと合うので、これを残しています。', 'あなたが欲しいと思うので、プリンを取っています。', '後で点になるかもしれないので、これを残しています。', '今は役に立たないので、これを渡しています。'],
    },
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
    introTitle: 'How To Use These Cards',
    introBullets: [
      'Choose one game before the session.',
      'Pick one mission and a few useful phrases.',
      'Play gently, speak during real turns, and review one phrase at the end.',
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
    introTitle: 'このカードの使い方',
    introBullets: [
      'セッション前にゲームを一つ選びます。',
      'ミッションを一つ、使うフレーズをいくつか選びます。',
      '実際のターンで少しずつ話し、最後に一つの表現を振り返ります。',
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
  const openBriefing = (slug: string) => {
    window.location.hash = `briefings/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openGame = (title: string) => {
    window.location.hash = `games?q=${encodeURIComponent(title)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <h2 className="font-display text-3xl tracking-wide text-[#bd5c24]">{t.introTitle}</h2>
            <div className="mt-5 grid gap-3">
              {t.introBullets.map((bullet, index) => {
                const icons = [BookOpen, MessageCircle, Sparkles];
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
                <PhraseTiers title={t.phrases} tiers={language === 'ja' ? briefing.jpPhraseTiers : briefing.phraseTiers} language={language} compact />
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
                  <button onClick={() => openBriefing(briefing.slug)} className="rule-button px-4 py-2"><BookOpen size={13} /> {t.read}</button>
                  <button onClick={() => openGame(briefing.gameTitle)} className="rule-button px-4 py-2"><Search size={13} /> {language === 'ja' ? 'ゲームを見る' : 'View Game'}</button>
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

export function BriefingDetail({ language, onNavigate, slug }: { language: Language; onNavigate: (section: Section) => void; slug: string }) {
  const t = pageCopy[language];
  const briefing = briefings.find((item) => item.slug === slug) ?? briefings[0];
  const title = language === 'ja' ? briefing.jpTitle : briefing.title;
  const audience = language === 'ja' ? briefing.jpAudience : briefing.audience;
  const level = language === 'ja' ? briefing.jpLevel : briefing.level;
  const prompts = language === 'ja' ? briefing.jpPrompts : briefing.prompts;
  const openGame = () => {
    window.location.hash = `games?q=${encodeURIComponent(briefing.gameTitle)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-shell">
      <article className="container-shell py-12">
        <a href="#briefings" className="text-xs font-bold uppercase tracking-wide text-[#c86123]">
          {language === 'ja' ? '← ブリーフィング一覧へ' : '← Back to all briefings'}
        </a>

        <header className="reference-panel mt-6 overflow-hidden">
          <div className="bg-[#fff8ea] p-7 text-center">
            <p className="eyebrow justify-center">{level}</p>
            <h1 className="compact-title mt-2">{title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#71685d]">
              {language === 'ja'
                ? '一つのゲームを英語セッションで使いやすくするためのブリーフィングページです。'
                : 'A standalone briefing page for one game, designed for real English table sessions.'}
            </p>
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            <div className="border-b border-[#efd39d] p-5 text-center md:border-b-0 md:border-r">
              <Users className="mx-auto text-[#d87522]" size={24} />
              <p className="mt-3 text-[10px] font-bold uppercase text-[#8a7563]">{t.audience}</p>
              <p className="mt-2 text-sm leading-6 text-[#62584f]">{audience}</p>
            </div>
            <div className="border-b border-[#efd39d] p-5 text-center md:border-b-0 md:border-r">
              <CalendarDays className="mx-auto text-[#d87522]" size={24} />
              <p className="mt-3 text-[10px] font-bold uppercase text-[#8a7563]">{language === 'ja' ? '公開リズム' : 'Publishing Use'}</p>
              <p className="mt-2 text-sm leading-6 text-[#62584f]">{language === 'ja' ? '毎週記事のサンプル' : 'Example weekly article'}</p>
            </div>
            <div className="p-5 text-center">
              <BookOpen className="mx-auto text-[#d87522]" size={24} />
              <p className="mt-3 text-[10px] font-bold uppercase text-[#8a7563]">{language === 'ja' ? 'セッション用' : 'Session Use'}</p>
              <p className="mt-2 text-sm leading-6 text-[#62584f]">{language === 'ja' ? 'テーブルでそのまま使える英語カード' : 'Ready to use at the table'}</p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-5">
            <BriefingBlock icon={BookOpen} title={t.theme} body={language === 'ja' ? briefing.jpTheme : briefing.theme} />
            <BriefingBlock icon={Brain} title={t.why} body={language === 'ja' ? briefing.jpWhy : briefing.why} />
            <BriefingBlock icon={Sparkles} title={t.mission} body={language === 'ja' ? briefing.jpMission : briefing.mission} />
            <div className="reference-panel p-5">
              <h2 className="font-display text-2xl tracking-wide text-[#bd5c24]">{t.prompts}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {prompts.map((prompt) => (
                  <p key={prompt} className="rounded-xl border border-[#bde8c9] bg-[#f7fff8] p-4 text-sm leading-7 text-[#536456]">
                    <MessageCircle className="mb-2 text-[#2e7c44]" size={16} />{prompt}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="reference-panel p-5">
              <PhraseTiers title={t.phrases} tiers={language === 'ja' ? briefing.jpPhraseTiers : briefing.phraseTiers} language={language} />
            </div>
            <div className="reference-panel border-[#ffbdce] bg-[#fff7fa] p-5">
              <h2 className="font-display text-2xl tracking-wide text-[#ef3d66]">{t.silver}</h2>
              <p className="mt-3 text-sm leading-7 text-[#62584f]">{language === 'ja' ? briefing.jpSilverFit : briefing.silverFit}</p>
            </div>
            <div className="reference-panel p-5">
              <h2 className="font-display text-2xl tracking-wide text-[#3d332b]">FAQ</h2>
              <details className="mt-4 rounded border border-[#efd39d] bg-white p-4">
                <summary className="cursor-pointer font-bold">{language === 'ja' ? '初心者に向いていますか？' : 'Is this good for beginners?'}</summary>
                <p className="mt-3 text-sm leading-7 text-[#62584f]">{language === 'ja' ? 'はい。短い表現から始められるので、初心者にも使いやすいです。' : 'Yes. It works well because the language can start with short, repeatable phrases.'}</p>
              </details>
              <details className="mt-3 rounded border border-[#efd39d] bg-white p-4">
                <summary className="cursor-pointer font-bold">{language === 'ja' ? 'どう使えばいいですか？' : 'How should I use it at the table?'}</summary>
                <p className="mt-3 text-sm leading-7 text-[#62584f]">{language === 'ja' ? '一つのミッションと三つのプロンプトだけを選び、プレイ中に無理なく使います。' : 'Choose one mission and three prompts, then use them lightly during play.'}</p>
              </details>
            </div>
            <button onClick={() => onNavigate('board')} className="rule-button rule-button-primary w-full justify-center py-3">
              <ArrowRight size={14} /> {t.cta}
            </button>
            <button onClick={openGame} className="rule-button w-full justify-center py-3">
              <Search size={14} /> {language === 'ja' ? 'ゲームカードを見る' : 'View Linked Game Card'}
            </button>
          </aside>
        </section>
      </article>
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

function PhraseTiers({
  compact = false,
  language,
  tiers,
  title,
}: {
  compact?: boolean;
  language: Language;
  tiers: Briefing['phraseTiers'];
  title: string;
}) {
  const labels = language === 'ja'
    ? ['Beginner / 初心者', 'Some Experience / 少し経験あり', 'Experienced / 経験者']
    : ['Beginner', 'Some Experience', 'Experienced'];
  const entries = [
    { label: labels[0], phrases: tiers.beginner, tone: 'border-[#bde8c9] bg-[#f7fff8] text-[#2e7c44]' },
    { label: labels[1], phrases: tiers.someExperience, tone: 'border-[#efd39d] bg-[#fffaf0] text-[#8a5d2a]' },
    { label: labels[2], phrases: tiers.experienced, tone: 'border-[#b9d2fb] bg-[#f7fbff] text-[#366eb4]' },
  ];

  return (
    <div className="rounded-xl border border-[#efd39d] bg-[#fffaf0] p-4">
      <h3 className="font-display text-xl tracking-wide text-[#3d332b]">{title}</h3>
      <div className={`mt-3 grid gap-3 ${compact ? '' : 'lg:grid-cols-1'}`}>
        {entries.map(({ label, phrases, tone }) => (
          <section key={label} className={`rounded-xl border p-3 ${tone}`}>
            <p className="text-[10px] font-bold uppercase tracking-wide">{label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {phrases.map((phrase) => (
                <span key={phrase} className="rounded-full border border-white/80 bg-white px-3 py-1 text-xs font-bold text-[#4f463e] shadow-sm">
                  {phrase}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
