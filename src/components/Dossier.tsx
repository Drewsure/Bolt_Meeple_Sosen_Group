import { Award, Compass, Lightbulb, Users } from 'lucide-react';

const doctrine = [
  { icon: Lightbulb, title: 'Philosophy', color: 'text-[#eb8e1d] border-[#efc779]', body: 'English is not a subject to memorize. It is a strategic weapon to deploy in real-world negotiations, international business, and intellectual combat.' },
  { icon: Compass, title: 'Vision', color: 'text-[#3989ec] border-[#b4d5fe]', body: 'Create an elite Guild where executives, retirees, and strategists gather to master language through competitive strategy.' },
  { icon: Users, title: 'Method', color: 'text-[#24ac68] border-[#9fe1bb]', body: 'The “Sosen” approach: strategic creation through board gaming. Language, strategy, and cognition converge.' },
];

export function Dossier() {
  return (
    <main className="page-shell">
      <div className="tactical-banner h-32" />
      <div className="mx-auto max-w-3xl px-5 pb-16">
        <header className="-mt-10 text-center">
          <h1 className="compact-title">The Dossier</h1>
          <p className="mt-3 text-xs uppercase tracking-wide text-[#655b51]">Founder of the Meeple Sosen Group</p>
        </header>
        <section className="reference-panel mt-10 p-7">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea8a16] font-display text-2xl text-white">DS</span>
            <div><h2 className="font-display text-2xl">Drew Smith</h2><span className="rounded bg-[#fff0bc] px-2 py-1 text-[9px] font-bold text-[#bd6c17]">L1 FOUNDER STANDARD</span></div>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#61574d]">Drew Smith is the architect of a revolutionary approach to language mastery, one that rejects the “thin soup” methodology of traditional English education and channels the strategic depth of elite board gaming into linguistic precision.</p>
        </section>
        <div className="mt-6 space-y-5">
          {doctrine.map(({ icon: Icon, title, body, color }) => (
            <section key={title}>
              <h2 className={`mb-2 flex items-center gap-2 font-display text-xl ${color.split(' ')[0]}`}><Icon size={18} />{title}</h2>
              <p className={`rounded-lg border bg-white/70 p-5 text-xs leading-6 text-[#61574d] ${color.split(' ')[1]}`}>{body}</p>
            </section>
          ))}
        </div>
        <h2 className="mt-8 text-center font-display text-2xl text-[#b65923]">The L1 Founder Standard</h2>
        <p className="mt-3 text-center text-xs text-[#665d53]">“L1” represents the highest level of linguistic and strategic integration. It is a commitment to:</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {['Authentic Mastery', 'Cognitive Precision', 'Competitive Excellence', 'Elite Community'].map((title, index) => (
            <article key={title} className={`rounded border p-4 text-xs ${['border-[#efc779]', 'border-[#aed1ff]', 'border-[#dfc3fd]', 'border-[#a6e4c1]'][index]}`}>
              <strong className="block font-display text-base">{title}</strong>
              Our methods transform practice into confident table communication.
            </article>
          ))}
        </div>
        <blockquote className="mt-6 rounded-lg border border-[#f1bd57] bg-[#fff4d6] p-6 text-sm italic leading-7 text-[#554a42]">
          “This is not education. This is transformation. You will not just speak English better. You will think strategically, negotiate with precision, and command respect in any international room.”
          <footer className="mt-3 text-xs font-bold text-[#bf5c23]">— Drew Smith, Founder</footer>
        </blockquote>
        <p className="mt-7 text-center font-display text-lg text-[#c86122]"><Award className="mr-2 inline" size={17} /> Author your victory. Join the Guild.</p>
      </div>
    </main>
  );
}
