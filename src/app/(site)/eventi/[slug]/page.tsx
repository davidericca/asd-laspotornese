import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getEventDisplayStatus, getPublishedEventBySlug } from "@/lib/data/events";
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
      <PageHeader title={event.title} />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarBlank size={16} aria-hidden="true" />
            {formatDateIt(event.event_date)}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={16} aria-hidden="true" />
              {event.location}
            </span>
          )}
          <EventStatusBadge status={getEventDisplayStatus(event)} />
        </div>
        {event.description && (
          <p className="whitespace-pre-line text-sm">{event.description}</p>
        )}

        {attachments.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-sm font-semibold">Allegati</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachment.file_url}
                    target="_blank"
                    className="text-sm text-muted-foreground hover:underline"
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
            <h2 className="font-heading text-sm font-semibold">Foto</h2>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {galleryData.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted"
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
