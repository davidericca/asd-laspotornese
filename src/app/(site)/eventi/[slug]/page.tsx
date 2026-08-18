import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getAllPublicEvents } from "@/lib/data/events";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import {
  eventStatusColor,
  eventStatusLabel,
  formatDateIT,
  formatTimeIT,
  getEffectiveStatus,
} from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const events = await getAllPublicEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.title,
    description:
      event.description?.slice(0, 160) ||
      `${event.title} — ${formatDateIT(event.event_date)}`,
    openGraph: event.cover_image
      ? { images: [{ url: event.cover_image.url }] }
      : undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || !event.published) notFound();

  const time = formatTimeIT(event.event_time);
  const status = getEffectiveStatus(event);

  return (
    <article>
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-primary-950">
        <SmartImage
          src={event.cover_image?.url}
          alt={event.title}
          className="opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent" />
        <Container className="relative flex h-full flex-col justify-end pb-10 text-white">
          <Badge className={`mb-4 w-fit ${eventStatusColor(status)}`}>
            {eventStatusLabel(status)}
          </Badge>
          <h1 className="max-w-3xl font-display text-3xl font-bold sm:text-4xl">
            {event.title}
          </h1>
        </Container>
      </div>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {event.description && (
              <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700">
                {event.description}
              </div>
            )}

            {event.extra_info && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-primary-50/60 p-6">
                <h2 className="font-display font-semibold text-primary-950">
                  Informazioni aggiuntive
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                  {event.extra_info}
                </p>
              </div>
            )}

            {event.gallery && event.gallery.images.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-semibold text-primary-950">
                  Galleria fotografica
                </h2>
                <div className="mt-5">
                  <GalleryGrid images={event.gallery.images} />
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-display font-semibold text-primary-950">
                Dettagli
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <InfoRow label="Data" value={formatDateIT(event.event_date, true)} />
                {event.end_date && event.end_date !== event.event_date && (
                  <InfoRow label="Fino al" value={formatDateIT(event.end_date)} />
                )}
                {time && <InfoRow label="Orario" value={time} />}
                {event.location && (
                  <InfoRow label="Luogo" value={event.location} />
                )}
              </dl>
            </div>

            {event.attachments.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="font-display font-semibold text-primary-950">
                  Documenti e regolamenti
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {event.attachments.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={a.url}
                        target="_blank"
                        className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 transition hover:border-secondary-300 hover:bg-secondary-50"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-secondary-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
                        </svg>
                        <span className="flex-1 truncate">{a.file_name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
