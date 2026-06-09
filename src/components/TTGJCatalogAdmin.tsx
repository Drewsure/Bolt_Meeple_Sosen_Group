import { Database, LogIn, Plus, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  deleteTTGJCatalogEntry,
  getManagedTTGJCatalog,
  saveTTGJCatalogEntry,
  seedFallbackTTGJCatalog,
  ttgjCatalogKindLabels,
  ttgjCatalogKinds,
} from '../lib/ttgjCatalog';
import type { TTGJCatalogEntry, TTGJCatalogKind, TTGJCatalogStatus } from '../lib/ttgjCatalog';

const blankEntry = (kind: TTGJCatalogKind): Partial<TTGJCatalogEntry> & Pick<TTGJCatalogEntry, 'kind' | 'title'> => ({
  kind,
  title: '',
  meta: '',
  description: '',
  tags: [],
  action: 'Explore',
  status: 'draft',
  featured: false,
  sortOrder: 100,
});

export function TTGJCatalogAdmin() {
  const { user, signIn, signOut } = useAuth();
  const [entries, setEntries] = useState<TTGJCatalogEntry[]>([]);
  const [kind, setKind] = useState<TTGJCatalogKind>('event');
  const [editing, setEditing] = useState(blankEntry('event'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const role = user?.app_metadata?.role;
  const canEdit = role === 'admin' || role === 'catalog_editor';
  const visibleEntries = useMemo(() => entries.filter((entry) => entry.kind === kind), [entries, kind]);

  const refresh = useCallback(async () => {
    if (!canEdit) return;
    setBusy(true);
    try {
      setEntries(await getManagedTTGJCatalog());
      setMessage('Catalog refreshed from Supabase.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }, [canEdit]);

  useEffect(() => {
    if (canEdit) void refresh();
  }, [canEdit, refresh]);

  const startNew = (nextKind = kind) => {
    setKind(nextKind);
    setEditing(blankEntry(nextKind));
  };

  const save = async () => {
    if (!editing.title.trim()) {
      setMessage('Add a title before saving.');
      return;
    }
    setBusy(true);
    try {
      await saveTTGJCatalogEntry(editing);
      setMessage(`Saved "${editing.title}".`);
      startNew(editing.kind);
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!editing.id || editing.id.startsWith('local-')) return;
    if (!window.confirm(`Delete "${editing.title}" from the TTGJ catalog?`)) return;
    setBusy(true);
    try {
      await deleteTTGJCatalogEntry(editing.id);
      setMessage(`Deleted "${editing.title}".`);
      startNew(editing.kind);
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
      setBusy(false);
    }
  };

  const seed = async () => {
    if (!window.confirm('Seed or refresh the Supabase catalog from the approved local launch set?')) return;
    setBusy(true);
    try {
      const seeded = await seedFallbackTTGJCatalog();
      setMessage(`Seeded ${seeded.length} launch records into Supabase.`);
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-5 py-12 text-[#241d18]">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#e1c995] bg-white p-8 shadow-sm">
          <Database className="text-[#bc4937]" />
          <h1 className="mt-4 text-3xl font-black">TTGJ content desk</h1>
          <p className="mt-3 text-sm leading-7 text-[#6d6258]">The management screen is ready. Add the Supabase environment values and run the TTGJ catalog migration before permanent editing is enabled.</p>
          <a href="#ttgj" className="mt-6 inline-flex rounded bg-[#a60000] px-4 py-3 text-xs font-black text-white">Return to TTGJ</a>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-5 py-12 text-[#241d18]">
        <form className="mx-auto max-w-md rounded-lg border border-[#e1c995] bg-white p-8 shadow-sm" onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          const result = await signIn(email, password);
          setMessage(result.error?.message ?? 'Signed in.');
          setBusy(false);
        }}>
          <LogIn className="text-[#bc4937]" />
          <h1 className="mt-4 text-3xl font-black">TTGJ content desk</h1>
          <p className="mt-2 text-sm text-[#6d6258]">Sign in with an approved editor account.</p>
          <input className="mt-6 w-full rounded border border-[#dfcfb4] p-3 text-sm" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input className="mt-3 w-full rounded border border-[#dfcfb4] p-3 text-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
          <button disabled={busy} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-[#a60000] px-4 py-3 text-xs font-black text-white disabled:opacity-50"><LogIn size={15} /> Sign in</button>
          {message && <p className="mt-4 text-xs font-bold text-[#8a5b29]">{message}</p>}
        </form>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-5 py-12 text-[#241d18]">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#e1c995] bg-white p-8 shadow-sm">
          <ShieldCheck className="text-[#bc4937]" />
          <h1 className="mt-4 text-3xl font-black">Editor approval required</h1>
          <p className="mt-3 text-sm leading-7 text-[#6d6258]">This account is signed in, but it does not have the trusted admin or catalog editor role required to manage public TTGJ content.</p>
          <button type="button" onClick={() => void signOut()} className="mt-6 rounded border border-[#d3ba88] px-4 py-3 text-xs font-black">Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-5 py-8 text-[#241d18]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-[#ddc89f] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bc4937]">Owner and admin tools</p>
            <h1 className="mt-2 text-4xl font-black">TTGJ content desk</h1>
            <p className="mt-2 text-sm font-semibold text-[#756454]">Manage the directory content without touching the public layout.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void seed()} disabled={busy} className="inline-flex items-center gap-2 rounded border border-[#d2b77d] bg-white px-4 py-3 text-xs font-black"><Database size={15} /> Seed launch set</button>
            <button type="button" onClick={() => void refresh()} disabled={busy} className="inline-flex items-center gap-2 rounded border border-[#d2b77d] bg-white px-4 py-3 text-xs font-black"><RefreshCw size={15} /> Refresh</button>
            <a href="#ttgj" className="rounded bg-[#a60000] px-4 py-3 text-xs font-black text-white">View TTGJ</a>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {ttgjCatalogKinds.map((item) => (
            <button key={item} type="button" onClick={() => startNew(item)} className={`shrink-0 rounded border px-3 py-2 text-xs font-black ${kind === item ? 'border-[#bc4937] bg-[#bc4937] text-white' : 'border-[#dcc9a5] bg-white'}`}>
              {ttgjCatalogKindLabels[item]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="rounded-lg border border-[#ddc89f] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-black">{ttgjCatalogKindLabels[kind]} records</h2>
              <button type="button" onClick={() => startNew()} className="inline-flex items-center gap-1 text-xs font-black text-[#a60000]"><Plus size={14} /> New</button>
            </div>
            <div className="mt-4 grid max-h-[680px] gap-2 overflow-y-auto">
              {visibleEntries.map((entry) => (
                <button type="button" key={entry.id} onClick={() => setEditing(entry)} className="rounded border border-[#eee2cc] px-3 py-3 text-left hover:border-[#bc4937]">
                  <strong className="block text-sm">{entry.title}</strong>
                  <span className="mt-1 block text-[10px] font-black uppercase text-[#9a7b58]">{entry.status} {entry.featured ? '| Featured' : ''}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#ddc89f] bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bc4937]">{editing.id ? 'Edit record' : 'New record'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} placeholder="Title" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" value={editing.meta ?? ''} onChange={(event) => setEditing({ ...editing, meta: event.target.value })} placeholder="Short metadata line" />
              <textarea className="min-h-28 rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" value={editing.description ?? ''} onChange={(event) => setEditing({ ...editing, description: event.target.value })} placeholder="Description" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm sm:col-span-2" value={(editing.tags ?? []).join(', ')} onChange={(event) => setEditing({ ...editing, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} placeholder="Tags separated by commas" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm" value={editing.location ?? ''} onChange={(event) => setEditing({ ...editing, location: event.target.value })} placeholder="Location" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm" value={editing.eventType ?? ''} onChange={(event) => setEditing({ ...editing, eventType: event.target.value })} placeholder="Event type" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm" value={editing.startsAt ?? ''} onChange={(event) => setEditing({ ...editing, startsAt: event.target.value })} placeholder="Start date ISO format" />
              <input className="rounded border border-[#dfcfb4] p-3 text-sm" value={editing.websiteUrl ?? ''} onChange={(event) => setEditing({ ...editing, websiteUrl: event.target.value })} placeholder="Website URL" />
              <select className="rounded border border-[#dfcfb4] p-3 text-sm" value={editing.status ?? 'draft'} onChange={(event) => setEditing({ ...editing, status: event.target.value as TTGJCatalogStatus })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <label className="flex items-center gap-2 rounded border border-[#dfcfb4] p-3 text-sm font-bold">
                <input type="checkbox" checked={editing.featured ?? false} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} />
                Featured
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => void save()} disabled={busy} className="inline-flex items-center gap-2 rounded bg-[#a60000] px-4 py-3 text-xs font-black text-white disabled:opacity-50"><Save size={15} /> Save record</button>
              {editing.id && !editing.id.startsWith('local-') && <button type="button" onClick={() => void remove()} disabled={busy} className="inline-flex items-center gap-2 rounded border border-[#d7b6aa] px-4 py-3 text-xs font-black text-[#a60000]"><Trash2 size={15} /> Delete</button>}
            </div>
            {message && <p className="mt-4 text-xs font-bold text-[#8a5b29]">{message}</p>}
          </section>
        </div>
      </div>
    </main>
  );
}
