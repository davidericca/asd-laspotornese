"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { deleteFromMedia } from "@/lib/supabase/storage";
import { makeSlug } from "@/lib/utils";

export interface GalleryActionState {
  error?: string;
}

const gallerySchema = z.object({
  title: z.string().min(2, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  eventId: z.string().optional(),
});

async function uniqueGallerySlug(title: string): Promise<string> {
  const supabase = await createClient();
  const base = makeSlug(title);
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabase
      .from("galleries")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    i += 1;
    slug = makeSlug(title, String(i));
  }
}

export async function createGallery(
  _prevState: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  const parsed = gallerySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    eventId: formData.get("eventId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
  }

  const supabase = await createClient();
  const slug = await uniqueGallerySlug(parsed.data.title);

  const { data, error } = await supabase
    .from("galleries")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_id: parsed.data.eventId || null,
      slug,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
  redirect(`/admin/galleria/${data.id}`);
}

export async function updateGallery(
  id: string,
  data: { title: string; description?: string; eventId?: string; coverImageId?: string | null }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("galleries")
    .update({
      title: data.title,
      description: data.description || null,
      event_id: data.eventId || null,
      cover_image_id: data.coverImageId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
  revalidatePath(`/galleria/${id}`);
}

export async function deleteGallery(id: string) {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("images")
    .select("id, storage_path")
    .eq("gallery_id", id);

  for (const image of images ?? []) {
    await deleteFromMedia(supabase, image.storage_path);
  }
  if (images && images.length > 0) {
    await supabase
      .from("images")
      .delete()
      .in("id", images.map((i) => i.id));
  }

  const { error } = await supabase.from("galleries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
}
