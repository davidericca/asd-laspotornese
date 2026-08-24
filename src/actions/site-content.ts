"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { SITE_CONTENT_KEYS } from "@/lib/data/site-content";
import { uploadCoverImage } from "@/lib/storage/upload-cover-image";

export async function updateSiteContent(formData: FormData) {
  const supabase = await getServerSupabase();

  const rows = SITE_CONTENT_KEYS.filter((key) => key !== "home_hero_image_url").map((key) => ({
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

export async function updateHeroImage(formData: FormData) {
  const supabase = await getServerSupabase();

  const file = formData.get("hero_image");
  if (file instanceof File && file.size > 0) {
    const url = await uploadCoverImage(supabase, "site", "hero", file);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "home_hero_image_url", value: url }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
}
