import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import { Check, ImagePlus, Loader2, Search, Trash2, UploadCloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { buildGameBrief } from '../lib/gameBriefs';
import { deleteManualGame, publishManualGameUpdate } from '../lib/manualGameUpdates';
import { clearPreviewGameUpdate, getPreviewGameUpdate, savePreviewGameUpdate, subscribeToPreviewGameUpdates } from '../lib/previewGameUpdates';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Game } from '../types/database';

interface ManualGameUpdateProps {
  games: Game[];
  onUpdated: (game: Game) => void;
  onDeleted: (game: Game) => void;
  focusTitle?: string;
  onFocusHandled?: () => void;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected image for preview staging.'));
    reader.readAsDataURL(file);
  });
}

export function ManualGameUpdate({ games, onUpdated, onDeleted, focusTitle, onFocusHandled }: ManualGameUpdateProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState('Camel Up');
  const [selectedId, setSelectedId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [requirement, setRequirement] = useState('Add the correct cover image and confirm the card brief reads naturally.');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draggingImage, setDraggingImage] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

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
  const stagedPreview = useMemo(
    () => selectedGame ? getPreviewGameUpdate(selectedGame.id) : null,
    // Preview updates arrive through a small external store, so the version is the refresh signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedGame, previewVersion],
  );

  useEffect(() => subscribeToPreviewGameUpdates(() => setPreviewVersion((current) => current + 1)), []);

  useEffect(() => {
    if (!focusTitle) return;
    setQuery(focusTitle);
    setSelectedId('');
    setMessage(`Ready to repair ${focusTitle}.`);
    onFocusHandled?.();
  }, [focusTitle, onFocusHandled]);

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
      if (!isSupabaseConfigured || !user) {
        const stagedImageUrl = imageFile ? await fileToDataUrl(imageFile) : selectedGame.cover_image_url;
        const updated = {
          ...selectedGame,
          cover_image_url: stagedImageUrl,
          description: description.trim() || selectedGame.description,
        };
        savePreviewGameUpdate({
          id: selectedGame.id,
          cover_image_url: updated.cover_image_url,
          description: updated.description,
          requirement: requirement.trim(),
        });
        onUpdated(updated);
        setMessage(`Preview staged for ${updated.title}. Note: ${requirement}`);
        return;
      }

      const updated = await publishManualGameUpdate(selectedGame, imageFile, description, requirement);
      onUpdated(updated);
      setImageFile(null);
      setPreviewUrl(null);
      setMessage(`Permanent update saved for ${updated.title}. Requirement note recorded: ${requirement}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Manual update could not be saved.');
    } finally {
      setPublishing(false);
    }
  };

  const clearLocalPreview = () => {
    if (!selectedGame) return;
    clearPreviewGameUpdate(selectedGame.id);
    setImageFile(null);
    setPreviewUrl(null);
    setMessage(`Local preview cleared for ${selectedGame.title}. The card is back to the saved catalogue version.`);
  };

  const deleteGame = async () => {
    if (!selectedGame) return;
    const mode = isSupabaseConfigured && user ? 'permanently delete' : 'hide from this local preview';
    const confirmed = window.confirm(`Are you sure you want to ${mode} "${selectedGame.title}"?`);
    if (!confirmed) return;

    setDeleting(true);
    setMessage('');
    try {
      if (!isSupabaseConfigured || !user) {
        savePreviewGameUpdate({
          id: selectedGame.id,
          deleted: true,
          requirement: requirement.trim() || `Delete requested for ${selectedGame.title}.`,
        });
        onDeleted(selectedGame);
        setSelectedId('');
        setMessage(`${selectedGame.title} is hidden from this local preview. Clear browser preview storage to restore it.`);
        return;
      }

      await deleteManualGame(selectedGame);
      onDeleted(selectedGame);
      setSelectedId('');
      setMessage(`${selectedGame.title} was permanently deleted from the catalogue.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The game could not be deleted.');
    } finally {
      setDeleting(false);
    }
  };

  const changed = Boolean(imageFile) || Boolean(requirement.trim()) || description.trim() !== (selectedGame?.description ?? '');
  const canPublish = Boolean(selectedGame) && changed && !publishing;
  const buttonLabel = isSupabaseConfigured && user ? 'Save Permanent Update' : 'Stage Local Preview Only';

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
            {buttonLabel}
          </button>
          {stagedPreview && (
            <button type="button" onClick={clearLocalPreview} className="mt-3 w-full rounded border border-[#d2b174] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#9d5b1e]">
              Clear Local Preview for This Game
            </button>
          )}
          <button type="button" disabled={!selectedGame || deleting} onClick={deleteGame} className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-[#f0a0a0] bg-[#fff7f4] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#b8322b] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:text-[#9a9188]">
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isSupabaseConfigured && user ? 'Delete Game Permanently' : 'Hide Game From Local Preview'}
          </button>
          <p className="mt-3 text-[11px] leading-5 text-[#766b60]">
            {isSupabaseConfigured && user
              ? 'Permanent mode: image, card brief, and requirement note are saved through admin-only Supabase rules.'
              : 'Local preview only: this is stored in this browser for testing. Permanent saving requires Supabase plus a signed-in approved administrator.'}
          </p>
          {message && <p className="mt-4 rounded border border-[#e7c987] bg-[#fff9ed] p-3 text-sm text-[#665c50]">{message}</p>}
        </div>
      </div>
    </section>
  );
}
