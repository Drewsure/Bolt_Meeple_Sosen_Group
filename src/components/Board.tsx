import { Award, BookOpen, CheckCircle2, ChevronRight, Clock, Database, FileText, Image, Radio, Save, Shield, Sparkles, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames, getGamesNeedingImages } from '../lib/games';
import type { Language } from '../lib/i18n';
import { ui } from '../lib/i18n';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import { saveSessionProgressRecord } from '../lib/sessionProgress';
import type { Game } from '../types/database';

const commands: Array<{ icon: typeof Database; label: string; copy: string; section: Section; tone: string }> = [
  { icon: Database, label: 'Game Library', copy: 'Browse the collection and choose a table that fits the group.', section: 'games', tone: 'border-[#f0c978] bg-[#fff9ec]' },
  { icon: Trophy, label: 'Community Progress', copy: 'See how the group is growing over time.', section: 'ranking', tone: 'border-[#b9d2fb] bg-[#f7fbff]' },
  { icon: Award, label: 'My Progress', copy: 'Review phrases, badges, and session history when you are ready.', section: 'profile', tone: 'border-[#ead4fa] bg-[#fdf8ff]' },
];

const missionFlow: Array<{ label: string; title: string; verb: string; copy: string; section: Section; icon: typeof Database; visual: string; image: string }> = [
  { label: '01', title: 'Choose A Game', verb: 'Browse Games', copy: 'Choose one board game that fits the group: time, difficulty, theme, and player count.', section: 'games', icon: Database, visual: 'Game Choice', image: '/images/mission-route-pick-game.svg' },
  { label: '02', title: 'Choose One English Focus', verb: 'Pick A Focus', copy: 'Give the table one gentle language aim: explain, ask, persuade, report, or reflect.', section: 'board', icon: Target, visual: 'English Focus', image: '/images/mission-route-english-job.svg' },
  { label: '03', title: 'Play With Support', verb: 'Use A Conversation Card', copy: 'During play, use the prompt. The game gives everyone a reason to speak.', section: 'board', icon: Shield, visual: 'Supported Play', image: '/images/mission-route-live-challenge.svg' },
  { label: '04', title: 'Review Together', verb: 'Record Progress', copy: 'After play, notice what English appeared and choose one small thing for next time.', section: 'profile', icon: Trophy, visual: 'Session Review', image: '/images/mission-route-record-result.svg' },
];

type MissionLevel = 'Foundation' | 'Intermediate' | 'Advanced' | 'Master';
type LevelFilter = MissionLevel | 'All';

const missionLevels: LevelFilter[] = ['All', 'Foundation', 'Intermediate', 'Advanced', 'Master'];

