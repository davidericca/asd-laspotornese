import Link from "next/link";
import { EventStatusBadge } from "@/components/ui/EventStatusBadge";
import { EventCountdown } from "@/components/site/EventCountdown";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getEventDisplayStatus, getNextUpcomingEvent } from "@/lib/data/events";
import { getLatestNews, type NewsRow } from "@/lib/data/news";
import { getPublishedActivities, type ActivityRow } from "@/lib/data/activities";
import { getPublishedGalleries } from "@/lib/data/galleries";
import { cardClass } from "@/lib/ui";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

const ACTIVITY_ACCENTS = ["text-accent", "text-accent-teal", "text-accent-gold", "text-accent"];
const FILMSTRIP_WEIGHTS = [0.75, 1.85, 1, 1, 0.75];

function ActivityIcon({ index, className }: { index: number; className?: string }) {
  const icons = [
    // barca
    <path key="boat" d="M3 18h18M5 18l1-7h12l1 7M8 11V6h8v5" strokeLinecap="round" strokeLinejoin="round" />,
    // pesce
    <path key="fish" d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6Z" strokeLinecap="round" strokeLinejoin="round" />,
    // trofeo
    <path
      key="trophy"
      d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM5 6H3v2a3 3 0 0 0 3 3M19 6h2v2a3 3 0 0 1-3 3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    // persone
    <path
      key="people"
      d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M17 8a3 3 0 1 0 0-6M22 21c0-3-1.8-5.5-4-6.4"
      strokeLinecap="round"
    />,
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      {index % icons.length === 3 && <circle cx="9" cy="8" r="3" stroke="currentColor" />}
      {icons[index % icons.length]}
    </svg>
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
  const galleryPreview = galleries.filter((g) => g.cover_image_url).slice(0, 5);
  const hasHeroPhoto = Boolean(content.home_hero_image_url);
  const eventDate = nextEvent ? new Date(nextEvent.event_date) : null;
  const eventCancelled = nextEvent && getEventDisplayStatus(nextEvent) === "annullato";

  return (
    <div>
      {/* Hero */}
      <div className="relative isolate min-h-[360px] overflow-hidden bg-primary sm:min-h-[400px]">
        {hasHeroPhoto && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.home_hero_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
          </>
        )}
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-10">
          <h1 className="font-heading text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.96] font-extrabold text-primary-foreground text-wrap-balance">
            <span className="block">ASD LA</span>
            <span className="block text-accent">SPOTORNESE</span>
          </h1>
          <p className="mt-3 max-w-md text-primary-foreground/85">
            {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
          </p>
          <div className="mt-5">
            <Link
              href="/attivita"
              className="inline-block rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90"
            >
              Scopri le attività →
            </Link>
          </div>
        </div>
      </div>

      {/* Prossimo evento — fuso con l'hero */}
      {nextEvent && eventDate && (
        <div className="bg-primary">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-y-4 px-6 py-5">
            <div className="flex items-center gap-5">
              <div className="shrink-0 rounded-xl border border-primary-foreground/25 px-6 py-3 text-center">
                <div className="font-mono text-3xl leading-none font-bold text-primary-foreground">
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
                <p className="font-mono text-[10px] tracking-widest text-accent uppercase">
                  Prossimo evento
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/eventi/${nextEvent.slug}`}
                    className="font-heading font-bold text-primary-foreground hover:underline"
                  >
                    {nextEvent.title}
                  </Link>
                  {eventCancelled && <EventStatusBadge status="annullato" />}
                </div>
                {(nextEvent.event_time || nextEvent.location) && (
                  <p className="text-xs text-primary-foreground/55">
                    {nextEvent.location}
                    {nextEvent.event_time && nextEvent.location && " · "}
                    {nextEvent.event_time && `ore ${nextEvent.event_time.slice(0, 5)}`}
                  </p>
                )}
                <Link href={`/eventi/${nextEvent.slug}`} className="inline-block text-xs font-bold text-accent">
                  Scopri i dettagli →
                </Link>
              </div>
            </div>
            <EventCountdown eventDate={nextEvent.event_date} eventTime={nextEvent.event_time} />
          </div>
        </div>
      )}

      {/* Attività */}
      {previewActivities.length > 0 && (
        <div className="py-14">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
              Le nostre attività
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Cosa facciamo tutto l&apos;anno
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-9 bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="h-px w-9 bg-border" />
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 px-6 sm:grid-cols-4 sm:gap-y-0">
            {previewActivities.map((activity, index) => (
              <ActivityColumn key={activity.id} activity={activity} index={index} first={index === 0} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/attivita" className="text-sm font-medium text-primary hover:underline">
              Scopri tutte le attività →
            </Link>
          </div>
        </div>
      )}

      {/* Galleria — filmstrip a piena larghezza */}
      {galleryPreview.length > 0 && (
        <div className="bg-primary py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
                  Galleria
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
                  I nostri momenti
                </h2>
              </div>
              <Link href="/galleria" className="text-sm font-bold whitespace-nowrap text-accent">
                Vedi tutta la galleria →
              </Link>
            </div>
          </div>
          <div className="mt-8 flex h-[240px] gap-1">
            {galleryPreview.map((gallery, index) => (
              <Link
                key={gallery.id}
                href={`/galleria/${gallery.id}`}
                className="group block h-full min-w-0 overflow-hidden"
                style={{ flexGrow: FILMSTRIP_WEIGHTS[index % FILMSTRIP_WEIGHTS.length] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery.cover_image_url!}
                  alt={gallery.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* News */}
      {latestNews.length > 0 && (
        <div className="py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
                  Ultime news
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Novità e comunicazioni
                </h2>
              </div>
              <Link href="/news" className="text-sm font-bold whitespace-nowrap text-primary hover:underline">
                Vedi tutte le news →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {latestNews.map((item) => (
                <NewsPreviewCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityColumn({
  activity,
  index,
  first,
}: {
  activity: ActivityRow;
  index: number;
  first: boolean;
}) {
  const accent = ACTIVITY_ACCENTS[index % ACTIVITY_ACCENTS.length];
  return (
    <div className={first ? "" : "sm:border-l sm:border-border sm:pl-6"}>
      <div className={`font-mono text-2xl font-bold ${accent}`}>{String(index + 1).padStart(2, "0")}</div>
      <ActivityIcon index={index} className={`mt-2 h-6 w-6 ${accent} opacity-80`} />
      <h3 className="mt-2 font-heading font-semibold text-card-foreground">{activity.title}</h3>
      {activity.description && (
        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{activity.description}</p>
      )}
      <Link href="/attivita" className="mt-2 inline-block text-xs font-bold text-accent">
        Scopri di più →
      </Link>
    </div>
  );
}

function NewsPreviewCard({ item }: { item: NewsRow }) {
  return (
    <Link href={`/news/${item.slug}`} className={`group flex flex-col overflow-hidden ${cardClass}`}>
      {item.cover_image_url && (
        <div className="aspect-[16/10] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="font-mono text-xs text-muted-foreground">{formatDateIt(item.created_at)}</span>
        <p className="font-heading font-semibold text-card-foreground group-hover:underline">
          {item.title}
        </p>
        {item.featured && (
          <span className="text-xs font-semibold tracking-wide text-accent uppercase">In evidenza</span>
        )}
        <span className="mt-auto pt-1 text-xs font-bold text-accent">Leggi l&apos;articolo →</span>
      </div>
    </Link>
  );
}
