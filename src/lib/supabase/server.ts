import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Client Supabase da usare in Server Component, Server Action e Route
 * Handler. Legge/scrive i cookie di sessione tramite l'API `cookies()` di
 * Next.js, così l'utente amministratore resta autenticato tra una pagina
 * e l'altra.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll può essere chiamato da un Server Component: in quel
            // caso i cookie vengono comunque aggiornati dal middleware.
          }
        },
      },
    }
  );
}
