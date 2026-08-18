import { createClient } from "@/lib/supabase/server";
import type { EventRow, EventWithRelations } from "@/lib/types";
import { fetchGalleryWithImages, fetchImageById } from "@/lib/data/helpers";
import { getEffectiveStatus } from "@/lib/utils";

async function attachRelations(event: EventRow): Promise<EventWithRelations> {
  const supabase = await createClient();
  const [coverImage, gallery, attachmentsRes] = await Promise.all([
    fetchImageById(supabase, event.cover_image_id),
    fetchGalleryWithImages(supabase, event.gallery_id),
    supabase
      .from("attachments")
      .select("*")
      .eq("related_type", "event")
      .eq("related_id", event.id),
  ]);

  return {
    ...event,
    cover_image: coverImage,
    gallery,
    attachments: attachmentsRes.data ?? [],
  };
}

/**
 * Prossimi eventi pubblicati, ordinati per data crescente. Per la Home.
 *
 * Lo stato "prossimo/concluso" è calcolato automaticamente in base alla
 * data odierna (vedi getEffectiveStatus in lib/utils.ts): un evento resta
 * "prossimo" fino a fine giornata e scompare da qui il giorno dopo, senza
 * che l'amministratore debba aggiornarlo manualmente.
 */
export async function getUpcomingEvents(limit = 3): Promise<EventRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .neq("status", "annullato")
      .order("event_date", { ascending: true });
    if (error) throw error;
    const events = (data as EventRow[]) ?? [];
    return events
      .filter((e) => getEffectiveStatus(e) === "prossimo")
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** Tutti gli eventi pubblicati (per la pagina elenco + calendario). */
export async function getAllPublicEvents(): Promise<EventRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .order("event_date", { ascending: false });
    if (error) throw error;
    return (data as EventRow[]) ?? [];
  } catch {
    return [];
  }
}

/** Tutti gli eventi, pubblicati e non — per il pannello amministratore. */
export async function getAllEventsAdmin(): Promise<EventRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) throw error;
    return (data as EventRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getEventBySlug(
  slug: string
): Promise<EventWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return attachRelations(data as EventRow);
  } catch {
    return null;
  }
}

export async function getEventById(
  id: string
): Promise<EventWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return attachRelations(data as EventRow);
  } catch {
    return null;
  }
}
