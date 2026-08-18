"use client";

import { useState } from "react";
/* eslint-disable @next/next/no-img-element */

/**
 * Campo per caricare/sostituire l'immagine di copertina di un evento o di
 * una news. Mostra un'anteprima locale prima dell'invio del form (il file
 * viene poi ottimizzato automaticamente lato server al salvataggio).
 */
export function CoverImageInput({
  currentUrl,
  name = "cover_image",
}: {
  currentUrl?: string | null;
  name?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Immagine di copertina
      </label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {preview ? (
            <img src={preview} alt="Anteprima" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Nessuna immagine
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-secondary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-700 hover:file:bg-secondary-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Formati JPG, PNG o WebP. Verrà ottimizzata automaticamente al
            salvataggio.
          </p>
        </div>
      </div>
    </div>
  );
}
