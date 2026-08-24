import Link from "next/link";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getNextUpcomingEvent } from "@/lib/data/events";
import { getLatestNews } from "@/lib/data/news";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [content, nextEvent, latestNews] = await Promise.all([
    getPublishedSiteContent(),
    getNextUpcomingEvent(),
    getLatestNews(3),
  ]);

  return (
    <div>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="font-heading text-4xl font-semibold">ASD La Spotornese</h1>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-primary-foreground/80">
            {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Prossimo evento
            </h2>
            {nextEvent ? (
              <Link href={`/eventi/${nextEvent.slug}`} className="mt-3 block hover:underline">
                <p className="font-medium text-card-foreground">{nextEvent.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateIt(nextEvent.event_date)}
                  {nextEvent.location && ` · ${nextEvent.location}`}
                </p>
              </Link>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nessun evento in programma al momento.
              </p>
            )}
            <Link href="/eventi" className="mt-4 inline-block text-sm font-medium text-card-foreground hover:underline">
              Vedi tutti gli eventi →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ultime news
            </h2>
            {latestNews.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {latestNews.map((item) => (
                  <li key={item.id}>
                    <Link href={`/news/${item.slug}`} className="text-card-foreground hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nessuna comunicazione al momento.
              </p>
            )}
            <Link href="/news" className="mt-4 inline-block text-sm font-medium text-card-foreground hover:underline">
              Vedi tutte le news →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
