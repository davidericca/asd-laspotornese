"use client";

/**
 * Client Supabase da usare nei Client Component (browser).
 * Usa le chiavi pubbliche (anon key): la sicurezza è garantita dalle
 * policy di Row Level Security definite nel database, non dalla segretezza
 * di questa chiave.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
