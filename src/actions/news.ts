"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { uploadAttachmentFile } from "@/lib/storage/upload-attachment";
import { uploadCoverImage } from "@/lib/storage/upload-cover-image";

function readNewsFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(title),
    body: String(formData.get("body") ?? ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

async function maybeUploadCover(
  supabase: Awaited<ReturnType<typeof getServerSupabase>>,
  id: string,
  formData: FormData,
) {
  const cover = formData.get("cover_image");
  if (cover instanceof File && cover.size > 0) {
    const url = await uploadCoverImage(supabase, "news", id, cover);
    await supabase.from("news").update({ cover_image_url: url }).eq("id", id);
  }
}

export async function createNews(formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readNewsFields(formData);

  const { data, error } = await supabase
    .from("news")
    .insert(fields)
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const attachment = formData.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    await uploadAttachmentFile(supabase, "news", data.id, attachment);
  }
  await maybeUploadCover(supabase, data.id, formData);

  revalidatePath("/news");
  revalidatePath("/");
  redirect(`/admin/news/${data.id}`);
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readNewsFields(formData);

  const { error } = await supabase.from("news").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  await maybeUploadCover(supabase, id, formData);

  revalidatePath("/news");
  revalidatePath(`/news/${fields.slug}`);
  revalidatePath("/");
  redirect(`/admin/news/${id}`);
}

export async function deleteNews(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  revalidatePath("/admin/news");
}
