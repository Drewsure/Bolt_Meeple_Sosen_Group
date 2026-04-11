import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getTranslation } from '../lib/i18n';

interface HeaderProps {
  onAuthClick: () => void;
  onNavigate: (section: 'home' | 'situation' | 'armory' | 'reserves' | 'dossier' | 'leaderboard' | 'lok' | 'dashboard') => void;
}

export function Header({ onAuthClick, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, language } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <Shield className="w-8 h-8 text-amber-500 group-hover:rotate-12 transition-transform" />
            <div>
              <div className="font-bebas text-xl tracking-widest text-white">
                {getTranslation(language, 'meepleOsen')}
              </div>
              <div className="text-xs text-slate-500 tracking-wider">{getTranslation(language, 'founderStandard')}</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button
              onClick={() => onNavigate('situation')}
              className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
            >
              {getTranslation(language, 'situation')}
            </button>
            <button
              onClick={() => onNavigate('armory')}
              className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
            >
              {getTranslation(language, 'armoryNav')}
            </button>
            <button
              onClick={() => onNavigate('reserves')}
              className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
            >
              {getTranslation(language, 'reservesNav')}
            </button>
            <button
              onClick={() => onNavigate('dossier')}
              className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
            >
              {getTranslation(language, 'dossierNav')}
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
            >
              {getTranslation(language, 'board')}
            </button>
            {user && (
              <>
                <button
                  onClick={() => onNavigate('lok')}
                  className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
                >
                  {getTranslation(language, 'lockVault')}
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider"
                >
                  {getTranslation(language, 'commandCenter')}
                </button>
              </>
            )}
            <div className="h-8 w-px bg-slate-700"></div>
            <LanguageSwitcher />
            <button
              onClick={onAuthClick}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas tracking-wider hover:scale-105 transition-transform"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            >
              {user ? getTranslation(language, 'profile') : getTranslation(language, 'join')}
            </button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <button
              onClick={() => {
                onNavigate('situation');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
            >
              {getTranslation(language, 'situationRoom')}
            </button>
            <button
              onClick={() => {
                onNavigate('armory');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
            >
              {getTranslation(language, 'armoryNav')}
            </button>
            <button
              onClick={() => {
                onNavigate('reserves');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
            >
              {getTranslation(language, 'reservesNav')}
            </button>
            <button
              onClick={() => {
                onNavigate('dossier');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
            >
              {getTranslation(language, 'dossierNav')}
            </button>
            <button
              onClick={() => {
                onNavigate('leaderboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
            >
              {getTranslation(language, 'leaderboardTitle')}
            </button>
            {user && (
              <>
                <button
                  onClick={() => {
                    onNavigate('lok');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
                >
                  {getTranslation(language, 'lockVault')}
                </button>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-slate-300 hover:text-amber-500 transition-colors font-bebas tracking-wider text-sm py-2"
                >
                  {getTranslation(language, 'commandCenter')}
                </button>
              </>
            )}
            <button
              onClick={() => {
                onAuthClick();
                setMobileMenuOpen(false);
              }}
              className="block w-full px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas tracking-wider mt-4"
            >
              {user ? getTranslation(language, 'profile') : getTranslation(language, 'joinGuild')}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
