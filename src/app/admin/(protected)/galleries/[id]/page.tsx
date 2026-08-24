import { getAdminGalleryWithImages } from "@/lib/data/galleries";
import { uploadImages, deleteImage, deleteGallery } from "@/actions/galleries";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { fileInputClass } from "@/lib/ui";

export default async function EditGalleryPage({
  params,
}: PageProps<"/admin/galleries/[id]">) {
  const { id } = await params;
  const { gallery, images } = await getAdminGalleryWithImages(id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{gallery.title}</h1>
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
