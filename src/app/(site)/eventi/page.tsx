import type { Metadata } from "next";
import Link from "next/link";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getEventDisplayStatus, getPublishedEvents, type EventRow } from "@/lib/data/events";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario di eventi e gare dell'ASD La Spotornese.",
};

function EventCard({ event }: { event: EventRow }) {
  return (
    <li>
      <Link
        href={`/eventi/${event.slug}`}
        className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-medium text-card-foreground group-hover:underline">
            {event.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
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
          </div>
        </div>
        <EventStatusBadge status={getEventDisplayStatus(event)} />
      </Link>
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
        <ul className="mt-3 flex flex-col gap-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
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
            <ul className="mt-3 flex flex-col gap-3 opacity-80">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
