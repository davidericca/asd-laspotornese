import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { getPublishedSiteContent } from "@/lib/data/site-content";

const links = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/attivita", label: "Attività" },
  { href: "/eventi", label: "Eventi" },
  { href: "/news", label: "News" },
  { href: "/galleria", label: "Galleria" },
  { href: "/contatti", label: "Contatti" },
];

export async function Footer() {
  const content = await getPublishedSiteContent();
  const hasContactDetails =
    content.contatti_indirizzo || content.contatti_telefono || content.contatti_email;

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/stemma.png"
                alt=""
                aria-hidden="true"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="font-heading font-semibold text-foreground">
                ASD La Spotornese
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Società di pesca sportiva con sede a Spotorno.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Il sito
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Contatti
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground">
              {content.contatti_indirizzo && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{content.contatti_indirizzo}</span>
                </li>
              )}
              {content.contatti_telefono && (
                <li className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{content.contatti_telefono}</span>
                </li>
              )}
              {content.contatti_email && (
                <li className="flex items-center gap-2">
                  <EnvelopeSimple size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{content.contatti_email}</span>
                </li>
              )}
              {!hasContactDetails && (
                <li className="text-muted-foreground">
                  <Link href="/contatti" className="hover:underline">
                    Vedi la pagina Contatti
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ASD La Spotornese. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