const missionBuilder: Array<{
  title: string;
  level: MissionLevel;
  englishJob: string;
  missionStatement: string;
  challenge: string;
  tags: string[];
}> = [
  {
    title: 'Carcassonne',
    level: 'Foundation',
    englishJob: 'Explain placement decisions',
    missionStatement: 'Use every tile placement as a short reason-giving drill: "I am placing this here because..."',
    challenge: 'Before scoring a feature, describe the risk and the reward in one clear English sentence.',
    tags: ['reasoning', 'spatial language', 'turn explanation'],
  },
  {
    title: 'Sushi Go!',
    level: 'Foundation',
    englishJob: 'Read the table and predict choices',
    missionStatement: 'Players practise simple prediction language while choosing cards under friendly pressure.',
    challenge: 'Once per round, predict one opponent choice and explain the clue that made you think so.',
    tags: ['prediction', 'food vocabulary', 'quick turns'],
  },
  {
    title: 'Modern Art',
    level: 'Intermediate',
    englishJob: 'Persuade buyers and justify value',
    missionStatement: 'Turn auctions into negotiation practice where players defend value, timing, and confidence.',
    challenge: 'Before one bid, give a 20-second sales pitch explaining why the painting is worth the price.',
    tags: ['persuasion', 'money language', 'confidence'],
  },
  {
    title: 'Pandemic',
    level: 'Intermediate',
    englishJob: 'Coordinate urgent plans',
    missionStatement: 'Use the outbreak pressure to practise proposals, agreement, warning, and emergency teamwork.',
    challenge: 'On your turn, state the team priority, your action plan, and one risk if the plan fails.',
    tags: ['teamwork', 'planning', 'problem solving'],
  },
  {
    title: 'Power Grid',
    level: 'Advanced',
    englishJob: 'Explain trade-offs',
    missionStatement: 'Players compare cost, timing, scarcity, and future position while making economic decisions.',
    challenge: 'Before buying, explain the trade-off: what you gain now, what you lose later, and why it is acceptable.',
    tags: ['trade-offs', 'economics', 'future planning'],
  },
  {
    title: 'Brass: Birmingham',
    level: 'Advanced',
    englishJob: 'Negotiate networks and timing',
    missionStatement: 'Use industrial decisions to practise conditional language, opportunity cost, and long-term planning.',
    challenge: 'Describe your network plan using "if", "unless", and "because" before you build.',
    tags: ['conditions', 'industry', 'strategy'],
  },
  {
    title: 'Terraforming Mars',
    level: 'Master',
    englishJob: 'Defend a long-term strategy',
    missionStatement: 'Players connect engine-building choices to a future vision and explain why the plan is worth patience.',
    challenge: 'At the end of a generation, give an investor report: what improved, what is weak, and what comes next.',
    tags: ['presentation', 'science', 'long strategy'],
  },
  {
    title: 'Great Western Trail',
    level: 'Master',
    englishJob: 'Report route efficiency',
    missionStatement: 'Use route planning to practise sequencing, opportunity cost, and performance review language.',
    challenge: 'After each delivery, summarize whether your route was efficient and name one adjustment.',
    tags: ['sequencing', 'efficiency', 'self-review'],
  },
];

const challengeDeck = [
  {
    title: 'Power Grid',
    label: 'Auction Reason',
    prompt: 'After one bid, explain why you chose that price.',
    output: 'I bid because... / I stopped because...',
    tags: ['auction', 'economics', 'decision'],
  },
  {
    title: 'Pandemic',
    label: 'Team Plan',
    prompt: 'Before your turn, tell the table the next useful step.',
    output: 'The biggest danger is... My plan is...',
    tags: ['teamwork', 'urgency', 'clear instructions'],
  },
  {
    title: 'Brass: Birmingham',
    label: 'Network Deal',
    prompt: 'Explain one route choice and ask for one fair agreement.',
    output: 'If you take this route, then I can...',
    tags: ['negotiation', 'conditions', 'industry'],
  },
  {
    title: 'Catan',
    label: 'Fair Trade Offer',
    prompt: 'Offer a trade and explain why it helps both players.',
    output: 'This is fair because you get... and I get...',
    tags: ['trade', 'fairness', 'persuasion'],
  },
];

const focusOptions = [
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
];

