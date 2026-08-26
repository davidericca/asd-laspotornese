"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

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
          className="flex items-center gap-3 font-heading text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/stemma.png"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            priority
            className="h-10 w-10"
          />
          <span className="flex flex-col leading-tight">
            ASD La Spotornese
            <span className="font-mono text-[10px] font-normal tracking-widest text-primary-foreground/55 uppercase">
              Pesca sportiva
            </span>
          </span>
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
              className="rounded-xs bg-accent px-4 py-2 font-medium text-accent-foreground transition hover:opacity-90"
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
          className="-m-2 cursor-pointer rounded-xs p-2 transition hover:bg-white/10 sm:hidden"
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
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
              className="inline-block rounded-xs bg-accent px-4 py-2 font-medium text-accent-foreground"
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
