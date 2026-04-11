import { Shield, Brain, Target, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function About() {
  const { language } = useAuth();

  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bebas text-white mb-6 tracking-wide">
            {language === 'ja' ? 'MEEPLE SOSEN グループ' : 'THE MEEPLE SOSEN GROUP'}
          </h2>
          <p className="text-2xl font-bebas text-amber-500 tracking-widest">
            {language === 'ja' ? 'ゲームをマスターします。言語を指揮します。' : 'MASTER THE GAME. COMMAND THE LANGUAGE.'}
          </p>
        </div>

        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bebas text-amber-500 mb-4 tracking-wide">
              {language === 'ja' ? '「薄いスープ」の英語レッスンにうんざりしていますか？' : 'Are you tired of "Thin Soup" English lessons?'}
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              {language === 'ja' ? '従来の言語学習には実質がありません。それには賭けがありません。それには実際の意思決定の「重み」がありません。' : 'Traditional language learning lacks substance. It lacks stakes. It lacks the "weight" of real-world decision-making.'}
            </p>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? 'Meeple Sosen グループ（MSG）では、言語をマスターする最良の方法は、それを戦略の武器として使用することだと考えています。世界で最も洗練されたボードゲーム（BoardGameGeekトップ100）と、「シミュレーションの著者」向けに設計された高レベルの英語カリキュラムを組み合わせています。リーダー、退職者、そして平凡なもので落ち着くことを拒否する戦略家。' : 'At <span className="text-amber-500 font-semibold">The Meeple Sosen Group (MSG)</span>, we believe the best way to master a language is to use it as a weapon of strategy. We combine the world\'s most sophisticated board games (the BoardGameGeek Top 100) with a high-level English curriculum designed for the "Authors of the Simulation"—the leaders, the retirees, and the strategists who refuse to settle for the ordinary.'}
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-4xl font-bebas text-center text-white mb-12 tracking-wide">
            {language === 'ja' ? '「創戦」（SOSEN）方法があるのはなぜですか？' : 'WHY THE "SOSEN" (創戦) METHOD?'}
          </h3>
          <p className="text-center text-slate-300 mb-12 max-w-3xl mx-auto">
            {language === 'ja' ? 'Meeple Sosen Groupでは、あなたは学生ではありません。あなたはリード・ストラテジストです。Power Grid、Brass：Birmingham、Pax Pamirなどのタイトルを使用して、あなたが話すすべての英語が直接的に勝利に影響を与える専門的なシミュレーション内に配置します。' : 'In the Meeple Sosen Group, you aren\'t a student; you are a <span className="text-amber-500 font-semibold">Lead Strategist</span>. Using titles like Power Grid, Brass: Birmingham, and Pax Pamir, we place you inside a professional simulation where every English word you speak has a direct impact on your victory.'}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Target className="w-12 h-12 text-amber-500" />
              </div>
              <h4 className="text-xl font-bebas text-white text-center mb-3 tracking-wide">
                {language === 'ja' ? '戦略的没入' : 'STRATEGIC IMMERSION'}
              </h4>
              <p className="text-slate-400 text-center text-sm leading-relaxed">
                {language === 'ja' ? '英語で交渉し、オークション、アライアンスを構築します。' : 'Negotiate, auction, and alliance-build in English.'}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Brain className="w-12 h-12 text-amber-500" />
              </div>
              <h4 className="text-xl font-bebas text-white text-center mb-3 tracking-wide">
                {language === 'ja' ? '認知的習得' : 'COGNITIVE MASTERY'}
              </h4>
              <p className="text-slate-400 text-center text-sm leading-relaxed">
                {language === 'ja' ? '言語学的なリーチを拡大しながら、深いユーロゲームメカニクスであなたの脳に従事してください。' : 'Engage your brain with deep Euro-game mechanics while expanding your linguistic reach.'}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-amber-500" />
              </div>
              <h4 className="text-xl font-bebas text-white text-center mb-3 tracking-wide">
                {language === 'ja' ? 'L1 創設者標準' : 'THE L1 FOUNDER STANDARD'}
              </h4>
              <p className="text-slate-400 text-center text-sm leading-relaxed">
                {language === 'ja' ? '独自のLanguage Overlay Kits（LOK）の恩恵を受けて、従来の学習の「分析麻痺」なしに複雑なゲームをプレイできます。' : 'Benefit from our proprietary Language Overlay Kits (LOKs), allowing you to play complex games without the "Analysis Paralysis" of traditional learning.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/30 p-8 rounded-lg">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-16 h-16 text-amber-500" />
          </div>
          <h3 className="text-3xl font-bebas text-center text-white mb-4 tracking-wide">
            {language === 'ja' ? 'ギルドに参加' : 'JOIN THE GUILD'}
          </h3>
          <p className="text-slate-300 text-center leading-relaxed max-w-3xl mx-auto mb-4">
            {language === 'ja' ? '退職した幹部であるかどうか、グローバルな知的追求を探しているか、国際交渉で競争上の優位性を求めているプロフェッショナルであるかどうか、あなたの「道」（パス）はここから始まります。' : 'Whether you are a retired executive looking for a global intellectual pursuit or a professional seeking a competitive edge in international negotiation, your <span className="text-amber-500 font-semibold">"Michi" (Path)</span> starts here.'}
          </p>
          <p className="text-2xl font-bebas text-center text-amber-500 tracking-wide">
            {language === 'ja' ? '英語を勉強するだけではありません。あなたの勝利を著者します。' : 'DON\'T JUST STUDY ENGLISH. AUTHOR YOUR VICTORY.'}
          </p>
        </div>
      </div>
    </section>
  );
}
