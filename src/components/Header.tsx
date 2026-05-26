import { ChevronDown, Gamepad2, Languages, Menu, X } from 'lucide-react';
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

type NavItem = { labelKey?: keyof typeof ui.en.nav; label?: { en: string; ja: string }; section: Section };

const primaryNavigation: NavItem[] = [
  { labelKey: 'home', section: 'home' },
  { labelKey: 'silver', section: 'silver-circle' },
  { labelKey: 'board', section: 'board' },
  { labelKey: 'games', section: 'games' },
  { label: { en: 'Briefings', ja: 'ブリーフィング' }, section: 'briefings' },
];

const secondaryNavigation: NavItem[] = [
  { label: { en: 'Join / Pricing', ja: '参加・料金' }, section: 'offers' },
  { label: { en: 'Partners', ja: '提携' }, section: 'partnerships' },
  { labelKey: 'dossier', section: 'dossier' },
  { labelKey: 'ranking', section: 'ranking' },
  { labelKey: 'profile', section: 'profile' },
];

const allNavigation = [...primaryNavigation, ...secondaryNavigation];

export function Header({ currentSection, language, onNavigate, onToggleLanguage }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const activeSection: Section = currentSection === 'armory' || currentSection === 'challenges'
    ? 'board'
    : currentSection === 'briefing-detail' ? 'briefings' : currentSection;
  const t = ui[language].nav;

  const labelFor = ({ labelKey, label }: NavItem) => labelKey ? t[labelKey] : label?.[language];
  const isActive = (section: Section) => activeSection === section;

  const select = (section: Section) => {
    onNavigate(section);
    setOpen(false);
    setMoreOpen(false);
  };

  const navButtonClass = (section: Section) => {
    const isSilver = section === 'silver-circle';
    if (isSilver) {
      return `border border-[#ff99b0] bg-[#fff5f8] text-[#ef3d66] shadow-sm hover:bg-[#ffeaf0] ${isActive(section) ? 'ring-1 ring-[#ef3d66]/30' : ''}`;
    }
    return isActive(section)
      ? 'bg-[#fff4df] text-[#cf612d] shadow-sm'
      : 'text-[#514941] hover:bg-[#fff4df] hover:text-[#cf612d]';
  };

  return (
    <header className="nav-glass fixed inset-x-0 top-0 z-40 border-b border-[#efc779]/80">
      <div className="mx-auto flex h-[66px] w-full max-w-[1360px] items-center justify-between gap-4 px-5 md:px-8">
        <button onClick={() => select('home')} className="flex shrink-0 items-center gap-2 text-left">
          <Gamepad2 size={20} className="text-[#db771e]" />
          <span className="font-display text-[17px] leading-[0.95] tracking-[0.065em] text-[#ae4f1f]">
            Meeple Sosen
            <br />
            Group
          </span>
        </button>

        <nav className="hidden flex-1 items-center justify-end gap-1.5 md:flex xl:gap-2">
          <button onClick={onToggleLanguage} className="inline-flex items-center gap-2 rounded-full border border-[#e8a33e] bg-[#fffaf0] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#d06720] transition hover:bg-[#fff0d4]">
            <Languages size={12} />
            {t.toggle}
          </button>

          {primaryNavigation.map((item) => {
            const navLabel = labelFor(item);
            return (
              <button
                key={`${item.section}-${item.labelKey ?? navLabel}`}
                onClick={() => select(item.section)}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.05em] transition-all xl:px-3 xl:text-[12px] ${navButtonClass(item.section)}`}
              >
                {navLabel}
              </button>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setMoreOpen((current) => !current)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.05em] transition-all xl:px-3 xl:text-[12px] ${
                secondaryNavigation.some((item) => isActive(item.section)) ? 'bg-[#fff4df] text-[#cf612d] shadow-sm' : 'text-[#514941] hover:bg-[#fff4df] hover:text-[#cf612d]'
              }`}
            >
              {language === 'ja' ? 'その他' : 'More'} <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-[calc(100%+0.65rem)] z-[60] w-56 overflow-hidden rounded-2xl border border-[#efc779] bg-[#fffdf8] p-2 shadow-2xl shadow-[#7b4c20]/25">
                {secondaryNavigation.map((item) => {
                  const navLabel = labelFor(item);
                  return (
                    <button
                      key={`${item.section}-${item.labelKey ?? navLabel}`}
                      onClick={() => select(item.section)}
                      className={`block w-full rounded-xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] transition ${
                        isActive(item.section) ? 'bg-[#fff4df] text-[#cf612d]' : 'text-[#5d574d] hover:bg-[#fff4df] hover:text-[#cf612d]'
                      }`}
                    >
                      {navLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <button onClick={() => setOpen(!open)} className="text-[#cf612d] md:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-[#efc779] bg-[#fffdf8] p-5 sm:grid-cols-2 md:hidden">
          <button onClick={onToggleLanguage} className="border-b border-[#eadfce] px-2 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#d06720]">
            {t.toggle}
          </button>
          {allNavigation.map((item) => {
            const isSilver = item.section === 'silver-circle';
            const navLabel = labelFor(item);
            return (
              <button
                key={`${item.section}-${item.labelKey ?? navLabel}`}
                onClick={() => select(item.section)}
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
