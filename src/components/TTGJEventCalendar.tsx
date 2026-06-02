import { ArrowUpRight, CalendarDays, Clock3, Download, MapPin, Star, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { TTGJCatalogEntry } from '../lib/ttgjCatalog';

function eventType(event: TTGJCatalogEntry) {
  return event.eventType || event.tags[0] || 'Special';
}

function dateLabel(event: TTGJCatalogEntry) {
  if (!event.startsAt) return event.meta;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(event.startsAt));
}

export function TTGJEventCalendar({ events }: { events: TTGJCatalogEntry[] }) {
  const [filter, setFilter] = useState('All events');
  const [listLimit, setListLimit] = useState(4);
  const [selectedEvent, setSelectedEvent] = useState<TTGJCatalogEntry | null>(null);
  const filters = ['All events', 'Tournament', 'Meetup', 'Convention', 'Special'];
  const filteredEvents = useMemo(
    () => filter === 'All events' ? events : events.filter((event) => eventType(event).toLowerCase() === filter.toLowerCase()),
    [events, filter],
  );
  const featuredEvent = events.find((event) => event.featured) ?? events[0];
  const activeDays = new Set(events.flatMap((event) => {
    if (!event.startsAt) return [];
    const date = new Date(event.startsAt);
    return date.getMonth() === 5 && date.getFullYear() === 2026 ? [date.getDate()] : [];
  }));
  const addToCalendar = (event: TTGJCatalogEntry) => {
    const start = event.startsAt ? new Date(event.startsAt) : new Date();
    const end = event.endsAt ? new Date(event.endsAt) : new Date(start.getTime() + 60 * 60 * 1000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const body = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TableTop Games Japan//Events//EN',
      'BEGIN:VEVENT',
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location ?? ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.slug || 'ttgj-event'}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="ttgj-events" className="border-y border-[#e8d8b9] bg-[#fbf8f1]">
      <div className="bg-[#1a1a2e] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e8bf68]">Events and community</p>
          <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            Gaming events <span className="block text-[#d42519]">across Japan</span>
          </h2>
          <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-[#d8d0c7]">
            Stay updated with conventions, local flea markets, tournaments, and community meetups in the Japanese tabletop scene.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        {featuredEvent && (
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-[#514338]"><span className="h-px w-7 bg-[#c81727]" /> Featured event</p>
            <article className="mt-4 overflow-hidden rounded-lg border border-[#ead3a2] bg-white shadow-[0_16px_34px_rgba(73,52,22,0.16)] md:grid md:grid-cols-[1fr_1fr]">
              <div className="relative min-h-60 overflow-hidden bg-[#eee1c7]">
                <img src="/images/ttgj-game-market.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-[#c81727] px-3 py-1 text-[10px] font-black uppercase text-white shadow-sm">
                  Upcoming · {dateLabel(featuredEvent)}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#c81727]"><Star size={12} /> {eventType(featuredEvent)}</p>
                <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717]">{featuredEvent.title}</h3>
                <div className="mt-4 grid gap-2 text-xs font-bold text-[#a46b17]">
                  <span className="flex items-center gap-2"><CalendarDays size={13} /> {dateLabel(featuredEvent)}</span>
                  {featuredEvent.location && <span className="flex items-center gap-2"><MapPin size={13} /> {featuredEvent.location}</span>}
                </div>
                <p className="mt-5 text-sm font-semibold leading-6 text-[#7b6b5b]">{featuredEvent.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedEvent(featuredEvent)} className="inline-flex items-center gap-1.5 rounded bg-[#c81727] px-4 py-3 text-xs font-black text-white">Event details <ArrowUpRight size={13} /></button>
                  <button type="button" onClick={() => addToCalendar(featuredEvent)} className="inline-flex items-center gap-1.5 rounded bg-[#1a1a2e] px-4 py-3 text-xs font-black text-white"><Download size={13} /> Add to calendar</button>
                </div>
              </div>
            </article>
          </div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-[220px_1fr]">
          <aside className="self-start rounded-lg border border-[#ead3a2] bg-[#fffdf7] p-4 shadow-sm">
            <div className="flex items-center justify-between text-[#5f4a36]">
              <strong className="text-sm">June 2026</strong>
              <CalendarDays size={15} className="text-[#ad8542]" />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[#9c8a78]">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
              <span />
              {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                <span key={day} className={`grid h-6 place-items-center rounded ${activeDays.has(day) ? 'bg-[#f5d685] font-black text-[#6d4c13]' : ''}`}>{day}</span>
              ))}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => { setFilter(item); setListLimit(4); }}
                  className={`rounded border px-3 py-2 text-[10px] font-black uppercase transition ${filter === item ? 'border-[#d8a342] bg-[#e8bd58] text-[#5d410f]' : 'border-[#e5d3b2] bg-[#fffdf7] text-[#8d755b] hover:border-[#d8a342]'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {filteredEvents.slice(0, listLimit).map((event) => (
                <article key={event.id} className="rounded-lg border border-[#ead3a2] bg-[#fffdf7] p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#b17b24]">{eventType(event)}</p>
                      <h3 className="mt-1 text-sm font-black text-[#3f332b]">{event.title}</h3>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#86715d]">{event.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-bold text-[#ad8542]">
                        {event.location && <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>}
                        <span className="flex items-center gap-1"><CalendarDays size={11} /> {dateLabel(event)}</span>
                        {event.startsAt && <span className="flex items-center gap-1"><Clock3 size={11} /> {new Date(event.startsAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedEvent(event)} className="shrink-0 text-[10px] font-black text-[#a46b17]">{event.action}</button>
                  </div>
                </article>
              ))}
            </div>
            {listLimit < filteredEvents.length && (
              <button
                type="button"
                onClick={() => setListLimit((current) => Math.min(current + 4, filteredEvents.length))}
                className="mt-4 rounded bg-[#bd1121] px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-[#9e0d1a]"
              >
                Show more events
              </button>
            )}
          </div>
        </div>
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#171717]/65 px-4 py-8" role="dialog" aria-modal="true" aria-label={`${selectedEvent.title} details`}>
          <article className="max-h-full w-full max-w-xl overflow-y-auto rounded-xl border border-[#ead3a2] bg-[#fffdf7] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#c81727]">{eventType(selectedEvent)}</p>
                <h3 className="mt-2 text-2xl font-black text-[#171717]">{selectedEvent.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedEvent(null)} aria-label="Close event details" className="rounded border border-[#ead3a2] p-2 text-[#6d6258]"><X size={16} /></button>
            </div>
            <p className="mt-5 text-sm font-semibold leading-6 text-[#7b6b5b]">{selectedEvent.description}</p>
            <div className="mt-5 grid gap-2 rounded-lg bg-[#fff7e7] p-4 text-xs font-bold text-[#8a6529]">
              <span className="flex items-center gap-2"><CalendarDays size={14} /> {dateLabel(selectedEvent)}</span>
              {selectedEvent.location && <span className="flex items-center gap-2"><MapPin size={14} /> {selectedEvent.location}</span>}
              {selectedEvent.startsAt && <span className="flex items-center gap-2"><Clock3 size={14} /> {new Date(selectedEvent.startsAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => addToCalendar(selectedEvent)} className="inline-flex items-center gap-1.5 rounded bg-[#1a1a2e] px-4 py-3 text-xs font-black text-white"><Download size={13} /> Add to calendar</button>
              {selectedEvent.websiteUrl && <a href={selectedEvent.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded bg-[#c81727] px-4 py-3 text-xs font-black text-white">Official website <ArrowUpRight size={13} /></a>}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
