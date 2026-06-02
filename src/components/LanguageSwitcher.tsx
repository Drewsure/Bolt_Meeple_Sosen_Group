import { Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-amber-400" />
      <button
        onClick={() => setLanguage('ja')}
        className={`px-3 py-1 rounded-full text-sm font-bebas transition-all ${
          language === 'ja'
            ? 'bg-amber-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-bebas transition-all ${
          language === 'en'
            ? 'bg-amber-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        English
      </button>
    </div>
  );
}
