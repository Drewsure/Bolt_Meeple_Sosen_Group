import { useEffect, useState } from 'react';
import { Trophy, Calendar, Target, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Session } from '../lib/supabase';
import { getTranslation } from '../lib/i18n';

export function Dashboard() {
  const { profile, signOut, language } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('member_id', profile.id)
        .order('session_date', { ascending: false })
        .limit(5);

      if (!error && data) {
        setSessions(data as Session[]);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [profile]);

  if (!profile) return null;

  const rankProgress = (profile.xp_points % 1000) / 10;
  const nextRank = getNextRank(profile.rank);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bebas text-white tracking-widest mb-2">
              {language === 'ja' ? 'コマンドセンター' : 'COMMAND CENTER'}
            </h1>
            <p className="text-slate-400">{language === 'ja' ? 'おかえりなさい、リード・ストラテジスト' : 'Welcome back, Lead Strategist'} {profile.display_name}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 hover:border-amber-500 transition-all duration-300"
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bebas tracking-wider">{language === 'ja' ? '終了' : 'EXIT'}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="relative bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
            <div className="scanline"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-bebas text-slate-500 tracking-widest">{language === 'ja' ? 'ランク' : 'RANK'}</span>
              </div>
              <div className="text-3xl font-bebas text-white tracking-wide mb-2">
                {profile.rank}
              </div>
              <div className="text-sm text-slate-400">
                {profile.xp_points.toLocaleString()} XP
              </div>
            </div>
          </div>

          <div className="relative bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
            <div className="scanline"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-bebas text-slate-500 tracking-widest">{language === 'ja' ? 'セッション' : 'SESSIONS'}</span>
              </div>
              <div className="text-3xl font-bebas text-white tracking-wide mb-2">
                {profile.total_sessions}
              </div>
              <div className="text-sm text-slate-400">{language === 'ja' ? '完了したシミュレーション' : 'Completed Simulations'}</div>
            </div>
          </div>

          <div className="relative bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
            <div className="scanline"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-bebas text-slate-500 tracking-widest">{language === 'ja' ? 'ステータス' : 'STATUS'}</span>
              </div>
              <div className="text-3xl font-bebas text-white tracking-wide mb-2">{language === 'ja' ? 'アクティブ' : 'ACTIVE'}</div>
              <div className="text-sm text-slate-400">{language === 'ja' ? '稼働中' : 'Operational'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bebas text-white tracking-wide mb-1">
                {language === 'ja' ? 'ランク進行' : 'RANK PROGRESSION'}
              </h3>
              <p className="text-sm text-slate-400">
                {nextRank ? (language === 'ja' ? `次: ${nextRank}` : `Next: ${nextRank}`) : (language === 'ja' ? '最高ランク達成' : 'Maximum Rank Achieved')}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>

          <div className="relative">
            <div className="h-4 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${rankProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>0 XP</span>
              <span className="text-amber-500 font-bebas">{rankProgress.toFixed(1)}%</span>
              <span>1000 XP</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-8 rounded-lg">
          <h3 className="text-2xl font-bebas text-white tracking-wide mb-6">
            {language === 'ja' ? '最近のセッション' : 'RECENT SESSIONS'}
          </h3>

          {loading ? (
            <div className="text-center text-slate-400 py-8">{language === 'ja' ? 'セッションを読み込み中...' : 'Loading sessions...'}</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">{language === 'ja' ? 'まだセッションが記録されていません' : 'No sessions recorded yet'}</p>
              <button
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas text-xl tracking-widest hover:scale-105 transition-transform"
                style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
              >
                {language === 'ja' ? '最初のセッションをスケジュール' : 'SCHEDULE FIRST SESSION'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-700/30 rounded-lg hover:border-amber-500/30 transition-all"
                >
                  <div>
                    <div className="font-bebas text-lg text-white tracking-wide">
                      {session.game_title}
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(session.session_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500 font-bebas text-xl">
                      +{session.xp_earned} XP
                    </div>
                    <div className="text-xs text-slate-500 uppercase">{language === 'ja' && session.status === 'completed' ? '完了' : language === 'ja' && session.status === 'pending' ? '保留中' : session.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getNextRank(currentRank: string): string | null {
  const ranks = ['Initiate', 'Regional Director', 'Vice Chairman', 'Chairman', 'Grand Master'];
  const currentIndex = ranks.indexOf(currentRank);
  return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
}
