import Link from "next/link";
import { getAdminGalleries } from "@/lib/data/galleries";

export default async function AdminGalleriesPage() {
  const galleries = await getAdminGalleries();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Gallerie</h1>
        <Link
          href="/admin/galleries/new"
          className="rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Nuova galleria
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {galleries.map((gallery) => (
          <li key={gallery.id}>
            <Link
              href={`/admin/galleries/${gallery.id}`}
              className="-mx-2 block px-2 py-3 transition-colors hover:bg-muted/50"
            >
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
