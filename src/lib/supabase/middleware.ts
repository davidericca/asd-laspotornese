import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rinnova la sessione Supabase ad ogni richiesta e protegge le rotte
 * /admin/* dall'accesso di utenti non autenticati (redirect al login).
 * Chiamata dal middleware.ts nella root del progetto.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Anche se autenticato, l'utente deve essere presente nella tabella
    // "admins" per poter accedere al pannello (difesa in profondità: le
    // policy RLS a livello di database bloccano comunque ogni scrittura
    // non autorizzata, ma qui evitiamo di mostrare l'interfaccia stessa).
    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "not_authorized");
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
