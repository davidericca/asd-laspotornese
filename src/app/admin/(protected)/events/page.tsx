import Link from "next/link";
import { getAdminEvents } from "@/lib/data/events";
import { formatDateIt } from "@/lib/utils";
import { deleteEvent } from "@/actions/events";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Eventi</h1>
        <Link
          href="/admin/events/new"
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Nuovo evento
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-center justify-between py-3"
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
              <p className="text-sm text-muted-foreground">
                {formatDateIt(event.event_date)} &middot; {event.status}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/events/${event.id}`} className="hover:underline">
                Modifica
              </Link>
              <form action={deleteEvent.bind(null, event.id)}>
                <SubmitButton className="text-red-600 hover:underline dark:text-red-400">
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
