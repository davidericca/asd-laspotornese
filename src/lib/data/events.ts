import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  status: "programmato" | "in corso" | "concluso" | "annullato";
  description: string | null;
  cover_image_url: string | null;
  gallery_id: string | null;
  published: boolean;
};

export async function getPublishedEvents() {
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("published", true)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data as EventRow[];
}

export async function getAdminEvents() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data as EventRow[];
}

export async function getAdminEventById(id: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as EventRow;
}
