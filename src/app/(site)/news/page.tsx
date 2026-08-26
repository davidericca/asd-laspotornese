import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedNews, type NewsRow } from "@/lib/data/news";
import { formatDateIt } from "@/lib/utils";
import { cardClass } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "Comunicazioni e novità dall'ASD La Spotornese.",
};

function excerptOf(body: string, length = 140) {
  if (body.length <= length) return body;
  return body.slice(0, length).trimEnd() + "…";
}

function NewsCard({ item }: { item: NewsRow }) {
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
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {formatDateIt(item.created_at)}
          </span>
          {item.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              <Sparkle size={12} weight="fill" aria-hidden="true" />
              In evidenza
            </span>
          )}
        </div>
        <p className="font-heading font-semibold text-card-foreground group-hover:underline">
          {item.title}
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">{excerptOf(item.body)}</p>
        <span className="mt-auto pt-2 text-sm font-medium text-primary">Leggi tutto →</span>
      </div>
    </Link>
  );
}

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <>
      <PageHeader
        title="News"
        eyebrow="Comunicazioni"
        description="Tutte le novità e gli aggiornamenti della società."
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
        {news.length === 0 && (
          <p className="text-muted-foreground">Nessuna comunicazione al momento.</p>
        )}
      </div>
    </>
  );
}
