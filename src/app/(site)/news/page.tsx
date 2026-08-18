import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { NewsCard } from "@/components/news/NewsCard";
import { getAllPublicNews } from "@/lib/data/news";
import { fetchImageById } from "@/lib/data/galleries";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "News",
  description: `News e comunicazioni ufficiali della ${SITE.name}.`,
};

export default async function NewsPage() {
  const news = await getAllPublicNews();
  const supabase = await createClient();

  const covers: Record<string, string | null | undefined> = {};
  await Promise.all(
    news.map(async (n) => {
      const img = await fetchImageById(supabase, n.cover_image_id);
      covers[n.id] = img?.url;
    })
  );

  const featured = news.filter((n) => n.featured);
  const others = news.filter((n) => !n.featured);

  return (
    <>
      <PageHero
        eyebrow="Comunicazioni"
        title="News"
        subtitle="Tutte le novità, gli aggiornamenti e le comunicazioni ufficiali della società."
      />
      <Container className="py-12 sm:py-16">
        {news.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nessuna comunicazione pubblicata al momento.
          </p>
        ) : (
          <div className="space-y-10">
            {featured.length > 0 && (
              <section>
                <h2 className="mb-6 font-display text-xl font-semibold text-primary-950">
                  In evidenza
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((n) => (
                    <NewsCard key={n.id} news={n} coverUrl={covers[n.id]} />
                  ))}
                </div>
              </section>
            )}
            <section>
              {featured.length > 0 && (
                <h2 className="mb-6 font-display text-xl font-semibold text-primary-950">
                  Tutte le news
                </h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((n) => (
                  <NewsCard key={n.id} news={n} coverUrl={covers[n.id]} />
                ))}
              </div>
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
