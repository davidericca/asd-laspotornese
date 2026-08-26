import type { SupabaseClient } from "@supabase/supabase-js";

// Le tabelle "news" ed "events" hanno lo slug con vincolo unique: se due
// titoli producono lo stesso slug (es. stesso titolo riusato, o titoli che
// si riducono allo stesso testo), il salvataggio falliva con un errore del
// server. Qui si controlla e, se serve, si aggiunge un numero in fondo
// (es. "titolo", "titolo-2", "titolo-3"...) finche' non e' libero.
export async function ensureUniqueSlug(
  supabase: SupabaseClient,
  table: "news" | "events",
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  const base = baseSlug || "senza-titolo";
  let candidate = base;

  for (let suffix = 2; ; suffix++) {
    let query = supabase.from(table).select("id").eq("slug", candidate).limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
  }
}
