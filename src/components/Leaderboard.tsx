import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, LeaderboardEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Leaderboard() {
  const { language } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'victories' | 'deployment'>('xp');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order(sortBy === 'xp' ? 'total_xp' : sortBy === 'victories' ? 'game_victories' : 'linguistic_deployment_score', {
          ascending: false,
        });

      if (!error && data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-6xl md:text-7xl font-bebas text-white mb-4 tracking-wide">
            {language === 'ja' ? 'グローバルリーダーボード' : 'GLOBAL LEADERBOARD'}
          </h1>
          <p className="text-slate-300">
            {language === 'ja' ? '匿名で競争します。ランクを上昇させます。ギルドを支配します。' : 'Compete anonymously. Rise through the ranks. Dominate the Guild.'}
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={() => setSortBy('xp')}
            className={`px-6 py-3 font-bebas tracking-widest transition-all ${
              sortBy === 'xp'
                ? 'bg-amber-600 text-slate-900 border border-amber-500'
                : 'bg-slate-800/50 text-amber-500 border border-slate-700 hover:border-amber-500'
            }`}
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            {language === 'ja' ? '合計 XP' : 'TOTAL XP'}
          </button>
          <button
            onClick={() => setSortBy('victories')}
            className={`px-6 py-3 font-bebas tracking-widest transition-all ${
              sortBy === 'victories'
                ? 'bg-amber-600 text-slate-900 border border-amber-500'
                : 'bg-slate-800/50 text-amber-500 border border-slate-700 hover:border-amber-500'
            }`}
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            {language === 'ja' ? '勝利' : 'VICTORIES'}
          </button>
          <button
            onClick={() => setSortBy('deployment')}
            className={`px-6 py-3 font-bebas tracking-widest transition-all ${
              sortBy === 'deployment'
                ? 'bg-amber-600 text-slate-900 border border-amber-500'
                : 'bg-slate-800/50 text-amber-500 border border-slate-700 hover:border-amber-500'
            }`}
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            {language === 'ja' ? 'デプロイメント' : 'DEPLOYMENT'}
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">{language === 'ja' ? 'リーダーボードを読み込み中...' : 'Loading leaderboard...'}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{language === 'ja' ? 'リーダーボードが入力されています。ギルドに参加する最初の人になります。' : 'The leaderboard is being populated. Be the first to join the Guild.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => {
              let medalIcon: string;
              if (index === 0) medalIcon = '🥇';
              else if (index === 1) medalIcon = '🥈';
              else if (index === 2) medalIcon = '🥉';
              else medalIcon = '';

              return (
                <div
                  key={entry.id}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg hover:border-amber-500/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="text-4xl font-bebas text-amber-500 w-12 text-center">
                      {medalIcon || `#${index + 1}`}
                    </div>
                    <div>
                      <div className="text-2xl font-bebas text-white tracking-wide">{entry.rank_title}</div>
                      <p className="text-sm text-slate-400">{language === 'ja' ? '戦略家' : 'Strategist'}</p>
                    </div>
                  </div>

                  <div className="flex gap-12 text-right">
                    <div>
                      <div className="text-amber-500 font-bebas text-2xl">{entry.total_xp.toLocaleString()}</div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{language === 'ja' ? '合計XP' : 'Total XP'}</p>
                    </div>
                    <div>
                      <div className="text-amber-500 font-bebas text-2xl">{entry.game_victories}</div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{language === 'ja' ? '勝利' : 'Victories'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-amber-500 font-bebas text-lg">
                        <Zap className="w-4 h-4" />
                        {entry.linguistic_deployment_score}
                      </div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{language === 'ja' ? 'デプロイメント' : 'Deployment'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
