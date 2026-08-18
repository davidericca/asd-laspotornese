"use client";

import { useActionState, type ReactNode } from "react";
import { createEvent, updateEvent, type EventActionState } from "@/actions/events";
import { CoverImageInput } from "@/components/admin/forms/CoverImageInput";
import type { EventRow, GalleryRow } from "@/lib/types";

const initialState: EventActionState = {};

export function EventForm({
  event,
  galleries,
}: {
  event?: EventRow & { cover_image_url?: string | null };
  galleries: GalleryRow[];
}) {
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Titolo" required>
        <input
          name="title"
          required
          defaultValue={event?.title}
          placeholder='Es. "Gara Sociale di Pesca 2026"'
          className="input"
        />
      </Field>

      <Field label="Descrizione">
        <textarea
          name="description"
          rows={5}
          defaultValue={event?.description ?? ""}
          placeholder="Descrivi l'evento: modalità di partecipazione, categorie, premi…"
          className="input"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Data" required>
          <input
            type="date"
            name="event_date"
            required
            defaultValue={event?.event_date}
            className="input"
          />
        </Field>
        <Field label="Orario">
          <input
            type="time"
            name="event_time"
            defaultValue={event?.event_time?.slice(0, 5)}
            className="input"
          />
        </Field>
        <Field label="Data fine (se più giorni)">
          <input
            type="date"
            name="end_date"
            defaultValue={event?.end_date ?? ""}
            className="input"
          />
        </Field>
      </div>

      <Field label="Luogo">
        <input
          name="location"
          defaultValue={event?.location ?? ""}
          placeholder="Es. Molo di Spotorno"
          className="input"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Stato">
          <select
            name="status"
            defaultValue={event?.status === "annullato" ? "annullato" : "prossimo"}
            className="input"
          >
            <option value="prossimo">Prossimo (automatico in base alla data)</option>
            <option value="annullato">Annullato</option>
          </select>
          <p className="mt-1.5 text-xs text-slate-400">
            Diventa &quot;Concluso&quot; da solo, sul sito, a partire dal
            giorno dopo la data dell&apos;evento. Scegli &quot;Annullato&quot;
            solo se la manifestazione non si svolgerà.
          </p>
        </Field>
        <Field label="Galleria fotografica collegata">
          <select name="gallery_id" defaultValue={event?.gallery_id ?? ""} className="input">
            <option value="">Nessuna</option>
            {galleries.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Informazioni aggiuntive">
        <textarea
          name="extra_info"
          rows={3}
          defaultValue={event?.extra_info ?? ""}
          placeholder="Regolamento sintetico, quota di iscrizione, cosa portare…"
          className="input"
        />
      </Field>

      <CoverImageInput currentUrl={event?.cover_image_url} />

      <label className="flex items-center gap-2.5 text-sm text-slate-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={event?.published ?? true}
          className="h-4 w-4 rounded border-slate-300 text-secondary-600 focus:ring-secondary-500"
        />
        Pubblicato (visibile sul sito)
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : event ? "Salva modifiche" : "Crea evento"}
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
