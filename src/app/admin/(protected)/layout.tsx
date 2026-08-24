import { logout } from "@/actions/auth";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-primary px-6 py-4 text-primary-foreground">
        <span className="font-heading font-semibold">Pannello admin</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-primary-foreground/80">
            {user?.email}
          </span>
          <form action={logout}>
            <button type="submit" className="hover:underline">
              Esci
            </button>
          </form>
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
