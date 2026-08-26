"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarBlank, MapPin } from "@phosphor-icons/react";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getEventDisplayStatus, type EventRow } from "@/lib/event-status";
import { formatDateIt } from "@/lib/utils";
import { cardClass } from "@/lib/ui";

const TABS = [
  { id: "prossimi", label: "Prossimi" },
  { id: "conclusi", label: "Conclusi" },
  { id: "tutti", label: "Tutti" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function EventCard({ event }: { event: EventRow }) {
  return (
    <Link
      href={`/eventi/${event.slug}`}
      className={`group flex flex-col overflow-hidden ${cardClass}`}
    >
      {event.cover_image_url && (
        <div className="aspect-[16/10] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            style={{ objectPosition: event.cover_image_position || "50% 50%" }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <CalendarBlank size={14} aria-hidden="true" />
            {formatDateIt(event.event_date)}
            {event.event_time && ` · ore ${event.event_time.slice(0, 5)}`}
          </span>
          <EventStatusBadge status={getEventDisplayStatus(event)} />
        </div>
        <p className="font-heading font-semibold text-card-foreground group-hover:underline">
          {event.title}
        </p>
        {event.location && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} aria-hidden="true" />
            {event.location}
          </span>
        )}
        <span className="mt-auto pt-2 text-sm font-medium text-primary">Scopri di più →</span>
      </div>
    </Link>
  );
}

export function EventTabs({ upcoming, past }: { upcoming: EventRow[]; past: EventRow[] }) {
  const [tab, setTab] = useState<TabId>("prossimi");
  const list = tab === "prossimi" ? upcoming : tab === "conclusi" ? past : [...upcoming, ...past];

  return (
    <div>
      <div className="inline-flex gap-1 rounded-full border border-border bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-8 text-muted-foreground">
            Nessun evento da mostrare.
          </p>
        )}
      </div>
    </div>
  );
}
