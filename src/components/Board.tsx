import { Award, BookOpen, ChevronRight, Clock, Database, FileText, Image, Radio, Shield, Sparkles, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames, getGamesNeedingImages } from '../lib/games';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import type { Game } from '../types/database';

const commands: Array<{ icon: typeof Database; label: string; copy: string; section: Section; tone: string }> = [
  { icon: Database, label: 'Reserves Database', copy: 'Search the full collection, open detailed cards, and select the next table.', section: 'games', tone: 'border-[#f0c978] bg-[#fff9ec]' },
  { icon: Target, label: 'The Armory', copy: 'Filter simulations by tier and inspect field dossiers before deployment.', section: 'armory', tone: 'border-[#f0c978] bg-white' },
  { icon: Shield, label: 'Guild Challenges', copy: 'Turn a game into an English mission with tactical output.', section: 'challenges', tone: 'border-[#bde8c9] bg-[#f6fff7]' },
  { icon: Trophy, label: 'Ranking', copy: 'Check the public ranking state and prepare the first submissions.', section: 'ranking', tone: 'border-[#b9d2fb] bg-[#f7fbff]' },
  { icon: Award, label: 'Profile Badges', copy: 'Review rank, domain badges, and completion readiness.', section: 'profile', tone: 'border-[#ead4fa] bg-[#fdf8ff]' },
  { icon: Image, label: 'Image Maintenance', copy: 'Repair covers, stage manual updates, and clear missing-image work.', section: 'admin-images', tone: 'border-[#f3b6a8] bg-[#fff7f4]' },
];

const missionFlow: Array<{ label: string; title: string; copy: string; section: Section }> = [
  { label: '01', title: 'Select The Table', copy: 'Start from Reserves or Armory and choose a game with the right weight, time, and language demands.', section: 'games' },
  { label: '02', title: 'Assign The Objective', copy: 'Convert the game into a challenge: negotiation, briefing, auction, alliance, or strategic report.', section: 'challenges' },
  { label: '03', title: 'Deploy English', copy: 'Use table decisions as language prompts: justify, persuade, forecast, compare, and summarize.', section: 'situation' },
  { label: '04', title: 'Record Progress', copy: 'Route outcomes into profile badges, ranking, and future mission planning.', section: 'profile' },
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
  const readyImages = Math.max(games.length - missingImages.length, 0);
  const strategicTitles = games.filter((game) => (game.weight ?? 0) >= 2.5).length;
  const gatewayTitles = games.filter((game) => (game.weight ?? 99) <= 1.8 && (game.duration_minutes ?? 999) <= 45).length;

  const operationStats: Array<[string, string, typeof Database, string]> = [
    ['Available Titles', games.length ? games.length.toString() : '...', Database, 'Total reserve base'],
    ['Ready Covers', games.length ? `${readyImages}/${games.length}` : '...', Image, 'Visible card image coverage'],
    ['Strategic Titles', games.length ? strategicTitles.toString() : '...', Target, 'Advanced planning candidates'],
    ['Gateway Tables', games.length ? gatewayTitles.toString() : '...', Users, 'Fast onboarding candidates'],
  ];

  return (
    <main className="page-shell">
      <header className="tactical-banner py-11 text-center">
        <p className="eyebrow justify-center">Mission Control</p>
        <h1 className="compact-title mt-2">Command Board</h1>
        <p className="mt-4 text-xs text-[#71685d]">Plan the next mission. Deploy language through strategy.</p>
      </header>

      <div className="container-shell py-10">
        <section className="grid gap-4 md:grid-cols-4">
          {operationStats.map(([label, value, Icon, note]) => (
            <article key={String(label)} className="reference-panel p-6 text-center">
              <Icon className="mx-auto text-[#d56d22]" size={25} />
              <p className="font-display mt-3 text-4xl text-[#d06122]">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#776d62]">{label}</p>
              <p className="mt-1 text-[10px] text-[#948a7e]">{note}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
              <p className="eyebrow">Mission Sequence</p>
              <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">Today&apos;s Deployment Path</h2>
            </div>
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {missionFlow.map((step) => (
                <button key={step.label} onClick={() => onNavigate(step.section)} className="rounded-xl border border-[#efd39d] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="font-display text-3xl text-[#efbd72]">{step.label}</span>
                  <h3 className="font-display mt-2 text-xl tracking-wide text-[#3d332b]">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#70665b]">{step.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#c86123]">Open station <ChevronRight size={12} /></span>
                </button>
              ))}
            </div>
          </article>

          <article className="reference-panel overflow-hidden">
            <div className="border-b border-[#f1d8a5] bg-[#fff8ea] px-6 py-4">
              <p className="eyebrow">Signal</p>
              <h2 className="font-display mt-2 text-3xl tracking-wide text-[#bd5c24]">Commander&apos;s Brief</h2>
            </div>
            <div className="space-y-4 p-5 text-sm leading-7 text-[#6f655a]">
              <p><Radio className="mr-2 inline text-[#d87522]" size={16} />Choose one game, one language objective, and one visible output. A mission is not “play a game.” A mission is a strategic situation that forces useful English to appear.</p>
              <p><BookOpen className="mr-2 inline text-[#4c89d8]" size={16} />Best starting pattern: one short briefing before play, three required phrases during play, one after-action summary at the end.</p>
              <button onClick={() => onNavigate('challenges')} className="rule-button rule-button-primary mt-2 w-full justify-center py-3">
                <Sparkles size={14} /> Initialize Challenge Route
              </button>
            </div>
          </article>
        </section>

        <h2 className="compact-title mt-12 text-center text-3xl">Operations</h2>
        <section className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
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
