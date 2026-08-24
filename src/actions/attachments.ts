"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { uploadAttachmentFile } from "@/lib/storage/upload-attachment";

export async function uploadAttachment(
  parent: "event" | "news",
  parentId: string,
  revalidateTarget: string,
  formData: FormData,
) {
  const supabase = await getServerSupabase();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  await uploadAttachmentFile(supabase, parent, parentId, file);

  revalidatePath(revalidateTarget);
}

export async function deleteAttachment(
  attachmentId: string,
  fileUrl: string,
  revalidateTarget: string,
) {
  const supabase = await getServerSupabase();
  const path = new URL(fileUrl).pathname.split("/attachments/")[1];

  await supabase.storage.from("attachments").remove([path]);
  const { error } = await supabase.from("attachments").delete().eq("id", attachmentId);
  if (error) throw new Error(error.message);

  revalidatePath(revalidateTarget);
}
