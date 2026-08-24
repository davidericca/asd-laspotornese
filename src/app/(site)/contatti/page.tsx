import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contatti",
  description: "Come contattare l'ASD La Spotornese.",
};

export default async function ContattiPage() {
  const content = await getPublishedSiteContent();
  const hasAddress = Boolean(content.contatti_indirizzo);

  return (
    <>
      <PageHeader title="Contatti" />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <dl className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 text-sm shadow-sm sm:max-w-sm">
          {content.contatti_indirizzo && (
            <div>
              <dt className="text-muted-foreground">Indirizzo</dt>
              <dd className="text-card-foreground">{content.contatti_indirizzo}</dd>
            </div>
          )}
          {content.contatti_telefono && (
            <div>
              <dt className="text-muted-foreground">Telefono</dt>
              <dd className="text-card-foreground">{content.contatti_telefono}</dd>
            </div>
          )}
          {content.contatti_email && (
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-card-foreground">{content.contatti_email}</dd>
            </div>
          )}
        </dl>
        {!content.contatti_indirizzo &&
          !content.contatti_telefono &&
          !content.contatti_email && (
            <p className="text-muted-foreground">
              [INSERIRE indirizzo, email, telefono e mappa]
            </p>
          )}
        {hasAddress && (
          <iframe
            title="Mappa"
            className="mt-8 aspect-video w-full rounded-lg border border-border"
            src={`https://www.google.com/maps?q=${encodeURIComponent(content.contatti_indirizzo)}&output=embed`}
            loading="lazy"
          />
        )}
      </div>
    </>
  );
}
