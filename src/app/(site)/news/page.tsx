import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedNews } from "@/lib/data/news";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <>
      <PageHeader title="News" description="Comunicazioni dell'associazione." />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {news.map((item) => (
            <li key={item.id} className="py-4">
              <p className="font-medium">
                {item.title}
                {item.featured && (
                  <span className="ml-2 text-xs text-black/40 dark:text-white/40">
                    In evidenza
                  </span>
                )}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDateIt(item.created_at)}
              </p>
              <p className="mt-2 text-sm">{item.body}</p>
            </li>
          ))}
          {news.length === 0 && (
            <li className="py-4 text-black/60 dark:text-white/60">
              Nessuna comunicazione al momento.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
