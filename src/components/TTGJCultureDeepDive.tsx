import { useEffect, useState } from 'react';
import { Database, Dices, ExternalLink, Flower2, History, Sparkles, X, Zap } from 'lucide-react';
import { CultureIntroductoryExample, type CultureGameId } from './TTGJCultureArcade';

type CultureId = CultureGameId;
type CultureDetail = {
  id: CultureId;
  character: string;
  title: string;
  japanese: string;
  caption: string;
  legacy: string;
  mechanic: string;
  bridge: string;
  query: string;
  image: string;
  imageCredit: string;
  imageSource: string;
};

const details: CultureDetail[] = [
  {
    id: 'shogi', character: '\u5c06', title: 'Shogi', japanese: '\u5c06\u68cb', caption: 'The captured piece returns with a new allegiance.',
    legacy: 'Shogi is the ultimate game of recycling. Unlike Western chess, captured pieces are not discarded. They can return to the board as your own soldiers, reflecting an age when loyalties could change with the tide of battle.',
    mechanic: 'The Drop: a captured piece can be placed back onto almost any open square. A quiet reserve becomes a sudden attack, so the board is never the whole battlefield.',
    bridge: 'The strategy and emotional pressure of Shogi are central to stories such as March Comes in Like a Lion. For visitors, Shogi halls reveal a living competitive tradition rather than a museum piece.',
    query: "Find public Shogi halls, teaching tables, and visitor-ready sessions.", image: '/images/culture/shogi.jpg', imageCredit: 'Shogi board, Wikimedia Commons', imageSource: 'https://commons.wikimedia.org/wiki/File:Shogi_board_pieces_and_komadai.jpg',
  },
  {
    id: 'mahjong', character: '\u9ebb', title: 'Mahjong', japanese: '\u9ebb\u96c0', caption: 'Four winds, 136 tiles, and the tension of a declared Riichi.',
    legacy: 'Mahjong was born in China, then evolved sharply in Japan. The Japanese Riichi variant turns a social game into a psychological duel of shifting winds, hidden multipliers, and dangerous discards.',
    mechanic: 'Furiten: if you previously discarded a tile that could complete your hand, you cannot win from another player discarding it. Reading the discard field becomes a forensic investigation.',
    bridge: 'Akagi captured the high-stakes drama of Riichi Mahjong, while M-League has made the game a polished televised competition with professional teams and commentary.',
    query: 'Find beginner-friendly Mahjong parlors with public entry and visitor guidance.', image: '/images/culture/mahjong.jpg', imageCredit: 'Mahjong tiles, Wikimedia Commons', imageSource: 'https://commons.wikimedia.org/wiki/File:MahjongWD.jpg',
  },
  {
    id: 'hanafuda', character: '\u82b1', title: 'Hanafuda', japanese: '\u82b1\u672d', caption: 'Twelve months of seasonal warfare in the palm of your hand.',
    legacy: 'Hanafuda survived Japan\'s forbidden-games era. Floral imagery replaced numbers and suits, creating a game of poetic association that could carry the tension of card play beneath an elegant surface. Nintendo began by producing Hanafuda cards in Kyoto in 1889.',
    mechanic: 'Koi-Koi: forming a scoring combination does not have to end the round. Bank the points or call Koi-Koi and continue for a higher reward, with the risk of handing the advantage to your opponent.',
    bridge: 'Hanafuda connects a centuries-old analog craft to Nintendo\'s origins and appears memorably in Summer Wars, where the cards become a dramatic language of nerve and calculation.',
    query: 'Find Hanafuda play spaces, cultural sites, and seasonal card experiences.', image: '/images/culture/hanafuda.jpg', imageCredit: 'Nintendo Hanafuda cards, Wikimedia Commons', imageSource: 'https://commons.wikimedia.org/wiki/File:Nintendo_Hanafuda.jpg',
  },
  {
    id: 'go', character: '\u56f2', title: 'Go', japanese: '\u56f2\u7881', caption: 'A game of space, breath, territory, and influence.',
    legacy: 'Go is not a game of destruction but a game of space. More than 2,500 years old, it arrived in Japan as an elite discipline and simulation of cosmic order. The board gradually fills until influence can be counted.',
    mechanic: 'Liberties: a stone breathes through adjacent empty intersections. Block every exit and the group is captured. The urgent Atari state means only one liberty remains.',
    bridge: 'Hikaru no Go introduced a new generation to the game. AlphaGo later turned the ancient board into a modern milestone in the story of artificial intelligence.',
    query: 'Find public Go salons with bilingual support and visitor-ready teaching tables.', image: '/images/culture/go.jpg', imageCredit: 'Go board, Yinan Chen / public domain', imageSource: 'https://www.goodfreephotos.com/albums/other-photos/go-board.jpg',
  },
  {
    id: 'karuta', character: '\u6b4c', title: 'Karuta', japanese: '\u6b4c\u7559\u591a', caption: 'Poetry remembered so deeply that the body moves first.',
    legacy: 'Karuta is the martial art of literature. Rooted in the Ogura Hyakunin Isshu anthology, it transformed poetry study into a fast tactile sport where rhythm, memory, and composure meet.',
    mechanic: 'Dead-card logic: only half of the poem cards may be on the mat. Players must stay still when an absent card is read, then strike instantly when the first identifying syllable reveals a live card.',
    bridge: 'Chihayafuru brought competitive Karuta into popular culture, revealing the silence, speed, and fierce concentration of the tournament scene.',
    query: 'Find public Karuta events, cultural demonstrations, and visitor practice sessions.', image: '/images/culture/karuta.jpg', imageCredit: 'Karuta waka cards, Wikimedia Commons', imageSource: 'https://commons.wikimedia.org/wiki/File:Karuta_waka.jpg',
  },
  {
    id: 'sugoroku', character: '\u53cc', title: 'Sugoroku', japanese: '\u53cc\u516d', caption: 'The original race for fortune and fate.',
    legacy: 'Sugoroku is a family of racing games. Picture Sugoroku became a vivid Edo-period form of mass media: a map, lesson, satire, and game in one. Players travelled imaginary routes long before digital party games.',
    mechanic: 'Directional branching: special dice results can split the route, send a traveller toward the capital, or trap them at a local inn for a lost turn. Probability hides beneath a playful board.',
    bridge: 'The route-and-roll DNA of Sugoroku continues through Japanese life-simulation games and party-game franchises, including the cultural path that leads toward Mario Party.',
    query: 'Find Sugoroku archives, family play spaces, and visitor-ready cultural exhibits.', image: '/images/culture/sugoroku.jpg', imageCredit: 'Historical Sugoroku board, Edo-Tokyo Museum Collection', imageSource: 'https://cultural.jp/en/item/tokyomuseumcolection-edo_tokyo_museumjbD90204712',
  },
];

