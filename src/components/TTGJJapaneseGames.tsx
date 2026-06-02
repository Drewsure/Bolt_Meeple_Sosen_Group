import { useState } from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';
import type { TTGJCatalogEntry } from '../lib/ttgjCatalog';
import { TTGJCultureArcade, type CultureGameId } from './TTGJCultureArcade';
import { TTGJCultureDeepDive } from './TTGJCultureDeepDive';

function GameCard({ game }: { game: TTGJCatalogEntry }) {
  return (
    <article className="rounded-2xl border border-white/80 bg-white/65 p-4 shadow-[0_12px_30px_rgba(114,91,62,0.08)] backdrop-blur-xl">
      <Gamepad2 size={18} className="text-[#bc4937]" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7560]">{game.meta}</p>
      <h3 className="mt-1.5 text-lg font-black">{game.title}</h3>
      <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[#6d6258]">{game.description}</p>
    </article>
  );
}

export function TTGJJapaneseGames({ games }: { games: TTGJCatalogEntry[] }) {
  const newGames = games.slice(0, 6);
  const recommended = [...games].reverse().slice(0, 6);
  const [selectedCulture, setSelectedCulture] = useState<CultureGameId | null>(null);

  return (
    <section id="ttgj-japanese-games" className="border-y border-[#e1cfac] bg-[#f3ead8]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bc4937]">Japan tabletop hero</p>
            <h2 className="font-display mt-4 text-5xl uppercase leading-[0.92] text-[#171717] md:text-7xl">
              The world&apos;s most unique <span className="text-[#c81727]">gaming culture</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-[#6d6258]">
              Japan has developed one of the world&apos;s most vibrant tabletop gaming cultures. From centuries-old games like Shogi and Mahjong to cutting-edge indie designs, Japan&apos;s analog gaming scene is unlike anything else on Earth.
            </p>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-[#6d6258]">
              TTGJ connects traditional play, modern Japanese-made games, creators, cafes, retailers, and visitor-ready routes.
            </p>
          </div>
          <TTGJCultureArcade onSelect={setSelectedCulture} />
        </div>

        <div className="mt-14 grid gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#bc4937]" />
              <h3 className="text-2xl font-black uppercase">New Japanese Games - Made by Japan -</h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {newGames.map((game) => <GameCard key={`new-${game.id}`} game={game} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Gamepad2 size={18} className="text-[#bc4937]" />
              <h3 className="text-2xl font-black uppercase">Recommended Japanese Games</h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {recommended.map((game) => <GameCard key={`recommended-${game.id}`} game={game} />)}
            </div>
          </div>
        </div>
      </div>
      {selectedCulture && <TTGJCultureDeepDive initialId={selectedCulture} onClose={() => setSelectedCulture(null)} />}
    </section>
  );
}
