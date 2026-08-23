"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { SITE_CONTENT_KEYS } from "@/lib/data/site-content";

export async function updateSiteContent(formData: FormData) {
  const supabase = await getServerSupabase();

  const rows = SITE_CONTENT_KEYS.map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/chi-siamo");
  revalidatePath("/attivita");
  revalidatePath("/contatti");
}
