import type { ActivityRow } from "@/lib/data/activities";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ActivityForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ActivityRow;
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
      <SubmitButton className="self-start rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
        Salva
      </SubmitButton>
    </form>
  );
}
