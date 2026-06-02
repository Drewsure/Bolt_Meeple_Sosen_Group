import { CheckCircle2, FileText, Save, Shield, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getGames } from '../lib/games';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import { saveSessionProgressRecord } from '../lib/sessionProgress';
import type { Game } from '../types/database';

const challengeDeck = [
  {
    title: 'Power Grid',
    label: 'Auction Reason',
    prompt: 'After one bid, explain why you chose that price.',
    output: 'I bid because... / I stopped because...',
  },
  {
    title: 'Pandemic',
    label: 'Team Plan',
    prompt: 'Before your turn, tell the table the next useful step.',
    output: 'The biggest danger is... My plan is...',
  },
  {
    title: 'Brass: Birmingham',
    label: 'Network Deal',
    prompt: 'Explain one route choice and ask for one fair agreement.',
    output: 'If you take this route, then I can...',
  },
  {
    title: 'Catan',
    label: 'Fair Trade Offer',
    prompt: 'Offer a trade and explain why it helps both players.',
    output: 'This is fair because you get... and I get...',
  },
];

const focusOptions = {
  en: [
    {
      id: 'explain',
      title: 'Explain A Choice',
      plain: 'Say what you did and why.',
      phrases: ['I chose this because...', 'My reason is...', 'I think this helps because...'],
    },
    {
      id: 'ask',
      title: 'Ask A Useful Question',
      plain: 'Ask for information before you decide.',
      phrases: ['Can I ask about...?', 'What happens if...?', 'Do you think I should...?'],
    },
    {
      id: 'suggest',
      title: 'Suggest A Plan',
      plain: 'Offer a simple next step to the table.',
      phrases: ['Maybe we should...', 'One option is...', 'I suggest we...'],
    },
    {
      id: 'reflect',
      title: 'Notice What Happened',
      plain: 'Review one moment after the turn.',
      phrases: ['That worked because...', 'Next time I want to...', 'I learned the phrase...'],
    },
  ],
  ja: [
    {
      id: 'explain',
      title: '選んだ理由を言う',
      plain: '何をしたか、なぜそうしたかを短く話します。',
      phrases: ['I chose this because...', 'My reason is...', 'I think this helps because...'],
    },
    {
      id: 'ask',
      title: '役に立つ質問をする',
      plain: '決める前に、必要な情報を聞きます。',
      phrases: ['Can I ask about...?', 'What happens if...?', 'Do you think I should...?'],
    },
    {
      id: 'suggest',
      title: '次の作戦を提案する',
      plain: 'テーブルに一つの小さな次の行動を出します。',
      phrases: ['Maybe we should...', 'One option is...', 'I suggest we...'],
    },
    {
      id: 'reflect',
      title: '起きたことを振り返る',
      plain: 'ターンの後で、一つの場面を見直します。',
      phrases: ['That worked because...', 'Next time I want to...', 'I learned the phrase...'],
    },
  ],
} as const;

