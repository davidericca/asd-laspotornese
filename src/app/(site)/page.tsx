import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/events/EventCard";
import { NewsCard } from "@/components/news/NewsCard";
import { getUpcomingEvents } from "@/lib/data/events";
import { getLatestNews } from "@/lib/data/news";
import { getRecentImages, fetchImageById } from "@/lib/data/galleries";
import { getSiteContent, getContactInfo } from "@/lib/data/site-content";
import { ACTIVITIES_PLACEHOLDER, SITE } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const [upcomingEvents, latestNews, recentImages, heroSubtitle, contact] =
    await Promise.all([
      getUpcomingEvents(3),
      getLatestNews(3),
      getRecentImages(8),
      getSiteContent(
        "home_hero_subtitle",
        SITE.shortDescription
      ),
      getContactInfo(),
    ]);

  const supabase = await createClient();
  const eventCovers = await Promise.all(
    upcomingEvents.map((e) => fetchImageById(supabase, e.cover_image_id))
  );
  const newsCovers = await Promise.all(
    latestNews.map((n) => fetchImageById(supabase, n.cover_image_id))
  );

  return (
    <>
      <Hero subtitle={heroSubtitle} />

      {/* Attività */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Cosa facciamo"
            title="Le nostre attività"
            description="La ASD La Spotornese promuove la pesca sportiva in tutte le sue forme, tra tradizione, competizione e tutela dell'ambiente marino."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIVITIES_PLACEHOLDER.map((activity) => (
              <div
                key={activity.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
                  <ActivityIcon icon={activity.icon} />
                </div>
                <h3 className="mt-4 font-display font-semibold text-primary-950">
                  {activity.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/attivita" variant="ghost">
              Tutte le attività →
            </Button>
          </div>
        </Container>
      </section>

      {/* Prossimi eventi */}
      <section className="bg-primary-50/60 py-14 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Non perderteli"
              title="Prossimi eventi & gare"
            />
            <Button href="/eventi" variant="ghost">
              Vedi tutti gli eventi →
            </Button>
          </div>

          {upcomingEvents.length === 0 ? (
            <EmptyState message="Nessun evento in programma al momento. Torna a trovarci presto!" />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  coverUrl={eventCovers[i]?.url}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Ultime news */}
      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Restiamo in contatto" title="Ultime news" />
            <Button href="/news" variant="ghost">
              Tutte le news →
            </Button>
          </div>

          {latestNews.length === 0 ? (
            <EmptyState message="Nessuna comunicazione pubblicata al momento." />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news, i) => (
                <NewsCard key={news.id} news={news} coverUrl={newsCovers[i]?.url} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Anteprima galleria */}
      <section className="bg-primary-950 py-14 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary-300">
                In immagini
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Galleria fotografica
              </h2>
            </div>
            <Button href="/galleria" variant="outline">
              Vedi la galleria completa →
            </Button>
          </div>

          {recentImages.length === 0 ? (
            <p className="mt-10 text-primary-200">
              Le fotografie delle nostre attività saranno pubblicate qui a
              breve.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {recentImages.slice(0, 8).map((image) => (
                <Link
                  key={image.id}
                  href="/galleria"
                  className="group relative block aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.url}
                    alt={image.alt_text || image.title || "Fotografia"}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Contatti */}
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Vieni a trovarci"
              title="Contatti"
              description="Per informazioni su iscrizioni, eventi o per qualsiasi domanda, siamo a tua disposizione."
            />
            <ul className="mt-8 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                  📍
                </span>
                <span>
                  {contact.address}
                  <br />
                  {contact.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                  ✉️
                </span>
                <a href={`mailto:${contact.email}`} className="hover:text-secondary-700">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                  📞
                </span>
                <a href={`tel:${contact.phone}`} className="hover:text-secondary-700">
                  {contact.phone}
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/contatti" variant="secondary">
                Vai alla pagina contatti
              </Button>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {/* Sostituita con mappa reale nella pagina Contatti */}
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Mappa disponibile nella pagina Contatti
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}

function ActivityIcon({ icon }: { icon: string }) {
  const paths: Record<string, string> = {
    anchor:
      "M12 3v9m0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v9m-7-5a7 7 0 0 0 14 0M5 7l-2 2m16-2 2 2",
    trophy:
      "M8 4h8v4a4 4 0 0 1-8 0V4Zm-4 0h4v2a4 4 0 0 1-4-4Zm16 0h-4v2a4 4 0 0 0 4-4ZM9 16h6l1 4H8l1-4Z",
    users:
      "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 2c2.7 0 5 1.6 5 3.5V19h-6v-2.5c0-.9-.3-1.7-.9-2.4.6-.1 1.2-.1 1.9-.1Zm-8 0c.7 0 1.3 0 1.9.1-.6.7-.9 1.5-.9 2.4V19H3v-2.5C3 14.6 5.3 13 8 13Z",
    waves:
      "M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon] ?? paths.waves} />
    </svg>
  );
}
