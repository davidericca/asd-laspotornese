import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/constants";
import { getSiteContent, getContactInfo } from "@/lib/data/site-content";

export const metadata: Metadata = {
  title: "La Società",
  description: `Storia, valori e missione della ${SITE.name}.`,
};

export default async function LaSocietaPage() {
  const [aboutText, mission, contact] = await Promise.all([
    getSiteContent("about_text", SITE.aboutText),
    getSiteContent("mission_text", SITE.mission),
    getContactInfo(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title="La Società"
        subtitle="Passione per il mare, tradizione sportiva e spirito di squadra."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading title="La nostra storia" />
            <div className="prose prose-slate mt-6 max-w-none whitespace-pre-line text-slate-700">
              {aboutText}
            </div>

            <SectionHeading title="La nostra missione" />
            <p className="mt-6 whitespace-pre-line text-slate-700">
              {mission}
            </p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-primary-50/60 p-6">
              <h3 className="font-display font-semibold text-primary-950">
                Informazioni societarie
              </h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-500">Sede</dt>
                  <dd>
                    {contact.address}, {contact.city}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">
                    Codice Fiscale / P.IVA
                  </dt>
                  <dd>{contact.vatOrFiscalCode}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Email</dt>
                  <dd>{contact.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Telefono</dt>
                  <dd>{contact.phone}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
