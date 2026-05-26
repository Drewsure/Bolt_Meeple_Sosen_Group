import { Gamepad2, Languages, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';

interface HeaderProps {
  currentSection: Section;
  language: Language;
  onNavigate: (section: Section) => void;
  onToggleLanguage: () => void;
}

const navigation: Array<{ labelKey?: keyof typeof ui.en.nav; label?: { en: string; ja: string }; section: Section }> = [
  { labelKey: 'home', section: 'home' },
  { labelKey: 'silver', section: 'silver-circle' },
  { labelKey: 'board', section: 'board' },
  { labelKey: 'games', section: 'games' },
  { label: { en: 'Briefings', ja: 'ブリーフィング' }, section: 'briefings' },
  { label: { en: 'Join / Pricing', ja: '参加・料金' }, section: 'offers' },
  { labelKey: 'dossier', section: 'dossier' },
  { labelKey: 'ranking', section: 'ranking' },
  { labelKey: 'profile', section: 'profile' },
];

export function Header({ currentSection, language, onNavigate, onToggleLanguage }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const activeSection: Section = currentSection === 'armory' || currentSection === 'challenges'
    ? 'board'
    : currentSection === 'briefing-detail' ? 'briefings' : currentSection;
  const t = ui[language].nav;

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
          {navigation.map(({ labelKey, label, section }) => {
            const isSilver = section === 'silver-circle';
            const isActive = activeSection === section;
            const navLabel = labelKey ? t[labelKey] : label?.[language];
            return (
              <button
                key={`${section}-${labelKey ?? navLabel}`}
                onClick={() => select(section)}
                className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.06em] transition-colors xl:text-[12px] ${
                  isSilver
                    ? `rounded border border-[#ff99b0] bg-[#fff5f8] px-3 py-2 text-[#ef3d66] shadow-sm hover:bg-[#ffeaf0] ${isActive ? 'ring-1 ring-[#ef3d66]/30' : ''}`
                    : isActive ? 'text-[#cf612d]' : 'text-[#514941] hover:text-[#cf612d]'
                }`}
              >
                {navLabel}
              </button>
            );
          })}
        </nav>

        <button onClick={onToggleLanguage} className="absolute left-[112px] top-[38px] hidden items-center gap-2 rounded border border-[#e8a33e] px-3 py-1 text-[9px] font-bold text-[#d06720] md:inline-flex">
          <Languages size={12} />
          {t.toggle}
        </button>
        <button onClick={() => setOpen(!open)} className="text-[#cf612d] md:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-[#efc779] bg-[#fffdf8] p-5 sm:grid-cols-2 md:hidden">
          <button onClick={onToggleLanguage} className="border-b border-[#eadfce] px-2 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#d06720]">
            {t.toggle}
          </button>
          {navigation.map(({ labelKey, label, section }) => {
            const isSilver = section === 'silver-circle';
            const navLabel = labelKey ? t[labelKey] : label?.[language];
            return (
              <button
                key={`${section}-${labelKey ?? navLabel}`}
                onClick={() => select(section)}
                className={`border-b border-[#eadfce] px-2 py-3 text-left text-sm font-bold uppercase tracking-[0.12em] ${
                  isSilver ? 'text-[#ef3d66]' : 'text-[#5d574d]'
                }`}
              >
                {navLabel}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
