"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";

function readActivityFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "") || null,
    published: formData.get("published") === "on",
  };
}

export async function createActivity(formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readActivityFields(formData);

  const { count } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase
    .from("activities")
    .insert({ ...fields, position: count ?? 0 });
  if (error) throw new Error(error.message);

  revalidatePath("/attivita");
  redirect("/admin/activities");
}

export async function updateActivity(id: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const fields = readActivityFields(formData);

  const { error } = await supabase.from("activities").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/attivita");
  redirect("/admin/activities");
}

export async function deleteActivity(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/attivita");
  revalidatePath("/admin/activities");
}

export async function moveActivity(id: string, direction: "up" | "down") {
  const supabase = await getServerSupabase();
  const { data: activities, error } = await supabase
    .from("activities")
    .select("id, position")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);

  const index = activities.findIndex((activity) => activity.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= activities.length) return;

  const current = activities[index];
  const swapWith = activities[swapIndex];

  await Promise.all([
    supabase.from("activities").update({ position: swapWith.position }).eq("id", current.id),
    supabase.from("activities").update({ position: current.position }).eq("id", swapWith.id),
  ]);

  revalidatePath("/attivita");
  revalidatePath("/admin/activities");
}
