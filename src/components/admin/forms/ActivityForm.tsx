import type { ActivityRow } from "@/lib/data/activities";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageFocalPointPicker } from "@/components/admin/forms/ImageFocalPointPicker";
import { fileInputClass } from "@/lib/ui";

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
      <label className="flex flex-col gap-2 text-sm">
        Foto (opzionale)
        <input type="file" name="cover_image" accept="image/*" className={fileInputClass} />
      </label>
      <p className="-mt-2 text-xs text-muted-foreground">
        Scegli il file, poi premi &quot;Salva&quot; qui sotto: solo allora viene caricato davvero.
      </p>
      {defaultValues?.cover_image_url && (
        <p className="-mt-1 text-xs text-muted-foreground">
          Foto attuale. Caricandone una nuova la sostituirai.
        </p>
      )}
      <ImageFocalPointPicker
        positionFieldName="cover_image_position"
        fileFieldName="cover_image"
        currentImageUrl={defaultValues?.cover_image_url ?? null}
        currentPosition={null}
      />
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
