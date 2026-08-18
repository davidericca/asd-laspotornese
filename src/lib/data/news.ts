import { createClient } from "@/lib/supabase/server";
import type { NewsRow, NewsWithRelations } from "@/lib/types";
import { fetchImageById } from "@/lib/data/helpers";

async function attachRelations(news: NewsRow): Promise<NewsWithRelations> {
  const supabase = await createClient();
  const [coverImage, attachmentsRes] = await Promise.all([
    fetchImageById(supabase, news.cover_image_id),
    supabase
      .from("attachments")
      .select("*")
      .eq("related_type", "news")
      .eq("related_id", news.id),
  ]);

  return {
    ...news,
    cover_image: coverImage,
    attachments: attachmentsRes.data ?? [],
  };
}

/** Ultime news pubblicate, per la Home. */
export async function getLatestNews(limit = 3): Promise<NewsRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as NewsRow[]) ?? [];
  } catch {
    return [];
  }
}

/** Tutte le news pubblicate, per la pagina elenco. */
export async function getAllPublicNews(): Promise<NewsRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as NewsRow[]) ?? [];
  } catch {
    return [];
  }
}

/** Tutte le news, pubblicate e non — per il pannello amministratore. */
export async function getAllNewsAdmin(): Promise<NewsRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as NewsRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getNewsBySlug(
  slug: string
): Promise<NewsWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return attachRelations(data as NewsRow);
  } catch {
    return null;
  }
}

export async function getNewsById(
  id: string
): Promise<NewsWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return attachRelations(data as NewsRow);
  } catch {
    return null;
  }
}