const boardTranslations = {
  en: {
    missionFlow,
    sessionBuilder: 'Session Builder',
    sessionBuilderTitle: 'Game + English Focus + Conversation Card',
    sessionBuilderCopy: 'Pick a level, choose a game, and give the table one small English focus. The aim is confidence, not performance.',
    activeSession: 'Active Session Card',
    tableFocus: 'Table Focus',
    conversationCard: 'Conversation Card',
    successLooksLike: 'Success Looks Like',
    successCopy: 'Someone says a useful sentence because the game made it natural, then notices it after play.',
    reviewTemplate: [
      ['Situation', 'What was happening on the board?'],
      ['Decision', 'What did you choose and why?'],
      ['Language', 'Which phrases or vocabulary appeared naturally?'],
      ['Result', 'What changed because of the decision?'],
      ['Next Time', 'What would be useful to try next time?'],
    ],
  },
  ja: {
    missionFlow: [
      { title: 'ゲームを選ぶ', verb: 'ゲームを見る', copy: '時間、難しさ、テーマ、人数に合うボードゲームを一つ選びます。', visual: 'ゲーム選び' },
      { title: '英語フォーカスを一つ選ぶ', verb: 'フォーカスを選ぶ', copy: '説明する、質問する、提案する、報告する、ふり返るなど、一つだけ選びます。', visual: '英語フォーカス' },
      { title: 'サポート付きで遊ぶ', verb: '会話カードを使う', copy: 'プレイ中にプロンプトを使います。ゲームが話す理由を作ります。', visual: 'サポートプレイ' },
      { title: '一緒にふり返る', verb: '進捗を記録する', copy: 'プレイ後に、出てきた英語に気づき、次回の小さな目標を選びます。', visual: 'セッション記録' },
    ],
    sessionBuilder: 'セッションビルダー',
    sessionBuilderTitle: 'ゲーム + 英語フォーカス + 会話カード',
    sessionBuilderCopy: 'レベルを選び、ゲームを選び、テーブルに一つだけ英語フォーカスを置きます。目的は完璧さではなく、自信です。',
    activeSession: '現在のセッションカード',
    tableFocus: 'テーブルのフォーカス',
    conversationCard: '会話カード',
    successLooksLike: '成功の形',
    successCopy: 'ゲームの流れの中で誰かが使える一文を言い、プレイ後にそれに気づけることです。',
    reviewTemplate: [
      ['状況', 'ボード上で何が起きていましたか？'],
      ['判断', '何を選びましたか？その理由は？'],
      ['言葉', '自然に出てきたフレーズや語彙は何ですか？'],
      ['結果', 'その判断で何が変わりましたか？'],
      ['次回', '次に試すと役に立ちそうなことは何ですか？'],
    ],
  },
} as const;

