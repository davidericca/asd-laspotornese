import { EventForm } from "@/components/admin/forms/EventForm";
import { createEvent } from "@/actions/events";
import { getAdminGalleries } from "@/lib/data/galleries";

export default async function NewEventPage() {
  const galleries = await getAdminGalleries();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Nuovo evento</h1>
      <div className="mt-6">
        <EventForm action={createEvent} galleries={galleries} showAttachmentField />
      </div>
    </div>
  );
}
