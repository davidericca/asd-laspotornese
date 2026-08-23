"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

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

  const { error } = await supabase.from("news").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readNewsFields(formData);

  const { error } = await supabase.from("news").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/news");
  revalidatePath("/admin/news");
}