export function SessionWorkspace({ language }: { language: Language }) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedFocusId, setSelectedFocusId] = useState<string>(focusOptions[language][0].id);
  const [selectedCardLabel, setSelectedCardLabel] = useState(challengeDeck[0].label);
  const [recordGameTitle, setRecordGameTitle] = useState('');
  const [usefulPhrase, setUsefulPhrase] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [nextTime, setNextTime] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const t = ui[language].board;
  const common = ui[language].common;
  const localizedFocusOptions = focusOptions[language];

  useEffect(() => {
    const load = () => {
      getGames().then(setGames);
    };
    load();
    return subscribeToPreviewGameUpdates(load);
  }, []);

  useEffect(() => {
    if (!localizedFocusOptions.some((focus) => focus.id === selectedFocusId)) {
      setSelectedFocusId(localizedFocusOptions[0].id);
    }
  }, [localizedFocusOptions, selectedFocusId]);

  const selectedFocus = localizedFocusOptions.find((focus) => focus.id === selectedFocusId) ?? localizedFocusOptions[0];
  const selectedCard = challengeDeck.find((card) => card.label === selectedCardLabel) ?? challengeDeck[0];
  const gameOptions = useMemo(() => {
    const titles = ['Carcassonne', ...games.slice(0, 40).map((game) => game.title)];
    return [...new Set(titles)];
  }, [games]);
  const progressGameTitle = recordGameTitle || gameOptions[0] || 'Carcassonne';

  const saveProgress = () => {
    saveSessionProgressRecord({
      gameTitle: progressGameTitle,
      focusTitle: selectedFocus.title,
      conversationCard: selectedCard.label,
      usefulPhrase: usefulPhrase.trim() || selectedCard.output,
      whatHappened: whatHappened.trim() || 'A supported table session was completed.',
      nextTime: nextTime.trim() || 'Try the same focus again with one new phrase.',
    });
    setUsefulPhrase('');
    setWhatHappened('');
    setNextTime('');
    setSaveMessage(t.saved);
    window.setTimeout(() => setSaveMessage(''), 2400);
  };

  return (
    <section className="reference-panel mt-8 overflow-hidden">
      <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-5 text-center">
        <p className="eyebrow justify-center">{t.workspace}</p>
        <h2 className="font-display mt-2 text-4xl tracking-wide text-[#bd5c24]">{t.workspaceTitle}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#746b60]">{t.workspaceCopy}</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-3">
        <article className="border-b border-[#f1d8a5] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2">
            <Target className="text-[#d87522]" size={20} />
            <h3 className="font-display text-2xl tracking-wide text-[#3d332b]">{t.pickFocus}</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#70665b]">{t.pickFocusCopy}</p>
          <div className="mt-5 space-y-3">
            {localizedFocusOptions.map((focus) => (
              <button
                key={focus.id}
                onClick={() => setSelectedFocusId(focus.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedFocus.id === focus.id ? 'border-[#d87522] bg-[#fff4dd] shadow-sm' : 'border-[#efd39d] bg-white hover:bg-[#fffaf0]'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg tracking-wide text-[#3d332b]">{focus.title}</span>
                  {selectedFocus.id === focus.id && <CheckCircle2 className="text-[#d87522]" size={18} />}
                </span>
                <span className="mt-1 block text-xs text-[#70665b]">{focus.plain}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#d9ead3] bg-[#f7fff4] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#4a8f56]">{t.starterPhrases}</p>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-[#536456]">
              {selectedFocus.phrases.map((phrase) => <li key={phrase}>- {phrase}</li>)}
            </ul>
          </div>
        </article>

        <article className="border-b border-[#f1d8a5] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2">
            <Shield className="text-[#2e7c44]" size={20} />
            <h3 className="font-display text-2xl tracking-wide text-[#3d332b]">{t.useCard}</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#70665b]">{t.useCardCopy}</p>
          <div className="mt-5 space-y-3">
            {challengeDeck.map((card) => (
              <button
                key={card.label}
                onClick={() => setSelectedCardLabel(card.label)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedCard.label === card.label ? 'border-[#4ca866] bg-[#f7fff4] shadow-sm' : 'border-[#efd39d] bg-white hover:bg-[#fffaf0]'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg tracking-wide text-[#3d332b]">{card.label}</span>
                  {selectedCard.label === card.label && <CheckCircle2 className="text-[#49a85f]" size={18} />}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#70665b]">{card.prompt}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#efd39d] bg-[#fffaf0] p-4 text-sm font-bold text-[#7a5a34]">
            {selectedCard.output}
          </div>
        </article>

        <article className="p-5">
          <div className="flex items-center gap-2">
            <FileText className="text-[#366eb4]" size={20} />
            <h3 className="font-display text-2xl tracking-wide text-[#3d332b]">{t.recordProgress}</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#70665b]">{t.recordProgressCopy}</p>

          <label className="mt-5 block text-[10px] font-bold uppercase tracking-wide text-[#8a7563]">{common.game}</label>
          <select value={progressGameTitle} onChange={(event) => setRecordGameTitle(event.target.value)} className="mt-2 w-full rounded border border-[#efd39d] bg-white px-3 py-3 text-sm text-[#453b34]">
            {gameOptions.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>

          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#8a7563]">{common.usefulPhrase}</label>
          <input value={usefulPhrase} onChange={(event) => setUsefulPhrase(event.target.value)} placeholder={selectedCard.output} className="mt-2 w-full rounded border border-[#efd39d] bg-white px-3 py-3 text-sm text-[#453b34]" />

          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#8a7563]">{common.whatHappened}</label>
          <textarea value={whatHappened} onChange={(event) => setWhatHappened(event.target.value)} placeholder="One useful moment from the table..." rows={3} className="mt-2 w-full rounded border border-[#efd39d] bg-white px-3 py-3 text-sm text-[#453b34]" />

          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#8a7563]">{common.nextTime}</label>
          <textarea value={nextTime} onChange={(event) => setNextTime(event.target.value)} placeholder="One small thing to try next..." rows={3} className="mt-2 w-full rounded border border-[#efd39d] bg-white px-3 py-3 text-sm text-[#453b34]" />

          <button onClick={saveProgress} className="rule-button rule-button-primary mt-5 w-full justify-center py-3">
            <Save size={14} /> {t.saveProgress}
          </button>
          {saveMessage && <p className="mt-3 text-center text-xs font-bold text-[#2e7c44]">{saveMessage}</p>}
        </article>
      </div>
    </section>
  );
}
