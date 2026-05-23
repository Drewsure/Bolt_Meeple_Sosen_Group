import { ArrowRight, Heart, Quote, Smile, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Section } from '../App';
import { getSilverCircleGames } from '../lib/games';
import type { Game } from '../types/database';

export function SilverCircle({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    getSilverCircleGames().then(setGames);
  }, []);

  return (
    <main className="silver-page min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-9 px-5 py-14 md:px-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-[#d96e78]">SILVER CIRCLE / ミープル創戦</p>
          <h1 className="font-editorial mt-6 text-5xl font-bold leading-tight text-[#493c3a] sm:text-6xl">
            ボードゲームで、
            <br />
            会話と笑顔がひろがる。
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-9 text-[#665657]">
            50代からのやさしい英語と交流の時間。ルールを学び、仲間と話し、
            新しい毎日をテーブルから始めましょう。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#d96e78] px-7 py-3.5 text-sm font-bold text-white">無料体験を予約する</button>
            <button onClick={() => onNavigate('games')} className="rounded-full border border-[#df9aa1] px-7 py-3.5 text-sm font-bold text-[#c55b66]">ゲームを見る</button>
          </div>
        </div>
        <div className="silver-card overflow-hidden rounded-[2rem] p-3">
          <img
            src="/images/silver-circle-hero.webp"
            alt="ボードゲームを楽しむ仲間"
            className="h-[430px] w-full rounded-[1.4rem] object-cover"
          />
          <p className="px-5 py-4 text-sm text-[#8a7473]">少人数テーブル / ゆっくり進む初心者向けセッション</p>
        </div>
      </section>

      <section className="border-y border-[#efd7d4] bg-[#fffaf8] py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-editorial text-3xl font-bold">こんなお悩みはありませんか？</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ['会話のきっかけ', '新しい人と話したいけれど、自然なきっかけが見つからない。'],
              ['英語への不安', '勉強はしたいけれど、教室形式は緊張してしまう。'],
              ['脳と心の元気', '楽しみながら考え、笑い、続けられる趣味がほしい。'],
            ].map(([title, text]) => (
              <article key={title} className="silver-card rounded-2xl p-6">
                <Heart size={21} className="mb-5 text-[#d96e78]" />
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#786667]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d96e78]">WHY BOARD GAMES</p>
            <h2 className="font-editorial mt-4 text-4xl font-bold">遊びには、続けられる理由があります。</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[#665657]">
            <p>ゲームは相手の表情を見て、選び、声に出して伝える活動です。単語帳より自然に会話を重ねられます。</p>
            <p>短いゲームから始め、スタッフがルールと言葉を丁寧に支えます。勝ち負けよりも、参加する喜びを大切にします。</p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf8] py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-center text-xs font-bold tracking-[0.22em] text-[#d96e78]">RECOMMENDED GAMES</p>
          <h2 className="mt-4 text-center font-editorial text-4xl font-bold">はじめてのおすすめゲーム</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {games.slice(0, 4).map((game) => (
              <article key={game.id} className="silver-card overflow-hidden rounded-2xl">
                <div className="h-32 bg-[#f5e4df]">
                  {game.cover_image_url && <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{game.title}</h3>
                  <p className="mt-3 text-xs font-bold text-[#d96e78]">{game.duration_minutes}分 / {game.min_players}-{game.max_players}人</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-center font-editorial text-4xl font-bold">体験までの3ステップ</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ['01', '無料予約', '日時を選び、簡単なフォームでご予約ください。'],
            ['02', '安心のご案内', 'スタッフが難易度と英語レベルを合わせます。'],
            ['03', '楽しい一卓', 'お茶を囲みながら、やさしくプレイします。'],
          ].map(([number, title, body]) => (
            <article key={number} className="text-center">
              <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7dddc] font-bold text-[#d96e78]">{number}</p>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#786667]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#efd7d4] bg-[#fffaf8] py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              '英語が苦手でも、カードを指しながら自然に言葉が出てきました。毎週の楽しみです。',
              '退職後の仲間づくりにぴったりでした。ゲームがあるので初対面でも笑顔になります。',
            ].map((quote, index) => (
              <article key={quote} className="silver-card rounded-2xl p-7">
                <Quote className="text-[#d96e78]" />
                <p className="mt-5 font-editorial text-lg leading-8">{quote}</p>
                <p className="mt-5 text-sm text-[#8a7473]">{index ? '60代 / 横浜市' : '50代 / 東京都'}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2 className="text-center font-editorial text-4xl font-bold">よくあるご質問</h2>
        <div className="mt-9 divide-y divide-[#efd7d4] border-y border-[#efd7d4]">
          {[
            ['英語がまったく話せなくても大丈夫ですか？', 'はい。日本語でルールをご案内し、使いやすい英語から始めます。'],
            ['一人で参加できますか？', 'もちろんです。少人数テーブルに丁寧にご案内します。'],
            ['どのくらいの時間ですか？', '体験セッションは約60分を予定しています。'],
          ].map(([question, answer]) => (
            <div key={question} className="py-6">
              <p className="font-bold">{question}</p>
              <p className="mt-3 text-sm leading-7 text-[#786667]">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#d96e78] px-5 py-16 text-center text-white">
        <Smile className="mx-auto mb-5" size={32} />
        <h2 className="font-editorial text-4xl font-bold">まずは無料体験で、ひとつの笑顔から。</h2>
        <p className="mx-auto mt-5 max-w-lg leading-8 text-[#fff3f1]">お友達との参加も歓迎です。ゆっくり、楽しく、あなたのペースで。</p>
        <button className="mt-8 rounded-full bg-white px-9 py-4 font-bold text-[#c55b66]">無料体験を申し込む <ArrowRight className="ml-2 inline" size={16} /></button>
      </section>
      <footer className="flex flex-col items-center justify-between gap-3 bg-[#493c3a] px-6 py-8 text-sm text-[#f5dbd9] md:flex-row">
        <span className="flex items-center gap-2"><Users size={16} /> お友達紹介で次回セッション無料</span>
        <span>Silver Circle by Meeple Sosen Group</span>
      </footer>
    </main>
  );
}
