import Link from "next/link";

const sections = [
  { href: "/admin/activities", label: "Attività", description: "Le schede attività della home" },
  { href: "/admin/events", label: "Eventi", description: "Calendario, stato, allegati e foto collegate" },
  { href: "/admin/news", label: "News", description: "Comunicazioni e avvisi" },
  { href: "/admin/galleries", label: "Gallerie", description: "Album fotografici" },
  { href: "/admin/content", label: "Testi del sito", description: "Home, chi siamo, contatti" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
      <ul className="mt-6 flex flex-col divide-y divide-border border-y border-border">
        {sections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="-mx-2 flex items-center justify-between gap-4 px-2 py-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium text-foreground">{section.label}</p>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <span aria-hidden="true" className="text-muted-foreground">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
