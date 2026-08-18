import { GalleryCreateForm } from "@/components/admin/forms/GalleryCreateForm";
import { getAllEventsAdmin } from "@/lib/data/events";

export default async function NuovaGalleriaPage() {
  const events = await getAllEventsAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary-900">
        Nuova galleria
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Crea prima la galleria: potrai caricare le foto subito dopo.
      </p>
      <div className="mt-8">
        <GalleryCreateForm events={events} />
      </div>
    </div>
  );
}
