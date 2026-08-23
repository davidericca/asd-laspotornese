import { createClient } from "@supabase/supabase-js";
import { fetchWithTimeout } from "./fetch-with-timeout";

// Client "di sola lettura pubblica": nessun accesso a cookies(), cosi'
// le pagine pubbliche restano cache-abili con `export const revalidate`.
// Vedi sezione 6 della guida.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: fetchWithTimeout },
  },
);
