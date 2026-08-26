import { randomUUID } from "crypto";
import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadCoverImage(
  supabase: SupabaseClient,
  folder: "events" | "news" | "activities" | "site",
  id: string,
  file: File,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const path = `covers/${folder}/${id}/${randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(path, optimized, { contentType: "image/webp" });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

// Carica la nuova copertina (se ne e' stata scelta una) e aggiorna la riga
// col suo URL. Usato dalle server action di activities/events/news, che
// hanno tutte lo stesso schema: tabella con id + cover_image_url.
export async function maybeUploadCover(
  supabase: SupabaseClient,
  table: "activities" | "events" | "news",
  id: string,
  formData: FormData,
) {
  const cover = formData.get("cover_image");
  if (cover instanceof File && cover.size > 0) {
    const url = await uploadCoverImage(supabase, table, id, cover);
    await supabase.from(table).update({ cover_image_url: url }).eq("id", id);
  }
}
