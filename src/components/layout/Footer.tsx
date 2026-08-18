import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { getContactInfo } from "@/lib/data/site-content";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  facebook: (
    <path d="M13.5 9H15V6.5h-1.75C11.6 6.5 10.5 7.6 10.5 9.25V11H9v2.5h1.5V19h2.5v-5.5H15l.5-2.5h-2v-1.25c0-.4.35-.75.75-.75Z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.2" cy="7.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
};

function SocialLink({ href, kind }: { href: string; kind: keyof typeof SOCIAL_ICONS }) {
  const isPlaceholder = !href || href.startsWith("[");
  return (
    <a
      href={isPlaceholder ? "#" : href}
      target={isPlaceholder ? undefined : "_blank"}
      rel="noreferrer"
      aria-label={kind}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-primary-200 transition hover:border-secondary-400 hover:text-secondary-300"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-4 w-4">
        {SOCIAL_ICONS[kind]}
      </svg>
    </a>
  );
}

export async function Footer() {
  const year = new Date().getFullYear();
  const contact = await getContactInfo();

  return (
    <footer className="mt-24 border-t border-white/10 bg-primary-950 text-primary-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            {SITE.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-primary-300">
            {SITE.shortDescription}
          </p>
          <div className="mt-5 flex gap-2.5">
            <SocialLink href={contact.social.facebook} kind="facebook" />
            <SocialLink href={contact.social.instagram} kind="instagram" />
            <SocialLink href={contact.social.youtube} kind="youtube" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            Naviga
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-200 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            Contatti
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-200">
            <li>{contact.address}</li>
            <li>{contact.city}</li>
            <li>
              <a href={`tel:${contact.phone}`} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            Informazioni
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-200">
            <li>{contact.vatOrFiscalCode}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-primary-400 sm:flex-row">
          <p>
            © {year} {SITE.name}. Tutti i diritti riservati.
          </p>
          <p>Sito realizzato per l&apos;associazione — contenuti in aggiornamento.</p>
        </Container>
      </div>
    </footer>
  );
}
