import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, language } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else {
        if (!displayName.trim()) {
          setError('Display name is required');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bebas text-white tracking-widest mb-2">
          {isSignIn ? getTranslation(language, 'signIn') : getTranslation(language, 'signUp')}
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          {isSignIn ? getTranslation(language, 'commandCenterDesc') : getTranslation(language, 'beginYourJourney')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-bebas text-slate-300 tracking-wide mb-2">
                {getTranslation(language, 'displayName')}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white focus:border-amber-500 focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bebas text-slate-300 tracking-wide mb-2">
              {getTranslation(language, 'email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white focus:border-amber-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bebas text-slate-300 tracking-wide mb-2">
              {getTranslation(language, 'password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white focus:border-amber-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas text-xl tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            {loading ? (language === 'ja' ? '処理中...' : 'PROCESSING...') : isSignIn ? getTranslation(language, 'signInButton') : getTranslation(language, 'signUpButton')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError('');
            }}
            className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
          >
            {isSignIn ? getTranslation(language, 'notMember') : getTranslation(language, 'alreadyMember')}
          </button>
        </div>
      </div>
    </div>
  );
}
