import Link from "next/link";
import { getAdminEvents, getEventDisplayStatus } from "@/lib/data/events";
import { formatDateIt } from "@/lib/utils";
import { deleteEvent } from "@/actions/events";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Eventi</h1>
        <Link
          href="/admin/events/new"
          className="rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Nuovo evento
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {events.map((event) => (
          <li
            key={event.id}
            className="-mx-2 flex items-center justify-between gap-4 px-2 py-3 transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">
                {event.title}{" "}
                {!event.published && (
                  <span className="text-xs text-muted-foreground">
                    (bozza)
                  </span>
                )}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDateIt(event.event_date)}</span>
                <EventStatusBadge status={getEventDisplayStatus(event)} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/events/${event.id}`} className="hover:underline">
                Modifica
              </Link>
              <form action={deleteEvent.bind(null, event.id)}>
                <SubmitButton className="text-red-600 hover:underline">
                  Elimina
                </SubmitButton>
              </form>
            </div>
          </li>
        ))}
        {events.length === 0 && (
          <li className="py-3 text-muted-foreground">
            Nessun evento creato.
          </li>
        )}
      </ul>
    </div>
  );
}
