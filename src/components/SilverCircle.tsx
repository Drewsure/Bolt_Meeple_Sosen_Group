import { ArrowRight, Brain, CheckCircle2, Clock3, Globe2, Heart, MapPin, Phone, Quote, Smile, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Section } from '../App';
import { getSilverCircleGames } from '../lib/games';
import type { Game } from '../types/database';

const painPoints = [
  ['☔', '毎日が似たような日々…', '趣味がなく、一日が長く感じる。外に出る理由がなかなか見つからない。'],
  ['🧠', '頭の衰えが心配…', '物忘れが増えた気がする。認知症にはなりたくないけど、何をすれば良いか分からない。'],
  ['🪑', '話し相手が少ない', '近所に友達がいない。子どもたちは遠くに住んでいる。孤独を感じることがある。'],
  ['🌎', '英語、ずっと気になってたけど', '英語に挑戦したかったのに、機会がなかった。でも今からでも遅くない。'],
];

const evidence = [
  ['🧠', '「二言語の使用は認知的予備能の一形態であり、アルツハイマー病の発症を平均4〜5年遅らせることが示されている」', 'Bialystok et al.', 'Neuropsychologia, 2007'],
  ['🔬', '「第二言語の習得は認知症の発症を抑制する。神経変性の影響を補う脳の認知的予備能として機能する」', 'Grundy et al. — Iowa State University, 2021', 'Bilingualism: Language and Cognition'],
  ['🎲', '「ボードゲームは幸福感を高め、社会的包摂を促進し、学習を力強く支援する」', 'Dr. Atherton et al.', 'University of Glasgow / BBC Health, 2024'],
  ['📚', '「ボードゲームは言語学習に有望なツール。低不安・高エンゲージメントの環境で対話を引き出す」', 'Systematic Review', 'Journal of Modern Studies & Research, 2025'],
];

const effects = [
  ['Brain', '英語が脳を二倍鍛える', '英語でゲームをするとき、脳は戦略・記憶・言語の3つを同時に処理します。'],
  ['Users', '英語で生まれる本物の絆', '“My turn!” “Good move!” 毎回のゲームで自然と英語が口から出てくる。'],
  ['Heart', '生きがいと達成感', '英語のフレーズを一つ覚えるたびに、小さな成功体験が積み重なる。'],
  ['Smile', '安心して学べる場所', 'ゲームの中だから、間違えることも笑いになる。'],
];

const faqs = ['英語が全くわからなくても大丈夫ですか？', 'ゲームが初めてでも大丈夫ですか？', '一人でも参加できますか？', 'どんな服装で来れば良いですか？'];

