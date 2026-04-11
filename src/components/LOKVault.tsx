import { Download, Volume2, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, LanguageOverlayKit } from '../lib/supabase';
import { getTranslation } from '../lib/i18n';

export function LOKVault() {
  const { profile, language } = useAuth();
  const [loks, setLoks] = useState<LanguageOverlayKit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLOKs = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from('language_overlay_kits')
        .select('*')
        .eq('member_id', profile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLoks(data as LanguageOverlayKit[]);
      }
      setLoading(false);
    };

    fetchLOKs();
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bebas text-white mb-4 tracking-wide">
            {getTranslation(language, 'lockVault')}
          </h1>
          <p className="text-slate-300 text-lg">
            {language === 'ja' ? 'あなたのミッションドッシェ。各セッションの戦略的ブリーフィング、音声発音、言語展開ガイド。' : 'Your Mission Dossiers. Strategic briefings, audio pronunciations, and linguistic deployment guides for each session.'}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">{language === 'ja' ? 'ミッションドッシェを読み込み中...' : 'Loading your mission dossiers...'}</div>
        ) : loks.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-12 rounded-lg text-center">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 text-lg mb-2">{language === 'ja' ? 'まだミッションドッシェがありません' : 'No mission dossiers yet'}</p>
            <p className="text-slate-400">
              {language === 'ja' ? 'セッションを予約して、最初の Language Overlay Kit をアンロックしてください。戦略的なブリーフィングがここに表示されます。' : 'Book a session to unlock your first Language Overlay Kit. Your strategic briefings will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {loks.map((lok) => (
              <div key={lok.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg hover:border-amber-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-amber-500 font-bebas text-sm tracking-widest mb-2">
                      SESSION {lok.session_number} · MISSION
                    </div>
                    <h3 className="text-3xl font-bebas text-white tracking-wide">{lok.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500 font-bebas text-2xl">{lok.difficulty_rating}</div>
                    <p className="text-xs text-slate-500">Difficulty</p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-700/30 p-4 rounded mb-4">
                  <p className="text-sm text-slate-300 line-clamp-3">{lok.strategic_briefing}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/30 border border-slate-700/30 p-4 rounded">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{language === 'ja' ? '準備時間' : 'Prep Time'}</p>
                    <p className="text-2xl font-bebas text-amber-500">{lok.estimated_prep_hours}h</p>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-700/30 p-4 rounded">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{language === 'ja' ? '重要なフレーズ' : 'Key Phrases'}</p>
                    <p className="text-2xl font-bebas text-amber-500">
                      {Object.keys(lok.key_phrases).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {lok.audio_briefing_url && (
                    <a
                      href={lok.audio_briefing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-700/30 rounded hover:border-amber-500/50 transition-all"
                    >
                      <Volume2 className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-slate-300">{language === 'ja' ? 'オーディオブリーフィング' : 'Audio Briefing'}</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      const vocabJson = JSON.stringify(lok.vocabulary_list, null, 2);
                      const element = document.createElement('a');
                      element.setAttribute(
                        'href',
                        'data:text/plain;charset=utf-8,' + encodeURIComponent(vocabJson)
                      );
                      element.setAttribute('download', `${lok.title}-vocabulary.json`);
                      element.style.display = 'none';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-700/30 rounded hover:border-amber-500/50 transition-all w-full"
                  >
                    <Download className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-slate-300">{language === 'ja' ? '語彙をダウンロード' : 'Download Vocabulary'}</span>
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {language === 'ja' ? '作成日時' : 'Created'} {new Date(lok.created_at).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
