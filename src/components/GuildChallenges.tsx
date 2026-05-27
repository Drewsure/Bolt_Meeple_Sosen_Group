import { Flag, Lightbulb, Shield, Swords, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Section } from '../App';
import { buildGameBrief } from '../lib/gameBriefs';
import { getGames } from '../lib/games';
import { subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import type { Game } from '../types/database';

const challenges = [
  { level: 'Advanced', game: 'Power Grid', title: 'The Power Plant Auction', body: 'Write a formal auction bid declaration in English for Power Plant #41.', tags: ['Formal Writing', 'Economics', 'Strategic Bidding'], color: 'pill-blue' },
  { level: 'Foundation', game: 'Catan', title: 'The Catan Diplomatic Alliance', body: 'Deliver a short diplomatic speech in English to propose a non-aggression trade pact.', tags: ['Diplomacy', 'Conditional Phrases', 'Spoken English'], color: 'pill-green' },
  { level: 'Intermediate', game: 'Brass: Birmingham', title: 'The Coal Crisis Negotiation', body: 'Draft a formal business proposal in English to secure a coal supply contract.', tags: ['Negotiation', 'Formal Writing', 'Trade'], color: 'pill-blue' },
  { level: 'Foundation', game: 'Pandemic', title: 'The Pandemic Emergency Brief', body: 'Present a three-point strategic argument in English to your team.', tags: ['Persuasion', 'Leadership', 'Team Communication'], color: 'pill-green' },
  { level: 'Master', game: 'Terraforming Mars', title: 'The Terraforming Merger Pitch', body: 'Compose a collaborative project pitch in English proposing a joint venture.', tags: ['Corporate English', 'Collaboration', 'Negotiation'], color: '' },
];

export function GuildChallenges({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [catalogue, setCatalogue] = useState<Game[]>([]);

  useEffect(() => {
    const loadGames = () => {
      getGames().then(setCatalogue);
    };
    loadGames();
    return subscribeToPreviewGameUpdates(loadGames);
  }, []);

  const catalogueByTitle = useMemo(
    () => new Map(catalogue.map((game) => [game.title.toLowerCase(), game])),
    [catalogue],
  );

  return (
    <main className="page-shell">
      <header className="tactical-banner py-12 text-center">
        <h1 className="compact-title"><Shield className="mr-2 inline" size={25} /> Guild Challenges <Shield className="ml-2 inline" size={25} /></h1>
        <p className="mt-4 text-xs text-[#71685d]">Complete simulated strategic scenarios. Share and vote on community English tips.</p>
      </header>
      <div className="mx-auto max-w-4xl px-5 py-9">
        <div className="flex justify-center gap-2">
          {['All', 'Foundation', 'Intermediate', 'Advanced', 'Master'].map((filter, index) => <span key={filter} className={`rounded border border-[#ebbc68] px-4 py-2 text-[10px] font-bold uppercase ${index === 0 ? 'bg-[#eb921c] text-white' : ''}`}>{filter}</span>)}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[['5', 'Active Challenges', Swords], ['5+', 'Mission Types', Lightbulb], ['-', 'Guild Members', Users]].map(([value, label, Icon]) => (
            <div key={String(label)} className="reference-panel py-5 text-center"><Icon className="mx-auto text-[#db781f]" size={21} /><strong className="mt-1 block font-display text-2xl">{String(value)}</strong><span className="text-[10px] text-[#756a60]">{String(label)}</span></div>
          ))}
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {challenges.map((challenge) => {
            const game = catalogueByTitle.get(challenge.game.toLowerCase());
            return (
              <article key={challenge.title} className="tactical-card overflow-hidden">
                <div className="relative h-28 bg-gradient-to-br from-[#f2ddc0] to-[#e8edf4]">
                  {game?.cover_image_url ? (
                    <img src={game.cover_image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center font-display text-3xl text-[#b46f3f]">{challenge.game}</div>
                  )}
                  <span className={`pill ${challenge.color} absolute left-3 top-3`}>{challenge.level}</span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase text-[#d06a24]">{challenge.game}</p>
                  <h2 className="font-display text-base tracking-wide">{challenge.title}</h2>
                  {game && <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-[#756a60]">{buildGameBrief(game)}</p>}
                  <p className="mt-3 rounded border border-[#efd08e] bg-[#fff9e9] p-3 text-[10px] leading-5 text-[#5f554c]"><Flag className="mr-1 inline text-[#dc7c20]" size={11} />{challenge.body}</p>
                  <div className="mt-3 flex flex-wrap gap-1">{challenge.tags.map((tag) => <span key={tag} className="rounded border border-[#dbd0c3] px-2 py-1 text-[9px]">{tag}</span>)}</div>
                  <button onClick={() => onNavigate('ranking')} className="mt-4 text-[10px] text-[#756a60]">Click to view details <span className="float-right text-[#de7c1f]">&gt;</span></button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
