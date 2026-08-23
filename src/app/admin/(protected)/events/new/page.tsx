import { EventForm } from "@/components/admin/forms/EventForm";
import { createEvent } from "@/actions/events";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Nuovo evento</h1>
      <div className="mt-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
