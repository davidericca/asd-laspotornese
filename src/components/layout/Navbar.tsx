"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/attivita", label: "Attività" },
  { href: "/eventi", label: "Eventi" },
  { href: "/news", label: "News" },
  { href: "/galleria", label: "Galleria" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          ASD La Spotornese
        </Link>
        <ul className="hidden items-center gap-x-6 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition hover:opacity-80">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contatti"
              className="rounded bg-accent px-4 py-2 font-medium text-accent-foreground transition hover:opacity-90"
            >
              Contattaci
            </Link>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          className="text-2xl leading-none sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <ul className="flex flex-col gap-1 px-6 pb-4 text-sm sm:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-1 hover:opacity-80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/contatti"
              className="inline-block rounded bg-accent px-4 py-2 font-medium text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Contattaci
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
