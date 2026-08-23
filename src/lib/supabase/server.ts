import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { fetchWithTimeout } from "./fetch-with-timeout";

// Client "con sessione": usa cookies(), quindi va usato SOLO nell'area
// admin. Se usato in pagine pubbliche disattiva la cache di Next.js.
// Vedi sezione 6 della guida.
export async function getServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { fetch: fetchWithTimeout },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll chiamato da un Server Component: ignorabile se c'e'
            // un middleware che rinfresca le sessioni.
          }
        },
      },
    },
  );
}
