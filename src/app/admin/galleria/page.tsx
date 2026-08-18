import Link from "next/link";
import { getGalleriesWithCover } from "@/lib/data/galleries";
import { formatDateTimeIT } from "@/lib/utils";

export default async function AdminGalleriaPage() {
  const galleries = await getGalleriesWithCover();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-900">
          Gallerie & Immagini
        </h1>
        <Link
          href="/admin/galleria/nuova"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          + Carica immagini
        </Link>
      </div>

      {galleries.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Nessuna galleria creata. Inizia creandone una nuova.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((g) => (
            <Link
              key={g.id}
              href={`/admin/galleria/${g.id}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              <div className="relative h-36 w-full bg-slate-100">
                {(g.cover_image?.url ?? g.images[0]?.url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.cover_image?.url ?? g.images[0]?.url}
                    alt={g.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-primary-950">{g.title}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {g.images.length} foto · {formatDateTimeIT(g.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
