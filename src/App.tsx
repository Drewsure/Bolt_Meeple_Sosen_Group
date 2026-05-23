import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SituationRoom } from './components/SituationRoom';
import { Armory } from './components/Armory';
import { Reserves } from './components/Reserves';
import { Dossier } from './components/Dossier';
import { Leaderboard } from './components/Leaderboard';
import { Dashboard } from './components/Dashboard';
import { GuildChallenges } from './components/GuildChallenges';
import { SilverCircle } from './components/SilverCircle';
import { ImageAdmin } from './components/ImageAdmin';
import { AuthModal } from './components/AuthModal';
import { Board } from './components/Board';

export type Section =
  | 'home'
  | 'situation'
  | 'armory'
  | 'games'
  | 'dossier'
  | 'board'
  | 'challenges'
  | 'ranking'
  | 'profile'
  | 'silver-circle'
  | 'admin-images';

const sectionFromHash = (): Section => {
  const hash = window.location.hash.replace('#', '') as Section;
  const valid: Section[] = ['home', 'situation', 'armory', 'games', 'dossier', 'board', 'challenges', 'ranking', 'profile', 'silver-circle', 'admin-images'];
  return valid.includes(hash) ? hash : 'home';
};

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [section, setSection] = useState<Section>(sectionFromHash);

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

  return (
    <div>
      <Header onAuthClick={() => setAuthModalOpen(true)} onNavigate={navigate} currentSection={section} />
      {section === 'home' && <Hero onNavigate={navigate} />}
      {section === 'situation' && <SituationRoom onNavigate={navigate} />}
      {section === 'armory' && <Armory />}
      {section === 'games' && <Reserves />}
      {section === 'dossier' && <Dossier />}
      {section === 'board' && <Board onNavigate={navigate} />}
      {section === 'challenges' && <GuildChallenges onNavigate={navigate} />}
      {section === 'ranking' && <Leaderboard onNavigate={navigate} />}
      {section === 'profile' && <Dashboard onJoin={() => setAuthModalOpen(true)} />}
      {section === 'silver-circle' && <SilverCircle onNavigate={navigate} />}
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
