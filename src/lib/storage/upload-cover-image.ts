import { randomUUID } from "crypto";
import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadCoverImage(
  supabase: SupabaseClient,
  folder: "events" | "news",
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
