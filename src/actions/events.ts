"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { ensureUniqueSlug } from "@/lib/ensure-unique-slug";
import { uploadAttachmentFile } from "@/lib/storage/upload-attachment";
import { maybeUploadCover } from "@/lib/storage/upload-cover-image";

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(title),
    event_date: String(formData.get("event_date") ?? ""),
    event_time: String(formData.get("event_time") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    status: formData.get("cancelled") === "on" ? "annullato" : "programmato",
    description: String(formData.get("description") ?? "") || null,
    gallery_id: String(formData.get("gallery_id") ?? "") || null,
    cover_image_position: String(formData.get("cover_image_position") ?? "") || null,
    published: formData.get("published") === "on",
  };
}

export async function createEvent(formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readEventFields(formData);
  fields.slug = await ensureUniqueSlug(supabase, "events", fields.slug);

  const { data, error } = await supabase
    .from("events")
    .insert(fields)
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const attachment = formData.get("attachment");
  await Promise.all([
    attachment instanceof File && attachment.size > 0
      ? uploadAttachmentFile(supabase, "event", data.id, attachment)
      : null,
    maybeUploadCover(supabase, "events", data.id, formData),
  ]);

  revalidatePath("/eventi");
  revalidatePath("/");
  redirect(`/admin/events/${data.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readEventFields(formData);
  fields.slug = await ensureUniqueSlug(supabase, "events", fields.slug, id);

  const { error } = await supabase
    .from("events")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  await maybeUploadCover(supabase, "events", id, formData);

  revalidatePath("/eventi");
  revalidatePath(`/eventi/${fields.slug}`);
  revalidatePath("/");
  redirect(`/admin/events/${id}`);
}

export async function deleteEvent(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/eventi");
  revalidatePath("/admin/events");
}
