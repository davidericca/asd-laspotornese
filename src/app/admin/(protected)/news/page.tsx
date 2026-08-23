import Link from "next/link";
import { getAdminNews } from "@/lib/data/news";
import { deleteNews } from "@/actions/news";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function AdminNewsPage() {
  const news = await getAdminNews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News</h1>
        <Link
          href="/admin/news/new"
          className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Nuova news
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/10">
        {news.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">
                {item.title}{" "}
                {!item.published && (
                  <span className="text-xs text-black/40 dark:text-white/40">
                    (bozza)
                  </span>
                )}
                {item.featured && (
                  <span className="text-xs text-black/40 dark:text-white/40">
                    {" "}
                    &middot; in evidenza
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/news/${item.id}`} className="hover:underline">
                Modifica
              </Link>
              <form action={deleteNews.bind(null, item.id)}>
                <SubmitButton className="text-red-600 hover:underline dark:text-red-400">
                  Elimina
                </SubmitButton>
              </form>
            </div>
          </li>
        ))}
        {news.length === 0 && (
          <li className="py-3 text-black/60 dark:text-white/60">
            Nessuna news creata.
          </li>
        )}
      </ul>
    </div>
  );
}
