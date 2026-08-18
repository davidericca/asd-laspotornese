import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import type { EventRow } from "@/lib/types";
import {
  eventStatusColor,
  eventStatusLabel,
  formatDateIT,
  formatTimeIT,
  getEffectiveStatus,
} from "@/lib/utils";

export function EventCard({
  event,
  coverUrl,
}: {
  event: EventRow;
  coverUrl?: string | null;
}) {
  const time = formatTimeIT(event.event_time);
  const status = getEffectiveStatus(event);

  return (
    <Link
      href={`/eventi/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <SmartImage
          src={coverUrl}
          alt={event.title}
          className="transition duration-500 group-hover:scale-105"
        />
        <Badge className={`absolute left-3 top-3 shadow ${eventStatusColor(status)}`}>
          {eventStatusLabel(status)}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium text-secondary-700">
          {formatDateIT(event.event_date)}
          {time ? ` · ${time}` : ""}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-primary-950 group-hover:text-secondary-700">
          {event.title}
        </h3>
        {event.location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.3" />
            </svg>
            {event.location}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary-700">
          Scopri di più
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 transition group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
