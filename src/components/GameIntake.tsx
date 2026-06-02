import { AlertTriangle, Check, Database, FileSpreadsheet, Images, Loader2, ShieldCheck, UploadCloud } from 'lucide-react';
import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { prepareGameIntake, publishGameIntake, type GameIntakeDraft } from '../lib/gameIntake';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';

interface GameIntakeProps {
  games: Game[];
  onPublished: (created: Game[]) => void;
}

export function GameIntake({ games, onPublished }: GameIntakeProps) {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [drafts, setDrafts] = useState<GameIntakeDraft[]>([]);
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);

  const ready = useMemo(() => drafts.filter((draft) => !draft.duplicate), [drafts]);
  const duplicates = drafts.length - ready.length;

  useEffect(() => () => {
    drafts.forEach((draft) => {
      if (draft.coverPreviewUrl) URL.revokeObjectURL(draft.coverPreviewUrl);
    });
  }, [drafts]);

  const acceptFiles = async (files: File[]) => {
    setMessage('');
    try {
      const prepared = await prepareGameIntake(files, games);
      setDrafts(prepared);
      setMessage(`${prepared.length} submitted game${prepared.length === 1 ? '' : 's'} reviewed and placed in intake order.`);
    } catch (error) {
      setDrafts([]);
      setMessage(error instanceof Error ? error.message : 'Unable to read the submitted files.');
    }
  };

  const receiveDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void acceptFiles(Array.from(event.dataTransfer.files));
  };

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    void acceptFiles(Array.from(event.target.files ?? []));
  };

  const publish = async () => {
    setPublishing(true);
    setMessage('');
    try {
      const created = await publishGameIntake(drafts);
      onPublished(created);
      setDrafts([]);
      setMessage(`${created.length} new game${created.length === 1 ? '' : 's'} added to the live database in catalogue order.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The intake could not be published.');
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = isSupabaseConfigured && Boolean(user) && ready.length > 0 && !publishing;

  return (
    <section className="reference-panel mx-auto mt-8 max-w-5xl overflow-hidden bg-[#fffdf9]">
      <div className="border-b border-[#efd091] px-7 py-6 md:flex md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin Intake Workflow</p>
          <h2 className="font-display mt-2 text-3xl tracking-wide text-[#c55c27]">New Game Submission Bay</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#70665b]">Drop a game CSV with optional cover images. The system reads fields, pairs artwork, checks the existing catalogue, and prepares clean records for approved publishing.</p>
        </div>
        <span className="mt-5 inline-flex rounded border border-[#e8bd66] bg-[#fff4d9] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#b4611d] md:mt-0">
          Protected Admin Area
        </span>
      </div>

      <div className="grid gap-6 p-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <label
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={receiveDrop}
            className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 text-center transition-colors ${dragging ? 'border-[#cf612d] bg-[#fff0e1]' : 'border-[#e5be78] bg-[#fffaf1]'}`}
          >
            <UploadCloud size={36} className="text-[#d06a2c]" />
            <strong className="font-display mt-4 text-2xl tracking-wide text-[#433a32]">Drop New Games Here</strong>
            <span className="mt-2 text-sm text-[#756a5d]">CSV export + JPG, PNG, or WEBP covers</span>
            <span className="rule-button rule-button-primary mt-5 px-6 py-3">Choose Submission Files</span>
            <input type="file" className="hidden" multiple accept=".csv,image/png,image/jpeg,image/webp" onChange={selectFiles} />
          </label>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <article className="rounded border border-[#f0cf91] bg-white px-2 py-4">
              <strong className="font-display text-3xl text-[#d36a2b]">{drafts.length}</strong>
              <p className="text-[10px] uppercase tracking-wide text-[#746b60]">Submitted</p>
            </article>
            <article className="rounded border border-[#bfe6cb] bg-white px-2 py-4">
              <strong className="font-display text-3xl text-[#20a65d]">{ready.length}</strong>
              <p className="text-[10px] uppercase tracking-wide text-[#746b60]">Ready</p>
            </article>
            <article className="rounded border border-[#f4d1bb] bg-white px-2 py-4">
              <strong className="font-display text-3xl text-[#d36a2b]">{duplicates}</strong>
              <p className="text-[10px] uppercase tracking-wide text-[#746b60]">Duplicates</p>
            </article>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl tracking-wide text-[#453b33]">Integrated Processing Order</h3>
          <div className="mt-4 space-y-3 text-sm text-[#665d52]">
            <p className="flex gap-3 rounded border border-[#efdbc0] bg-white p-3"><FileSpreadsheet size={18} className="shrink-0 text-[#d36a2b]" /> 1. Read game details from the submitted CSV.</p>
            <p className="flex gap-3 rounded border border-[#efdbc0] bg-white p-3"><Images size={18} className="shrink-0 text-[#d36a2b]" /> 2. Match cover files using BGG ID or title.</p>
            <p className="flex gap-3 rounded border border-[#efdbc0] bg-white p-3"><ShieldCheck size={18} className="shrink-0 text-[#20a65d]" /> 3. Reject existing titles and IDs before publishing.</p>
            <p className="flex gap-3 rounded border border-[#efdbc0] bg-white p-3"><Database size={18} className="shrink-0 text-[#d36a2b]" /> 4. Store approved covers and add records to Supabase.</p>
          </div>

          <button type="button" disabled={!canPublish} onClick={publish} className="rule-button rule-button-primary mt-5 w-full disabled:cursor-not-allowed disabled:border-[#cfbea3] disabled:bg-[#e7ded0] disabled:text-[#80766a]">
            {publishing ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Publish Ready Games
          </button>
          <p className="mt-3 text-[11px] leading-5 text-[#766b60]">
            {isSupabaseConfigured && user
              ? 'Publishing is sent through secure database rules that permit only approved admin accounts.'
              : 'Preview is ready. Permanent publishing requires Supabase configuration and a signed-in approved administrator.'}
          </p>
        </div>
      </div>

      {message && <p className="mx-7 mb-5 rounded border border-[#e7c987] bg-[#fff9ed] p-4 text-sm text-[#665c50]">{message}</p>}

      {drafts.length > 0 && (
        <div className="border-t border-[#efd091] px-7 py-6">
          <h3 className="font-display text-xl tracking-wide">Submission Review Queue</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {drafts.map((draft) => (
              <article key={draft.key} className="flex gap-3 rounded border border-[#efd7ae] bg-white p-3">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded bg-[#fff1d6]">
                  {draft.coverPreviewUrl ? <img src={draft.coverPreviewUrl} alt="" className="h-full w-full object-cover" /> : <Images className="m-auto mt-5 text-[#d8b786]" size={20} />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#3c342d]">{draft.title}</p>
                  <p className="mt-1 text-[11px] text-[#766b60]">{draft.bggId ? `BGG #${draft.bggId}` : 'No BGG ID'} / {draft.record.item_type}</p>
                  <p className={`mt-2 flex items-start gap-1 text-[11px] ${draft.duplicate ? 'text-[#c45624]' : 'text-[#24894e]'}`}>
                    {draft.duplicate ? <AlertTriangle size={12} className="mt-0.5 shrink-0" /> : <Check size={12} className="mt-0.5 shrink-0" />}
                    {draft.duplicate ? 'Duplicate - will not publish' : draft.warnings[0] ?? 'Ready to publish'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
