import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SituationRoom } from './components/SituationRoom';
import { Armory } from './components/Armory';
import { Reserves } from './components/Reserves';
import { Dossier } from './components/Dossier';
import { Leaderboard } from './components/Leaderboard';
import { LOKVault } from './components/LOKVault';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';

type Section = 'home' | 'situation' | 'armory' | 'reserves' | 'dossier' | 'leaderboard' | 'lok' | 'dashboard';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const { user, loading } = useAuth();

  const handleNavigate = (section: Section) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitialize = () => {
    if (user) {
      setCurrentSection('dashboard');
    } else {
      setAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white font-bebas text-3xl tracking-widest">INITIALIZING...</div>
      </div>
    );
  }

  return (
    <div>
      <Header onAuthClick={() => setAuthModalOpen(true)} onNavigate={handleNavigate} />

      {currentSection === 'home' && <Hero onInitialize={handleInitialize} />}
      {currentSection === 'situation' && <SituationRoom onInitialize={handleInitialize} />}
      {currentSection === 'armory' && <Armory />}
      {currentSection === 'reserves' && <Reserves />}
      {currentSection === 'dossier' && <Dossier />}
      {currentSection === 'leaderboard' && <Leaderboard />}
      {currentSection === 'lok' && user && <LOKVault />}
      {currentSection === 'dashboard' && user && <Dashboard />}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
