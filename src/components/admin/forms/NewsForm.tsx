import type { NewsRow } from "@/lib/data/news";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function NewsForm({
  action,
  defaultValues,
  showAttachmentField,
}: {
  action: (formData: FormData) => void;
  defaultValues?: NewsRow;
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
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Testo
        <textarea
          name="body"
          rows={8}
          required
          defaultValue={defaultValues?.body}
          className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured ?? false}
        />
        In evidenza
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
      <SubmitButton className="self-start rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
        Salva
      </SubmitButton>
    </form>
  );
}
