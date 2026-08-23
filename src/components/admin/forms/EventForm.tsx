import type { EventRow } from "@/lib/data/events";

const STATUSES: EventRow["status"][] = [
  "programmato",
  "in corso",
  "concluso",
  "annullato",
];

export function EventForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: EventRow;
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
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
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
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Orario
          <input
            type="time"
            name="event_time"
            defaultValue={defaultValues?.event_time ?? ""}
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Luogo
        <input
          type="text"
          name="location"
          defaultValue={defaultValues?.location ?? ""}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Stato
        <select
          name="status"
          defaultValue={defaultValues?.status ?? "programmato"}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Descrizione
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
        />
        Pubblicato
      </label>
      <button
        type="submit"
        className="self-start rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Salva
      </button>
    </form>
  );
}
