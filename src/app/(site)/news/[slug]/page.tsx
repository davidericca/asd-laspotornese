import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsBySlug, getAllPublicNews } from "@/lib/data/news";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { formatDateTimeIT } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const news = await getAllPublicNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return {};

  return {
    title: news.title,
    description: news.excerpt || news.body.slice(0, 160),
    openGraph: news.cover_image
      ? { images: [{ url: news.cover_image.url }] }
      : undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news || !news.published) notFound();

  return (
    <article>
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden bg-primary-950">
        <SmartImage src={news.cover_image?.url} alt={news.title} className="opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent" />
        <Container className="relative flex h-full flex-col justify-end pb-10 text-white">
          {news.featured && (
            <Badge className="mb-4 w-fit bg-accent-500 text-white">
              In evidenza
            </Badge>
          )}
          <p className="text-sm text-primary-200">
            {formatDateTimeIT(news.published_at)}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold sm:text-4xl">
            {news.title}
          </h1>
        </Container>
      </div>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 lg:col-span-2">
            {news.body}
          </div>

          {news.attachments.length > 0 && (
            <aside>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="font-display font-semibold text-primary-950">
                  Allegati
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {news.attachments.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={a.url}
                        target="_blank"
                        className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 transition hover:border-secondary-300 hover:bg-secondary-50"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-secondary-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
                        </svg>
                        <span className="flex-1 truncate">{a.file_name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </Container>
    </article>
  );
}
