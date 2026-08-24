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
          className="rounded border border-border bg-transparent px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Testo
        <textarea
          name="body"
          rows={8}
          required
          defaultValue={defaultValues?.body}
          className="rounded border border-border bg-transparent px-3 py-2"
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
      <label className="flex flex-col gap-1 text-sm">
        Foto di copertina (opzionale)
        <input type="file" name="cover_image" accept="image/*" />
      </label>
      {defaultValues?.cover_image_url && (
        <p className="text-xs text-muted-foreground">
          È già presente una foto di copertina. Caricandone una nuova la sostituirai.
        </p>
      )}
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
