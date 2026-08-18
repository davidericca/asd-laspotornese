"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary-950/95 backdrop-blur supports-[backdrop-filter]:bg-primary-950/90">
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between py-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-lg font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-500/20 text-secondary-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="h-5 w-5"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6Z"
                />
                <circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none" />
                <path strokeLinecap="round" d="M3 12c-1 0-2-1-2-1s1-1 2-1" />
              </svg>
            </span>
            <span className="leading-tight">
              {SITE.name}
              <span className="block text-[11px] font-normal text-primary-200">
                Società di Pesca Sportiva
              </span>
            </span>
          </Link>

          {/* Menu desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-primary-200 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href="/contatti" variant="primary" className="px-5 py-2.5">
              Contattaci
            </Button>
          </div>

          {/* Pulsante menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Apri/chiudi il menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Menu mobile a comparsa */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-primary-950 transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <Container>
          <nav className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-primary-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>
    </header>
  );
}
