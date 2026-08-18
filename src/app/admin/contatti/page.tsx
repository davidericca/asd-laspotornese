import { ContattiForm } from "@/components/admin/forms/ContattiForm";
import { getContactInfo } from "@/lib/data/site-content";

export default async function AdminContattiPage() {
  const contact = await getContactInfo();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary-900">Contatti</h1>
      <p className="mt-1 text-sm text-slate-500">
        Queste informazioni vengono mostrate nel footer, nella Home e nella
        pagina Contatti del sito.
      </p>
      <div className="mt-8">
        <ContattiForm contact={contact} />
      </div>
    </div>
  );
}
