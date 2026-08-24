import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export type NewsRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover_image_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export async function getPublishedNews() {
  const { data, error } = await supabasePublic
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as NewsRow[];
}

export async function getPublishedNewsBySlug(slug: string) {
  const { data, error } = await supabasePublic
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data as NewsRow | null;
}

export async function getLatestNews(limit: number) {
  const { data, error } = await supabasePublic
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as NewsRow[];
}

export async function getAdminNews() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as NewsRow[];
}

export async function getAdminNewsById(id: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as NewsRow;
}
