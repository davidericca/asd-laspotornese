"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/activities", label: "Attività" },
  { href: "/admin/events", label: "Eventi" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/galleries", label: "Gallerie" },
  { href: "/admin/content", label: "Testi del sito" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-muted">
      <ul className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3 text-sm">
        {sections.map((section) => {
          const isActive =
            section.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(section.href);
          return (
            <li key={section.href}>
              <Link
                href={section.href}
                className={
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
