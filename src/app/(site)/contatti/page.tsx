import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";
import { getSocialLinks } from "@/lib/social-links";
import { cardClass } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contatti",
  description: "Come contattare l'ASD La Spotornese.",
};

export default async function ContattiPage() {
  const content = await getPublishedSiteContent();
  const hasAddress = Boolean(content.contatti_indirizzo);
  const hasAnyDetail =
    content.contatti_indirizzo || content.contatti_telefono || content.contatti_email;
  const hasMap = hasAddress || content.contatti_coordinate;
  const socialLinks = getSocialLinks(content);

  return (
    <>
      <PageHeader title="Contatti" description="Come contattare l'associazione." />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className={`grid gap-8 ${hasMap ? "lg:grid-cols-[360px_1fr]" : ""}`}>
          <dl className={`flex h-fit flex-col gap-4 p-7 text-sm ${cardClass}`}>
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
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 border-t border-border pt-4">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    <Icon size={20} weight="fill" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
            {!hasAnyDetail && (
              <p className="text-muted-foreground">[INSERIRE indirizzo, email, telefono e mappa]</p>
            )}
          </dl>
          {hasMap && (
            <iframe
              title="Mappa"
              className="aspect-video w-full rounded-lg border border-border lg:aspect-auto lg:h-full lg:min-h-[320px]"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                content.contatti_coordinate || content.contatti_indirizzo,
              )}&output=embed`}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </>
  );
}
