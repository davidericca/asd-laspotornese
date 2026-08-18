import Link from "next/link";
import { getAllNewsAdmin } from "@/lib/data/news";
import { deleteNews } from "@/actions/news";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { Badge } from "@/components/ui/Badge";
import { formatDateTimeIT } from "@/lib/utils";

export default async function AdminNewsPage() {
  const news = await getAllNewsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-900">News</h1>
        <Link
          href="/admin/news/nuovo"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          + Nuova news
        </Link>
      </div>

      {news.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Nessuna news pubblicata. Inizia creandone una nuova.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Titolo</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">In evidenza</th>
                <th className="px-5 py-3 font-medium">Pubblicato</th>
                <th className="px-5 py-3 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.map((n) => (
                <tr key={n.id}>
                  <td className="px-5 py-3.5 font-medium text-primary-950">{n.title}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDateTimeIT(n.published_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    {n.featured && (
                      <Badge className="bg-accent-100 text-accent-800">In evidenza</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {n.published ? "Sì" : "Bozza"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/news/${n.id}`}
                        className="text-xs font-medium text-secondary-700 hover:underline"
                      >
                        Modifica
                      </Link>
                      <DeleteButton
                        action={deleteNews.bind(null, n.id)}
                        confirmMessage={`Eliminare la news "${n.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
