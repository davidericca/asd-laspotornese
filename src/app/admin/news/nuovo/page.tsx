import { NewsForm } from "@/components/admin/forms/NewsForm";

export default function NuovaNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary-900">Nuova news</h1>
      <p className="mt-1 text-sm text-slate-500">
        Scrivi la comunicazione: potrai aggiungere allegati dopo il salvataggio.
      </p>
      <div className="mt-8">
        <NewsForm />
      </div>
    </div>
  );
}
