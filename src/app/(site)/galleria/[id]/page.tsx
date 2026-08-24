import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedGalleryWithImages } from "@/lib/data/galleries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/galleria/[id]">): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublishedGalleryWithImages(id);
  if (!data) return {};

  return {
    title: data.gallery.title,
    description: data.gallery.description ?? undefined,
    openGraph: data.gallery.cover_image_url ? { images: [data.gallery.cover_image_url] } : undefined,
  };
}

export default async function GalleryDetailPage({
  params,
}: PageProps<"/galleria/[id]">) {
  const { id } = await params;
  const data = await getPublishedGalleryWithImages(id);
  if (!data) notFound();
  const { gallery, images } = data;

  return (
    <>
      <PageHeader title={gallery.title} description={gallery.description ?? undefined} />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div key={image.id}>
              <div className="aspect-square w-full overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt_text ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
              {image.alt_text && (
                <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {image.alt_text}
                </p>
              )}
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-muted-foreground">
            Nessuna foto in questa galleria.
          </p>
        )}
      </div>
    </>
  );
}
