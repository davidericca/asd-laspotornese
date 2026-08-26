"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { SITE_CONTENT_KEYS } from "@/lib/data/site-content";
import { uploadCoverImage } from "@/lib/storage/upload-cover-image";

const HERO_IMAGE_KEYS = ["home_hero_image_url", "home_hero_image_position"];

// Un unico form/azione per tutti i testi del sito, inclusa la foto hero e la
// sua inquadratura: prima c'erano due form separati con due bottoni "Salva"
// diversi, ed era facile salvarne uno pensando di aver salvato anche l'altro.
export async function updateSiteContent(formData: FormData) {
  const supabase = await getServerSupabase();

  const rows = SITE_CONTENT_KEYS.filter((key) => !HERO_IMAGE_KEYS.includes(key)).map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  const file = formData.get("hero_image");
  if (file instanceof File && file.size > 0) {
    const url = await uploadCoverImage(supabase, "site", "hero", file);
    rows.push({ key: "home_hero_image_url", value: url });
  }

  const position = formData.get("home_hero_image_position");
  if (typeof position === "string" && position) {
    rows.push({ key: "home_hero_image_position", value: position });
  }

  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/chi-siamo");
  revalidatePath("/attivita");
  revalidatePath("/contatti");
  revalidatePath("/admin/content");
}
