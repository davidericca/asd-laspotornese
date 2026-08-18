import { EventForm } from "@/components/admin/forms/EventForm";
import { getAllGalleries } from "@/lib/data/galleries";

export default async function NuovoEventoPage() {
  const galleries = await getAllGalleries();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary-900">Nuovo evento</h1>
      <p className="mt-1 text-sm text-slate-500">
        Compila i campi principali: potrai aggiungere documenti dopo il salvataggio.
      </p>
      <div className="mt-8">
        <EventForm galleries={galleries} />
      </div>
    </div>
  );
}
