import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedNews } from "@/lib/data/news";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "Comunicazioni e novità dall'ASD La Spotornese.",
};

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <>
      <PageHeader title="News" description="Comunicazioni dell'associazione." />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <ul className="flex flex-col gap-3">
          {news.map((item) => (
            <li key={item.id}>
              <Link
                href={`/news/${item.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <p className="font-medium text-card-foreground group-hover:underline">
                  {item.title}
                  {item.featured && (
                    <span className="ml-2 inline-flex items-center gap-1 align-middle text-xs font-semibold uppercase tracking-wide text-accent dark:text-muted-foreground">
                      <Sparkle size={12} weight="fill" aria-hidden="true" />
                      In evidenza
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateIt(item.created_at)}
                </p>
              </Link>
            </li>
          ))}
          {news.length === 0 && (
            <li className="py-4 text-muted-foreground">
              Nessuna comunicazione al momento.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
