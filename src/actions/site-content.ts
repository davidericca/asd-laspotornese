"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Salva un blocco di contenuto testuale (site_content) identificato da una
 * chiave. Usata sia per i testi delle pagine (Home, La Società) sia per le
 * informazioni di contatto.
 */
export async function saveSiteContent(
  entries: Record<string, string | number>
) {
  const supabase = await createClient();

  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("site_content").upsert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
