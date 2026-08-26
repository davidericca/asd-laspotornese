import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { getPublishedSiteContent } from "@/lib/data/site-content";

export async function Footer() {
  const content = await getPublishedSiteContent();
  const hasContactDetails =
    content.contatti_indirizzo || content.contatti_telefono || content.contatti_email;

  return (
    <footer className="bg-primary text-primary-foreground/70">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
        <div>
          <h2 className="font-mono text-[10px] font-bold tracking-widest text-accent uppercase">
            ASD La Spotornese
          </h2>
          <p className="mt-2.5 max-w-xs text-sm">
            Società di pesca sportiva con sede a Spotorno.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:px-6">
          <Image
            src="/stemma.png"
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <span className="text-center font-heading text-sm font-semibold text-primary-foreground">
            ASD La Spotornese
          </span>
        </div>

        <div className="sm:text-right">
          <h2 className="font-mono text-[10px] font-bold tracking-widest text-accent uppercase">
            Contatti
          </h2>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-sm sm:items-end">
            {content.contatti_indirizzo && (
              <li className="flex items-start gap-2 sm:flex-row-reverse">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-foreground/50" aria-hidden="true" />
                <span>{content.contatti_indirizzo}</span>
              </li>
            )}
            {content.contatti_telefono && (
              <li className="flex items-center gap-2 sm:flex-row-reverse">
                <Phone size={16} className="shrink-0 text-primary-foreground/50" aria-hidden="true" />
                <span>{content.contatti_telefono}</span>
              </li>
            )}
            {content.contatti_email && (
              <li className="flex items-center gap-2 sm:flex-row-reverse">
                <EnvelopeSimple size={16} className="shrink-0 text-primary-foreground/50" aria-hidden="true" />
                <span>{content.contatti_email}</span>
              </li>
            )}
            {!hasContactDetails && (
              <li>
                <Link href="/contatti" className="hover:underline">
                  Vedi la pagina Contatti
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 font-mono text-xs text-primary-foreground/45">
          <span>
            &copy; {new Date().getFullYear()} ASD La Spotornese
            {content.cf_piva && ` · P.IVA ${content.cf_piva}`}
          </span>
          <span>Spotorno (SV)</span>
        </div>
      </div>
    </footer>
  );
}
