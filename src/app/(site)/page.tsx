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
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">ASD La Spotornese</h1>
      <p className="mt-4 max-w-2xl whitespace-pre-line text-black/60 dark:text-white/60">
        {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase text-black/40 dark:text-white/40">
            Prossimo evento
          </h2>
          {nextEvent ? (
            <Link
              href={`/eventi/${nextEvent.slug}`}
              className="mt-3 block rounded border border-black/10 p-4 hover:underline dark:border-white/10"
            >
              <p className="font-medium">{nextEvent.title}</p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDateIt(nextEvent.event_date)}
                {nextEvent.location && ` · ${nextEvent.location}`}
              </p>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-black/60 dark:text-white/60">
              Nessun evento in programma al momento.
            </p>
          )}
          <Link href="/eventi" className="mt-3 inline-block text-sm hover:underline">
            Vedi tutti gli eventi →
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-black/40 dark:text-white/40">
            Ultime news
          </h2>
          {latestNews.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {latestNews.map((item) => (
                <li key={item.id}>
                  <Link href={`/news/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-black/60 dark:text-white/60">
              Nessuna comunicazione al momento.
            </p>
          )}
          <Link href="/news" className="mt-3 inline-block text-sm hover:underline">
            Vedi tutte le news →
          </Link>
        </div>
      </div>
    </div>
  );
}
