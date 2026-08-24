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
          className="rounded border border-border bg-transparent px-3 py-2"
        />
      </label>
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
        Foto (opzionale)
        <input type="file" name="cover_image" accept="image/*" />
      </label>
      {defaultValues?.cover_image_url && (
        <p className="text-xs text-muted-foreground">
          È già presente una foto. Caricandone una nuova la sostituirai.
        </p>
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
