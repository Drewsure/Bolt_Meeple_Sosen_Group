import { Award, BookOpen, ChevronRight, Clock, Database, FileText, Image, Radio, Shield, Sparkles, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames, getGamesNeedingImages } from '../lib/games';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import type { Game } from '../types/database';

const commands: Array<{ icon: typeof Database; label: string; copy: string; section: Section; tone: string }> = [
  { icon: Database, label: 'Reserves Database', copy: 'Search the full collection, open detailed cards, and select the next table.', section: 'games', tone: 'border-[#f0c978] bg-[#fff9ec]' },
  { icon: Trophy, label: 'Ranking', copy: 'Check the public ranking state and prepare the first submissions.', section: 'ranking', tone: 'border-[#b9d2fb] bg-[#f7fbff]' },
  { icon: Award, label: 'Profile Badges', copy: 'Review rank, domain badges, and completion readiness.', section: 'profile', tone: 'border-[#ead4fa] bg-[#fdf8ff]' },
  { icon: Image, label: 'Image Maintenance', copy: 'Repair covers, stage manual updates, and clear missing-image work.', section: 'admin-images', tone: 'border-[#f3b6a8] bg-[#fff7f4]' },
];

const missionFlow: Array<{ label: string; title: string; verb: string; copy: string; section: Section; icon: typeof Database; visual: string; example: string }> = [
  { label: '01', title: 'Pick A Game', verb: 'Browse Reserves', copy: 'Choose one board game that fits the group: time, difficulty, theme, and player count.', section: 'games', icon: Database, visual: 'Game Choice', example: 'Carcassonne' },
  { label: '02', title: 'Choose The English Job', verb: 'Build Mission Here', copy: 'Give the game one language job: explain a plan, make a deal, persuade someone, or report what happened.', section: 'board', icon: Target, visual: 'English Job', example: 'Brass: Birmingham' },
  { label: '03', title: 'Play With A Task', verb: 'Use Challenge Deck', copy: 'During play, use the mission. Players must speak because the board creates pressure.', section: 'board', icon: Shield, visual: 'Live Challenge', example: 'Pandemic' },
  { label: '04', title: 'Record What Happened', verb: 'Record Progress', copy: 'After play, write what happened, what English appeared, and what should be practised next.', section: 'profile', icon: Trophy, visual: 'After Action', example: 'Terraforming Mars' },
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
    label: 'The Power Plant Auction',
    prompt: 'Win or lose one auction bid, then explain your economic reason in English.',
    output: 'I bid because... / I stopped because...',
    tags: ['auction', 'economics', 'decision'],
  },
  {
    title: 'Pandemic',
    label: 'The Emergency Brief',
    prompt: 'Give the team a concise crisis update before your turn.',
    output: 'The biggest danger is... My plan is...',
    tags: ['teamwork', 'urgency', 'clear instructions'],
  },
  {
    title: 'Brass: Birmingham',
    label: 'The Coal Crisis Negotiation',
    prompt: 'Explain a network decision and negotiate one useful table agreement.',
    output: 'If you take this route, then I can...',
    tags: ['negotiation', 'conditions', 'industry'],
  },
  {
    title: 'Catan',
    label: 'The Diplomatic Alliance',
    prompt: 'Propose a fair trade and explain why it helps both players.',
    output: 'This is fair because you get... and I get...',
    tags: ['trade', 'fairness', 'persuasion'],
  },
];

