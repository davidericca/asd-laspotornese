"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImages, type ImageActionState } from "@/actions/images";

const initialState: ImageActionState = {};

/**
 * Widget di caricamento multiplo per la galleria. Permette di selezionare
 * più immagini insieme, ne mostra un'anteprima prima dell'invio e le
 * carica tutte in un'unica operazione. Ogni immagine viene poi ottimizzata
 * automaticamente lato server.
 */
export function MultiImageUploader({ galleryId }: { galleryId: string }) {
  const [state, formAction, isPending] = useActionState(
    uploadImages,
    initialState
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form
      action={(formData) => {
        formAction(formData);
        setPreviews([]);
        if (inputRef.current) inputRef.current.value = "";
      }}
      className="rounded-2xl border-2 border-dashed border-secondary-300 bg-secondary-50/40 p-6"
    >
      <input type="hidden" name="galleryId" value={galleryId} />

      <label className="block text-sm font-semibold text-secondary-800">
        Carica immagini
      </label>
      <p className="mt-1 text-xs text-secondary-700/70">
        Puoi selezionare più foto contemporaneamente. Verranno ottimizzate
        automaticamente per il web.
      </p>

      <input
        ref={inputRef}
        type="file"
        name="files"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-700 file:shadow-sm hover:file:bg-secondary-100"
      />

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Anteprima ${i + 1}`}
              className="h-20 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {state.error && (
        <p className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-3 text-sm text-secondary-700">
          Immagini caricate con successo.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-full bg-secondary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-700 disabled:opacity-60"
      >
        {isPending ? "Caricamento in corso…" : "Carica immagini"}
      </button>
    </form>
  );
}
