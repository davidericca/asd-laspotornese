import { notFound } from "next/navigation";
import Link from "next/link";
import { getGalleryById } from "@/lib/data/galleries";
import { getAllEventsAdmin } from "@/lib/data/events";
import { GalleryManager } from "@/components/admin/forms/GalleryManager";

export default async function AdminGalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [gallery, events] = await Promise.all([
    getGalleryById(id),
    getAllEventsAdmin(),
  ]);

  if (!gallery) notFound();

  return (
    <div>
      <Link
        href="/admin/galleria"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-700 hover:underline"
      >
        ← Tutte le gallerie
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-primary-900">
        {gallery.title}
      </h1>

      <div className="mt-8">
        <GalleryManager gallery={gallery} events={events} />
      </div>
    </div>
  );
}
