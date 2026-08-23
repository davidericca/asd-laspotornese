import Link from "next/link";
import { getAdminGalleries } from "@/lib/data/galleries";

export default async function AdminGalleriesPage() {
  const galleries = await getAdminGalleries();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallerie</h1>
        <Link
          href="/admin/galleries/new"
          className="rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Nuova galleria
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/10">
        {galleries.map((gallery) => (
          <li key={gallery.id} className="py-3">
            <Link href={`/admin/galleries/${gallery.id}`} className="hover:underline">
              {gallery.title}
            </Link>
          </li>
        ))}
        {galleries.length === 0 && (
          <li className="py-3 text-black/60 dark:text-white/60">
            Nessuna galleria creata.
          </li>
        )}
      </ul>
    </div>
  );
}
