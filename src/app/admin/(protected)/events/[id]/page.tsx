import { EventForm } from "@/components/admin/forms/EventForm";
import { getAdminEventById } from "@/lib/data/events";
import { updateEvent } from "@/actions/events";

export default async function EditEventPage({
  params,
}: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const event = await getAdminEventById(id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Modifica evento</h1>
      <div className="mt-6">
        <EventForm action={updateEvent.bind(null, id)} defaultValues={event} />
      </div>
    </div>
  );
}