export function SilverCircle({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    getSilverCircleGames().then(setGames);
  }, []);

  return (
    <main className="silver-page min-h-screen pt-[66px]">
      <section className="relative overflow-hidden bg-[#fff2ef]">
        <div className="absolute left-[8%] top-44 text-xl text-[#fa80ad]">✿</div>
        <div className="absolute right-[8%] top-52 text-xl text-[#fa80ad]">✿</div>
        <div className="silver-section grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-flex rounded-full border border-[#ff9aad] px-4 py-2 text-sm font-bold text-[#ef315d]">✧ 英語ゲーム体験会 無料開催中</span>
            <p className="mt-7 font-bold text-[#ee3f63]">西区・福岡市 ご近所 英語ゲーム倶楽部</p>
            <h1 className="silver-title mt-4 text-5xl leading-[1.28] sm:text-6xl">英語でゲーム。<br />脳を鍛える。<br />本物の仲間と。</h1>
            <p className="mt-7 text-lg leading-9 text-[#615655]">隔週木曜日、近くのホールに集まって、英語のボードゲームを楽しむ。<br />英語を使いながら脳を鍛え、本物の仲間と繋がる。<br />ゲームが先生。英語ゼロからでも大丈夫。</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button className="rounded-full bg-[#f63360] px-8 py-4 font-bold text-white">無料体験に申し込む <ArrowRight className="ml-2 inline" size={16} /></button>
              <button onClick={() => onNavigate('games')} className="rounded-full border border-[#fc849e] px-8 py-4 font-bold text-[#ea3159]">詳しく見る</button>
            </div>
            <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#6d6260]"><span>GB 英語でゲーム・日本語サポート付</span><span>🧠 第二言語学習が認知症を予防</span><span>📍 少人数・徒歩圏内</span></div>
          </div>
          <div className="relative">
            <img src="/images/silver-circle-hero.webp" alt="英語のボードゲームを楽しむシニア仲間" className="h-[490px] w-full rounded-[1.5rem] object-cover shadow-lg" />
            <span className="silver-card absolute -left-5 bottom-[-18px] rounded-2xl px-6 py-4 text-sm"><Brain className="mr-2 inline text-[#f33d67]" size={20} />認知症リスク低減<br /><b className="ml-7 text-lg">最大20年</b></span>
            <span className="silver-card absolute -right-5 top-[-20px] rounded-2xl px-5 py-4 text-sm">😊 毎回の笑顔<br /><b className="text-[#eb9b18]">★★★★★</b></span>
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">退職後、こんな気持ちはありませんか？</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {painPoints.map(([emoji, title, body]) => (
            <article key={title} className="silver-card rounded-2xl p-7"><span className="text-3xl">{emoji}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 leading-7 text-[#655a59]">{body}</p></article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff3ef] text-center">
        <div className="silver-section max-w-4xl">
          <p className="text-4xl text-[#2abaae]">♧</p>
          <h2 className="silver-title mt-5 text-5xl">英語×アナログゲーム＝<br />二重の脳トレ。</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#544947]">英語を「勉強」するのではなく、ゲームの中で自然に使う。記憶・戦略・英語表現が同時に刺激される。これが研究者たちが注目する「最強の認知症予防」の組み合わせです。</p>
        </div>
      </section>

      <section className="silver-section">
        <p className="text-center text-sm font-bold text-[#f33d67]">エビデンス</p>
        <h2 className="silver-title mt-4 text-center text-4xl">科学が証明する<br />英語×ゲームの力</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {evidence.map(([emoji, copy, source, publication], index) => (
            <article key={source} className={`rounded-2xl border p-8 ${['border-[#fac7d0] bg-[#fff5f6]', 'border-[#a3e3dd] bg-[#effcfa]', 'border-[#f2d17b] bg-[#fff9ea]', 'border-[#b8caff] bg-[#f1f4ff]'][index]}`}>
              <span className="text-2xl">{emoji}</span><p className="mt-6 text-lg leading-8">{copy}</p><p className="mt-7 border-t border-black/10 pt-5 font-bold">{source}</p><p className="mt-1 text-sm text-[#807777]">{publication}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf5]">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">研究が裏付ける4つの効果</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {effects.map(([icon, title, body], index) => {
              const Icon = { Brain, Users, Heart, Smile }[icon as 'Brain' | 'Users' | 'Heart' | 'Smile'];
              return <article key={title} className="silver-card rounded-2xl p-8"><Icon className={['text-[#f43f69]', 'text-[#18aea4]', 'text-[#eea21d]', 'text-[#566ee9]'][index]} size={28} /><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-4 leading-8 text-[#5f5553]">{body}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">こんなゲームを楽しみます</h2>
        <p className="mt-4 text-center text-lg text-[#807675]">どれも30分以内で覚えられる、シンプルで奥深いゲームです。</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {games.slice(0, 4).map((game, index) => (
            <article key={game.id} className="silver-card overflow-hidden rounded-2xl">
              <div className="relative h-40 bg-[#f3e4db]">{game.cover_image_url && <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" />}<span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#f13d65]">{['初心者向け', '大人気', '触って楽しい', '空間認識力UP'][index]}</span></div>
              <div className="p-6"><h3 className="text-xl font-bold">{game.title}</h3><p className="mt-4 text-sm leading-7 text-[#615755]">{game.description || '初めての方にも楽しめる、会話が生まれるゲームです。'}</p><p className="mt-5 text-sm text-[#726866]">♙ {game.min_players}-{game.max_players}人　◷ {game.duration_minutes}分</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">はじめ方は、とても簡単です</h2>
          <div className="mt-14 grid gap-8 text-center md:grid-cols-3">
            {[{ icon: Phone, title: '無料体験に申し込む', body: '下のボタンからお問い合わせください。' }, { icon: MapPin, title: 'お近くの会場へお越しください', body: 'ご自宅から歩いて行けるコミュニティホール。' }, { icon: Smile, title: 'ゲームを英語で楽しむ', body: '日本語サポート付き。笑顔でお待ちします。' }].map(({ icon: Icon, title, body }, index) => (
              <article key={title}><span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ffc0cd] text-[#f43b64]"><Icon /><b className="absolute -right-1 -top-2 rounded-full bg-[#f43b64] px-2 py-1 text-xs text-white">{index + 1}</b></span><h3 className="mt-7 text-xl font-bold">{title}</h3><p className="mt-4 leading-7 text-[#685e5c]">{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="silver-section">
        <h2 className="silver-title text-center text-4xl">開催スケジュールと料金</h2>
        <article className="silver-card mt-12 max-w-lg rounded-2xl p-7"><Clock3 className="mr-5 inline text-[#f43b64]" /><strong className="text-xl">第1・第3 木曜日</strong><p className="ml-12 mt-2 font-bold text-[#f43b64]">午後2時〜4時</p><p className="ml-12 mt-1 text-[#756b6a]">ご近所コミュニティホール・定員6名</p></article>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[['無料体験', '¥0', '/ 初回1回', ['1回限り', 'ゲーム・道具込み', '送迎相談可']], ['月会費プラン', '¥3,000', '/ 月2回', ['月2回（隔週）', 'ゲーム・飲み物込み', '英語フレーズ集プレゼント']], ['都度参加', '¥1,500', '/ 1回ごと', ['予約不要', 'ゲーム・道具込み', '気軽に参加']]].map(([title, price, term, items], index) => (
            <article key={String(title)} className={`silver-card rounded-2xl p-8 ${index === 1 ? 'border-[#f43b64]' : ''}`}><p className="text-lg text-[#716866]">{String(title)}</p><p className="mt-3 text-4xl font-bold">{String(price)} <span className="text-base font-normal text-[#7a716d]">{String(term)}</span></p><div className="mt-7 space-y-3">{(items as string[]).map((item) => <p key={item}><CheckCircle2 className="mr-2 inline text-[#18b4aa]" size={17} />{item}</p>)}</div><button className={`mt-9 w-full rounded-full py-3 font-bold ${index === 1 ? 'bg-[#f43b64] text-white' : 'bg-[#f5f4f3]'}`}>このプランで申し込む</button></article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="silver-section">
          <h2 className="silver-title text-center text-4xl">ご参加された方の声</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {['何十年も英語なんて話していなかったのに、「My turn!」って自然に声が出た瞬間、本当に嬉しくて。', '最初は英語が心配でしたが、先生が日本語でサポートしてくれるから安心でした。', '娘から「脳トレと英語が一緒にできるよ」と勧められて来ました。最高の気分です！'].map((text, index) => (
              <article key={text} className="silver-card rounded-2xl p-7"><Quote className="text-[#ffbbc8]" /><p className="mt-5 leading-8">{text}</p><p className="mt-7 font-bold">{['Yさん（72歳）', 'Kさん（68歳）', 'Tさん（75歳）'][index]}</p><p className="text-sm text-[#766d69]">西区在住</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="silver-section max-w-4xl">
        <h2 className="silver-title text-center text-4xl">よくあるご質問</h2>
        <div className="mt-12 space-y-4">
          {faqs.map((question) => <div key={question} className="rounded-xl border border-[#f7b4c2] bg-white px-7 py-5 font-bold">{question}<span className="float-right text-[#f43b64]">⌄</span></div>)}
        </div>
      </section>
      <footer className="bg-[#f43b64] p-12 text-center text-white">
        <Globe2 className="mx-auto" />
        <h2 className="mt-5 text-3xl font-bold">無料体験から始めましょう</h2>
        <p className="mt-4">お友達紹介で次回セッション無料 ・ Silver Circle by Meeple Sosen Group</p>
      </footer>
    </main>
  );
}
