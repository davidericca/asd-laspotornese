import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export const SITE_CONTENT_KEYS = [
  "home_intro",
  "chi_siamo",
  "contatti_indirizzo",
  "contatti_telefono",
  "contatti_email",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

async function toRecord(rows: { key: string; value: string }[]) {
  const record = {} as Record<SiteContentKey, string>;
  for (const key of SITE_CONTENT_KEYS) record[key] = "";
  for (const row of rows) {
    if (SITE_CONTENT_KEYS.includes(row.key as SiteContentKey)) {
      record[row.key as SiteContentKey] = row.value;
    }
  }
  return record;
}

export async function getPublishedSiteContent() {
  const { data, error } = await supabasePublic.from("site_content").select("key, value");
  if (error) throw error;
  return toRecord(data ?? []);
}

export async function getAdminSiteContent() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw error;
  return toRecord(data ?? []);
}
