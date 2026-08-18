import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import type { NewsRow } from "@/lib/types";
import { formatDateTimeIT } from "@/lib/utils";

export function NewsCard({
  news,
  coverUrl,
  compact = false,
}: {
  news: NewsRow;
  coverUrl?: string | null;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={compact ? "relative h-40 w-full" : "relative h-52 w-full"}>
        <SmartImage
          src={coverUrl}
          alt={news.title}
          className="transition duration-500 group-hover:scale-105"
        />
        {news.featured && (
          <Badge className="absolute left-3 top-3 bg-accent-500 text-white shadow">
            In evidenza
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {formatDateTimeIT(news.published_at)}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-primary-950 group-hover:text-secondary-700">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {news.excerpt}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary-700">
          Leggi tutto
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 transition group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
