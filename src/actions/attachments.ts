"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadToMedia, deleteFromMedia } from "@/lib/supabase/storage";

export async function uploadAttachment(
  relatedType: "event" | "news",
  relatedId: string,
  file: File
) {
  if (!file || file.size === 0) throw new Error("Nessun file selezionato.");

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const extension = file.name.split(".").pop() || "pdf";
  const path = `documents/${randomUUID()}.${extension}`;

  const { url } = await uploadToMedia(
    supabase,
    path,
    Buffer.from(arrayBuffer),
    file.type || "application/pdf"
  );

  const { error } = await supabase.from("attachments").insert({
    related_type: relatedType,
    related_id: relatedId,
    file_name: file.name,
    storage_path: path,
    url,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${relatedType === "event" ? "eventi" : "news"}/${relatedId}`);
}

export async function deleteAttachment(id: string, relatedType: "event" | "news", relatedId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("attachments")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (data?.storage_path) {
    await deleteFromMedia(supabase, data.storage_path);
  }

  const { error } = await supabase.from("attachments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${relatedType === "event" ? "eventi" : "news"}/${relatedId}`);
}
