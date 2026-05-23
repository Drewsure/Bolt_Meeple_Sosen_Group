import { Award, BookOpen, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../lib/i18n';

export function Dossier() {
  const { language } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bebas text-white mb-4 tracking-wide">
            {language === 'ja' ? 'ドッシェ' : 'THE DOSSIER'}
          </h1>
          <p className="text-amber-500 font-bebas text-lg tracking-widest">
            {language === 'ja' ? 'MEEPLE SOSEN GROUP の創設者' : 'FOUNDER OF THE MEEPLE SOSEN GROUP'}
          </p>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-12 rounded-lg mb-12">
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bebas text-slate-900">DS</span>
            </div>
            <h2 className="text-4xl font-bebas text-white tracking-wide mb-2">DREW SMITH</h2>
            <p className="text-amber-500 font-bebas tracking-widest text-sm">L1 FOUNDER STANDARD</p>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6 text-center text-lg">
            {language === 'ja' ? 'ドリュー・スミスは、言語習得への革新的なアプローチの建築家です。従来の英語教育の「薄いスープ」方法論を拒否し、代わりにエリート・ボードゲームの戦略的深さを言語精密性にチャネルします。' : 'Drew Smith is the architect of a revolutionary approach to language mastery—one that rejects the "thin soup" methodology of traditional English education and instead channels the strategic depth of elite board gaming into linguistic precision.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg">
            <Award className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-2xl font-bebas text-white mb-3 tracking-wide">{language === 'ja' ? '哲学' : 'PHILOSOPHY'}</h3>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? '英語は暗記する対象ではありません。実際の交渉、国際ビジネス、知的戦闘で配備する戦略的な武器です。' : 'English is not a subject to memorize. It is a strategic weapon to deploy in real-world negotiations, international business, and intellectual combat.'}
            </p>
          </div>

          <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg">
            <Globe className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-2xl font-bebas text-white mb-3 tracking-wide">{language === 'ja' ? 'ビジョン' : 'VISION'}</h3>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? '経営者、退職者、戦略家が集まって、競争戦略と認知的深さのレンズを通じて言語をマスターするエリートギルドを作成します。' : 'Create an elite Guild where executives, retirees, and strategists gather to master language through the lens of competitive strategy and cognitive depth.'}
            </p>
          </div>

          <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg">
            <BookOpen className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-2xl font-bebas text-white mb-3 tracking-wide">{language === 'ja' ? '方法論' : 'METHOD'}</h3>
            <p className="text-slate-300 leading-relaxed">
              {language === 'ja' ? '「創戦」アプローチ：ボードゲームを通じた戦略的創造。言語、戦略、認知がすべてのセッションで収束します。' : 'The "Sosen" approach: Strategic Creation through board gaming. Language, strategy, and cognition converge in every session.'}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-12 rounded-lg mb-12">
          <h3 className="text-3xl font-bebas text-white mb-6 tracking-wide">{language === 'ja' ? 'L1 創設者標準' : 'THE L1 FOUNDER STANDARD'}</h3>

          <p className="text-slate-300 leading-relaxed mb-6">
            {language === 'ja' ? '"L1" は言語と戦略統合の最高レベルを表します。これは以下へのコミットメントです：' : '"L1" represents the highest level of linguistic and strategic integration. It is a commitment to:'}
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-4">
              <span className="text-amber-500 font-bebas text-xl">✦</span>
              <span className="text-slate-300">
                <strong>{language === 'ja' ? '真正な習得：' : 'Authentic Mastery:'}</strong> {language === 'ja' ? '教えられたすべてのフレーズは、実際の戦略的ゲームと国際的背景で戦闘テストされます。' : 'Every phrase taught is battle-tested in real strategic games and international contexts.'}
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-amber-500 font-bebas text-xl">✦</span>
              <span className="text-slate-300">
                <strong>{language === 'ja' ? '認知精度：' : 'Cognitive Precision:'}</strong> {language === 'ja' ? '私たちの方法は、ボードゲームメカニクスの認知負荷を活用して、言語を最も深いレベルで刻印します。' : 'Our methods leverage the cognitive load of board game mechanics to imprint language at the deepest level.'}
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-amber-500 font-bebas text-xl">✦</span>
              <span className="text-slate-300">
                <strong>{language === 'ja' ? '競争上の卓越性：' : 'Competitive Excellence:'}</strong> {language === 'ja' ? 'メンバーは成績のためではなく、言語支配と戦略的勝利のために競争します。' : 'Members compete not for grades, but for linguistic dominance and strategic victory.'}
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-amber-500 font-bebas text-xl">✦</span>
              <span className="text-slate-300">
                <strong>{language === 'ja' ? 'エリートコミュニティ：' : 'Elite Community:'}</strong> {language === 'ja' ? 'マスターに献身している人だけが招待されます。ギルドは最高の基準を維持しています。' : 'Only those committed to mastery are invited. The Guild maintains the highest standards.'}
              </span>
            </li>
          </ul>

          <p className="text-slate-300 leading-relaxed italic">
            {language === 'ja' ? '"これは教育ではありません。これは変換です。あなたはより良く英語を話すだけではありません。戦略的に考え、正確に交渉し、国際的などの部屋でも尊敬を集めます。"' : '"This is not education. This is transformation. You will not just speak English better. You will think strategically, negotiate with precision, and command respect in any international room."'}
          </p>
          <p className="text-amber-500 font-bebas text-right mt-4">— {language === 'ja' ? 'ドリュー・スミス、創設者' : 'Drew Smith, Founder'}</p>
        </div>

        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 border border-amber-700/40 p-8 rounded-lg">
          <p className="text-slate-300 leading-relaxed mb-4">
            {language === 'ja' ? 'Meeple Sosen Group は、創設者が言語学習が退屈で、切断され、または効果的ではなかった場合がなければならないことを受け入れることを拒否したため、存在します。' : 'The Meeple Sosen Group exists because the founder refused to accept that language learning had to be boring, disconnected, or ineffective.'}
          </p>
          <p className="text-amber-500 font-bebas tracking-widest">
            {language === 'ja' ? 'あなたの勝利を著者します。ギルドに参加してください。' : 'Author your victory. Join the Guild.'}
          </p>
        </div>
      </div>
    </div>
  );
}
