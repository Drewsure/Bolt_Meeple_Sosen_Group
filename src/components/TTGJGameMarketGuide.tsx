import { useState } from 'react';

const tabs = ['Timeline', 'Pricing', 'Lexicon', 'Circuit'] as const;

export function TTGJGameMarketGuide() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Timeline');

  return (
    <section id="ttgj-game-market-guide" className="border-y border-[#332b1b] bg-[#050505] text-[#f0f0f0]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="flex justify-between border-b border-[#ffd700]/30 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd700]">
          <span>Game Market visitor guide</span>
          <span>Verify official details before travel</span>
        </div>
        <h2 className="mt-7 text-4xl font-black uppercase leading-tight md:text-6xl">The Game Market Tactical Manual</h2>
        <p className="mt-2 text-sm font-semibold italic text-[#999]">Tokyo visitor edition: a practical preparation guide.</p>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={`rounded-xl border border-[#ffd700]/30 p-3 text-xs font-black uppercase transition ${tab === item ? 'bg-[#ffd700] text-black' : 'bg-white/5 hover:bg-[#ffd700]/10'}`}>{item}</button>)}
        </div>

        <div className="mt-8 rounded-2xl border border-[#ffd700]/30 bg-white/[0.04] p-5 md:p-7">
          {tab === 'Timeline' && (
            <div className="space-y-5 text-sm leading-7 text-[#d0d0d0]">
              <h3 className="text-xl font-black text-[#ffd700]">Event preparation timeline</h3>
              <p><strong className="text-white">Two weeks before:</strong> check the official Game Market website, ticket rules, venue access, and any industry registration deadlines.</p>
              <p><strong className="text-white">The day before:</strong> prepare smaller yen notes and coins, top up your IC travel card, bring a sturdy tote bag, and buy travel essentials before reaching the venue.</p>
              <p><strong className="text-white">Event day:</strong> allow extra time for the train and station walk. Visit indie booths early because smaller print runs can sell out first.</p>
            </div>
          )}
          {tab === 'Pricing' && (
            <div className="space-y-4 text-sm leading-7 text-[#d0d0d0]">
              <h3 className="text-xl font-black text-[#ffd700]">Tickets and entry</h3>
              <p>Ticket prices, sales channels, entry windows, and venue halls can change between events. Confirm the current arrangements on the official Game Market website before travel.</p>
              <a className="inline-flex rounded bg-[#ffd700] px-4 py-3 text-xs font-black text-black" href="https://gamemarket.jp/" target="_blank" rel="noreferrer">Open official Game Market site</a>
            </div>
          )}
          {tab === 'Lexicon' && (
            <div>
              <h3 className="text-xl font-black text-[#ffd700]">Point and show communication</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  ['One of these, please.', 'Kore o hitotsu kudasai.'],
                  ['Can I playtest?', 'Shiyu dekimasu ka?'],
                  ['English rules?', 'Eigo no ruru wa arimasu ka?'],
                  ['Is it sold out?', 'Urikire desu ka?'],
                  ['May I take a photo?', 'Shashin o tottemo ii desu ka?'],
                  ['Do you take credit cards?', 'Kado wa tsukaemasu ka?'],
                ].map(([english, romaji]) => <div key={english} className="rounded-lg border border-white/10 bg-[#111] p-3"><p className="text-xs font-black text-white">{english}</p><p className="mt-1 text-xs italic text-[#ffd700]">{romaji}</p></div>)}
              </div>
            </div>
          )}
          {tab === 'Circuit' && (
            <div className="space-y-4 text-sm leading-7 text-[#d0d0d0]">
              <h3 className="text-xl font-black text-[#ffd700]">Beyond Tokyo</h3>
              <p><strong className="text-white">Osaka:</strong> watch for Kansai events with a close focus on regional designers and smaller booths.</p>
              <p><strong className="text-white">Fukuoka:</strong> connect regional events with Kyushu creators, cafes, and community tables.</p>
              <p><strong className="text-white">Tokyo autumn circuit:</strong> revisit the official schedule for the largest seasonal releases and polished follow-up editions.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