function ShogiViz() {
  return <div className="ttgj-viz-board ttgj-viz-shogi">{Array.from({ length: 9 }, (_, index) => <div key={index} className="ttgj-viz-cell">{index === 0 ? '\u738b' : index === 2 ? '\u9999' : index === 4 ? <span className="ttgj-drop-piece">{'\u91d1'}</span> : ''}</div>)}</div>;
}
function MahjongViz() {
  return <div className="flex gap-2">{['\u4e00', '\u4e5d', '\u4e2d', '\u4e8c'].map((tile) => <span key={tile} className={`ttgj-mahjong-tile ${tile === '\u4e2d' ? 'ttgj-safe-tile' : ''}`}>{tile}</span>)}</div>;
}
function HanafudaViz() {
  return <div className="flex items-center gap-5"><span className="ttgj-hanafuda-card"><Flower2 size={24} />{'\u6885'}</span><span className="ttgj-koi-bridge">Koi-Koi</span><span className="ttgj-hanafuda-card ttgj-hanafuda-delay"><Flower2 size={24} />{'\u685c'}</span></div>;
}
function GoViz() {
  return <div className="ttgj-viz-board ttgj-viz-go">{Array.from({ length: 9 }, (_, index) => <div key={index} className="ttgj-viz-cell">{[1, 3, 5, 7].includes(index) && <span className="ttgj-go-stone ttgj-black-stone" />}{index === 4 && <span className="ttgj-go-stone ttgj-atari-stone" />}</div>)}</div>;
}
function KarutaViz() {
  return <div className="relative grid grid-cols-5 gap-1.5 overflow-hidden">{Array.from({ length: 20 }, (_, index) => <span key={index} className={`h-9 w-7 rounded-sm border border-[#806332]/25 bg-white/70 ${index === 12 ? 'ttgj-karuta-target' : ''}`} />)}<span className="ttgj-karuta-strike" /></div>;
}
function SugorokuViz() {
  return <div className="flex items-center gap-5"><span className="ttgj-rolling-die"><Dices size={25} /></span><svg width="190" height="92" viewBox="0 0 190 92" aria-label="Animated Sugoroku branching path"><path d="M8 46 H74 L138 14 M74 46 L138 78" fill="none" stroke="#bd541f" strokeDasharray="6 5" strokeWidth="3" /><circle className="ttgj-sugoroku-runner" cx="8" cy="46" r="7" fill="#c81727" /><text x="141" y="17" fontSize="10" fill="#806332">CAPITAL</text><text x="141" y="82" fontSize="10" fill="#806332">LOCAL INN</text></svg></div>;
}
function Visualization({ id }: { id: CultureId }) {
  if (id === 'shogi') return <ShogiViz />;
  if (id === 'mahjong') return <MahjongViz />;
  if (id === 'hanafuda') return <HanafudaViz />;
  if (id === 'go') return <GoViz />;
  if (id === 'karuta') return <KarutaViz />;
  return <SugorokuViz />;
}

