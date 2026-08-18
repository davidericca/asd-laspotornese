import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SmartImage } from "@/components/ui/SmartImage";
import { getGalleriesWithCover } from "@/lib/data/galleries";
import { SITE } from "@/lib/constants";
import { formatDateTimeIT } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Galleria fotografica",
  description: `Le fotografie delle attività, degli eventi e delle gare della ${SITE.name}.`,
};

export default async function GalleriaPage() {
  const galleries = await getGalleriesWithCover();

  return (
    <>
      <PageHero
        eyebrow="In immagini"
        title="Galleria fotografica"
        subtitle="Sfoglia le gallerie delle nostre uscite, gare e manifestazioni."
      />
      <Container className="py-12 sm:py-16">
        {galleries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Le gallerie fotografiche saranno pubblicate qui a breve.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/galleria/${gallery.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <SmartImage
                    src={gallery.cover_image?.url ?? gallery.images[0]?.url}
                    alt={gallery.title}
                    className="transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
                    {gallery.images.length} foto
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-display font-semibold text-primary-950 group-hover:text-secondary-700">
                    {gallery.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDateTimeIT(gallery.created_at)}
                  </p>
                  {gallery.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {gallery.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
