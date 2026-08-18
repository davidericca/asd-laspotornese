import { createClient } from "@/lib/supabase/server";
import type { GalleryRow, GalleryWithImages, ImageRow } from "@/lib/types";
import { fetchGalleryWithImages, fetchImageById } from "@/lib/data/helpers";

/** Tutte le gallerie (per la pagina Galleria e per il pannello admin). */
export async function getAllGalleries(): Promise<GalleryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as GalleryRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getGalleriesWithCover(): Promise<GalleryWithImages[]> {
  try {
    const supabase = await createClient();
    const galleries = await getAllGalleries();
    const withImages = await Promise.all(
      galleries.map((g) => fetchGalleryWithImages(supabase, g.id))
    );
    return withImages.filter((g): g is GalleryWithImages => g !== null);
  } catch {
    return [];
  }
}

export async function getGalleryBySlug(
  slug: string
): Promise<GalleryWithImages | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("galleries")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return null;
    return fetchGalleryWithImages(supabase, data.id);
  } catch {
    return null;
  }
}

export async function getGalleryById(
  id: string
): Promise<GalleryWithImages | null> {
  try {
    const supabase = await createClient();
    return fetchGalleryWithImages(supabase, id);
  } catch {
    return null;
  }
}

/** Ultime immagini caricate, per l'anteprima galleria in Home. */
export async function getRecentImages(limit = 8): Promise<ImageRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as ImageRow[]) ?? [];
  } catch {
    return [];
  }
}

export { fetchImageById };
