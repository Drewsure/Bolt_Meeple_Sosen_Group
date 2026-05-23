import { Gamepad2, Languages, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { Section } from '../App';

interface HeaderProps {
  currentSection: Section;
  onAuthClick: () => void;
  onNavigate: (section: Section) => void;
}

const navigation: Array<{ label: string; section: Section }> = [
  { label: 'Home', section: 'home' },
  { label: 'Situation', section: 'situation' },
  { label: 'Armory', section: 'armory' },
  { label: 'Reserves - Database', section: 'games' },
  { label: 'Dossier', section: 'dossier' },
  { label: 'Board', section: 'profile' },
  { label: 'Guild Challenges', section: 'challenges' },
  { label: 'Ranking', section: 'ranking' },
  { label: 'Silver Circle', section: 'silver-circle' },
  { label: 'Update Images', section: 'admin-images' },
  { label: 'Profile', section: 'profile' },
];

export function Header({ currentSection, onAuthClick, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const select = (section: Section) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#efc779] bg-[#fffdfa]/95 backdrop-blur">
      <div className="mx-auto flex h-[66px] w-full max-w-[1360px] items-center justify-between gap-4 px-5 md:px-8">
        <button onClick={() => select('home')} className="flex shrink-0 items-center gap-2 text-left">
          <Gamepad2 size={20} className="text-[#db771e]" />
          <span className="font-display text-[17px] leading-[0.95] tracking-[0.065em] text-[#ae4f1f]">
            Meeple Sosen
            <br />
            Group
          </span>
        </button>

        <nav className="hidden flex-1 items-center justify-end gap-3 md:flex">
          {navigation.map(({ label, section }) => (
            <button
              key={`${section}-${label}`}
              onClick={() => select(section)}
              className={`whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.07em] transition-colors xl:text-[9px] ${
                currentSection === section && section === 'silver-circle'
                  ? 'rounded border border-[#ff99b0] px-3 py-2 text-[#ef3d66]'
                  : currentSection === section ? 'text-[#cf612d]' : 'text-[#514941] hover:text-[#cf612d]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button onClick={onAuthClick} className="absolute left-[112px] top-[38px] hidden items-center gap-2 rounded border border-[#e8a33e] px-3 py-1 text-[9px] font-bold text-[#d06720] md:inline-flex">
          <Languages size={12} />
          日本語
        </button>
        <button onClick={() => setOpen(!open)} className="text-[#cf612d] md:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-[#efc779] bg-[#fffdf8] p-5 sm:grid-cols-2 md:hidden">
          {navigation.map(({ label, section }) => (
            <button key={`${section}-${label}`} onClick={() => select(section)} className="border-b border-[#eadfce] px-2 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#5d574d]">
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
