import { ArrowRight, Brain, CheckCircle2, Clock3, Heart, Mail, MapPin, Phone, Quote, ShieldCheck, Smile, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { getSilverCircleGames } from '../lib/games';
import type { Game } from '../types/database';

const contactEmail = 'ministarenglish@mail.com';

const painPoints = [
  ['毎日が同じように感じる', '外に出る理由が少なくなり、会話や新しい刺激が減ってしまう。'],
  ['頭の衰えが少し心配', '物忘れや集中力が気になる。無理なく楽しく頭を使う場がほしい。'],
  ['話し相手が少ない', '近所で自然に会える仲間や、安心して参加できる場所がほしい。'],
  ['英語をやり直したい', '勉強としてではなく、ゲームの中で自然に使える形で始めたい。'],
];

const evidence = [
  ['第二言語を使うことは、認知予備能と関連する可能性が研究で示されています。', 'Bialystok et al.', 'Neuropsychologia, 2007'],
  ['バイリンガル経験は、脳の柔軟性や認知的な予備力と関係する可能性があります。', 'Grundy et al.', 'Bilingualism: Language and Cognition / Iowa State, 2021'],
  ['ボードゲームは会話、記憶、計画、社会的交流を同時に生みやすい活動です。', 'University of Glasgow / BBC Health', 'Board game wellbeing coverage, 2024'],
  ['安心できる少人数の場は、学習不安を下げ、参加を続けやすくします。', 'Community learning principle', 'Participation design note'],
];

const benefits = [
  [Brain, '英語で脳をほどよく使う', 'ルール確認、作戦、記憶、表現を同時に使います。難しい勉強ではなく、遊びの中で自然に頭を動かします。'],
  [Users, '本物の会話が生まれる', '“My turn.” “Good move.” など、短い英語から始めて、仲間とのやり取りにつなげます。'],
  [Heart, '外に出るきっかけになる', '決まった曜日に近くの会場へ行く理由ができます。生活のリズムづくりにも役立ちます。'],
  [Smile, '安心して参加できる', '日本語サポートあり。英語が初めてでも、ゲームが初めてでも大丈夫です。'],
];

const steps = [
  [Phone, '無料体験に申し込む', 'メールで希望日を送ってください。持ち物は特に必要ありません。'],
  [MapPin, '近くの会場へ来る', '西区周辺のコミュニティ会場で、少人数のテーブルから始めます。'],
  [Smile, '英語でゲームを楽しむ', '先生が日本語でも支えます。短い英語フレーズから安心して始められます。'],
];

const faqs = [
  ['英語が全くわからなくても大丈夫ですか？', 'はい。最初は日本語サポートを使いながら、短い言葉から始めます。'],
  ['ゲームが初めてでも大丈夫ですか？', '大丈夫です。30分前後で覚えられるゲームから選びます。'],
  ['一人でも参加できますか？', 'はい。ほとんどの方が一人で体験に来られます。'],
  ['どんな服装で行けば良いですか？', '普段着で大丈夫です。リラックスして来てください。'],
  ['医療や認知症治療ですか？', 'いいえ。医療行為ではありません。会話、遊び、地域参加を支えるコミュニティ活動です。'],
];

const testimonials = [
  ['Yさん（72歳）', '何十年も英語を話していなかったのに、“My turn!” が自然に出ました。今では毎回楽しみです。'],
  ['Kさん（68歳）', '最初は不安でしたが、日本語でも助けてもらえるので安心でした。終わる頃にはまた来たいと思いました。'],
  ['Tさん（75歳）', '孫に「英語でゲームをした」と話せるのが嬉しいです。新しい友人もできました。'],
];

function mailto(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function SilverCircle({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    getSilverCircleGames().then(setGames);
  }, []);

  const trialLink = useMemo(
    () => mailto('Silver Circle 無料体験について', '無料体験に興味があります。\n\nお名前：\n希望曜日・時間：\n参加人数：\nご質問：'),
    [],
  );
  const referralLink = useMemo(
    () => mailto('Silver Circle の紹介について', 'Silver Circle を紹介したい方がいます。\n\n紹介したい方との関係：\nお住まいの地域：\n連絡希望：'),
    [],
  );

  return (
    <main className="silver-page min-h-screen pt-[66px]">
      <section className="relative overflow-hidden bg-[#fff2ef]">
        <div className="silver-section grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#ff9aad] px-4 py-2 text-sm font-bold text-[#ef315d]">英語ゲーム体験会 無料開催中</span>
            <p className="mt-7 font-bold text-[#ee3f63]">西区・福岡市 ご近所 英語ボードゲーム倶楽部</p>
            <h1 className="silver-title mt-4 text-5xl leading-[1.28] sm:text-6xl">英語でゲーム。<br />脳に刺激。<br />人とつながる。</h1>
            <p className="mt-7 text-lg leading-9 text-[#615655]">
              隔週木曜日、近くの会場に集まって、英語のボードゲームを楽しむ少人数プログラムです。
              英語が初めてでも、ゲームが初めてでも大丈夫。日本語サポートつきで、会話と参加のきっかけをつくります。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={trialLink} className="rounded-full bg-[#f63360] px-8 py-4 font-bold text-white shadow-lg shadow-[#f63360]/20">
                無料体験に申し込む <ArrowRight className="ml-2 inline" size={16} />
              </a>
              <a href="#silver-details" className="rounded-full border border-[#fc849e] px-8 py-4 font-bold text-[#ea3159]">詳しく見る</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#6d6260]">
              <span>初心者歓迎</span>
              <span>日本語サポート</span>
              <span>少人数・徒歩圏内</span>
            </div>
          </div>
          <div className="relative">
            <img src="/images/silver-circle-hero.webp" alt="英語のボードゲームを楽しむシニアの集まり" className="h-[490px] w-full rounded-[1.5rem] object-cover shadow-lg" />
            <span className="silver-card absolute -left-5 bottom-[-18px] rounded-2xl px-6 py-4 text-sm"><Brain className="mr-2 inline text-[#f33d67]" size={20} />会話と脳の健康を<br /><b className="ml-7 text-lg">楽しく支える</b></span>
            <span className="silver-card absolute -right-5 top-[-20px] rounded-2xl px-5 py-4 text-sm">毎回の笑顔<br /><b className="text-[#eb9b18]">★★★★★</b></span>
          </div>
        </div>
      </section>

      <section id="silver-details" className="silver-section">
        <h2 className="silver-title text-center text-4xl">退職後、こんな気持ちはありませんか？</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {painPoints.map(([title, body]) => (
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
          <h2 className="silver-title mt-5 text-5xl">英語 × アナログゲーム =<br />参加しやすい脳トレ習慣</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#544947]">
            英語を「勉強」だけにせず、ゲームの中で自然に使います。研究では、第二言語使用や社会的な遊びが、認知予備能・会話・幸福感と関連する可能性が示されています。
            Silver Circle は医療行為ではなく、地域参加と楽しい学習を支える場です。
          </p>
        </div>
      </section>

      <section className="silver-section">
        <p className="text-center text-sm font-bold text-[#f33d67]">エビデンス</p>
        <h2 className="silver-title mt-4 text-center text-4xl">研究が示す、参加型活動の可能性</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {evidence.map(([copy, source, publication], index) => (
            <article key={source} className={`rounded-2xl border p-8 ${['border-[#fac7d0] bg-[#fff5f6]', 'border-[#a3e3dd] bg-[#effcfa]', 'border-[#f2d17b] bg-[#fff9ea]', 'border-[#b8caff] bg-[#f1f4ff]'][index]}`}>
              <p className="text-lg leading-8">{copy}</p>
              <p className="mt-7 border-t border-black/10 pt-5 font-bold">{source}</p>
              <p className="mt-1 text-sm text-[#807777]">{publication}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf5]">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">期待できる4つの効果</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {benefits.map(([Icon, title, body], index) => {
              const BenefitIcon = Icon as typeof Brain;
              return (
                <article key={String(title)} className="silver-card rounded-2xl p-8">
                  <BenefitIcon className={['text-[#f43f69]', 'text-[#18aea4]', 'text-[#eea21d]', 'text-[#566ee9]'][index]} size={28} />
                  <h3 className="mt-6 text-xl font-bold">{String(title)}</h3>
                  <p className="mt-4 leading-8 text-[#5f5553]">{String(body)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">こんなゲームを楽しみます</h2>
        <p className="mt-4 text-center text-lg text-[#807675]">どれも30分前後で覚えられる、会話が生まれやすいゲームです。</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.slice(0, 4).map((game, index) => (
            <article key={game.id} className="silver-card overflow-hidden rounded-2xl">
              <div className="relative h-40 bg-[#f3e4db]">
                {game.cover_image_url && <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" />}
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#f13d65]">{['初心者向け', '会話が出る', '色が楽しい', '空間認識UP'][index]}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#615755]">{game.description || '初めての方にも楽しめる、会話が生まれやすいゲームです。'}</p>
                <p className="mt-5 text-sm text-[#726866]">{game.min_players}-{game.max_players}人 / {game.duration_minutes}分</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => onNavigate('games')} className="rounded-full border border-[#fc849e] px-8 py-4 font-bold text-[#ea3159]">ゲーム一覧を見る</button>
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">はじめ方は、とても簡単です</h2>
          <div className="mt-14 grid gap-8 text-center md:grid-cols-3">
            {steps.map(([Icon, title, body], index) => {
              const StepIcon = Icon as typeof Phone;
              return (
                <article key={String(title)}>
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ffc0cd] text-[#f43b64]"><StepIcon /><b className="absolute -right-1 -top-2 rounded-full bg-[#f43b64] px-2 py-1 text-xs text-white">{index + 1}</b></span>
                  <h3 className="mt-7 text-xl font-bold">{String(title)}</h3>
                  <p className="mt-4 leading-7 text-[#685e5c]">{String(body)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">開催スケジュールと料金</h2>
        <article className="silver-card mt-12 max-w-lg rounded-2xl p-7">
          <Clock3 className="mr-5 inline text-[#f43b64]" />
          <strong className="text-xl">第1・第3 木曜日</strong>
          <p className="ml-12 mt-2 font-bold text-[#f43b64]">午後2時〜4時</p>
          <p className="ml-12 mt-1 text-[#756b6a]">ご近所コミュニティ会場・定員6名</p>
        </article>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ['無料体験', '¥0', '初回1回', ['1回限り', 'ゲーム・道具込み', 'メール相談可']],
            ['月会費プラン', '¥3,000', '月2回', ['月2回（隔週）', 'ゲーム・飲み物込み', '英語フレーズ集つき']],
            ['都度参加', '¥1,500', '1回ごと', ['予約制', 'ゲーム・道具込み', '気軽に参加']],
          ].map(([title, price, term, items], index) => (
            <article key={String(title)} className={`silver-card rounded-2xl p-8 ${index === 1 ? 'border-[#f43b64]' : ''}`}>
              <p className="text-lg text-[#716866]">{String(title)}</p>
              <p className="mt-3 text-4xl font-bold">{String(price)} <span className="text-base font-normal text-[#7a716d]">/ {String(term)}</span></p>
              <div className="mt-7 space-y-3">{(items as string[]).map((item) => <p key={item}><CheckCircle2 className="mr-2 inline text-[#18b4aa]" size={17} />{item}</p>)}</div>
              <a href={trialLink} className={`mt-9 block w-full rounded-full py-3 text-center font-bold ${index === 1 ? 'bg-[#f43b64] text-white' : 'bg-[#f5f4f3]'}`}>このプランで申し込む</a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">ご参加された方の声</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map(([name, text]) => (
              <article key={name} className="silver-card rounded-2xl p-7">
                <Quote className="text-[#ffbbc8]" />
                <p className="mt-5 leading-8">{text}</p>
                <p className="mt-7 font-bold">{name}</p>
                <p className="text-sm text-[#766d69]">西区在住</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="silver-section max-w-4xl">
        <h2 className="silver-title text-center text-4xl">よくあるご質問</h2>
        <div className="mt-12 space-y-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-xl border border-[#f7b4c2] bg-white px-7 py-5">
              <summary className="cursor-pointer font-bold text-[#312829]">{question}</summary>
              <p className="mt-4 leading-7 text-[#665b59]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#fff0df] py-16 text-center">
        <p className="text-sm font-bold text-[#ef8f1f]">まずは、無料体験から。</p>
        <h2 className="silver-title mt-4 text-4xl">気軽に一度、テーブルへ来てください。</h2>
        <p className="mt-4 leading-7 text-[#685e5c]">申し込みはメールで30秒。ご家族からのお問い合わせも歓迎です。</p>
        <a href={trialLink} className="mt-8 inline-flex rounded-full bg-[#f43b64] px-9 py-4 font-bold text-white">無料体験を申し込む <ArrowRight className="ml-2 inline" size={15} /></a>
        <p className="mt-5 text-sm text-[#756c69]"><Mail className="mr-2 inline" size={14} />{contactEmail}</p>
      </section>

      <section className="bg-[#ef4164] text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 px-5 py-12 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-sm font-bold">友人・ご家族に伝えてください</p>
            <h2 className="mt-3 text-4xl font-bold">あなたの大切な方に、ぜひ。</h2>
            <p className="mt-3 text-lg">退職後の親御さん、ご近所の友人へ。Silver Circle をご紹介ください。</p>
          </div>
          <a href={referralLink} className="rounded-full bg-white px-7 py-3 font-bold text-[#ef4164]"><Mail className="mr-2 inline" size={16} />メールで紹介する</a>
        </div>
      </section>

      <footer className="bg-[#201d1d] text-[#dad3d0]">
        <div className="mx-auto grid max-w-6xl gap-9 px-5 py-14 md:grid-cols-3 md:px-8">
          <div><h2 className="text-xl font-bold text-white">Silver Circle</h2><p className="mt-5 leading-7">Silver Circle は、英語のアナログボードゲームを通じて、西区の高齢者の会話・社会参加・学びの習慣づくりを支える地域プログラムです。</p></div>
          <div><h2 className="text-xl font-bold text-white">Meeple Sosen Group について</h2><p className="mt-5 leading-7">福岡市西区を拠点に、英語ボードゲームを通じた学習コミュニティを運営しています。戦略・言語・つながりを柱に、遊びから学ぶ文化を育てます。</p></div>
          <div><h2 className="text-xl font-bold text-white">お問い合わせ</h2><p className="mt-5 leading-8"><Mail className="mr-2 inline text-[#ff718e]" size={16} />{contactEmail}<br /><MapPin className="mr-2 inline text-[#ff718e]" size={16} />福岡市西区<br /><Clock3 className="mr-2 inline text-[#ff718e]" size={16} />第1・第3 木曜日 午後2時〜4時</p></div>
        </div>
        <p className="mx-auto max-w-6xl border-t border-[#443f3d] px-5 py-7 text-center text-sm text-[#8d8784] md:px-8">© 2026 Meeple Sosen Group — Silver Circle Program, Nishi-ku, Fukuoka</p>
      </footer>
    </main>
  );
}
