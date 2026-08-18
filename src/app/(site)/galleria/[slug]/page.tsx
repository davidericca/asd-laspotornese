import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGalleryBySlug, getAllGalleries } from "@/lib/data/galleries";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const revalidate = 60;

export async function generateStaticParams() {
  const galleries = await getAllGalleries();
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return {};
  return {
    title: gallery.title,
    description: gallery.description ?? `Galleria fotografica: ${gallery.title}`,
    openGraph: gallery.cover_image
      ? { images: [{ url: gallery.cover_image.url }] }
      : undefined,
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) notFound();

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <Link
          href="/galleria"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-700 hover:underline"
        >
          ← Tutte le gallerie
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold text-primary-950 sm:text-4xl">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="mt-2 max-w-2xl text-slate-600">{gallery.description}</p>
        )}

        <div className="mt-10">
          <GalleryGrid images={gallery.images} />
        </div>
      </Container>
    </div>
  );
}
