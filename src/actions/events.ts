"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optimizeImage } from "@/lib/image-processing";
import { uploadToMedia } from "@/lib/supabase/storage";
import { makeSlug } from "@/lib/utils";

export interface EventActionState {
  error?: string;
}

const eventSchema = z.object({
  title: z.string().min(2, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  event_date: z.string().min(1, "La data è obbligatoria"),
  event_time: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["prossimo", "concluso", "annullato"]),
  extra_info: z.string().optional(),
  gallery_id: z.string().optional(),
  published: z.string().optional(),
});

async function uniqueEventSlug(title: string): Promise<string> {
  const supabase = await createClient();
  const base = makeSlug(title);
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    i += 1;
    slug = makeSlug(title, String(i));
  }
}

async function uploadCoverIfProvided(
  formData: FormData
): Promise<string | null> {
  const file = formData.get("cover_image") as File | null;
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const optimized = await optimizeImage(Buffer.from(arrayBuffer));
  const path = `images/${randomUUID()}.${optimized.extension}`;
  const { url } = await uploadToMedia(
    supabase,
    path,
    optimized.buffer,
    optimized.contentType
  );

  const { data, error } = await supabase
    .from("images")
    .insert({
      storage_path: path,
      url,
      width: optimized.width,
      height: optimized.height,
      size_bytes: optimized.buffer.byteLength,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
  }

  let coverImageId: string | null = null;
  try {
    coverImageId = await uploadCoverIfProvided(formData);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Errore caricamento immagine: ${err.message}`
          : "Errore caricamento immagine di copertina.",
    };
  }

  const supabase = await createClient();
  const slug = await uniqueEventSlug(parsed.data.title);

  const { data, error } = await supabase
    .from("events")
    .insert({
      slug,
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_date: parsed.data.event_date,
      event_time: parsed.data.event_time || null,
      end_date: parsed.data.end_date || null,
      location: parsed.data.location || null,
      status: parsed.data.status,
      extra_info: parsed.data.extra_info || null,
      gallery_id: parsed.data.gallery_id || null,
      cover_image_id: coverImageId,
      published: parsed.data.published === "on",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/eventi");
  revalidatePath("/eventi");
  revalidatePath("/");
  redirect(`/admin/eventi/${data.id}`);
}

export async function updateEvent(
  id: string,
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
  }

  let coverImageId: string | undefined;
  try {
    const uploaded = await uploadCoverIfProvided(formData);
    if (uploaded) coverImageId = uploaded;
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Errore caricamento immagine: ${err.message}`
          : "Errore caricamento immagine di copertina.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_date: parsed.data.event_date,
      event_time: parsed.data.event_time || null,
      end_date: parsed.data.end_date || null,
      location: parsed.data.location || null,
      status: parsed.data.status,
      extra_info: parsed.data.extra_info || null,
      gallery_id: parsed.data.gallery_id || null,
      ...(coverImageId ? { cover_image_id: coverImageId } : {}),
      published: parsed.data.published === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/eventi");
  revalidatePath(`/admin/eventi/${id}`);
  revalidatePath("/eventi");
  revalidatePath("/");
  return {};
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/eventi");
  revalidatePath("/eventi");
  revalidatePath("/");
}
