import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminSessionGuard } from "@/components/admin/AdminSessionGuard";

export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <AdminSessionGuard />
      <header className="flex items-center justify-between border-b border-border bg-primary px-6 py-4 text-primary-foreground">
        <Link href="/admin" className="font-heading font-semibold hover:underline">
          Pannello admin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-primary-foreground/80">
            {user.email}
          </span>
          <form action={logout}>
            <button type="submit" className="hover:underline">
              Esci
            </button>
          </form>
        </div>
      </header>
      <AdminNav />
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
