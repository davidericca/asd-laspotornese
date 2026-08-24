import Link from "next/link";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getEventDisplayStatus, getNextUpcomingEvent, type EventRow } from "@/lib/data/events";
import { getLatestNews, type NewsRow } from "@/lib/data/news";
import { getPublishedActivities } from "@/lib/data/activities";
import { getPublishedGalleries } from "@/lib/data/galleries";
import { cardClass } from "@/lib/ui";

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
  const [content, nextEvent, latestNews, activities, galleries] = await Promise.all([
    getPublishedSiteContent(),
    getNextUpcomingEvent(),
    getLatestNews(3),
    getPublishedActivities(),
    getPublishedGalleries(),
  ]);

  const previewActivities = activities.slice(0, 4);
  const galleryPreview = galleries.filter((g) => g.cover_image_url).slice(0, 6);
  const [featuredNews, ...restNews] = latestNews;
  const listedNews = featuredNews?.cover_image_url ? restNews : latestNews;
  const hasHeroPhoto = Boolean(content.home_hero_image_url);

  return (
    <div>
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-primary">
        {hasHeroPhoto && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.home_hero_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
          </>
        )}
        <div
          className={`relative mx-auto flex max-w-5xl flex-col px-6 ${
            hasHeroPhoto
              ? "min-h-[420px] justify-end pb-12 sm:min-h-[520px]"
              : "justify-center py-16 sm:py-20"
          }`}
        >
          <span className="inline-block w-fit rounded-xs border border-primary-foreground/35 bg-primary-foreground/10 px-3 py-1.5 font-mono text-xs tracking-widest text-primary-foreground uppercase">
            Società di pesca sportiva
          </span>
          <h1 className="mt-5 font-heading text-[clamp(2.2rem,6vw,3.5rem)] leading-[1.03] font-bold text-primary-foreground">
            ASD La Spotornese
          </h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-primary-foreground/85">
            {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/attivita"
              className="rounded-xs bg-accent px-5 py-2.5 font-medium text-accent-foreground transition hover:opacity-90"
            >
              Scopri le attività
            </Link>
            <Link
              href="/eventi"
              className="rounded-xs border-2 border-primary-foreground/70 px-5 py-2.5 font-medium text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              Prossimi eventi
            </Link>
          </div>
        </div>
      </div>

      {/* Prossimo evento + news */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <section className="flex flex-col md:col-span-2">
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Prossimo evento
            </h2>
            <div className="flex-1">
              {nextEvent ? (
                <EventPreviewCard event={nextEvent} />
              ) : (
                <p className={`mt-4 p-6 text-sm text-muted-foreground ${cardClass}`}>
                  Nessun evento in programma al momento.
                </p>
              )}
            </div>
            <Link href="/eventi" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Vedi tutti gli eventi →
            </Link>
          </section>

          <section className="flex flex-col">
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Ultime news
            </h2>
            <div className="flex-1">
              {latestNews.length > 0 ? (
                <div className="mt-4">
                  {featuredNews.cover_image_url && <FeaturedNewsCard item={featuredNews} />}
                  {listedNews.length > 0 && (
                    <ul className="flex flex-col divide-y divide-border border-t border-border">
                      {listedNews.map((item) => (
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
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nessuna comunicazione al momento.
                </p>
              )}
            </div>
            <Link href="/news" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Vedi tutte le news →
            </Link>
          </section>
        </div>
      </div>

      {/* Attività */}
      {previewActivities.length > 0 && (
        <div className="bg-muted">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Le nostre attività
            </h2>
            <div className="mt-4 flex flex-col">
              {previewActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-5 border-b border-border py-5 ${
                    index === 0 ? "border-t border-primary" : ""
                  }`}
                >
                  <span className="w-10 shrink-0 font-mono text-xl font-bold text-border">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-card-foreground">
                      {activity.title}
                    </h3>
                    {activity.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  {activity.cover_image_url && (
                    <div className="hidden h-20 w-28 shrink-0 overflow-hidden bg-background sm:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activity.cover_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link href="/attivita" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
              Scopri tutte le attività →
            </Link>
          </div>
        </div>
      )}

      {/* Galleria */}
      {galleryPreview.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 py-12 pb-16">
          <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Galleria fotografica
          </h2>
          <div className="mt-6 columns-2 gap-4 sm:columns-3 sm:gap-6">
            {galleryPreview.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/galleria/${gallery.id}`}
                className="group mb-4 block break-inside-avoid overflow-hidden bg-muted sm:mb-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery.cover_image_url!}
                  alt={gallery.title}
                  className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <p className="mt-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {gallery.title}
                </p>
              </Link>
            ))}
          </div>
          <Link href="/galleria" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Vedi tutta la galleria →
          </Link>
        </div>
      )}
    </div>
  );
}

function EventPreviewCard({ event }: { event: EventRow }) {
  return (
    <Link
      href={`/eventi/${event.slug}`}
      className={`group mt-4 flex flex-col overflow-hidden sm:flex-row ${cardClass}`}
    >
      {event.cover_image_url && (
        <div className="aspect-[16/10] bg-muted sm:aspect-auto sm:w-2/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-1 gap-5 p-6">
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
      </div>
    </Link>
  );
}

function FeaturedNewsCard({ item }: { item: NewsRow }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={`group mb-4 flex flex-col overflow-hidden ${cardClass}`}
    >
      <div className="aspect-[16/9] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cover_image_url!}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        {item.featured && (
          <span className="text-xs font-semibold tracking-wide text-accent uppercase">
            In evidenza
          </span>
        )}
        <p className="mt-1 font-heading font-semibold text-card-foreground group-hover:underline">
          {item.title}
        </p>
      </div>
    </Link>
  );
}
