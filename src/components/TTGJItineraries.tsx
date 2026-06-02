import { ArrowRight, CheckCircle2, Mail, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const experiences = [
  ['Casual & Social', 'Relaxed cafes and party games'],
  ['Competitive / Heavy', 'Strategy-focused venues'],
  ['Historical / Cultural', 'Traditional games like Hanafuda and Go'],
  ['Shopping Focused', 'Rare finds and indie shops'],
  ['Family Friendly', 'All ages welcome'],
  ['Indie Discovery', 'Creators and small-publisher games'],
  ['Rural Hidden Cafes', 'Off-the-beaten-path countryside finds'],
  ['Mystery Game Support', 'Translator-assisted mystery sessions'],
] as const;

export function TTGJItineraries() {
  const [selected, setSelected] = useState('Casual & Social');
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <section id="ttgj-itineraries" className="border-y border-[#e0d2ba] bg-[#f8f5ef]">
      <button type="button" onClick={() => setIsOpen(true)} className="group block w-full bg-[#1a1a2e] px-5 py-14 text-center text-white transition hover:bg-[#24243b]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8a96e]">Exploratory travel planning</p>
        <h2 className="mt-3 text-4xl font-black uppercase md:text-6xl">Custom Itineraries</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#d8d0c7]">
          Tell us your preferences as we shape self-guided journeys through Japan&apos;s analog gaming landscape.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded bg-[#a60000] px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-sm transition group-hover:bg-[#c81727]">
          Plan your itinerary <ArrowRight size={15} />
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="ttgj-itinerary-dialog-title" className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#d7c7ab] bg-[#f8f5ef] p-5 shadow-2xl md:p-8">
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close itinerary questionnaire" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-[#6d6258] shadow-sm transition hover:text-[#a60000]">
              <X size={18} />
            </button>
            {submitted ? (
              <div className="rounded-2xl border border-[#d7c7ab] bg-white p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto text-[#237243]" size={40} />
                <h3 id="ttgj-itinerary-dialog-title" className="mt-4 text-2xl font-black">Feedback received</h3>
                <p className="mt-3 text-sm font-semibold text-[#6d6258]">Thank you. Your answers help shape future self-guided itinerary features.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded bg-[#a60000] px-4 py-3 text-xs font-black text-white">Submit another response</button>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
                <h3 id="ttgj-itinerary-dialog-title" className="pr-12 text-2xl font-black uppercase text-[#171717]">Custom itinerary questionnaire</h3>
            <div className="mt-5 rounded-xl border-l-4 border-[#bc4937] bg-[#fff1eb] p-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase text-[#a60000]"><Zap size={16} /> Important notice</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#684f35]">
                This questionnaire is for exploratory research purposes only. TableTop Games Japan does not currently offer guided tours. Your feedback helps shape future services.
              </p>
            </div>

            <div className="mt-7">
              <p className="text-xs font-black uppercase tracking-wide text-[#8a7560]">1. What board gaming experience are you searching for?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {experiences.map(([title, copy]) => (
                  <button type="button" key={title} onClick={() => setSelected(title)} className={`rounded-xl border p-3 text-left transition ${selected === title ? 'border-[#bc4937] bg-[#fff1eb]' : 'border-[#eadfcd] bg-white hover:border-[#d7b67c]'}`}>
                    <strong className="block text-sm">{title}</strong>
                    <span className="mt-1 block text-xs font-semibold text-[#8a7560]">{copy}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-black uppercase tracking-wide text-[#8a7560]">2. Group size<select className="mt-2 w-full rounded-xl border border-[#eadfcd] bg-white p-3 text-sm normal-case text-[#35200d]"><option>Solo traveler</option><option>Duo</option><option>Small group</option><option>Large group</option></select></label>
              <label className="text-xs font-black uppercase tracking-wide text-[#8a7560]">3. Duration<select className="mt-2 w-full rounded-xl border border-[#eadfcd] bg-white p-3 text-sm normal-case text-[#35200d]"><option>1-3 days</option><option>4-7 days</option><option>1-2 weeks</option></select></label>
              <label className="text-xs font-black uppercase tracking-wide text-[#8a7560]">4. Starting point<input required className="mt-2 w-full rounded-xl border border-[#eadfcd] bg-white p-3 text-sm normal-case text-[#35200d]" placeholder="Tokyo, Osaka, or another city" /></label>
              <label className="text-xs font-black uppercase tracking-wide text-[#8a7560]">5. Budget range<input className="mt-2 w-full rounded-xl border border-[#eadfcd] bg-white p-3 text-sm normal-case text-[#35200d]" placeholder="Optional" /></label>
            </div>
            <label className="mt-5 block text-xs font-black uppercase tracking-wide text-[#8a7560]">6. Tell us about your ideal trip<textarea required className="mt-2 min-h-24 w-full rounded-xl border border-[#eadfcd] bg-white p-3 text-sm normal-case text-[#35200d]" placeholder="Hidden cafes, indie shopping, regional events..." /></label>
            <label className="mt-5 block text-xs font-black uppercase tracking-wide text-[#8a7560]">7. Contact email<div className="relative mt-2"><Mail className="absolute left-3 top-3.5 text-[#8a7560]" size={16} /><input required type="email" className="w-full rounded-xl border border-[#eadfcd] bg-white p-3 pl-10 text-sm normal-case text-[#35200d]" placeholder="your@email.com" /></div></label>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#a60000] px-5 py-4 text-xs font-black uppercase tracking-wide text-white">Submit feedback <ArrowRight size={15} /></button>
          </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
