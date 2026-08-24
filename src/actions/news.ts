"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { uploadAttachmentFile } from "@/lib/storage/upload-attachment";

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

  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readNewsFields(formData);

  const { error } = await supabase.from("news").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  revalidatePath(`/news/${fields.slug}`);
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  revalidatePath("/admin/news");
}
