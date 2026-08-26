import { getAdminGalleryWithImages } from "@/lib/data/galleries";
import {
  uploadImages,
  deleteImage,
  deleteGallery,
  updateGallery,
  updateGalleryCoverPosition,
} from "@/actions/galleries";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageFocalPointPicker } from "@/components/admin/forms/ImageFocalPointPicker";
import { fileInputClass } from "@/lib/ui";

export default async function EditGalleryPage({
  params,
}: PageProps<"/admin/galleries/[id]">) {
  const { id } = await params;
  const { gallery, images } = await getAdminGalleryWithImages(id);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <form action={updateGallery.bind(null, id)} className="flex max-w-sm flex-1 flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Titolo
            <input
              type="text"
              name="title"
              required
              defaultValue={gallery.title}
              className="rounded border border-border bg-transparent px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descrizione (opzionale)
            <textarea
              name="description"
              rows={2}
              defaultValue={gallery.description ?? ""}
              className="rounded border border-border bg-transparent px-3 py-2"
            />
          </label>
          <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
            Salva
          </SubmitButton>
        </form>
        <form action={deleteGallery.bind(null, id)}>
          <SubmitButton className="text-sm text-red-600 hover:underline">
            Elimina galleria
          </SubmitButton>
        </form>
      </div>

      <form
        action={uploadImages.bind(null, id)}
        className="mt-6 flex flex-wrap items-center gap-4"
      >
        <input type="file" name="images" accept="image/*" multiple required className={fileInputClass} />
        <SubmitButton className="rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
          Carica foto
        </SubmitButton>
      </form>

      {gallery.cover_image_url && (
        <form
          action={updateGalleryCoverPosition.bind(null, id)}
          className="mt-8 flex max-w-xs flex-col gap-3"
        >
          <p className="text-xs text-muted-foreground">
            La copertina è la prima foto caricata. Regola qui quale parte resta visibile
            quando viene ritagliata (home e pagina galleria).
          </p>
          <ImageFocalPointPicker
            positionFieldName="cover_image_position"
            currentImageUrl={gallery.cover_image_url}
            currentPosition={gallery.cover_image_position}
          />
          <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
            Salva inquadratura
          </SubmitButton>
        </form>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="flex flex-col gap-2">
            <div className="aspect-square w-full overflow-hidden border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt_text ?? ""}
                className="h-full w-full object-contain"
              />
            </div>
            <form action={deleteImage.bind(null, id, image.id, image.url)}>
              <SubmitButton className="text-xs text-red-600 hover:underline">
                Elimina
              </SubmitButton>
            </form>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          Nessuna foto caricata.
        </p>
      )}
    </div>
  );
}