function pickRecommended(games: Game[]) {
  const names = ['Brass: Birmingham', 'Power Grid', 'Carcassonne', 'Pandemic', 'Terraforming Mars', 'Modern Art'];
  return names
    .map((name) => games.find((game) => game.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Game[];
}

export function Board({ onNavigate, language }: { onNavigate: (section: Section) => void; language: Language }) {
  const [games, setGames] = useState<Game[]>([]);
  const [missingImages, setMissingImages] = useState<Game[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('All');
  const [selectedMissionTitle, setSelectedMissionTitle] = useState(missionBuilder[0].title);
  const [selectedFocusId, setSelectedFocusId] = useState(focusOptions[0].id);
  const [selectedCardLabel, setSelectedCardLabel] = useState(challengeDeck[0].label);
  const [recordGameTitle, setRecordGameTitle] = useState('');
  const [usefulPhrase, setUsefulPhrase] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [nextTime, setNextTime] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const t = ui[language].board;
  const common = ui[language].common;
  const local = boardTranslations[language];

  useEffect(() => {
    const load = () => {
      Promise.all([getGames(), getGamesNeedingImages()]).then(([allGames, needsImages]) => {
        setGames(allGames);
        setMissingImages(needsImages);
      });
    };
    load();
    return subscribeToPreviewGameUpdates(load);
  }, []);

  const recommended = useMemo(() => pickRecommended(games), [games]);
  const catalogueByTitle = useMemo(() => new Map(games.map((game) => [game.title.toLowerCase(), game])), [games]);
  const filteredMissions = useMemo(() => missionBuilder.filter((mission) => selectedLevel === 'All' || mission.level === selectedLevel), [selectedLevel]);
  const selectedMission = missionBuilder.find((mission) => mission.title === selectedMissionTitle) ?? missionBuilder[0];
  const selectedFocus = focusOptions.find((focus) => focus.id === selectedFocusId) ?? focusOptions[0];
  const selectedCard = challengeDeck.find((card) => card.label === selectedCardLabel) ?? challengeDeck[0];
  const progressGameTitle = recordGameTitle || selectedMission.title;
  const readyImages = Math.max(games.length - missingImages.length, 0);
  const strategicTitles = games.filter((game) => (game.weight ?? 0) >= 2.5).length;
  const gatewayTitles = games.filter((game) => (game.weight ?? 99) <= 1.8 && (game.duration_minutes ?? 999) <= 45).length;

  const operationStats: Array<[string, string, typeof Database, string]> = [
    ['Available Titles', games.length ? games.length.toString() : '...', Database, 'Reserve base'],
    ['Ready Covers', games.length ? `${readyImages}/${games.length}` : '...', Image, 'Visual readiness'],
    ['Strategic Titles', games.length ? strategicTitles.toString() : '...', Target, 'Advanced candidates'],
    ['Gateway Tables', games.length ? gatewayTitles.toString() : '...', Users, 'Fast onboarding'],
  ];

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
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <p className="eyebrow justify-center">{t.eyebrow}</p>
        <h1 className="compact-title mt-2">{t.title}</h1>
        <p className="mt-4 text-xs text-[#71685d]">{t.subtitle}</p>
      </header>

      <div className="container-shell py-10">
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="reference-panel overflow-hidden">
            <div className="grid min-h-80 gap-6 bg-[#fff8ea] p-7 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center">
                <p className="eyebrow text-[#bd5c24]">{t.sessionFlow}</p>
                <h2 className="font-display mt-3 text-5xl tracking-wide text-[#2f251e]">{t.gameBecomesEnglish}</h2>
                <p className="mt-5 text-sm leading-7 text-[#6b5f54]">{t.flowCopy}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => onNavigate('games')} className="rule-button rule-button-primary px-5 py-3"><Database size={14} /> {t.browseGames}</button>
                  <a href="#session-builder" className="rounded border border-[#d78a2b] bg-white px-5 py-3 text-xs font-bold uppercase text-[#a9541f] shadow-sm hover:bg-[#fff2d8]">{t.chooseFocus}</a>
                </div>
              </div>

              <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-[#efc978] bg-[#fffdf8] p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffe0a3,transparent_32%),radial-gradient(circle_at_bottom_right,#f7b466,transparent_28%)] opacity-80" />
                <svg viewBox="0 0 520 300" className="relative z-10 h-full w-full" role="img" aria-label="Operational process graphic showing board game input turning into language output">
                  <defs>
                    <linearGradient id="pipelineOrange" x1="0" x2="1">
                      <stop offset="0%" stopColor="#ed941d" />
                      <stop offset="100%" stopColor="#c95d24" />
                    </linearGradient>
                  </defs>
                  <rect x="28" y="58" width="132" height="132" rx="18" fill="#fff7e6" stroke="#d8892a" strokeWidth="3" />
                  <path d="M55 96h78M55 125h78M55 154h78" stroke="#c95d24" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="55" cy="96" r="8" fill="#ed941d" />
                  <circle cx="94" cy="125" r="8" fill="#ed941d" />
                  <circle cx="133" cy="154" r="8" fill="#ed941d" />
                  <text x="94" y="218" textAnchor="middle" fill="#6b3a1d" fontSize="20" fontWeight="700">BOARD</text>

                  <path d="M176 124 C220 84, 252 84, 296 124" fill="none" stroke="url(#pipelineOrange)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M282 96l26 28-36 10" fill="none" stroke="#c95d24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="236" cy="92" r="22" fill="#fff7e6" stroke="#ed941d" strokeWidth="3" />
                  <text x="236" y="101" textAnchor="middle" fill="#c95d24" fontSize="28" fontWeight="800">?</text>

                  <rect x="330" y="58" width="150" height="132" rx="18" fill="#2f251e" stroke="#d8892a" strokeWidth="3" />
                  <path d="M363 96h84M363 126h63M363 156h96" stroke="#ffe3ad" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="447" cy="96" r="8" fill="#49d178" />
                  <circle cx="426" cy="126" r="8" fill="#4b86d9" />
                  <circle cx="459" cy="156" r="8" fill="#ed941d" />
                  <text x="405" y="218" textAnchor="middle" fill="#6b3a1d" fontSize="20" fontWeight="700">LANGUAGE</text>

                  <path d="M102 252h310" stroke="#efc978" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 12" />
                  <text x="258" y="276" textAnchor="middle" fill="#7a6554" fontSize="18" fontWeight="700">CHOOSE  FOCUS  PLAY  REVIEW</text>
                </svg>
              </div>
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
              <p className="eyebrow">{t.sessionGuide}</p>
              <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">{t.whatHappens}</h2>
            </div>
            <div className="space-y-4 p-5 text-sm leading-7 text-[#6f655a]">
              <p><Radio className="mr-2 inline text-[#d87522]" size={16} />{t.guide1}</p>
              <p><BookOpen className="mr-2 inline text-[#4c89d8]" size={16} />{t.guide2}</p>
              <p><Sparkles className="mr-2 inline text-[#d87522]" size={16} />{t.guide3}</p>
              <a href="#conversation-cards" className="rule-button rule-button-primary mt-2 w-full justify-center py-3">
                <Sparkles size={14} /> {t.seeCards}
              </a>
            </div>
          </article>
        </section>

        <section className="reference-panel mt-8 p-5">
          <div className="mb-4 text-center">
            <p className="eyebrow justify-center">{t.plain}</p>
            <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">{t.usePage}</h2>
            <p className="mt-2 text-xs text-[#746b60]">{t.route}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ['1', t.step1, t.step1Copy],
              ['2', t.step2, t.step2Copy],
              ['3', t.step3, t.step3Copy],
              ['4', t.step4, t.step4Copy],
            ].map(([number, title, copy]) => (
              <div key={number} className="rounded-xl border border-[#efd39d] bg-white p-4 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ed941d] font-display text-xl text-white">{number}</span>
                <p className="font-display mt-3 text-lg tracking-wide text-[#3d332b]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#70665b]">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {operationStats.map(([label, value, Icon, note]) => (
            <article key={String(label)} className="reference-panel p-5 text-center">
              <Icon className="mx-auto text-[#d56d22]" size={23} />
              <p className="font-display mt-3 text-3xl text-[#d06122]">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#776d62]">{label}</p>
              <p className="mt-1 text-[10px] text-[#948a7e]">{note}</p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-5 text-center">
            <p className="eyebrow justify-center">{t.sessionMap}</p>
            <h2 className="compact-title mt-2 text-3xl">{t.tableRoute}</h2>
            <p className="mt-2 text-xs text-[#746b60]">{t.routeCopy}</p>
          </div>
          <div className="relative grid gap-4 lg:grid-cols-4">
            <div className="absolute left-8 right-8 top-20 hidden h-1 bg-gradient-to-r from-[#ed941d] via-[#f4c16d] to-[#d06122] lg:block" />
            {missionFlow.map((step, index) => {
              const translatedStep = local.missionFlow[index];
              const Icon = step.icon;
              return (
                <button key={step.label} onClick={() => onNavigate(step.section)} className="reference-panel relative overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-40 overflow-hidden bg-[#fff4dd]">
                    <img src={step.image} alt="" className="h-full w-full object-cover" />
                    <div className={`absolute inset-0 ${step.label === '01' ? 'bg-gradient-to-br from-[#2f251e]/5 via-transparent to-[#2f251e]/35' : step.label === '02' ? 'bg-gradient-to-br from-[#1e386b]/5 via-transparent to-[#1e386b]/35' : step.label === '03' ? 'bg-gradient-to-br from-[#1f5b35]/5 via-transparent to-[#1f5b35]/35' : 'bg-gradient-to-br from-[#6b2d1e]/5 via-transparent to-[#6b2d1e]/35'}`} />
                    <Icon className="absolute right-7 top-8 text-white drop-shadow" size={42} />
                    <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#ed941d] font-display text-xl text-white shadow-lg">{step.label}</span>
                    <span className="absolute bottom-3 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-[#a75b1d]">{translatedStep.visual}</span>
                  </div>
                  <div className="p-5">
                    <Icon className="text-[#dc791d]" size={24} />
                    <h3 className="font-display mt-3 text-xl tracking-wide text-[#3d332b]">{translatedStep.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#70665b]">{translatedStep.copy}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#c86123]">{translatedStep.verb} <ChevronRight size={12} /></span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="reference-panel mt-12 overflow-hidden">
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
                {focusOptions.map((focus) => (
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
                <option value={selectedMission.title}>{selectedMission.title}</option>
                {games.slice(0, 40).map((game) => (
                  <option key={game.id} value={game.title}>{game.title}</option>
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

        <section id="session-builder" className="reference-panel mt-12 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b border-[#f1d8a5] p-5 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">{local.sessionBuilder}</p>
                  <h2 className="font-display mt-2 text-4xl tracking-wide text-[#bd5c24]">{local.sessionBuilderTitle}</h2>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-[#746b60]">{local.sessionBuilderCopy}</p>
                </div>
                <button onClick={() => onNavigate('games')} className="rule-button px-4 py-2">
                  <Database size={13} /> {t.browseGames}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {missionLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                      selectedLevel === level
                        ? 'border-[#dc791d] bg-[#ed941d] text-white shadow-sm'
                        : 'border-[#efc779] bg-white text-[#9a5a25] hover:bg-[#fff4dd]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {filteredMissions.map((mission) => {
                  const game = catalogueByTitle.get(mission.title.toLowerCase());
                  const active = mission.title === selectedMission.title;
                  return (
                    <button
                      key={mission.title}
                      onClick={() => setSelectedMissionTitle(mission.title)}
                      className={`overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                        active ? 'border-[#d87522] bg-[#fff7e7] shadow-md' : 'border-[#efd39d] bg-white'
                      }`}
                    >
                      <div className="relative h-32 bg-[#fff1d4]">
                        {game?.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2f251e]/70 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold uppercase text-[#c86123]">{mission.level}</span>
                        <span className="absolute bottom-3 left-3 font-display text-2xl tracking-wide text-white drop-shadow">{mission.title}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#d87522]">{mission.englishJob}</p>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#70665b]">{mission.missionStatement}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mission.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded border border-[#d8ead3] bg-[#f7fff4] px-2 py-1 text-[9px] font-bold text-[#4a8f56]">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="bg-[#fff8ea] p-6">
              <p className="eyebrow">{local.activeSession}</p>
              <h3 className="font-display mt-2 text-4xl tracking-wide text-[#3d332b]">{selectedMission.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#d87522]">{selectedMission.level} Table</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[#efc779] bg-white p-4">
                  <p className="font-display text-xl tracking-wide text-[#bd5c24]">{local.tableFocus}</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{selectedMission.missionStatement}</p>
                </div>
                <div className="rounded-xl border border-[#bde8c9] bg-[#f7fff8] p-4">
                  <p className="font-display text-xl tracking-wide text-[#2e7c44]">{local.conversationCard}</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{selectedMission.challenge}</p>
                </div>
                <div className="rounded-xl border border-[#b9d2fb] bg-[#f7fbff] p-4">
                  <p className="font-display text-xl tracking-wide text-[#366eb4]">{local.successLooksLike}</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{local.successCopy}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="conversation-cards" className="mt-12">
          <div className="mb-5 text-center">
            <p className="eyebrow justify-center">{t.conversationCards}</p>
            <h2 className="compact-title mt-2 text-3xl">{t.gentlePrompts}</h2>
            <p className="mt-2 text-xs text-[#746b60]">{t.cardsCopy}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {challengeDeck.map((challenge) => {
              const game = catalogueByTitle.get(challenge.title.toLowerCase());
              return (
                <article key={challenge.label} className="reference-panel overflow-hidden">
                  <div className="relative h-36 bg-[#fff1d4]">
                    {game?.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2f251e]/75 via-[#2f251e]/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-[9px] font-bold uppercase text-[#d87522]">{challenge.title}</span>
                    <span className="absolute bottom-3 left-3 right-3 font-display text-xl tracking-wide text-white drop-shadow">{challenge.label}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs leading-5 text-[#70665b]">{challenge.prompt}</p>
                    <div className="mt-3 rounded border border-[#efd39d] bg-[#fffaf0] p-3 text-[11px] font-bold text-[#7a5a34]">{challenge.output}</div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {challenge.tags.map((tag) => (
                        <span key={tag} className="rounded border border-[#d9d9d9] bg-white px-2 py-1 text-[9px] font-bold uppercase text-[#70665b]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <h2 className="compact-title mt-12 text-center text-3xl">{t.helpfulPlaces}</h2>
        <section className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-3">
          {commands.map(({ icon: Icon, label, copy, section, tone }) => (
            <button key={label} onClick={() => onNavigate(section)} className={`rounded-xl border p-6 text-left transition-transform hover:-translate-y-0.5 hover:shadow-md ${tone}`}>
              <Icon className="text-[#dc791d]" size={28} />
              <span className="mt-5 block font-display text-xl tracking-wide text-[#4c4036]">{label}</span>
              <span className="mt-2 block text-xs leading-5 text-[#70665b]">{copy}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#c86123]">{common.open} <ChevronRight size={12} /></span>
            </button>
          ))}
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] px-6 py-4">
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">{t.goodChoices}</p>
              <p className="mt-1 text-xs text-[#7a7065]">{t.goodChoicesCopy}</p>
            </div>
            <div className="divide-y divide-[#f3dfba]">
              {recommended.map((game) => (
                <button key={game.id} onClick={() => onNavigate('games')} className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-[#fff8e9]">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded border border-[#efd39d] bg-[#fff0ce]">
                    {game.cover_image_url ? <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center font-display text-sm text-[#ae6d3f]">{game.title}</div>}
                  </div>
                  <span>
                    <span className="font-display text-lg tracking-wide text-[#3d332b]">{game.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[#70665b]">{buildGameBrief(game)}</span>
                    <span className="mt-2 inline-flex items-center gap-3 text-[10px] text-[#936f46]"><Clock size={12} /> {game.duration_minutes ?? '-'}m <Users size={12} /> {game.min_players ?? '-'}-{game.max_players ?? '-'} <Trophy size={12} /> {game.bgg_rank ? `#${game.bgg_rank}` : 'Unranked'}</span>
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] px-6 py-4">
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">{t.sessionReview}</p>
              <p className="mt-1 text-xs text-[#7a7065]">{t.reviewCopy}</p>
            </div>
            <div className="grid gap-3 p-5">
              {local.reviewTemplate.map(([label, copy]) => (
                <div key={label} className="rounded border border-[#efd39d] bg-white p-4">
                  <p className="flex items-center gap-2 font-display text-lg tracking-wide text-[#3d332b]"><FileText size={15} className="text-[#d87522]" /> {label}</p>
                  <p className="mt-1 text-xs text-[#70665b]">{copy}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {missingImages.length > 0 && (
          <section className="reference-panel mt-10 p-5 text-center">
            <p className="font-display text-2xl tracking-wide text-[#bd5c24]">{t.libraryNote}</p>
            <p className="mt-1 text-xs text-[#70665b]">{t.libraryNoteCopy}</p>
          </section>
        )}
      </div>
    </main>
  );
}
