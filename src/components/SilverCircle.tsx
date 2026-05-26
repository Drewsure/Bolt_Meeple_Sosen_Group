import { ArrowRight, Brain, CheckCircle2, Clock3, Heart, Mail, MapPin, Phone, Quote, ShieldCheck, Smile, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { getSilverCircleGames } from '../lib/games';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';
import type { Game } from '../types/database';

const contactEmail = 'ministarenglish@mail.com';

const copy = {
  en: {
    badge: 'Free English game trial now open',
    location: 'Nishi-ku, Fukuoka - local English board game club',
    body: 'Gather at a nearby community table, enjoy simple board games in English, and connect with real people. Japanese support is available, and beginners are welcome.',
    proof1: 'GB English games + Japanese support',
    proof2: 'Helps prevent isolation through participation',
    proof3: 'Small groups in walking distance',
    pain: [
      ['The days feel too similar', 'It can be hard to find a reason to go out when routine becomes quiet.'],
      ['You worry about memory or mental sharpness', 'You want gentle stimulation without pressure or embarrassment.'],
      ['There are fewer people to talk with', 'A small, welcoming place can make conversation easier.'],
      ['English has always interested you', 'Now you can try again through play, not homework.'],
    ],
    evidenceLead: 'English + analog games can become double brain training.',
    evidenceBody: 'Research suggests that bilingual activity, social participation, and cognitively engaging games may support cognitive reserve, confidence, and wellbeing. Silver Circle is not medical care; it is a friendly community activity.',
    evidenceCards: [
      ['Bilingual use', 'Second-language use is associated with cognitive reserve in several studies.'],
      ['Board games', 'Board games can support planning, memory, turn-taking, and social connection.'],
      ['Small groups', 'A predictable, friendly table lowers the emotional barrier to participation.'],
      ['Conversation', 'Simple phrases such as "My turn" and "Good move" can become natural quickly.'],
    ],
    benefits: [
      ['Use English gently', 'Rules, choices, memory, and expression appear naturally during play.'],
      ['Real companionship', 'The table creates a reason to talk, laugh, and return.'],
      ['A reason to go out', 'A regular local session can become a soft rhythm in the week.'],
      ['Safe for beginners', 'Japanese support and simple games make the first step easier.'],
    ],
    steps: [
      ['Apply for a free trial', 'Send an email with your preferred day and any questions.'],
      ['Come to a nearby venue', 'We begin with a small, friendly table in the Nishi-ku area.'],
      ['Enjoy games in English', 'The instructor supports both Japanese and simple English phrases.'],
    ],
    pricing: [
      ['Free Trial', '¥0', 'first visit', ['One time only', 'Games and materials included', 'Email questions welcome']],
      ['Monthly Plan', '¥3,000', '2 sessions / month', ['Twice per month', 'Games and drinks included', 'Phrase sheet included']],
      ['Drop-In', '¥1,500', 'per session', ['No reservation plan', 'Games and materials included', 'Join casually']],
    ],
    faqs: [
      ['Is it okay if I do not understand English?', 'Yes. We begin with Japanese support and very small phrases.'],
      ['Is it okay if I have never played board games?', 'Yes. We choose simple games that can be learned quickly.'],
      ['Can I come alone?', 'Yes. Many people come alone for the first trial.'],
      ['What should I wear?', 'Normal comfortable clothes are fine.'],
      ['Is this medical care?', 'No. It is a community activity for conversation, play, and participation.'],
    ],
    testimonials: [
      ['Y, 72', 'I had not spoken English for years, but "My turn!" came out naturally. Now I look forward to each session.'],
      ['K, 68', 'I was nervous at first, but the Japanese support made it comfortable. I wanted to come again.'],
      ['T, 75', 'I was happy to tell my grandchild that I played a game in English. I also made new friends.'],
    ],
    scheduleTitle: 'Silver Circle Schedule And Fees',
    scheduleCardTitle: 'Silver Circle Schedule',
    schedule: '1st and 3rd Thursday, 2pm-4pm',
    schedulePlace: 'Nearby community hall, capacity 6',
    footerAbout: 'Silver Circle is a local participation program from the Meeple Sosen Group. It supports conversation, social connection, and joyful learning through English board games.',
  },
  ja: {
    badge: '英語ゲーム体験会 無料開催中',
    location: '西区・福岡市 ご近所 英語ゲーム倶楽部',
    body: '近くの会場に集まって、英語のボードゲームを楽しむシニア向けプログラムです。日本語サポートがあるので、英語が初めてでも、ゲームが初めてでも大丈夫です。',
    proof1: '英語ゲーム・日本語サポート',
    proof2: '参加を通じて孤立を防ぐ',
    proof3: '少人数・徒歩圏内',
    pain: [
      ['毎日が似たような日々', '外に出る理由が少なくなり、生活が静かになりすぎることがあります。'],
      ['頭の衰えが少し心配', '恥ずかしさやプレッシャーなしで、やさしく頭を使う場所がほしい。'],
      ['話し相手が少ない', '小さくて安心できる場所なら、会話を始めやすくなります。'],
      ['英語がずっと気になっていた', '勉強ではなく、ゲームの中で自然に英語を使ってみます。'],
    ],
    evidenceLead: '英語×アナログゲームは、二重の脳トレになります。',
    evidenceBody: '研究では、第二言語の使用、社会参加、認知的に関わる遊びが、認知予備能・自信・ウェルビーイングを支える可能性が示されています。Silver Circle は医療行為ではなく、地域参加と楽しい学びを支える活動です。',
    evidenceCards: [
      ['第二言語', '第二言語を使う活動は、認知予備能と関係する可能性があります。'],
      ['ボードゲーム', '計画、記憶、順番、交流を同時に使う活動です。'],
      ['少人数', '予測しやすい安心なテーブルは、参加の不安を下げます。'],
      ['会話', '“My turn” や “Good move” など、短い英語から自然に始めます。'],
    ],
    benefits: [
      ['英語をやさしく使う', 'ルール確認、選択、記憶、表現が遊びの中で自然に出てきます。'],
      ['本物の仲間づくり', '話す、笑う、また来る理由をテーブルが作ります。'],
      ['外に出るきっかけ', '近くの定期セッションが、週のやさしいリズムになります。'],
      ['初心者も安心', '日本語サポートと簡単なゲームで、最初の一歩を小さくできます。'],
    ],
    steps: [
      ['無料体験に申し込む', '希望日や質問をメールでお送りください。'],
      ['近くの会場へ来る', '西区周辺の小さなテーブルから始めます。'],
      ['英語でゲームを楽しむ', '講師が日本語と簡単な英語フレーズでサポートします。'],
    ],
    pricing: [
      ['無料体験', '¥0', '初回1回', ['1回限り', 'ゲーム・道具込み', 'メール相談可']],
      ['月会費プラン', '¥3,000', '月2回', ['月2回（隔週）', 'ゲーム・飲み物込み', '英語フレーズ集つき']],
      ['都度参加', '¥1,500', '1回ごと', ['予約不要プラン', 'ゲーム・道具込み', '気軽に参加']],
    ],
    faqs: [
      ['英語が全くわからなくても大丈夫ですか？', 'はい。最初は日本語サポートを使いながら、短い言葉から始めます。'],
      ['ゲームが初めてでも大丈夫ですか？', '大丈夫です。短時間で覚えられるシンプルなゲームから選びます。'],
      ['一人でも参加できますか？', 'はい。ほとんどの方が一人で体験に来られます。'],
      ['どんな服装で来れば良いですか？', '普段着で大丈夫です。リラックスしてお越しください。'],
      ['医療や認知症治療ですか？', 'いいえ。会話、遊び、地域参加を支えるコミュニティ活動です。'],
    ],
    testimonials: [
      ['Yさん（72歳）', '何年も英語を話していなかったのに、「My turn!」って自然に声が出ました。今では毎回楽しみです。'],
      ['Kさん（68歳）', '最初は不安でしたが、日本語でサポートしてくれるので安心でした。帰る頃には、また来たいと思いました。'],
      ['Tさん（75歳）', '孫に「英語でゲームをしたよ」と話せるのが嬉しいです。新しい友人もできました。'],
    ],
    scheduleTitle: 'Silver Circle 開催スケジュールと料金',
    scheduleCardTitle: 'Silver Circle Schedule',
    schedule: '第1・第3木曜日 午後2時〜4時',
    schedulePlace: 'ご近所コミュニティホール・定員6名',
    footerAbout: 'Silver Circle は、ミープル創戦グループによる地域参加プログラムです。英語のボードゲームを通じて、会話、つながり、楽しい学びを支えます。',
  },
} as const;

function mailto(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function SilverCircle({ onNavigate, language }: { onNavigate: (section: Section) => void; language: Language }) {
  const [games, setGames] = useState<Game[]>([]);
  const t = ui[language].silver;
  const local = copy[language];

  useEffect(() => {
    getSilverCircleGames().then(setGames);
  }, []);

  const trialLink = useMemo(
    () => mailto(language === 'ja' ? 'Silver Circle 無料体験について' : 'Silver Circle free trial', language === 'ja' ? '無料体験に興味があります。\n\n名前：\n希望日：\n質問：' : 'I am interested in a free trial.\n\nName:\nPreferred date:\nQuestions:'),
    [language],
  );
  const referralLink = useMemo(
    () => mailto(language === 'ja' ? 'Silver Circle の紹介について' : 'Silver Circle referral', language === 'ja' ? 'Silver Circle を紹介したい方がいます。\n\n紹介したい方との関係：\n地域：\n連絡希望：' : 'I would like to introduce Silver Circle to someone.\n\nRelationship:\nArea:\nPreferred contact:'),
    [language],
  );

  return (
    <main className="silver-page min-h-screen pt-[66px]">
      <section className="relative overflow-hidden bg-[#fff2ef]">
        <div className="silver-section grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#ff9aad] px-4 py-2 text-sm font-bold text-[#ef315d]">{local.badge}</span>
            <p className="mt-7 font-bold text-[#ee3f63]">{local.location}</p>
            <h1 className="silver-title mt-4 text-5xl leading-[1.28] sm:text-6xl">{t.title}</h1>
            <p className="mt-7 text-lg leading-9 text-[#615655]">{local.body}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={trialLink} className="rounded-full bg-[#f63360] px-8 py-4 font-bold text-white shadow-lg shadow-[#f63360]/20">
                {t.cta} <ArrowRight className="ml-2 inline" size={16} />
              </a>
              <a href="#silver-details" className="rounded-full border border-[#fc849e] px-8 py-4 font-bold text-[#ea3159]">{t.details}</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#6d6260]">
              <span>{local.proof1}</span>
              <span>{local.proof2}</span>
              <span>{local.proof3}</span>
            </div>
          </div>
          <div className="relative">
            <img src="/images/silver-circle-hero.webp" alt="" className="h-[490px] w-full rounded-[1.5rem] object-cover shadow-lg" />
            <span className="silver-card absolute -left-5 bottom-[-18px] rounded-2xl px-6 py-4 text-sm"><Brain className="mr-2 inline text-[#f33d67]" size={20} />{language === 'ja' ? '会話と脳の健康を' : 'Conversation and brain health'}<br /><b className="ml-7 text-lg">{language === 'ja' ? '楽しく支える' : 'supported gently'}</b></span>
            <span className="silver-card absolute -right-5 top-[-20px] rounded-2xl px-5 py-4 text-sm">{language === 'ja' ? '毎回の笑顔' : 'Smiles each session'}<br /><b className="text-[#eb9b18]">★★★★★</b></span>
          </div>
        </div>
      </section>

      <section id="silver-details" className="silver-section">
        <h2 className="silver-title text-center text-4xl">{t.painTitle}</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {local.pain.map(([title, body]) => (
            <article key={title} className="silver-card rounded-2xl p-7">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-[#655a59]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff3ef] text-center">
        <div className="silver-section max-w-4xl">
          <ShieldCheck className="mx-auto text-[#2abaae]" size={40} />
          <h2 className="silver-title mt-5 text-5xl">{local.evidenceLead}</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#544947]">{local.evidenceBody}</p>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">{t.evidenceTitle}</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {local.evidenceCards.map(([title, body], index) => (
            <article key={title} className={`rounded-2xl border p-8 ${['border-[#fac7d0] bg-[#fff5f6]', 'border-[#a3e3dd] bg-[#effcfa]', 'border-[#f2d17b] bg-[#fff9ea]', 'border-[#b8caff] bg-[#f1f4ff]'][index]}`}>
              <p className="font-bold">{title}</p>
              <p className="mt-4 text-lg leading-8">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf5]">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">{language === 'ja' ? '期待できる4つの効果' : 'Four Helpful Effects'}</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {local.benefits.map(([title, body], index) => {
              const icons = [Brain, Users, Heart, Smile];
              const BenefitIcon = icons[index];
              return (
                <article key={title} className="silver-card rounded-2xl p-8">
                  <BenefitIcon className={['text-[#f43f69]', 'text-[#18aea4]', 'text-[#eea21d]', 'text-[#566ee9]'][index]} size={28} />
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="mt-4 leading-8 text-[#5f5553]">{body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">{t.gamesTitle}</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.slice(0, 4).map((game) => (
            <article key={game.id} className="silver-card overflow-hidden rounded-2xl">
              <div className="relative h-40 bg-[#f3e4db]">
                {game.cover_image_url && <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#615755]">{game.description || (language === 'ja' ? '初めての方にも楽しめる、会話が生まれやすいゲームです。' : 'A friendly game that helps conversation start naturally.')}</p>
                <p className="mt-5 text-sm text-[#726866]">{game.min_players}-{game.max_players} / {game.duration_minutes}m</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => onNavigate('games')} className="rounded-full border border-[#fc849e] px-8 py-4 font-bold text-[#ea3159]">{ui[language].nav.games}</button>
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">{t.stepsTitle}</h2>
          <div className="mt-14 grid gap-8 text-center md:grid-cols-3">
            {local.steps.map(([title, body], index) => {
              const icons = [Phone, MapPin, Smile];
              const StepIcon = icons[index];
              return (
                <article key={title}>
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ffc0cd] text-[#f43b64]"><StepIcon /><b className="absolute -right-1 -top-2 rounded-full bg-[#f43b64] px-2 py-1 text-xs text-white">{index + 1}</b></span>
                  <h3 className="mt-7 text-xl font-bold">{title}</h3>
                  <p className="mt-4 leading-7 text-[#685e5c]">{body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">{local.scheduleTitle}</h2>
        <article className="silver-card mt-12 max-w-lg rounded-2xl p-7">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#ef4164]">{local.scheduleCardTitle}</p>
          <Clock3 className="mr-5 inline text-[#f43b64]" />
          <strong className="text-xl">{local.schedule}</strong>
          <p className="ml-12 mt-2 text-[#756b6a]">{local.schedulePlace}</p>
        </article>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {local.pricing.map(([title, price, term, items], index) => (
            <article key={title} className={`silver-card rounded-2xl p-8 ${index === 1 ? 'border-[#f43b64]' : ''}`}>
              <p className="text-lg text-[#716866]">{title}</p>
              <p className="mt-3 text-4xl font-bold">{price} <span className="text-base font-normal text-[#7a716d]">/ {term}</span></p>
              <div className="mt-7 space-y-3">{items.map((item) => <p key={item}><CheckCircle2 className="mr-2 inline text-[#18b4aa]" size={17} />{item}</p>)}</div>
              <a href={trialLink} className={`mt-9 block w-full rounded-full py-3 text-center font-bold ${index === 1 ? 'bg-[#f43b64] text-white' : 'bg-[#f5f4f3]'}`}>{t.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">{language === 'ja' ? 'ご参加された方の声' : 'Participant Voices'}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {local.testimonials.map(([name, text]) => (
              <article key={name} className="silver-card rounded-2xl p-7">
                <Quote className="text-[#ffbbc8]" />
                <p className="mt-5 leading-8">{text}</p>
                <p className="mt-7 font-bold">{name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="silver-section max-w-4xl">
        <h2 className="silver-title text-center text-4xl">{t.faqTitle}</h2>
        <div className="mt-12 space-y-4">
          {local.faqs.map(([question, answer]) => (
            <details key={question} className="rounded-xl border border-[#f7b4c2] bg-white px-7 py-5">
              <summary className="cursor-pointer font-bold text-[#312829]">{question}</summary>
              <p className="mt-4 leading-7 text-[#665b59]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#fff0df] py-16 text-center">
        <p className="text-sm font-bold text-[#ef8f1f]">{language === 'ja' ? 'まずは、無料体験から。' : 'Start with a free trial.'}</p>
        <h2 className="silver-title mt-4 text-4xl">{t.cta}</h2>
        <a href={trialLink} className="mt-8 inline-flex rounded-full bg-[#f43b64] px-9 py-4 font-bold text-white">{t.cta} <ArrowRight className="ml-2 inline" size={15} /></a>
        <p className="mt-5 text-sm text-[#756c69]"><Mail className="mr-2 inline" size={14} />{contactEmail}</p>
      </section>

      <section className="bg-[#ef4164] text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 px-5 py-12 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-sm font-bold">{language === 'ja' ? '友人・ご家族に伝えてください' : 'Tell a friend or family member'}</p>
            <h2 className="mt-3 text-4xl font-bold">{t.referralTitle}</h2>
          </div>
          <a href={referralLink} className="rounded-full bg-white px-7 py-3 font-bold text-[#ef4164]"><Mail className="mr-2 inline" size={16} />{language === 'ja' ? 'メールで紹介する' : 'Send referral email'}</a>
        </div>
      </section>

      <footer className="bg-[#201d1d] text-[#dad3d0]">
        <div className="mx-auto grid max-w-6xl gap-9 px-5 py-14 md:grid-cols-3 md:px-8">
          <div><h2 className="text-xl font-bold text-white">Silver Circle</h2><p className="mt-5 leading-7">{local.footerAbout}</p></div>
          <div><h2 className="text-xl font-bold text-white">Meeple Sosen Group</h2><p className="mt-5 leading-7">{language === 'ja' ? '福岡市西区を拠点に、英語とボードゲームを通じた学びのコミュニティを運営しています。' : 'Based in Nishi-ku, Fukuoka, we build learning communities through English and board games.'}</p></div>
          <div><h2 className="text-xl font-bold text-white">{language === 'ja' ? 'お問い合わせ' : 'Contact'}</h2><p className="mt-5 leading-8"><Mail className="mr-2 inline text-[#ff718e]" size={16} />{contactEmail}<br /><MapPin className="mr-2 inline text-[#ff718e]" size={16} />{language === 'ja' ? '福岡市西区' : 'Nishi-ku, Fukuoka'}<br /><Clock3 className="mr-2 inline text-[#ff718e]" size={16} />{local.schedule}</p></div>
        </div>
        <p className="mx-auto max-w-6xl border-t border-[#443f3d] px-5 py-7 text-center text-sm text-[#8d8784] md:px-8">© 2026 Meeple Sosen Group - Silver Circle Program, Nishi-ku, Fukuoka</p>
      </footer>
    </main>
  );
}
