import { BookMarked, Compass, Stamp } from 'lucide-react';

export function Dossier() {
  return (
    <main className="page-shell">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="paper-panel p-7">
          <p className="eyebrow">Dossier / Founder</p>
          <div className="mt-9 flex h-32 w-32 items-center justify-center border border-[#cf612d] bg-[#f6ede0] font-display text-6xl text-[#cf612d]">DS</div>
          <h1 className="font-display mt-8 text-5xl tracking-wider">Drew Smith</h1>
          <p className="eyebrow mt-2">L1 Founder Standard</p>
          <div className="mt-10 border-t border-[#eadfce] pt-6 text-sm leading-7 text-[#665d52]">
            Architect of a table-first approach to confident English: decisions before drills, community before classrooms.
          </div>
        </aside>
        <section>
          <p className="eyebrow">Operating Doctrine</p>
          <h2 className="display-title mt-4 text-7xl sm:text-8xl">Words With Stakes</h2>
          <p className="font-editorial mt-6 max-w-2xl text-xl leading-relaxed text-[#544c42]">
            Meeple Sosen is built for players who want English to feel useful immediately:
            the language of offers, objections, plans, probability and gracious victory.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Compass, title: 'Mission', body: 'Turn tabletop play into practical communication practice.' },
              { icon: BookMarked, title: 'Method', body: 'Structured briefings, guided play and reflective debriefs.' },
              { icon: Stamp, title: 'Standard', body: 'A generous, curious guild culture that values clarity.' },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="paper-panel p-6">
                <Icon className="mb-7 text-[#cf612d]" size={24} />
                <h3 className="font-display text-3xl tracking-wider text-[#cf612d]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#665d52]">{body}</p>
              </article>
            ))}
          </div>
          <blockquote className="mt-8 border-l-2 border-[#cf612d] bg-[#f5ecdf] p-7 font-editorial text-xl leading-8 text-[#4c453c]">
            “Language becomes memorable when a choice at the table truly matters.”
          </blockquote>
        </section>
      </div>
    </main>
  );
}
