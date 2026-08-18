import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: `Pannello amministratore — ${SITE.name}`,
  robots: { index: false, follow: false },
};

/**
 * Layout dell'area riservata. La pagina di login ha un proprio layout
 * "spoglio" (nessuna sidebar), quindi qui gestiamo solo le pagine protette.
 * L'accesso è già garantito dal middleware root; qui recuperiamo solo
 * l'utente per mostrare un saluto nell'intestazione.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La pagina di login non ha bisogno della sidebar: gestita da un layout
  // dedicato non è possibile qui senza route group, quindi la lasciamo
  // passare inalterata quando non c'è utente (redirect già gestito dal
  // middleware in ogni altro caso).
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/admin"
              className="text-lg font-semibold text-primary-900"
            >
              Pannello amministratore
            </Link>
            <p className="text-xs text-slate-400">{SITE.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm font-medium text-secondary-700 hover:underline sm:inline"
            >
              Vedi il sito ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="w-60 shrink-0">
          <AdminSidebar />
        </aside>
        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
