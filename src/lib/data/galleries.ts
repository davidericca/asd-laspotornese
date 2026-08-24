import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export type GalleryRow = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
};

export type ImageRow = {
  id: string;
  gallery_id: string;
  url: string;
  alt_text: string | null;
  position: number;
};

export async function getPublishedGalleries() {
  const { data, error } = await supabasePublic
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GalleryRow[];
}

export async function getPublishedGalleryWithImages(id: string) {
  const { data: gallery, error: galleryError } = await supabasePublic
    .from("galleries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (galleryError) throw galleryError;
  if (!gallery) return null;

  const { data: images, error: imagesError } = await supabasePublic
    .from("images")
    .select("*")
    .eq("gallery_id", id)
    .order("position", { ascending: true });
  if (imagesError) throw imagesError;

  return { gallery: gallery as GalleryRow, images: images as ImageRow[] };
}

export async function getAdminGalleries() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GalleryRow[];
}

export async function getAdminGalleryWithImages(id: string) {
  const supabase = await getServerSupabase();
  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", id)
    .single();
  if (galleryError) throw galleryError;

  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("*")
    .eq("gallery_id", id)
    .order("position", { ascending: true });
  if (imagesError) throw imagesError;

  return { gallery: gallery as GalleryRow, images: images as ImageRow[] };
}
