"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(title),
    event_date: String(formData.get("event_date") ?? ""),
    event_time: String(formData.get("event_time") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    status: String(formData.get("status") ?? "programmato"),
    description: String(formData.get("description") ?? "") || null,
    published: formData.get("published") === "on",
  };
}

export async function createEvent(formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readEventFields(formData);

  const { error } = await supabase.from("events").insert(fields);
  if (error) throw new Error(error.message);

  revalidatePath("/eventi");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readEventFields(formData);

  const { error } = await supabase
    .from("events")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/eventi");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/eventi");
  revalidatePath("/admin/events");
}
