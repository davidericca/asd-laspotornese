import type { EventRow } from "@/lib/data/events";
import type { GalleryRow } from "@/lib/data/galleries";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function EventForm({
  action,
  defaultValues,
  galleries,
  showAttachmentField,
}: {
  action: (formData: FormData) => void;
  defaultValues?: EventRow;
  galleries: GalleryRow[];
  showAttachmentField?: boolean;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Titolo
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="rounded border border-border bg-transparent px-3 py-2"
        />
      </label>
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Data
          <input
            type="date"
            name="event_date"
            required
            defaultValue={defaultValues?.event_date}
            className="rounded border border-border bg-transparent px-3 py-2"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Orario
          <input
            type="time"
            name="event_time"
            defaultValue={defaultValues?.event_time ?? ""}
            className="rounded border border-border bg-transparent px-3 py-2"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Luogo
        <input
          type="text"
          name="location"
          defaultValue={defaultValues?.location ?? ""}
          className="rounded border border-border bg-transparent px-3 py-2"
        />
      </label>
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="cancelled"
            defaultChecked={defaultValues?.status === "annullato"}
          />
          Evento annullato
        </label>
        <p className="text-xs text-muted-foreground">
          Lo stato &quot;programmato / in corso / concluso&quot; viene calcolato
          automaticamente in base alla data. Usa questa casella solo per
          segnalare che l&apos;evento è stato annullato.
        </p>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Descrizione
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="rounded border border-border bg-transparent px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Galleria foto collegata
        <select
          name="gallery_id"
          defaultValue={defaultValues?.gallery_id ?? ""}
          className="rounded border border-border bg-transparent px-3 py-2"
        >
          <option value="">Nessuna</option>
          {galleries.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.title}
            </option>
          ))}
        </select>
      </label>
      {showAttachmentField && (
        <label className="flex flex-col gap-1 text-sm">
          Allegato PDF (opzionale)
          <input type="file" name="attachment" accept="application/pdf" />
        </label>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
        />
        Pubblicato
      </label>
      <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
        Salva
      </SubmitButton>
    </form>
  );
}
