import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedEvents, type EventRow } from "@/lib/data/events";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario di eventi e gare dell'ASD La Spotornese.",
};

function EventItem({ event }: { event: EventRow }) {
  return (
    <li className="py-4">
      <Link href={`/eventi/${event.slug}`} className="font-medium hover:underline">
        {event.title}
      </Link>
      <p className="text-sm text-muted-foreground">
        {formatDateIt(event.event_date)}
        {event.location && ` · ${event.location}`}
      </p>
    </li>
  );
}

export default async function EventiPage() {
  const events = await getPublishedEvents();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((event) => event.event_date >= today);
  const past = events
    .filter((event) => event.event_date < today)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

  return (
    <>
      <PageHeader title="Eventi" description="Calendario di eventi e gare." />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Prossimi eventi
        </h2>
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {upcoming.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
          {upcoming.length === 0 && (
            <li className="py-4 text-muted-foreground">
              Nessun evento in programma al momento.
            </li>
          )}
        </ul>

        {past.length > 0 && (
          <>
            <h2 className="mt-10 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Eventi passati
            </h2>
            <ul className="mt-2 flex flex-col divide-y divide-border opacity-70">
              {past.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
