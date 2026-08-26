import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventTabs } from "@/components/site/EventTabs";
import { NextEventCard } from "@/components/site/NextEventCard";
import { getNextUpcomingEvent, getPublishedEvents } from "@/lib/data/events";

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

  return (
    <>
      <PageHeader
        title="Eventi"
        eyebrow="Calendario"
        description="Tutte le gare e le uscite organizzate dall'associazione."
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        {nextEvent && <NextEventCard event={nextEvent} className="mb-12 rounded-lg bg-primary p-7" />}
        <EventTabs upcoming={upcoming} past={past} />
      </div>
    </>
  );
}
