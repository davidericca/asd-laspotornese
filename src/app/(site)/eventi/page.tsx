import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedEvents } from "@/lib/data/events";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export default async function EventiPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <PageHeader title="Eventi" description="Calendario di eventi e gare." />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {events.map((event) => (
            <li key={event.id} className="py-4">
              <Link href={`/eventi/${event.slug}`} className="font-medium hover:underline">
                {event.title}
              </Link>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDateIt(event.event_date)}
                {event.location && ` · ${event.location}`}
              </p>
            </li>
          ))}
          {events.length === 0 && (
            <li className="py-4 text-black/60 dark:text-white/60">
              Nessun evento in programma al momento.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
