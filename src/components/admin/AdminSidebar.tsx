"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/eventi", label: "Eventi & Gare", exact: false },
  { href: "/admin/news", label: "News", exact: false },
  { href: "/admin/galleria", label: "Gallerie & Immagini", exact: false },
  { href: "/admin/contenuti", label: "Contenuti pagine", exact: false },
  { href: "/admin/contatti", label: "Contatti", exact: false },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-lg px-3.5 py-2.5 text-sm font-medium transition",
              active
                ? "bg-secondary-500/15 text-secondary-700"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
