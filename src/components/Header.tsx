import { Menu, Shield, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import type { Section } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentSection: Section;
  onAuthClick: () => void;
  onNavigate: (section: Section) => void;
}

const navigation: Array<{ label: string; section: Section }> = [
  { label: 'Situation Room', section: 'situation' },
  { label: 'Armory', section: 'armory' },
  { label: 'Game Database', section: 'games' },
  { label: 'Dossier', section: 'dossier' },
  { label: 'Guild Challenges', section: 'challenges' },
  { label: 'Ranking', section: 'ranking' },
  { label: 'Silver Circle', section: 'silver-circle' },
];

export function Header({ currentSection, onAuthClick, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const select = (section: Section) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[#fbf7ef]/95 backdrop-blur border-b border-[#dccfbe]">
      <div className="border-b border-[#eadfce] bg-[#f5edde]">
        <div className="container-shell flex h-8 items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-[#776d62]">
          <span>Tokyo Tabletop Language Guild</span>
          <span className="hidden sm:block">Strategic English through play</span>
        </div>
      </div>
      <div className="container-shell flex h-[72px] items-center justify-between gap-5">
        <button onClick={() => select('home')} className="flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 items-center justify-center border border-[#cf612d] text-[#cf612d]">
            <Shield size={23} strokeWidth={1.5} />
          </span>
          <span>
            <span className="font-display block text-[25px] leading-5 tracking-[0.09em] text-[#2d2923]">Meeple Sosen</span>
            <span className="line-label">Group / Founder Standard</span>
          </span>
        </button>

        <nav className="hidden items-center gap-5 xl:flex">
          {navigation.map(({ label, section }) => (
            <button
              key={section}
              onClick={() => select(section)}
              className={`text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                currentSection === section ? 'text-[#cf612d]' : 'text-[#5d574d] hover:text-[#cf612d]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => select('profile')} className="rule-button py-2.5">
            <UserRound size={14} />
            {user ? 'Profile' : 'Member Login'}
          </button>
          <button onClick={onAuthClick} className="rule-button rule-button-primary py-2.5">
            Join Guild
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="text-[#cf612d] xl:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#dccfbe] bg-[#fffdf8] px-5 pb-5 pt-3 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 md:grid-cols-2">
            {navigation.concat([{ label: 'Profile', section: 'profile' }]).map(({ label, section }) => (
              <button
                key={section}
                onClick={() => select(section)}
                className="border-b border-[#eadfce] px-2 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-[#5d574d]"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
