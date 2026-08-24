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

export function getEventDisplayStatus(
  event: Pick<EventRow, "status" | "event_date">,
): EventRow["status"] {
  if (event.status === "annullato") return "annullato";
  const today = new Date().toISOString().slice(0, 10);
  if (event.event_date < today) return "concluso";
  if (event.event_date === today) return "in corso";
  return "programmato";
}

export async function getPublishedEvents() {
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("published", true)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data as EventRow[];
}

export async function getPublishedEventBySlug(slug: string) {
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data as EventRow | null;
}

export async function getNextUpcomingEvent() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabasePublic
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as EventRow | null;
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
