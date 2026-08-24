import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/event-status";

export type { EventRow } from "@/lib/event-status";
export { getEventDisplayStatus } from "@/lib/event-status";

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
