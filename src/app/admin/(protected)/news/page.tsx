import Link from "next/link";
import { getAdminNews } from "@/lib/data/news";
import { deleteNews } from "@/actions/news";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function AdminNewsPage() {
  const news = await getAdminNews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">News</h1>
        <Link
          href="/admin/news/new"
          className="rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Nuova news
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {news.map((item) => (
          <li
            key={item.id}
            className="-mx-2 flex items-center justify-between gap-4 px-2 py-3 transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">
                {item.title}{" "}
                {!item.published && (
                  <span className="text-xs text-muted-foreground">
                    (bozza)
                  </span>
                )}
                {item.featured && (
                  <span className="text-xs text-muted-foreground">
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
                <SubmitButton className="text-red-600 hover:underline">
                  Elimina
                </SubmitButton>
              </form>
            </div>
          </li>
        ))}
        {news.length === 0 && (
          <li className="py-3 text-muted-foreground">
            Nessuna news creata.
          </li>
        )}
      </ul>
    </div>
  );
}
