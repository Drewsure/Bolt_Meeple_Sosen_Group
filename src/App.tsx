import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SituationRoom } from './components/SituationRoom';
import { Reserves } from './components/Reserves';
import { Dossier } from './components/Dossier';
import { Leaderboard } from './components/Leaderboard';
import { Dashboard } from './components/Dashboard';
import { SilverCircle } from './components/SilverCircle';
import { ImageAdmin } from './components/ImageAdmin';
import { AuthModal } from './components/AuthModal';
import { Board } from './components/Board';
import { Seo } from './components/Seo';
import { BriefingDetail, Briefings } from './components/Briefings';
import { Offers } from './components/Offers';
import { Partnerships } from './components/Partnerships';
import type { Language } from './lib/i18n';

export type Section =
  | 'home'
  | 'situation'
  | 'armory'
  | 'games'
  | 'briefings'
  | 'offers'
  | 'partnerships'
  | 'briefing-detail'
  | 'dossier'
  | 'board'
  | 'challenges'
  | 'ranking'
  | 'profile'
  | 'silver-circle'
  | 'admin-images';

const sectionFromHash = (): Section => {
  const hash = window.location.hash.replace('#', '') as Section;
  if (hash.startsWith('briefings/')) return 'briefing-detail';
  const valid: Section[] = ['home', 'situation', 'armory', 'games', 'briefings', 'offers', 'partnerships', 'dossier', 'board', 'challenges', 'ranking', 'profile', 'silver-circle', 'admin-images'];
  return valid.includes(hash) ? hash : 'home';
};

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [section, setSection] = useState<Section>(sectionFromHash);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem('msg-language');
    return saved === 'ja' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    const syncHash = () => setSection(sectionFromHash());
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const navigate = (next: Section) => {
    window.location.hash = next;
    setSection(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === 'en' ? 'ja' : 'en';
      window.localStorage.setItem('msg-language', next);
      return next;
    });
  };

  const briefingSlug = window.location.hash.replace('#briefings/', '');

  return (
    <div>
      <Seo section={section} language={language} />
      <Header onNavigate={navigate} currentSection={section} language={language} onToggleLanguage={toggleLanguage} />
      {section === 'home' && <Hero onNavigate={navigate} language={language} />}
      {section === 'situation' && <SituationRoom onNavigate={navigate} language={language} />}
      {(section === 'armory' || section === 'board' || section === 'challenges') && <Board onNavigate={navigate} language={language} />}
      {section === 'games' && <Reserves language={language} />}
      {section === 'briefings' && <Briefings language={language} onNavigate={navigate} />}
      {section === 'offers' && <Offers language={language} onNavigate={navigate} />}
      {section === 'partnerships' && <Partnerships language={language} />}
      {section === 'briefing-detail' && <BriefingDetail language={language} onNavigate={navigate} slug={briefingSlug} />}
      {section === 'dossier' && <Dossier language={language} />}
      {section === 'ranking' && <Leaderboard onNavigate={navigate} language={language} />}
      {section === 'profile' && <Dashboard onJoin={() => setAuthModalOpen(true)} language={language} />}
      {section === 'silver-circle' && <SilverCircle onNavigate={navigate} language={language} />}
      {section === 'admin-images' && <ImageAdmin />}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
