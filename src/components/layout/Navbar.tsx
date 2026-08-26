"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/attivita", label: "Attività" },
  { href: "/eventi", label: "Eventi" },
  { href: "/galleria", label: "Galleria" },
  { href: "/news", label: "News" },
  { href: "/contatti", label: "Contatti" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header
      className={`text-primary-foreground ${isHome ? "absolute inset-x-0 top-0 z-20" : "relative"} bg-primary`}
      style={isHome && !open ? { background: "linear-gradient(to bottom, rgba(11,34,48,0.55), rgba(11,34,48,0))" } : undefined}
    >
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
              <Link
                href={link.href}
                className="relative inline-block pb-1 transition hover:opacity-80"
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            </li>
          ))}
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
                className={`block py-1 hover:opacity-80 ${isActive(link.href) ? "font-bold text-accent" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
