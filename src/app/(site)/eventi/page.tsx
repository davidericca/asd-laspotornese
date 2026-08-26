import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventTabs } from "@/components/site/EventTabs";
import { EventCountdown } from "@/components/site/EventCountdown";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getEventDisplayStatus, getNextUpcomingEvent, getPublishedEvents } from "@/lib/data/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario di eventi e gare dell'ASD La Spotornese.",
};

export default async function EventiPage() {
  const [events, nextEvent] = await Promise.all([getPublishedEvents(), getNextUpcomingEvent()]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((event) => event.event_date >= today);
  const past = events
    .filter((event) => event.event_date < today)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));
  const eventDate = nextEvent ? new Date(nextEvent.event_date) : null;
  const eventCancelled = nextEvent && getEventDisplayStatus(nextEvent) === "annullato";

  return (
    <>
      <PageHeader
        title="Eventi"
        eyebrow="Calendario"
        description="Tutte le gare e le uscite organizzate dall'associazione."
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        {nextEvent && eventDate && (
          <div className="mb-12 flex flex-wrap items-center gap-y-4 rounded-lg bg-primary p-7">
            <div className="flex items-center gap-5">
              <div className="shrink-0 rounded-xl border border-primary-foreground/25 px-7 py-4 text-center">
                <div className="font-mono text-4xl leading-none font-bold text-primary-foreground">
                  {eventDate.getDate()}
                </div>
                <div className="mt-1.5 font-mono text-[10px] tracking-widest text-primary-foreground/55 uppercase">
                  {eventDate.toLocaleDateString("it-IT", { month: "long" })}
                </div>
                <div className="font-mono text-[10px] tracking-widest text-primary-foreground/55 uppercase">
                  {eventDate.getFullYear()}
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-widest text-accent uppercase">
                  Prossimo evento
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/eventi/${nextEvent.slug}`}
                    className="font-heading text-lg font-bold text-primary-foreground hover:underline"
                  >
                    {nextEvent.title}
                  </Link>
                  {eventCancelled && <EventStatusBadge status="annullato" />}
                </div>
                {(nextEvent.event_time || nextEvent.location) && (
                  <p className="text-xs text-primary-foreground/55">
                    {nextEvent.location}
                    {nextEvent.event_time && nextEvent.location && " · "}
                    {nextEvent.event_time && `ore ${nextEvent.event_time.slice(0, 5)}`}
                  </p>
                )}
              </div>
            </div>
            <EventCountdown eventDate={nextEvent.event_date} eventTime={nextEvent.event_time} />
          </div>
        )}
        <EventTabs upcoming={upcoming} past={past} />
      </div>
    </>
  );
}
