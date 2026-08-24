import { createGallery } from "@/actions/galleries";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { fileInputClass } from "@/lib/ui";

export default function NewGalleryPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Nuova galleria</h1>
      <form action={createGallery} className="mt-6 flex max-w-lg flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Titolo
          <input
            type="text"
            name="title"
            required
            className="rounded border border-border bg-transparent px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Descrizione
          <textarea
            name="description"
            rows={3}
            className="rounded border border-border bg-transparent px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Foto
          <input type="file" name="images" accept="image/*" multiple className={fileInputClass} />
        </label>
        <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
          Crea galleria
        </SubmitButton>
      </form>
    </div>
  );
}
