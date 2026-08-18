"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  updateImageMetadata,
  deleteImage,
  replaceImage,
} from "@/actions/images";
import type { ImageRow } from "@/lib/types";

export function AdminImageCard({
  image,
  isCover,
  onSetCover,
}: {
  image: ImageRow;
  isCover?: boolean;
  onSetCover?: (imageId: string) => void;
}) {
  const [title, setTitle] = useState(image.title ?? "");
  const [description, setDescription] = useState(image.description ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function handleSave() {
    startTransition(async () => {
      await updateImageMetadata(image.id, {
        title,
        description,
        alt_text: title,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  function handleDelete() {
    if (!confirm("Eliminare definitivamente questa immagine?")) return;
    startTransition(async () => {
      await deleteImage(image.id);
      router.refresh();
    });
  }

  function handleReplace(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      await replaceImage(image.id, formData);
      router.refresh();
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="relative h-40 w-full bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt_text || "Immagine"}
          className="h-full w-full object-cover"
        />
        {isCover && (
          <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Copertina
          </span>
        )}
      </div>
      <div className="space-y-2 p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo immagine"
          className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-secondary-500 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione (facoltativa)"
          rows={2}
          className="w-full resize-none rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:border-secondary-500 focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-primary-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-900 disabled:opacity-60"
          >
            {saved ? "Salvato ✓" : "Salva"}
          </button>

          {onSetCover && !isCover && (
            <button
              type="button"
              onClick={() => onSetCover(image.id)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Imposta come copertina
            </button>
          )}

          <label className="cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
            Sostituisci
            <input type="file" accept="image/*" onChange={handleReplace} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="ml-auto rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