export function TTGJCultureDeepDive({ initialId, onClose }: { initialId: CultureId; onClose: () => void }) {
  const [activeId, setActiveId] = useState<CultureId>(initialId);
  const active = details.find((detail) => detail.id === activeId) ?? details[0];
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111118]/80 p-3 backdrop-blur-sm md:p-6" role="presentation" onMouseDown={onClose}>
      <article role="dialog" aria-modal="true" aria-labelledby="ttgj-culture-dialog-title" onMouseDown={(event) => event.stopPropagation()} className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/80 bg-[#f8f5ef] shadow-[0_28px_90px_rgba(0,0,0,0.48)] lg:grid-cols-[0.38fr_0.62fr]">
        <div className="relative hidden min-h-[42rem] overflow-hidden bg-[#171827] lg:block">
          <img src={active.image} alt={`${active.title} culture reference`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-black/15" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e8bd66]">Visual reference</p>
            <h3 className="mt-2 text-4xl font-black">{active.japanese}</h3>
            <p className="mt-1 text-lg font-black">{active.title}</p>
            <a href={active.imageSource} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-white/75 transition hover:text-white">{active.imageCredit}<ExternalLink size={11} /></a>
          </div>
        </div>
        <div className="overflow-y-auto">
          <div className="sticky top-0 z-10 border-b border-[#decfb9] bg-[#f8f5ef]/95 px-5 py-4 backdrop-blur-xl md:px-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#bc4937]">Cultural field notes</p>
              <button type="button" onClick={onClose} aria-label="Close culture window" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#decfb9] bg-white text-[#6d6258] transition hover:border-[#c81727] hover:text-[#c81727]"><X size={16} /></button>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {details.map((detail) => <button type="button" key={detail.id} onClick={() => setActiveId(detail.id)} aria-pressed={activeId === detail.id} className={`ttgj-field-note-${detail.id} rounded-md border px-1 py-2 text-center transition ${activeId === detail.id ? 'border-[#c81727] bg-[#c81727] text-white' : 'border-[#decfb9] bg-white/70 hover:bg-white'}`}><span className="block font-editorial text-lg font-black">{detail.character}</span><span className="hidden text-[9px] font-black uppercase sm:block">{detail.title}</span></button>)}
            </div>
          </div>
          <div className="p-5 md:p-7">
            <div className="overflow-hidden rounded-xl bg-[#171827]">
              <div className="relative h-44 lg:hidden"><img src={active.image} alt={`${active.title} culture reference`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#111118] to-transparent" /></div>
              <div className="p-5 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e8bd66]">Play time: introductory session</p>
                <h2 id="ttgj-culture-dialog-title" className="mt-2 text-3xl font-black">{active.japanese} <span className="text-white/65">({active.title})</span></h2>
                <p className="mt-3 font-editorial text-sm font-bold italic leading-6 text-white/85">&ldquo;{active.caption}&rdquo;</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#c81727]"><History size={16} /><p className="text-[10px] font-black uppercase tracking-[0.2em]">The cultural legacy</p></div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#6d6258]">{active.legacy}</p>
            <div className="mt-5 rounded-xl bg-[#171827] p-5 text-white">
              <div className="flex items-center gap-2 text-[#e8bd66]"><Zap size={15} /><p className="text-[10px] font-black uppercase tracking-[0.18em]">Strategic mechanic</p></div>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/80">{active.mechanic}</p>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7560]">Tactical animation</p>
              <div className="mt-3 flex min-h-44 items-center justify-center overflow-hidden rounded-xl border border-[#decfb9] bg-white/75 p-5"><Visualization id={active.id} /></div>
            </div>
            <div className="mt-6"><CultureIntroductoryExample key={active.id} id={active.id} /></div>
            <div className="mt-6 flex items-center gap-2 text-[#2d6b5e]"><Sparkles size={15} /><p className="text-[10px] font-black uppercase tracking-[0.18em]">Pop-culture bridge</p></div>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#6d6258]">{active.bridge}</p>
            <div className="mt-5 rounded-lg border border-[#2d6b5e]/25 bg-[#ecf6f1] p-3">
              <div className="flex items-center gap-2 text-[#2d6b5e]"><Database size={14} /><p className="text-[10px] font-black uppercase tracking-[0.16em]">Tourist action engine</p></div>
              <p className="mt-2 text-xs font-bold leading-5 text-[#47675f]">{active.query}</p>
            </div>
            <a href={active.imageSource} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8a7560] transition hover:text-[#c81727] lg:hidden">{active.imageCredit}<ExternalLink size={11} /></a>
          </div>
        </div>
      </article>
    </div>
  );
}
