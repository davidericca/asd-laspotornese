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
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Nuova galleria
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {galleries.map((gallery) => (
          <li key={gallery.id} className="py-3">
            <Link href={`/admin/galleries/${gallery.id}`} className="hover:underline">
              {gallery.title}
            </Link>
          </li>
        ))}
        {galleries.length === 0 && (
          <li className="py-3 text-muted-foreground">
            Nessuna galleria creata.
          </li>
        )}
      </ul>
    </div>
  );
}
