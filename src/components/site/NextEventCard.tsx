import Link from "next/link";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { EventCountdown } from "@/components/site/EventCountdown";
import { getEventDisplayStatus, type EventRow } from "@/lib/data/events";

export function NextEventCard({
  event,
  className = "",
  showDetailsLink = false,
}: {
  event: EventRow;
  className?: string;
  showDetailsLink?: boolean;
}) {
  const eventDate = new Date(event.event_date);
  const cancelled = getEventDisplayStatus(event) === "annullato";

  return (
    <div className={`flex flex-wrap items-center gap-y-4 ${className}`}>
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
          <p className="font-mono text-[10px] tracking-widest text-accent uppercase">Prossimo evento</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <Link
              href={`/eventi/${event.slug}`}
              className="font-heading text-lg font-bold text-primary-foreground hover:underline"
            >
              {event.title}
            </Link>
            {cancelled && <EventStatusBadge status="annullato" />}
          </div>
          {(event.event_time || event.location) && (
            <p className="text-xs text-primary-foreground/55">
              {event.location}
              {event.event_time && event.location && " · "}
              {event.event_time && `ore ${event.event_time.slice(0, 5)}`}
            </p>
          )}
          {showDetailsLink && (
            <Link href={`/eventi/${event.slug}`} className="inline-block text-xs font-bold text-accent">
              Scopri i dettagli →
            </Link>
          )}
        </div>
      </div>
      <EventCountdown eventDate={event.event_date} eventTime={event.event_time} />
    </div>
  );
}
