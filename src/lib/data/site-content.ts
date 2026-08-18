import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";

export interface ContactInfo {
  address: string;
  city: string;
  email: string;
  phone: string;
  vatOrFiscalCode: string;
  social: { facebook: string; instagram: string; youtube: string };
  mapLat: number;
  mapLng: number;
}

/**
 * Legge un blocco di contenuto testuale modificabile dal pannello admin
 * (tabella site_content). Se la chiave non esiste ancora (o il database
 * non è raggiungibile) restituisce il valore di default passato, così le
 * pagine mostrano comunque un placeholder sensato.
 */
export async function getSiteContent<T = string>(
  key: string,
  fallback: T
): Promise<T> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (data?.value === undefined || data?.value === null) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

/**
 * Informazioni di contatto: legge gli eventuali valori salvati
 * dall'amministratore (tabella site_content) e completa quelli mancanti
 * con i placeholder statici di lib/constants.ts.
 */
export async function getContactInfo(): Promise<ContactInfo> {
  const all = await getAllSiteContent();
  return {
    address: (all.contact_address as string) ?? SITE.address,
    city: (all.contact_city as string) ?? SITE.city,
    email: (all.contact_email as string) ?? SITE.email,
    phone: (all.contact_phone as string) ?? SITE.phone,
    vatOrFiscalCode: (all.contact_vat as string) ?? SITE.vatOrFiscalCode,
    social: {
      facebook: (all.contact_social_facebook as string) ?? SITE.social.facebook,
      instagram: (all.contact_social_instagram as string) ?? SITE.social.instagram,
      youtube: (all.contact_social_youtube as string) ?? SITE.social.youtube,
    },
    mapLat: (all.contact_map_lat as number) ?? SITE.mapLat,
    mapLng: (all.contact_map_lng as number) ?? SITE.mapLng,
  };
}

export async function getAllSiteContent(): Promise<Record<string, unknown>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("key, value");
    const map: Record<string, unknown> = {};
    (data ?? []).forEach((row) => {
      map[row.key] = row.value;
    });
    return map;
  } catch {
    return {};
  }
}
