"use client";

import { useActionState, type ReactNode } from "react";
import { createGallery, type GalleryActionState } from "@/actions/galleries";
import type { EventRow } from "@/lib/types";

const initialState: GalleryActionState = {};

export function GalleryCreateForm({ events }: { events: EventRow[] }) {
  const [state, formAction, isPending] = useActionState(
    createGallery,
    initialState
  );

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Titolo galleria" required>
        <input
          name="title"
          required
          placeholder='Es. "Gara sociale 2026" oppure "Uscite in barca"'
          className="input"
        />
      </Field>

      <Field label="Descrizione (facoltativa)">
        <textarea name="description" rows={3} className="input" />
      </Field>

      <Field label="Collega a un evento (facoltativo)">
        <select name="eventId" className="input">
          <option value="">Nessun evento collegato</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Creazione…" : "Crea galleria"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
