import Image from "next/image";
import Link from "next/link";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getEventDisplayStatus, getNextUpcomingEvent, type EventRow } from "@/lib/data/events";
import { getLatestNews } from "@/lib/data/news";

export const revalidate = 60;

const MONTHS_SHORT = [
  "GEN", "FEB", "MAR", "APR", "MAG", "GIU",
  "LUG", "AGO", "SET", "OTT", "NOV", "DIC",
];

function EventDateBlock({ date }: { date: string }) {
  const d = new Date(date);
  return (
    <div className="shrink-0 text-center">
      <div className="font-mono text-4xl leading-none font-bold text-primary">
        {d.getDate()}
      </div>
      <div className="mt-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {MONTHS_SHORT[d.getMonth()]}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [content, nextEvent, latestNews] = await Promise.all([
    getPublishedSiteContent(),
    getNextUpcomingEvent(),
    getLatestNews(3),
  ]);

  return (
    <div>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center">
          <Image
            src="/stemma.png"
            alt=""
            aria-hidden="true"
            width={104}
            height={104}
            priority
            className="h-20 w-20 shrink-0 sm:h-26 sm:w-26"
          />
          <div>
            <p className="font-mono text-xs tracking-widest text-primary-foreground/80 uppercase">
              Società di pesca sportiva
            </p>
            <h1 className="mt-2 font-heading text-[clamp(1.75rem,6vw,2.5rem)] leading-tight font-bold">
              ASD La Spotornese
            </h1>
            <p className="mt-4 max-w-2xl whitespace-pre-line text-primary-foreground/80">
              {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <section className="md:col-span-2">
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Prossimo evento
            </h2>
            {nextEvent ? (
              <EventPreviewCard event={nextEvent} />
            ) : (
              <p className="mt-3 border border-border p-6 text-sm text-muted-foreground">
                Nessun evento in programma al momento.
              </p>
            )}
            <Link href="/eventi" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Vedi tutti gli eventi →
            </Link>
          </section>

          <section>
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Ultime news
            </h2>
            {latestNews.length > 0 ? (
              <ul className="mt-3 flex flex-col divide-y divide-border border-t border-border">
                {latestNews.map((item) => (
                  <li key={item.id} className="py-3">
                    <Link href={`/news/${item.slug}`} className="text-card-foreground hover:underline">
                      {item.title}
                    </Link>
                    {item.featured && (
                      <span className="ml-2 text-xs font-semibold tracking-wide text-accent uppercase">
                        In evidenza
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nessuna comunicazione al momento.
              </p>
            )}
            <Link href="/news" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Vedi tutte le news →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function EventPreviewCard({ event }: { event: EventRow }) {
  return (
    <Link
      href={`/eventi/${event.slug}`}
      className="mt-3 flex gap-5 border border-border p-6 transition-colors hover:border-primary"
    >
      <EventDateBlock date={event.event_date} />
      <div className="border-l border-border pl-5">
        <p className="font-heading text-lg font-semibold text-card-foreground">{event.title}</p>
        {(event.event_time || event.location) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {event.event_time && `ore ${event.event_time.slice(0, 5)}`}
            {event.event_time && event.location && " · "}
            {event.location}
          </p>
        )}
        <div className="mt-3">
          <EventStatusBadge status={getEventDisplayStatus(event)} />
        </div>
      </div>
    </Link>
  );
}
