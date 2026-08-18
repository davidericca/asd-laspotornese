"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { it } from "date-fns/locale";
import type { EventRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDateIT, formatTimeIT } from "@/lib/utils";

export function EventsCalendar({ events }: { events: EventRow[] }) {
  const [month, setMonth] = useState(() => {
    const withUpcoming = events.find((e) => e.event_date >= todayISO());
    return startOfMonth(new Date(`${(withUpcoming ?? events[0])?.event_date ?? todayISO()}T00:00:00`));
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    events.forEach((e) => {
      const list = map.get(e.event_date) ?? [];
      list.push(e);
      map.set(e.event_date, list);
    });
    return map;
  }, [events]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold capitalize text-primary-950">
          {format(month, "MMMM yyyy", { locale: it })}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            aria-label="Mese precedente"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Mese successivo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-slate-400">
        {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate.get(iso) ?? [];
          const inMonth = isSameMonth(day, month);
          const selected = selectedDate === iso;

          return (
            <button
              key={iso}
              type="button"
              disabled={dayEvents.length === 0}
              onClick={() => setSelectedDate(selected ? null : iso)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition",
                !inMonth && "text-slate-300",
                inMonth && dayEvents.length === 0 && "text-slate-600",
                dayEvents.length > 0 &&
                  "cursor-pointer font-semibold text-secondary-800 hover:bg-secondary-50",
                selected && "bg-secondary-600 text-white hover:bg-secondary-600",
                isToday(day) && !selected && "ring-1 ring-inset ring-accent-400"
              )}
            >
              {format(day, "d")}
              {dayEvents.length > 0 && (
                <span
                  className={cn(
                    "mt-0.5 h-1.5 w-1.5 rounded-full",
                    selected ? "bg-white" : "bg-accent-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          <p className="text-sm font-medium text-slate-500">
            {formatDateIT(selectedDate, true)}
          </p>
          {selectedEvents.map((e) => (
            <Link
              key={e.id}
              href={`/eventi/${e.slug}`}
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-secondary-300 hover:bg-secondary-50/50"
            >
              <p className="font-semibold text-primary-950">{e.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatTimeIT(e.event_time) ?? "Orario da definire"}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
