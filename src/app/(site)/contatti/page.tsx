import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";

export const revalidate = 60;

export default async function ContattiPage() {
  const content = await getPublishedSiteContent();
  const hasAddress = Boolean(content.contatti_indirizzo);

  return (
    <>
      <PageHeader title="Contatti" />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <dl className="flex flex-col gap-3 text-sm">
          {content.contatti_indirizzo && (
            <div>
              <dt className="text-black/60 dark:text-white/60">Indirizzo</dt>
              <dd>{content.contatti_indirizzo}</dd>
            </div>
          )}
          {content.contatti_telefono && (
            <div>
              <dt className="text-black/60 dark:text-white/60">Telefono</dt>
              <dd>{content.contatti_telefono}</dd>
            </div>
          )}
          {content.contatti_email && (
            <div>
              <dt className="text-black/60 dark:text-white/60">Email</dt>
              <dd>{content.contatti_email}</dd>
            </div>
          )}
        </dl>
        {!content.contatti_indirizzo &&
          !content.contatti_telefono &&
          !content.contatti_email && (
            <p className="text-black/60 dark:text-white/60">
              [INSERIRE indirizzo, email, telefono e mappa]
            </p>
          )}
        {hasAddress && (
          <iframe
            title="Mappa"
            className="mt-8 aspect-video w-full rounded"
            src={`https://www.google.com/maps?q=${encodeURIComponent(content.contatti_indirizzo)}&output=embed`}
            loading="lazy"
          />
        )}
      </div>
    </>
  );
}
