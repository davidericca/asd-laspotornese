import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadAttachmentFile(
  supabase: SupabaseClient,
  parent: "event" | "news",
  parentId: string,
  file: File,
) {
  const path = `${parent}/${parentId}/${randomUUID()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("attachments")
    .upload(path, buffer, { contentType: file.type || "application/pdf" });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from("attachments").getPublicUrl(path);

  const { error: insertError } = await supabase.from("attachments").insert({
    event_id: parent === "event" ? parentId : null,
    news_id: parent === "news" ? parentId : null,
    file_url: publicUrl.publicUrl,
    file_name: file.name,
  });
  if (insertError) throw new Error(insertError.message);
}
