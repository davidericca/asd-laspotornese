import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "media";

/** Carica un file nel bucket "media" e restituisce percorso + URL pubblico. */
export async function uploadToMedia(
  supabase: SupabaseClient,
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<{ path: string; url: string }> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  if (error) throw new Error(`Caricamento file fallito: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteFromMedia(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}
