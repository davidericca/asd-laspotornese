import type { Metadata } from "next";
import { EnvelopeSimple, IdentificationCard, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { cardClass } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "Storia e valori dell'ASD La Spotornese.",
};

export default async function ChiSiamoPage() {
  const content = await getPublishedSiteContent();
  const hasInfo =
    content.contatti_indirizzo ||
    content.cf_piva ||
    content.contatti_email ||
    content.contatti_telefono;

  return (
    <>
      <PageHeader title="Chi siamo" />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="leading-relaxed whitespace-pre-line text-foreground">
              {content.chi_siamo || "[INSERIRE storia e valori dell'associazione]"}
            </p>
          </div>

          {hasInfo && (
            <div className={`h-fit p-6 ${cardClass}`}>
              <h2 className="font-heading font-semibold text-card-foreground">
                Informazioni societarie
              </h2>
              <dl className="mt-4 flex flex-col gap-4 text-sm">
                {content.contatti_indirizzo && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin size={16} aria-hidden="true" />
                      Sede
                    </dt>
                    <dd className="mt-0.5 text-card-foreground">{content.contatti_indirizzo}</dd>
                  </div>
                )}
                {content.cf_piva && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <IdentificationCard size={16} aria-hidden="true" />
                      Codice Fiscale / P.IVA
                    </dt>
                    <dd className="mt-0.5 text-card-foreground">{content.cf_piva}</dd>
                  </div>
                )}
                {content.contatti_email && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <EnvelopeSimple size={16} aria-hidden="true" />
                      Email
                    </dt>
                    <dd className="mt-0.5 text-card-foreground">{content.contatti_email}</dd>
                  </div>
                )}
                {content.contatti_telefono && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone size={16} aria-hidden="true" />
                      Telefono
                    </dt>
                    <dd className="mt-0.5 text-card-foreground">{content.contatti_telefono}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
