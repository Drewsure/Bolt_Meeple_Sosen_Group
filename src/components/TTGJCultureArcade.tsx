import { useState } from 'react';
import { Dices, Flower2, Grid3X3, RotateCcw, Sparkles, Swords, Trophy } from 'lucide-react';

export type CultureGameId = 'shogi' | 'mahjong' | 'hanafuda' | 'go' | 'karuta' | 'sugoroku';
type CultureGame = { id: CultureGameId; character: string; label: string; description: string; prompt: string; color: string };

export const cultureGames: CultureGame[] = [
  { id: 'shogi', character: '\u5c06', label: 'Shogi', description: 'Japanese Chess', prompt: 'Advance the gold general to protect the king.', color: '#b43b2d' },
  { id: 'mahjong', character: '\u9ebb', label: 'Mahjong', description: 'Tile Strategy', prompt: 'Find the matching tile pair.', color: '#2d6b5e' },
  { id: 'hanafuda', character: '\u82b1', label: 'Hanafuda', description: 'Flower Cards', prompt: 'Match the seasonal flower cards.', color: '#c81727' },
  { id: 'go', character: '\u56f2', label: 'Go', description: 'Ancient Strategy', prompt: 'Place stones and shape a territory.', color: '#171717' },
  { id: 'karuta', character: '\u6b4c', label: 'Karuta', description: 'Poetry Cards', prompt: 'Catch the card that begins with the spoken sound.', color: '#806332' },
  { id: 'sugoroku', character: '\u53cc', label: 'Sugoroku', description: 'Board Racing', prompt: 'Roll the dice and guide the fox to the finish.', color: '#bd541f' },
];

