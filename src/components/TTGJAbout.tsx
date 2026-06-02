import { Database, Gamepad2, Globe2, Heart, MapPinned, ShieldCheck, Users } from 'lucide-react';

const values = [
  ['Accessibility', 'Breaking down language barriers to make Japanese gaming culture accessible to everyone.'],
  ['Accuracy', 'Providing up-to-date and verified information you can rely on for your adventures.'],
  ['Community', 'Connecting players, venues, and creators to foster a thriving tabletop ecosystem.'],
  ['Passion', 'We love board games. That passion drives everything we build and share.'],
] as const;

export function TTGJAbout({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section id="ttgj-about" className="border-y border-[#e1d4c1] bg-[#f8f5ef]">
      <div className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e8bf68]">About TableTop Games Japan</p>
          <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-7xl">Our <span className="text-[#c81727]">mission</span></h2>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#d8d0c7]">
            Connecting the world to Japan&apos;s vibrant tabletop gaming culture. Your gateway to analog gaming in Japan.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-2xl border border-[#a9cfc7] bg-[#edf8f5] p-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2d6b5e]">Our belief</p>
          <p className="mt-2 text-2xl font-black italic text-[#172b30]">&ldquo;Get to know a GAME, and you get to know a COMMUNITY.&rdquo;</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-[240px_1fr]">
          <aside className="self-start rounded-lg border border-[#dfc99f] bg-white p-4 shadow-[0_16px_30px_rgba(91,67,35,0.16)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bc4937]">Navigation flow</p>
            <div className="mt-5 flex min-h-[420px] flex-col items-center text-center text-[9px] font-black uppercase text-[#35200d]">
              <span className="rounded-full border border-[#8fb39d] bg-[#dceee2] px-4 py-2">Board game enthusiast in Japan</span>
              <span className="h-5 w-px bg-[#b9a98d]" />
              <span className="grid h-16 w-16 rotate-45 place-items-center border border-[#d0a66b] bg-[#fff0cc]"><span className="-rotate-45 block w-20 text-[8px] leading-3">What are you looking for?</span></span>
              <span className="h-5 w-px bg-[#b9a98d]" />
              <div className="grid w-full grid-cols-3 gap-1">
                {['Cafe / store', 'Specific game', 'Meet players'].map((item) => <span key={item} className="rounded border border-[#d8c6a7] bg-[#fffaf0] px-1 py-2">{item}</span>)}
              </div>
              <span className="h-5 w-px bg-[#b9a98d]" />
              <span className="grid h-12 w-12 rotate-45 place-items-center border border-[#d0a66b] bg-[#f8dc7e]"><span className="-rotate-45 block text-[8px] leading-3">Ready?</span></span>
              <span className="h-5 w-px bg-[#b9a98d]" />
              <div className="grid w-full grid-cols-2 gap-1">
                {['Search map', 'Browse events', 'Find a table', 'Shop games'].map((item) => <span key={item} className="rounded border border-[#b8ced1] bg-[#e9f5f5] px-1 py-2">{item}</span>)}
              </div>
              <span className="h-5 w-px bg-[#b9a98d]" />
              <span className="rounded border border-[#8fb39d] bg-[#dceee2] px-4 py-2">Welcome to tabletop Japan</span>
            </div>
            <div className="mt-5 h-3 bg-[#1a1a2e]" />
          </aside>

          <div>
            <h3 className="flex items-center gap-2 text-2xl font-black uppercase"><span className="h-px w-7 bg-[#c81727]" /> What is TableTop Games Japan?</h3>
            <p className="mt-4 text-xs font-semibold leading-6 text-[#6d6258]">
              TableTop Games Japan (TTGJ) is a bilingual English and Japanese resource for navigating the rich and often complex world of analog gaming in Japan.
            </p>
            <p className="mt-3 text-xs font-semibold leading-6 text-[#6d6258]">
              Whether you are visiting for a week or living in Japan, TTGJ helps you find welcoming cafes, locate Japanese-made games, connect with communities, and shape your own tabletop adventure.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <article className="rounded-lg border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
                <MapPinned size={20} className="text-[#bc4937]" />
                <h4 className="mt-4 text-base font-black uppercase">380+ venues</h4>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#6d6258]">Track cafes and stores across Japan, from Hokkaido to Okinawa, with practical arrival context and confidence cues.</p>
              </article>
              <article className="rounded-lg border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
                <Database size={20} className="text-[#2d6b5e]" />
                <h4 className="mt-4 text-base font-black uppercase">Game database</h4>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#6d6258]">Explore Japanese-made titles, internationally known games, indie discoveries, creators, and places to find them.</p>
              </article>
            </div>
            <h3 className="mt-7 flex items-center gap-2 text-2xl font-black uppercase"><span className="h-px w-7 bg-[#c81727]" /> Our core values</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {values.map(([title, copy], index) => {
                const Icon = [Globe2, ShieldCheck, Users, Heart][index];
                return (
                  <article key={title} className="rounded-lg border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur-xl">
                    <Icon size={18} className="text-[#bc4937]" />
                    <h4 className="mt-3 text-sm font-black uppercase tracking-wide">{title}</h4>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#6d6258]">{copy}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 overflow-hidden rounded-lg bg-[#1a1a2e] p-5 text-white shadow-xl">
              <div className="flex gap-4">
                <div>
                  <h3 className="text-2xl font-black uppercase">Join the community</h3>
                  <p className="mt-2 max-w-2xl text-xs font-semibold leading-6 text-[#d8d0c7]">Join events, discover new places, or partner with us to help more people enjoy tabletop Japan.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => scrollTo('ttgj-events')} className="rounded bg-[#bd1121] px-3 py-2 text-[10px] font-black text-white">Explore events</button>
                    <button type="button" onClick={() => scrollTo('ttgj-partners')} className="rounded border border-white/35 px-3 py-2 text-[10px] font-black text-white">Partner with TTGJ</button>
                  </div>
                </div>
                <Gamepad2 size={92} className="ml-auto shrink-0 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
