import { EventForm } from "@/components/admin/forms/EventForm";
import { AttachmentsSection } from "@/components/admin/forms/AttachmentsSection";
import { getAdminEventById } from "@/lib/data/events";
import { getAdminGalleries } from "@/lib/data/galleries";
import { getAdminAttachments } from "@/lib/data/attachments";
import { updateEvent } from "@/actions/events";

export default async function EditEventPage({
  params,
}: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const [event, galleries, attachments] = await Promise.all([
    getAdminEventById(id),
    getAdminGalleries(),
    getAdminAttachments("event", id),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Modifica evento</h1>
      <div className="mt-6">
        <EventForm action={updateEvent.bind(null, id)} defaultValues={event} galleries={galleries} />
      </div>
      <hr className="mt-10 max-w-lg border-border" />
      <div className="mt-8">
        <AttachmentsSection
          parent="event"
          parentId={id}
          revalidateTarget={`/eventi/${event.slug}`}
          attachments={attachments}
        />
      </div>
    </div>
  );
}