function pickRecommended(games: Game[]) {
  const names = ['Brass: Birmingham', 'Power Grid', 'Carcassonne', 'Pandemic', 'Terraforming Mars', 'Modern Art'];
  return names
    .map((name) => games.find((game) => game.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Game[];
}

export function Board({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [games, setGames] = useState<Game[]>([]);
  const [missingImages, setMissingImages] = useState<Game[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('All');
  const [selectedMissionTitle, setSelectedMissionTitle] = useState(missionBuilder[0].title);

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
  const readyImages = Math.max(games.length - missingImages.length, 0);
  const strategicTitles = games.filter((game) => (game.weight ?? 0) >= 2.5).length;
  const gatewayTitles = games.filter((game) => (game.weight ?? 99) <= 1.8 && (game.duration_minutes ?? 999) <= 45).length;

  const operationStats: Array<[string, string, typeof Database, string]> = [
    ['Available Titles', games.length ? games.length.toString() : '...', Database, 'Reserve base'],
    ['Ready Covers', games.length ? `${readyImages}/${games.length}` : '...', Image, 'Visual readiness'],
    ['Strategic Titles', games.length ? strategicTitles.toString() : '...', Target, 'Advanced candidates'],
    ['Gateway Tables', games.length ? gatewayTitles.toString() : '...', Users, 'Fast onboarding'],
  ];

  return (
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <p className="eyebrow justify-center">Mission Control</p>
        <h1 className="compact-title mt-2">Command Board</h1>
        <p className="mt-4 text-xs text-[#71685d]">Plan the next mission. Deploy language through strategy.</p>
      </header>

      <div className="container-shell py-10">
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="reference-panel overflow-hidden">
            <div className="grid min-h-80 gap-6 bg-[#fff8ea] p-7 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center">
                <p className="eyebrow text-[#bd5c24]">Operational Process</p>
                <h2 className="font-display mt-3 text-5xl tracking-wide text-[#2f251e]">Board To Language Pipeline</h2>
                <p className="mt-5 text-sm leading-7 text-[#6b5f54]">A mission begins with a game, but it only matters when the table creates useful English: decisions, pressure, persuasion, explanation, and reflection.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => onNavigate('games')} className="rule-button rule-button-primary px-5 py-3"><Database size={14} /> Start With Reserves</button>
                  <a href="#mission-builder" className="rounded border border-[#d78a2b] bg-white px-5 py-3 text-xs font-bold uppercase text-[#a9541f] shadow-sm hover:bg-[#fff2d8]">Build Mission</a>
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
                  <text x="258" y="276" textAnchor="middle" fill="#7a6554" fontSize="18" fontWeight="700">SELECT  ARM  DEPLOY  LOG</text>
                </svg>
              </div>
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
              <p className="eyebrow">Commander&apos;s Brief</p>
              <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">What Happens Here</h2>
            </div>
            <div className="space-y-4 p-5 text-sm leading-7 text-[#6f655a]">
              <p><Radio className="mr-2 inline text-[#d87522]" size={16} />The board is the situation engine. The mission statement gives the table a reason to speak.</p>
              <p><BookOpen className="mr-2 inline text-[#4c89d8]" size={16} />Process rule: choose the game, arm the language objective, run the challenge, then log the result.</p>
              <p><Sparkles className="mr-2 inline text-[#d87522]" size={16} />Every phase below is clickable. Use it as the live control route through the site.</p>
              <a href="#challenge-deck" className="rule-button rule-button-primary mt-2 w-full justify-center py-3">
                <Sparkles size={14} /> Open Challenge Deck
              </a>
            </div>
          </article>
        </section>

        <section className="reference-panel mt-8 p-5">
          <div className="mb-4 text-center">
            <p className="eyebrow justify-center">Plain English Version</p>
            <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">How To Use This Page</h2>
            <p className="mt-2 text-xs text-[#746b60]">The Command Board is just the route from “we have a game” to “we used English for a real reason.”</p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ['1', 'Pick a game', 'Choose what you will play.'],
              ['2', 'Give it an English job', 'Example: this game will train explaining, negotiating, persuading, or reporting.'],
              ['3', 'Play with pressure', 'Use the game situation to force useful speaking.'],
              ['4', 'Write the result', 'Record what was learned and what comes next.'],
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
            <p className="eyebrow justify-center">Phase Map</p>
            <h2 className="compact-title mt-2 text-3xl">Mission Route</h2>
            <p className="mt-2 text-xs text-[#746b60]">Follow the orange line from selection to after-action learning.</p>
          </div>
          <div className="relative grid gap-4 lg:grid-cols-4">
            <div className="absolute left-8 right-8 top-20 hidden h-1 bg-gradient-to-r from-[#ed941d] via-[#f4c16d] to-[#d06122] lg:block" />
            {missionFlow.map((step) => {
              const Icon = step.icon;
              const exampleGame = catalogueByTitle.get(step.example.toLowerCase());
              return (
                <button key={step.label} onClick={() => onNavigate(step.section)} className="reference-panel relative overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-40 overflow-hidden bg-[#fff4dd]">
                    {exampleGame?.cover_image_url ? <img src={exampleGame.cover_image_url} alt="" className="h-full w-full object-cover" /> : null}
                    <div className={`absolute inset-0 ${step.label === '01' ? 'bg-gradient-to-br from-[#2f251e]/25 via-[#f5b95f]/20 to-[#2f251e]/70' : step.label === '02' ? 'bg-gradient-to-br from-[#1e386b]/20 via-[#8fb8f4]/20 to-[#1e386b]/75' : step.label === '03' ? 'bg-gradient-to-br from-[#1f5b35]/20 via-[#64cf8a]/20 to-[#1f5b35]/75' : 'bg-gradient-to-br from-[#6b2d1e]/20 via-[#ee8b61]/20 to-[#6b2d1e]/75'}`} />
                    <Icon className="absolute right-7 top-8 text-white drop-shadow" size={42} />
                    <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#ed941d] font-display text-xl text-white shadow-lg">{step.label}</span>
                    <span className="absolute bottom-3 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-[#a75b1d]">{step.visual}</span>
                    <span className="absolute bottom-3 right-4 rounded-full border border-white/70 bg-[#2f251e]/80 px-3 py-1 text-[10px] font-bold uppercase text-white">{step.example}</span>
                  </div>
                  <div className="p-5">
                    <Icon className="text-[#dc791d]" size={24} />
                    <h3 className="font-display mt-3 text-xl tracking-wide text-[#3d332b]">{step.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#70665b]">{step.copy}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#c86123]">{step.verb} <ChevronRight size={12} /></span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="mission-builder" className="reference-panel mt-12 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b border-[#f1d8a5] p-5 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Unified Mission Builder</p>
                  <h2 className="font-display mt-2 text-4xl tracking-wide text-[#bd5c24]">Game + English Job + Challenge</h2>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-[#746b60]">This replaces the old separate Armory idea. Pick a level, choose a game, and the mission statement tells the table exactly what English to produce.</p>
                </div>
                <button onClick={() => onNavigate('games')} className="rule-button px-4 py-2">
                  <Database size={13} /> Browse Reserves
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
              <p className="eyebrow">Active Mission Card</p>
              <h3 className="font-display mt-2 text-4xl tracking-wide text-[#3d332b]">{selectedMission.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#d87522]">{selectedMission.level} Deployment</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[#efc779] bg-white p-4">
                  <p className="font-display text-xl tracking-wide text-[#bd5c24]">Mission Statement</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{selectedMission.missionStatement}</p>
                </div>
                <div className="rounded-xl border border-[#bde8c9] bg-[#f7fff8] p-4">
                  <p className="font-display text-xl tracking-wide text-[#2e7c44]">Table Challenge</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">{selectedMission.challenge}</p>
                </div>
                <div className="rounded-xl border border-[#b9d2fb] bg-[#f7fbff] p-4">
                  <p className="font-display text-xl tracking-wide text-[#366eb4]">Success Looks Like</p>
                  <p className="mt-2 text-sm leading-6 text-[#62584f]">A player says a useful sentence because the board situation demanded it, then records the phrase after play.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="challenge-deck" className="mt-12">
          <div className="mb-5 text-center">
            <p className="eyebrow justify-center">Challenge Deck</p>
            <h2 className="compact-title mt-2 text-3xl">Live Table Prompts</h2>
            <p className="mt-2 text-xs text-[#746b60]">This replaces the old separate Guild Challenges page. Use one card during play, then log the result in Profile.</p>
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

        <h2 className="compact-title mt-12 text-center text-3xl">Support Stations</h2>
        <section className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {commands.map(({ icon: Icon, label, copy, section, tone }) => (
            <button key={label} onClick={() => onNavigate(section)} className={`rounded-xl border p-6 text-left transition-transform hover:-translate-y-0.5 hover:shadow-md ${tone}`}>
              <Icon className="text-[#dc791d]" size={28} />
              <span className="mt-5 block font-display text-xl tracking-wide text-[#4c4036]">{label}</span>
              <span className="mt-2 block text-xs leading-5 text-[#70665b]">{copy}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#c86123]">Go <ChevronRight size={12} /></span>
            </button>
          ))}
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] px-6 py-4">
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">Next Deployment Candidates</p>
              <p className="mt-1 text-xs text-[#7a7065]">Curated from the reserve base for immediate mission planning.</p>
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
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">After-Action Template</p>
              <p className="mt-1 text-xs text-[#7a7065]">Use this structure after any session.</p>
            </div>
            <div className="grid gap-3 p-5">
              {[
                ['Situation', 'What was happening on the board?'],
                ['Decision', 'What did you choose and why?'],
                ['Language', 'Which phrases or vocabulary appeared naturally?'],
                ['Result', 'What changed because of the decision?'],
                ['Next Drill', 'What should be practised next time?'],
              ].map(([label, copy]) => (
                <div key={label} className="rounded border border-[#efd39d] bg-white p-4">
                  <p className="flex items-center gap-2 font-display text-lg tracking-wide text-[#3d332b]"><FileText size={15} className="text-[#d87522]" /> {label}</p>
                  <p className="mt-1 text-xs text-[#70665b]">{copy}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {missingImages.length > 0 && (
          <section className="reference-panel mt-10 flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-display text-2xl tracking-wide text-[#bd5c24]">Maintenance Alert</p>
              <p className="mt-1 text-xs text-[#70665b]">{missingImages.length} reserve cards still need cover images before full visual readiness.</p>
            </div>
            <button onClick={() => onNavigate('admin-images')} className="rule-button rule-button-primary px-5 py-3">
              <Image size={14} /> Open Maintenance
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
