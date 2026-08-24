import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedGalleries } from "@/lib/data/galleries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galleria",
  description: "Foto delle attività dell'ASD La Spotornese.",
};

export default async function GalleriaPage() {
  const galleries = await getPublishedGalleries();

  return (
    <>
      <PageHeader title="Galleria" description="Foto delle nostre attività." />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/galleria/${gallery.id}`}
              className="group"
            >
              <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                {gallery.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gallery.cover_image_url}
                    alt={gallery.title}
                    className="h-full w-full object-contain transition group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{gallery.title}</p>
            </Link>
          ))}
        </div>
        {galleries.length === 0 && (
          <p className="text-muted-foreground">
            Nessuna galleria pubblicata al momento.
          </p>
        )}
      </div>
    </>
  );
}
