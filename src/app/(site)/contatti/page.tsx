import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { cardClass } from "@/lib/ui";

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
      <PageHeader title="Contatti" description="Come contattare l'associazione." />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <dl className={`flex flex-col gap-4 p-7 text-sm sm:max-w-sm ${cardClass}`}>
          {content.contatti_indirizzo && (
            <div>
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={16} aria-hidden="true" />
                Indirizzo
              </dt>
              <dd className="text-card-foreground">{content.contatti_indirizzo}</dd>
            </div>
          )}
          {content.contatti_telefono && (
            <div>
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <Phone size={16} aria-hidden="true" />
                Telefono
              </dt>
              <dd className="text-card-foreground">{content.contatti_telefono}</dd>
            </div>
          )}
          {content.contatti_email && (
            <div>
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <EnvelopeSimple size={16} aria-hidden="true" />
                Email
              </dt>
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
