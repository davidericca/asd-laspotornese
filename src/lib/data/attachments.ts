import { supabasePublic } from "@/lib/supabase/public";
import { getServerSupabase } from "@/lib/supabase/server";

export type AttachmentRow = {
  id: string;
  event_id: string | null;
  news_id: string | null;
  file_url: string;
  file_name: string;
};

export async function getPublishedAttachments(parent: "event" | "news", id: string) {
  const column = parent === "event" ? "event_id" : "news_id";
  const { data, error } = await supabasePublic
    .from("attachments")
    .select("*")
    .eq(column, id);
  if (error) throw error;
  return data as AttachmentRow[];
}

export async function getAdminAttachments(parent: "event" | "news", id: string) {
  const supabase = await getServerSupabase();
  const column = parent === "event" ? "event_id" : "news_id";
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq(column, id);
  if (error) throw error;
  return data as AttachmentRow[];
}
