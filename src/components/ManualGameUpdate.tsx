import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import { Check, ImagePlus, Loader2, Search, UploadCloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { buildGameBrief } from '../lib/gameBriefs';
import { publishManualGameUpdate } from '../lib/manualGameUpdates';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';

interface ManualGameUpdateProps {
  games: Game[];
  onUpdated: (game: Game) => void;
}

export function ManualGameUpdate({ games, onUpdated }: ManualGameUpdateProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState('Camel Up');
  const [selectedId, setSelectedId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [requirement, setRequirement] = useState('Add the correct cover image and confirm the card brief reads naturally.');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [draggingImage, setDraggingImage] = useState(false);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games
      .filter((game) => !normalized || game.title.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [games, query]);

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedId) ?? matches[0] ?? null,
    [games, matches, selectedId],
  );

  useEffect(() => {
    if (!selectedId && matches[0]) {
      setSelectedId(matches[0].id);
    }
  }, [matches, selectedId]);

  useEffect(() => {
    if (!selectedGame) return;
    setDescription(selectedGame.description ?? buildGameBrief(selectedGame));
  }, [selectedGame]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const setSelectedImage = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0] ?? null);
  };

  const dropImage = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDraggingImage(false);
    setSelectedImage(Array.from(event.dataTransfer.files).find((file) => file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name)) ?? null);
  };

  const publish = async () => {
    if (!selectedGame) return;
    setPublishing(true);
    setMessage('');
    try {
      const updated = await publishManualGameUpdate(selectedGame, imageFile, description);
      onUpdated(updated);
      setImageFile(null);
      setPreviewUrl(null);
      setMessage(`Saved update for ${updated.title}. Note: ${requirement}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Manual update could not be saved.');
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = isSupabaseConfigured && Boolean(user) && Boolean(selectedGame) && (Boolean(imageFile) || description.trim() !== (selectedGame?.description ?? '')) && !publishing;

  return (
    <section className="reference-panel mx-auto mt-8 max-w-5xl overflow-hidden bg-[#fffdf9]">
      <div className="border-b border-[#efd091] px-7 py-6 md:flex md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Manual Existing-Game Repair</p>
          <h2 className="font-display mt-2 text-3xl tracking-wide text-[#c55c27]">Image + Brief Update Drop</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#70665b]">Use this when a card already exists, but needs a cover image or a clearer one-line brief. Search the title, attach the image, and leave the requirement note for the update.</p>
        </div>
        <span className="mt-5 inline-flex rounded border border-[#e8bd66] bg-[#fff4d9] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#b4611d] md:mt-0">
          Example: Camel Up
        </span>
      </div>

      <div className="grid gap-6 p-7 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#8c765e]">Find Existing Game</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 text-[#d06a2c]" size={16} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(''); }} className="w-full rounded border border-[#e9bd64] bg-white py-3 pl-10 pr-3 text-sm outline-none" placeholder="Search game title..." />
          </div>

          <div className="mt-3 space-y-2">
            {matches.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedId(game.id)}
                className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm ${selectedGame?.id === game.id ? 'border-[#d06a2c] bg-[#fff1df]' : 'border-[#ead4ad] bg-white'}`}
              >
                <span className="font-bold text-[#3f352d]">{game.title}</span>
                <span className="text-[11px] text-[#8b7c6b]">{game.cover_image_url ? 'Has image' : 'Needs image'}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="grid gap-4 md:grid-cols-[160px_1fr]">
            <label
              onDragOver={(event) => { event.preventDefault(); setDraggingImage(true); }}
              onDragLeave={() => setDraggingImage(false)}
              onDrop={dropImage}
              className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center ${draggingImage ? 'border-[#cf612d] bg-[#fff0e1]' : 'border-[#e4bd78] bg-[#fff8ed]'}`}
            >
              {previewUrl || selectedGame?.cover_image_url ? (
                <img src={previewUrl ?? selectedGame?.cover_image_url ?? ''} alt="" className="h-32 w-28 rounded object-cover" />
              ) : (
                <>
                  <UploadCloud className="text-[#d06a2c]" size={30} />
                  <span className="mt-2 text-xs font-bold text-[#6d6256]">Drop or choose image</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} />
            </label>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-[#8c765e]">Update Requirement Note</label>
              <input value={requirement} onChange={(event) => setRequirement(event.target.value)} className="mt-2 w-full rounded border border-[#e9bd64] bg-white p-3 text-sm outline-none" placeholder="Example: Add Camel Up cover and keep brief short." />

              <label className="mt-4 block text-[11px] font-bold uppercase tracking-wide text-[#8c765e]">Card Brief Line</label>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-2 w-full rounded border border-[#e9bd64] bg-white p-3 text-sm leading-6 outline-none" placeholder="Optional replacement summary for the card." />
            </div>
          </div>

          <div className="mt-5 rounded border border-[#efd7ae] bg-white p-4">
            <p className="font-display text-xl tracking-wide text-[#3f352d]">{selectedGame?.title ?? 'Select a game'}</p>
            <p className="mt-2 text-xs leading-5 text-[#71665b]">{description || 'The selected card brief will preview here.'}</p>
          </div>

          <button type="button" disabled={!canPublish} onClick={publish} className="rule-button rule-button-primary mt-5 w-full disabled:cursor-not-allowed disabled:border-[#cfbea3] disabled:bg-[#e7ded0] disabled:text-[#80766a]">
            {publishing ? <Loader2 size={15} className="animate-spin" /> : imageFile ? <ImagePlus size={15} /> : <Check size={15} />}
            Publish Manual Update
          </button>
          <p className="mt-3 text-[11px] leading-5 text-[#766b60]">
            {isSupabaseConfigured && user
              ? 'Manual updates are saved through admin-only database and storage rules.'
              : 'Preview mode: choose the image and write the note now; permanent publishing requires a signed-in approved administrator.'}
          </p>
          {message && <p className="mt-4 rounded border border-[#e7c987] bg-[#fff9ed] p-3 text-sm text-[#665c50]">{message}</p>}
        </div>
      </div>
    </section>
  );
}
