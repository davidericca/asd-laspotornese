import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SITE } from "@/lib/constants";
import { getContactInfo } from "@/lib/data/site-content";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatta la ${SITE.name}: indirizzo, telefono, email e social.`,
};

export default async function ContattiPage() {
  const contact = await getContactInfo();
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    contact.mapLng - 0.01
  }%2C${contact.mapLat - 0.01}%2C${contact.mapLng + 0.01}%2C${
    contact.mapLat + 0.01
  }&layer=mapnik&marker=${contact.mapLat}%2C${contact.mapLng}`;

  return (
    <>
      <PageHero
        eyebrow="Parliamone"
        title="Contatti"
        subtitle="Scrivici o passa a trovarci: saremo felici di darti il benvenuto."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <ContactCard icon="📍" label="Indirizzo">
              {contact.address}
              <br />
              {contact.city}
            </ContactCard>
            <ContactCard icon="✉️" label="Email">
              <a href={`mailto:${contact.email}`} className="hover:text-secondary-700">
                {contact.email}
              </a>
            </ContactCard>
            <ContactCard icon="📞" label="Telefono">
              <a href={`tel:${contact.phone}`} className="hover:text-secondary-700">
                {contact.phone}
              </a>
            </ContactCard>
            <ContactCard icon="🪪" label="Dati societari">
              {contact.vatOrFiscalCode}
            </ContactCard>

            <div className="rounded-2xl border border-slate-200 bg-primary-50/60 p-6">
              <p className="text-sm text-slate-600">
                Seguici anche sui nostri canali social per non perderti
                eventi, gare e aggiornamenti.
              </p>
              <div className="mt-4 flex gap-3 text-sm font-medium text-secondary-700">
                <a
                  href={contact.social.facebook.startsWith("[") ? "#" : contact.social.facebook}
                  className="hover:underline"
                >
                  Facebook
                </a>
                <a
                  href={contact.social.instagram.startsWith("[") ? "#" : contact.social.instagram}
                  className="hover:underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="h-full min-h-[400px] overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                title="Mappa della sede"
                src={mapSrc}
                className="h-full min-h-[400px] w-full"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Posizione indicativa — sarà aggiornata con l&apos;indirizzo
              esatto della sede.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

function ContactCard({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-lg">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-slate-700">{children}</p>
      </div>
    </div>
  );
}
