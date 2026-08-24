import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedEventBySlug } from "@/lib/data/events";
import { getPublishedAttachments } from "@/lib/data/attachments";
import { getPublishedGalleryWithImages } from "@/lib/data/galleries";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/eventi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.description ?? `Evento del ${formatDateIt(event.event_date)}`,
    openGraph: event.cover_image_url ? { images: [event.cover_image_url] } : undefined,
  };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/eventi/[slug]">) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) notFound();
  const [attachments, galleryData] = await Promise.all([
    getPublishedAttachments("event", event.id),
    event.gallery_id ? getPublishedGalleryWithImages(event.gallery_id) : null,
  ]);

  return (
    <>
      <PageHeader
        title={event.title}
        description={`${formatDateIt(event.event_date)}${event.location ? ` · ${event.location}` : ""} · ${event.status}`}
      />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        {event.description && (
          <p className="whitespace-pre-line text-sm">{event.description}</p>
        )}

        {attachments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold">Allegati</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachment.file_url}
                    target="_blank"
                    className="text-sm text-black/60 hover:underline dark:text-white/60"
                  >
                    {attachment.file_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {galleryData && galleryData.images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold">Foto</h2>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {galleryData.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square w-full overflow-hidden rounded bg-black/5 dark:bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt_text ?? ""}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
