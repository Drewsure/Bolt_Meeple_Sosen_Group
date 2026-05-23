import { Shield, Brain, Zap, Target } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import { useAuth } from '../contexts/AuthContext';

interface SituationRoomProps {
  onInitialize: () => void;
}

export function SituationRoom({ onInitialize }: SituationRoomProps) {
  const { language } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32">
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-30"></div>
              <Shield className="relative w-32 h-32 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bebas tracking-wider text-white mb-6 drop-shadow-2xl">
            {language === 'ja' ? 'シチュエーションルーム' : 'THE SITUATION ROOM'}
          </h1>
          <p className="text-2xl font-bebas text-amber-500 tracking-widest mb-8">
            {language === 'ja' ? 'SOSEN コマンドセンターへようこそ' : 'WELCOME TO THE SOSEN COMMAND CENTER'}
          </p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'ja' ? 'あなたはここに来たのはクラスを受けるためではありません。戦略的なエコシステムを指揮するため、英語があなたの競争上の武器となる場所です。' : 'You are not here to take a class. You are here to command a strategic ecosystem where English becomes your competitive weapon.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg">
            <h3 className="text-3xl font-bebas text-amber-500 mb-4 tracking-wide">
              {language === 'ja' ? '問題：「薄いスープ」' : 'THE PROBLEM: "THIN SOUP"'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? '従来の英語学校は言語学習をスープボウルを満たすようなものと考えています—希薄で、賭けがなく、現実世界の応用と切り離されています。' : 'Traditional English schools treat language learning like filling a soup bowl—diluted, without stakes, disconnected from real-world application.'}
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              {language === 'ja' ? '意思決定の重みに欠けています。交渉の緊張。言語精密性を通じて達成された戦略的勝利の満足度。' : 'They lack the weight of decision-making. The tension of negotiation. The satisfaction of strategic victory achieved through linguistic precision.'}
            </p>
            <p className="text-slate-400 text-sm italic mt-6">
              {language === 'ja' ? 'この薄いスープにうんざりしていませんか？' : 'Are you tired of the thin soup?'}
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg">
            <h3 className="text-3xl font-bebas text-amber-500 mb-4 tracking-wide">
              {language === 'ja' ? 'ソリューション：「創戦」（SOSEN）' : 'THE SOLUTION: "SOSEN" (創戦)'}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? '戦略的創造。世界で最も洗練されたボードゲームを、経営者、退職者、戦略家のために設計された高レベルの英語カリキュラムと組み合わせます。' : 'Strategic Creation. We combine the world\'s most sophisticated board games with a high-level English curriculum designed for executives, retirees, and strategists.'}
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              {language === 'ja' ? 'すべての交渉。すべてのオークション。すべての同盟。完全に英語で行われます。実際のゲームメカニクスが賭けを決定します。' : 'Every negotiation. Every auction. Every alliance. Conducted entirely in English. With real game mechanics determining the stakes.'}
            </p>
            <p className="text-amber-500 font-bebas tracking-wide mt-6">
              {language === 'ja' ? 'あなたの勝利には重みがあります。あなたの言葉には力があります。' : 'Your victory has weight. Your words have power.'}
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bebas text-center text-white mb-12 tracking-wide">
            {language === 'ja' ? '習得の4つの柱' : 'THE PILLARS OF MASTERY'}
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all">
              <Brain className="w-12 h-12 text-amber-500 mb-4" />
              <h4 className="font-bebas text-white tracking-wide mb-3">{language === 'ja' ? '認知的深さ' : 'COGNITIVE DEPTH'}</h4>
              <p className="text-sm text-slate-400">{language === 'ja' ? 'ユーロゲームメカニクスは、実際の交渉を反映した戦略的思考を要求します。' : 'Euro-game mechanics demand strategic thinking that mirrors real negotiation.'}</p>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all">
              <Zap className="w-12 h-12 text-amber-500 mb-4" />
              <h4 className="font-bebas text-white tracking-wide mb-3">{language === 'ja' ? '言語配備' : 'LINGUISTIC DEPLOYMENT'}</h4>
              <p className="text-sm text-slate-400">{language === 'ja' ? '話された英語フレーズはすべてあなたの勝利条件に影響します。' : 'Every English phrase spoken influences your victory condition.'}</p>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all">
              <Target className="w-12 h-12 text-amber-500 mb-4" />
              <h4 className="font-bebas text-white tracking-wide mb-3">{language === 'ja' ? '戦略的賭け' : 'STRATEGIC STAKES'}</h4>
              <p className="text-sm text-slate-400">{language === 'ja' ? '精密さを通じて勝つ。躊躇を通じて負ける。ゲームは実行を要求します。' : 'Win through precision. Lose through hesitation. The game demands execution.'}</p>
            </div>

            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all">
              <Shield className="w-12 h-12 text-amber-500 mb-4" />
              <h4 className="font-bebas text-white tracking-wide mb-3">{language === 'ja' ? 'エリートコミュニティ' : 'ELITE COMMUNITY'}</h4>
              <p className="text-sm text-slate-400">{language === 'ja' ? 'fellow strategistsと競争します。ランク内を上昇させます。ギルドに参加してください。' : 'Compete with fellow strategists. Rise through the ranks. Join the Guild.'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/40 p-12 rounded-lg text-center">
          <h3 className="text-4xl font-bebas text-white mb-4 tracking-wide">
            {language === 'ja' ? 'あなたの勝利を著者する準備はできていますか？' : 'READY TO AUTHOR YOUR VICTORY?'}
          </h3>
          <p className="text-slate-300 mb-8 text-lg">
            {language === 'ja' ? 'シミュレーションを初期化します。ギルドに参加してください。戦略的な未来を指揮してください。' : 'Initialize your simulation. Join the Guild. Command your strategic future.'}
          </p>
          <button
            onClick={onInitialize}
            className="group relative px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas text-2xl tracking-widest overflow-hidden transition-all duration-300 hover:scale-105"
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10">{language === 'ja' ? 'シミュレーション初期化' : 'INITIALIZE SIMULATION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
