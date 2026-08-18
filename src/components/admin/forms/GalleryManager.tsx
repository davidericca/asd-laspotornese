"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGallery, deleteGallery } from "@/actions/galleries";
import { AdminImageCard } from "@/components/admin/forms/AdminImageCard";
import { MultiImageUploader } from "@/components/admin/forms/MultiImageUploader";
import type { EventRow, GalleryWithImages } from "@/lib/types";

export function GalleryManager({
  gallery,
  events,
}: {
  gallery: GalleryWithImages;
  events: EventRow[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(gallery.title);
  const [description, setDescription] = useState(gallery.description ?? "");
  const [eventId, setEventId] = useState(gallery.event_id ?? "");
  const [coverImageId, setCoverImageId] = useState(gallery.cover_image_id);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateGallery(gallery.id, {
        title,
        description,
        eventId: eventId || undefined,
        coverImageId,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      router.refresh();
    });
  }

  function handleSetCover(imageId: string) {
    setCoverImageId(imageId);
    startTransition(async () => {
      await updateGallery(gallery.id, {
        title,
        description,
        eventId: eventId || undefined,
        coverImageId: imageId,
      });
      router.refresh();
    });
  }

  function handleDeleteGallery() {
    if (
      !confirm(
        `Eliminare la galleria "${gallery.title}" e tutte le sue ${gallery.images.length} foto? L'operazione non è reversibile.`
      )
    )
      return;
    startTransition(async () => {
      await deleteGallery(gallery.id);
      router.push("/admin/galleria");
    });
  }

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display font-semibold text-primary-950">
          Informazioni galleria
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Titolo
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Descrizione
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Evento collegato
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="input"
            >
              <option value="">Nessuno</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-primary-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-900 disabled:opacity-60"
          >
            {saved ? "Salvato ✓" : "Salva modifiche"}
          </button>
          <button
            type="button"
            onClick={handleDeleteGallery}
            className="rounded-full px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Elimina galleria
          </button>
        </div>
      </div>

      <MultiImageUploader galleryId={gallery.id} />

      <div>
        <h2 className="font-display font-semibold text-primary-950">
          Foto della galleria ({gallery.images.length})
        </h2>
        {gallery.images.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nessuna foto caricata ancora. Usa il modulo qui sopra per
            aggiungerne.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.images.map((image) => (
              <AdminImageCard
                key={image.id}
                image={image}
                isCover={coverImageId === image.id}
                onSetCover={handleSetCover}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
