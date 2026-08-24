import { getAdminSiteContent } from "@/lib/data/site-content";
import { updateSiteContent } from "@/actions/site-content";
import { SubmitButton } from "@/components/ui/SubmitButton";

const fieldClass =
  "rounded border border-border bg-transparent px-3 py-2";

export default async function AdminContentPage() {
  const content = await getAdminSiteContent();

  return (
    <div>
      <h1 className="text-2xl font-bold">Testi del sito</h1>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
        Le attività ora si gestiscono da &quot;Gestisci attività&quot; nella dashboard, una scheda per volta.
      </p>
      <form action={updateSiteContent} className="mt-6 flex max-w-lg flex-col gap-6">
        <label className="flex flex-col gap-1 text-sm">
          Home &mdash; presentazione
          <textarea
            name="home_intro"
            rows={3}
            defaultValue={content.home_intro}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Chi siamo
          <textarea
            name="chi_siamo"
            rows={6}
            defaultValue={content.chi_siamo}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; indirizzo
          <input
            type="text"
            name="contatti_indirizzo"
            defaultValue={content.contatti_indirizzo}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; telefono
          <input
            type="text"
            name="contatti_telefono"
            defaultValue={content.contatti_telefono}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; email
          <input
            type="email"
            name="contatti_email"
            defaultValue={content.contatti_email}
            className={fieldClass}
          />
        </label>
        <SubmitButton className="self-start rounded bg-primary px-4 py-2 text-primary-foreground">
          Salva
        </SubmitButton>
      </form>
    </div>
  );
}
