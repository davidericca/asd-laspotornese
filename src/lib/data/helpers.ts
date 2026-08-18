import type { SupabaseClient } from "@supabase/supabase-js";
import type { GalleryWithImages, ImageRow } from "@/lib/types";

/**
 * Funzioni di supporto condivise dal livello di accesso ai dati.
 * Ogni chiamata a Supabase è racchiusa in try/catch a monte (nelle funzioni
 * che le usano) così che, in assenza di connessione o di credenziali
 * valide (es. durante la build senza variabili d'ambiente reali), le
 * pagine pubbliche si degradino mostrando "nessun contenuto" invece di
 * far fallire l'intero sito.
 */

export async function fetchImageById(
  supabase: SupabaseClient,
  imageId: string | null
): Promise<ImageRow | null> {
  if (!imageId) return null;
  const { data } = await supabase
    .from("images")
    .select("*")
    .eq("id", imageId)
    .maybeSingle();
  return (data as ImageRow) ?? null;
}

export async function fetchGalleryWithImages(
  supabase: SupabaseClient,
  galleryId: string | null
): Promise<GalleryWithImages | null> {
  if (!galleryId) return null;

  const { data: gallery } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", galleryId)
    .maybeSingle();

  if (!gallery) return null;

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("gallery_id", galleryId)
    .order("sort_order", { ascending: true });

  const coverImage = await fetchImageById(supabase, gallery.cover_image_id);

  return {
    ...gallery,
    images: (images as ImageRow[]) ?? [],
    cover_image: coverImage,
  };
}
