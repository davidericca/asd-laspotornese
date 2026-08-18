import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/data/events";
import { getAllGalleries } from "@/lib/data/galleries";
import { EventForm } from "@/components/admin/forms/EventForm";
import { AttachmentsManager } from "@/components/admin/forms/AttachmentsManager";

export default async function EditEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, galleries] = await Promise.all([
    getEventById(id),
    getAllGalleries(),
  ]);

  if (!event) notFound();

  return (
    <div>
      <Link
        href="/admin/eventi"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-700 hover:underline"
      >
        ← Tutti gli eventi
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-primary-900">
        Modifica evento
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventForm
            event={{ ...event, cover_image_url: event.cover_image?.url }}
            galleries={galleries}
          />
        </div>
        <div>
          <AttachmentsManager
            relatedType="event"
            relatedId={event.id}
            attachments={event.attachments}
          />
        </div>
      </div>
    </div>
  );
}
