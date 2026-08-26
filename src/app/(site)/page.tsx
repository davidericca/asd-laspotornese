import Link from "next/link";
import { NextEventCard } from "@/components/site/NextEventCard";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getNextUpcomingEvent } from "@/lib/data/events";
import { getLatestNews, type NewsRow } from "@/lib/data/news";
import { getPublishedActivities, type ActivityRow } from "@/lib/data/activities";
import { getPublishedGalleries } from "@/lib/data/galleries";
import { getActivityStyle } from "@/lib/activity-style";
import { cardClass } from "@/lib/ui";
import { formatDateIt, excerptOf } from "@/lib/utils";
import { colorClass, fontClass, heroTitleSizeClass, bodyTextSizeClass } from "@/lib/text-style-presets";

export const revalidate = 60;

export default async function HomePage() {
  const [content, nextEvent, latestNews, activities, galleries] = await Promise.all([
    getPublishedSiteContent(),
    getNextUpcomingEvent(),
    getLatestNews(3),
    getPublishedActivities(),
    getPublishedGalleries(),
  ]);

  const previewActivities = activities.slice(0, 4);
  const galleryPreview = galleries.filter((g) => g.cover_image_url).slice(0, 3);
  const hasHeroPhoto = Boolean(content.home_hero_image_url);
  const heroTitleLines = (content.home_hero_title || "ASD LA\nSPOTORNESE").split("\n");
  const heroTitleClass = [
    fontClass(content.home_hero_title_font, "titolo"),
    heroTitleSizeClass(content.home_hero_title_size),
  ].join(" ");
  const heroTitleColor1 = colorClass(content.home_hero_title_color || "bianco");
  const heroTitleColor2 = colorClass(content.home_hero_title_color_2 || "arancione");
  const heroIntroClass = [
    fontClass(content.home_intro_font, "testo"),
    bodyTextSizeClass(content.home_intro_size),
    colorClass(content.home_intro_color || "bianco"),
  ].join(" ");

  return (
    <div>
      {/* Hero */}
      <div className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden bg-primary sm:aspect-[2.6/1] sm:min-h-[420px] sm:max-h-[640px]">
        {hasHeroPhoto && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.home_hero_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: content.home_hero_image_position || "50% 50%" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,34,48,0.88)_0%,rgba(11,34,48,0.35)_32%,transparent_58%)]" />
          </>
        )}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 sm:pb-20">
          <h1 className={`leading-[0.94] font-extrabold text-wrap-balance ${heroTitleClass}`}>
            {heroTitleLines.map((line, i) => (
              <span
                key={i}
                className={`block ${i === heroTitleLines.length - 1 ? heroTitleColor2 : heroTitleColor1}`}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className={`mt-3 max-w-md whitespace-pre-line ${heroIntroClass}`}>
            {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
          </p>
          <div className="mt-5">
            <Link
              href="/chi-siamo"
              className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold tracking-wide text-accent-foreground uppercase transition hover:opacity-90 active:scale-[0.97]"
            >
              Scopri la società →
            </Link>
          </div>
        </div>
      </div>

      {/* Prossimo evento — fuso con l'hero */}
      {nextEvent && (
        <div className="bg-primary">
          <NextEventCard event={nextEvent} className="mx-auto max-w-5xl px-6 py-8" showDetailsLink />
        </div>
      )}

      {/* Attività */}
      {previewActivities.length > 0 && (
        <div className="py-14">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
              Le nostre attività
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground uppercase sm:text-3xl">
              Viviamo il mare, tutto l&apos;anno
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

      {/* Galleria */}
      {galleryPreview.length > 0 && (
        <div className="bg-primary py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
                  Galleria
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-primary-foreground uppercase sm:text-3xl">
                  I nostri momenti
                </h2>
              </div>
              <Link href="/galleria" className="text-sm font-bold whitespace-nowrap text-accent">
                Vedi tutta la galleria →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {galleryPreview.map((gallery) => (
                <Link
                  key={gallery.id}
                  href={`/galleria/${gallery.id}`}
                  className={`group block overflow-hidden ${cardClass}`}
                >
                  <div className="aspect-[16/10] bg-primary-hover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gallery.cover_image_url!}
                      alt={gallery.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      style={{ objectPosition: gallery.cover_image_position || "50% 50%" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
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
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground uppercase sm:text-3xl">
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
  const { accent, Icon } = getActivityStyle(index);
  return (
    <div className={first ? "" : "sm:border-l sm:border-border sm:pl-6"}>
      <div className={`font-mono text-2xl font-bold ${accent}`}>{String(index + 1).padStart(2, "0")}</div>
      <Icon size={24} className={`mt-2 ${accent} opacity-80`} aria-hidden="true" />
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
            style={{ objectPosition: item.cover_image_position || "50% 50%" }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="font-mono text-xs text-muted-foreground">{formatDateIt(item.created_at)}</span>
        <p className="font-heading font-semibold text-card-foreground group-hover:underline">
          {item.title}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{excerptOf(item.body, 100)}</p>
        {item.featured && (
          <span className="text-xs font-semibold tracking-wide text-accent uppercase">In evidenza</span>
        )}
        <span className="mt-auto pt-1 text-xs font-bold text-accent">Leggi l&apos;articolo →</span>
      </div>
    </Link>
  );
}
