import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  published: boolean;
  cover_image_url: string | null;
};

export async function getPublishedActivities() {
  const { data, error } = await supabasePublic
    .from("activities")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) throw error;
  return data as ActivityRow[];
}

export async function getAdminActivities() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data as ActivityRow[];
}

export async function getAdminActivityById(id: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ActivityRow;
}
