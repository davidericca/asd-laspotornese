import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";
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
        {images.length > 0 && <GalleryLightbox images={images} />}
        {images.length === 0 && (
          <p className="text-muted-foreground">
            Nessuna foto in questa galleria.
          </p>
        )}
      </div>
    </>
  );
}