function CompleteNote({ text }: { text: string }) {
  return <div className="flex items-center gap-2 rounded-lg border border-[#bad8c9] bg-[#f1faf5] px-3 py-2 text-xs font-black text-[#2d6b5e]"><Trophy size={15} />{text}</div>;
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-md border border-[#dbcbb5] bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#6d6258] transition hover:bg-white"><RotateCcw size={13} />Reset</button>;
}

function ShogiMiniGame() {
  const [moved, setMoved] = useState(false);
  const pieces = [['\u9999', '', '\u738b'], ['', moved ? '' : '\u91d1', ''], ['', '', moved ? '\u91d1' : '']];
  return <div>
    <div className="grid w-48 grid-cols-3 border border-[#b48a50] bg-[#e7bd76]">
      {pieces.flatMap((row, rowIndex) => row.map((piece, columnIndex) => {
        const destination = rowIndex === 2 && columnIndex === 2;
        return <button type="button" key={`${rowIndex}-${columnIndex}`} onClick={() => destination && !moved && setMoved(true)} className={`aspect-square border border-[#c69552] text-2xl font-black transition ${destination && !moved ? 'animate-pulse bg-[#fff1b5] hover:bg-white' : ''}`} aria-label={destination ? 'Move gold general here' : 'Shogi square'}>{piece}</button>;
      }))}
    </div>
    <div className="mt-4 flex items-center gap-3">{moved ? <CompleteNote text="King protected. Nicely read." /> : <p className="text-xs font-bold text-[#6d6258]">Tap the glowing square.</p>}<ResetButton onClick={() => setMoved(false)} /></div>
  </div>;
}

function PairMiniGame({ hanafuda = false }: { hanafuda?: boolean }) {
  const tiles = hanafuda ? ['\u6885', '\u685c', '\u83ca', '\u685c', '\u677e', '\u9db4'] : ['\u4e2d', '\u767c', '\u4e09', '\u767c', '\u4e5d', '\u6771'];
  const answer = hanafuda ? '\u685c' : '\u767c';
  const [selected, setSelected] = useState<number[]>([]);
  const solved = selected.length === 2 && selected.every((index) => tiles[index] === answer);
  function choose(index: number) {
    if (solved) return;
    if (selected.includes(index)) return setSelected(selected.filter((value) => value !== index));
    const next = [...selected, index].slice(-2);
    setSelected(next);
    if (next.length === 2 && !next.every((value) => tiles[value] === answer)) window.setTimeout(() => setSelected([]), 420);
  }
  return <div>
    <div className="grid max-w-sm grid-cols-3 gap-2">{tiles.map((tile, index) => <button type="button" key={`${tile}-${index}`} onClick={() => choose(index)} className={`aspect-[4/3] rounded-lg border text-2xl font-black shadow-sm transition hover:-translate-y-0.5 ${selected.includes(index) ? 'border-[#c81727] bg-[#fff0ed] text-[#c81727]' : 'border-[#decfb9] bg-white/80 text-[#2d6b5e]'}`}>{hanafuda ? <span className="flex items-center justify-center gap-1"><Flower2 size={16} />{tile}</span> : tile}</button>)}</div>
    <div className="mt-4 flex items-center gap-3">{solved ? <CompleteNote text={hanafuda ? 'Cherry blossom pair found.' : 'Green dragon pair found.'} /> : <p className="text-xs font-bold text-[#6d6258]">Choose two matching cards.</p>}<ResetButton onClick={() => setSelected([])} /></div>
  </div>;
}

function GoMiniGame() {
  const [stones, setStones] = useState<Record<number, 'black' | 'white'>>({});
  const turn = Object.keys(stones).length % 2 === 0 ? 'black' : 'white';
  return <div>
    <div className="grid w-48 grid-cols-5 border border-[#b48a50] bg-[#dfb66f] p-1">{Array.from({ length: 25 }, (_, index) => <button type="button" key={index} onClick={() => setStones((current) => current[index] ? current : { ...current, [index]: turn })} className="relative aspect-square border border-[#b48a50]/60" aria-label={`Place ${turn} stone at intersection ${index + 1}`}>{stones[index] && <span className={`absolute inset-[16%] rounded-full shadow-md ${stones[index] === 'black' ? 'bg-[#1f1f1f]' : 'border border-[#d8d3ca] bg-white'}`} />}</button>)}</div>
    <div className="mt-4 flex items-center gap-3"><p className="text-xs font-bold text-[#6d6258]">{Object.keys(stones).length ? `${Object.keys(stones).length} stones placed. ${turn} to play.` : 'Black opens. Tap any intersection.'}</p><ResetButton onClick={() => setStones({})} /></div>
  </div>;
}

function KarutaMiniGame() {
  const cards = ['\u3042', '\u304b', '\u3055', '\u305f'];
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const target = cards[round % cards.length];
  function choose(card: string) { if (card === target) { setWon(true); window.setTimeout(() => { setRound((value) => value + 1); setWon(false); }, 700); } }
  return <div>
    <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#806332]">Listen for: <span className="ml-2 text-3xl text-[#c81727]">{target}</span></p>
    <div className="grid max-w-sm grid-cols-4 gap-2">{[...cards].reverse().map((card) => <button type="button" key={card} onClick={() => choose(card)} className="aspect-[3/4] rounded-md border border-[#decfb9] bg-white/80 font-editorial text-3xl font-black text-[#171717] shadow-sm transition hover:-translate-y-1 hover:border-[#c81727]">{card}</button>)}</div>
    <div className="mt-4">{won ? <CompleteNote text="Card captured. Quick hands." /> : <p className="text-xs font-bold text-[#6d6258]">Tap the matching poetry card.</p>}</div>
  </div>;
}

function SugorokuMiniGame() {
  const [position, setPosition] = useState(0);
  const [roll, setRoll] = useState<number | null>(null);
  const finished = position === 7;
  function rollDice() { const next = 1 + Math.floor(Math.random() * 3); setRoll(next); setPosition((current) => Math.min(7, current + next)); }
  return <div>
    <div className="grid max-w-md grid-cols-8 gap-1.5">{Array.from({ length: 8 }, (_, index) => <div key={index} className={`flex aspect-square items-center justify-center rounded-md border text-xs font-black ${index === position ? 'border-[#c81727] bg-[#fff0ed]' : 'border-[#decfb9] bg-white/75'}`}>{index === position ? <img src="/images/ttgj-fox.png" alt="" className="h-8 w-8 object-contain" /> : index === 7 ? <Trophy size={15} className="text-[#bd541f]" /> : index + 1}</div>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3">{finished ? <CompleteNote text="The fox reached the finish." /> : <button type="button" onClick={rollDice} className="inline-flex items-center gap-2 rounded-md bg-[#c81727] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#a91120]"><Dices size={15} />Roll dice {roll && `- ${roll}`}</button>}<ResetButton onClick={() => { setPosition(0); setRoll(null); }} /></div>
  </div>;
}

function ActiveGame({ id }: { id: CultureGameId }) {
  if (id === 'shogi') return <ShogiMiniGame />;
  if (id === 'mahjong') return <PairMiniGame />;
  if (id === 'hanafuda') return <PairMiniGame hanafuda />;
  if (id === 'go') return <GoMiniGame />;
  if (id === 'karuta') return <KarutaMiniGame />;
  return <SugorokuMiniGame />;
}

export function CultureIntroductoryExample({ id }: { id: CultureGameId }) {
  const active = cultureGames.find((game) => game.id === id) ?? cultureGames[0];
  return <div className="overflow-hidden rounded-xl border border-[#decfb9] bg-white/80 p-5">
    <div className="grid gap-5 sm:grid-cols-[0.72fr_1.28fr] sm:items-center">
      <div>
        <div className="flex items-center gap-2 text-[#c81727]">{active.id === 'shogi' ? <Swords size={18} /> : active.id === 'go' ? <Grid3X3 size={18} /> : active.id === 'sugoroku' ? <Dices size={18} /> : <Sparkles size={18} />}<p className="text-[10px] font-black uppercase tracking-[0.2em]">Introductory example</p></div>
        <h3 className="mt-3 text-2xl font-black">{active.label}</h3>
        <p className="mt-2 max-w-xs text-xs font-semibold leading-5 text-[#6d6258]">{active.prompt}</p>
      </div>
      <ActiveGame id={active.id} />
    </div>
  </div>;
}

export function TTGJCultureArcade({ onSelect }: { onSelect: (id: CultureGameId) => void }) {
  return <div>
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#bc4937]">Introductory examples</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#6d6258]">Choose a tradition to open its visual story, tactical animation, and introductory playable example.</p>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{cultureGames.map((game) => {
      return <button type="button" key={game.id} onClick={() => onSelect(game.id)} className={`ttgj-culture-card ttgj-culture-${game.id} group relative overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-5 text-center shadow-[0_12px_30px_rgba(114,91,62,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#c81727] hover:bg-white/95`}><span className="ttgj-culture-sigil font-editorial block text-4xl font-black" style={{ color: game.color }}>{game.character}</span><span className="mt-2 block text-sm font-black">{game.label}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-[#8a7560]">{game.description}</span><span className="mx-auto mt-3 block h-1 w-8 rounded-full bg-[#decfb9] transition group-hover:bg-[#c81727]" /></button>;
    })}</div>
  </div>;
}
