"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import type { EventRow } from "@/lib/types";
import { cn, getEffectiveStatus } from "@/lib/utils";

type Filter = "prossimo" | "concluso" | "tutti";
type View = "elenco" | "calendario";

export function EventsExplorer({
  events,
  covers,
}: {
  events: EventRow[];
  covers: Record<string, string | null | undefined>;
}) {
  const [filter, setFilter] = useState<Filter>("prossimo");
  const [view, setView] = useState<View>("elenco");

  const filtered = useMemo(() => {
    if (filter === "tutti") return events;
    return events.filter((e) => getEffectiveStatus(e) === filter);
  }, [events, filter]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          {(
            [
              ["prossimo", "Prossimi"],
              ["concluso", "Conclusi"],
              ["tutti", "Tutti"],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                filter === value
                  ? "bg-primary-900 text-white"
                  : "text-slate-500 hover:text-primary-900"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 self-start">
          {(
            [
              ["elenco", "Elenco"],
              ["calendario", "Calendario"],
            ] as [View, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                view === value
                  ? "bg-secondary-600 text-white"
                  : "text-slate-500 hover:text-secondary-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {view === "calendario" ? (
          <EventsCalendar events={filtered} />
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nessun evento in questa categoria al momento.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} coverUrl={covers[event.id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
