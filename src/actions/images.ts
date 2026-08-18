"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { optimizeImage } from "@/lib/image-processing";
import { uploadToMedia, deleteFromMedia } from "@/lib/supabase/storage";

export interface ImageActionState {
  error?: string;
  success?: boolean;
}

/**
 * Carica una o più immagini contemporaneamente: ognuna viene ottimizzata
 * automaticamente (ridimensionata e compressa in WebP) prima di essere
 * salvata su Supabase Storage e registrata nel database. Riservato agli
 * amministratori: le policy RLS del bucket "media" bloccano chiunque altro.
 */
export async function uploadImages(
  _prevState: ImageActionState,
  formData: FormData
): Promise<ImageActionState> {
  const supabase = await createClient();
  const galleryId = (formData.get("galleryId") as string) || null;
  const files = formData.getAll("files") as File[];

  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) {
    return { error: "Seleziona almeno un'immagine da caricare." };
  }

  try {
    for (const file of validFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const optimized = await optimizeImage(Buffer.from(arrayBuffer));
      const path = `images/${randomUUID()}.${optimized.extension}`;

      const { url } = await uploadToMedia(
        supabase,
        path,
        optimized.buffer,
        optimized.contentType
      );

      const { error: insertError } = await supabase.from("images").insert({
        gallery_id: galleryId,
        storage_path: path,
        url,
        width: optimized.width,
        height: optimized.height,
        size_bytes: optimized.buffer.byteLength,
        title: null,
        description: null,
        alt_text: null,
      });

      if (insertError) throw new Error(insertError.message);
    }
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Errore durante il caricamento: ${err.message}`
          : "Errore durante il caricamento delle immagini.",
    };
  }

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
  revalidatePath("/");
  return { success: true };
}

export async function updateImageMetadata(
  id: string,
  data: { title?: string; description?: string; alt_text?: string }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("images").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
}

export async function deleteImage(id: string) {
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (image?.storage_path) {
    await deleteFromMedia(supabase, image.storage_path);
  }

  const { error } = await supabase.from("images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
  revalidatePath("/");
}

/** Sostituisce il file di un'immagine esistente mantenendo titolo/descrizione. */
export async function replaceImage(id: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Nessun file selezionato.");

  const { data: existing } = await supabase
    .from("images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  const arrayBuffer = await file.arrayBuffer();
  const optimized = await optimizeImage(Buffer.from(arrayBuffer));
  const path = `images/${randomUUID()}.${optimized.extension}`;

  const { url } = await uploadToMedia(
    supabase,
    path,
    optimized.buffer,
    optimized.contentType
  );

  const { error } = await supabase
    .from("images")
    .update({
      storage_path: path,
      url,
      width: optimized.width,
      height: optimized.height,
      size_bytes: optimized.buffer.byteLength,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (existing?.storage_path) {
    await deleteFromMedia(supabase, existing.storage_path);
  }

  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
}

export async function assignImageToGallery(id: string, galleryId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("images")
    .update({ gallery_id: galleryId })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/galleria");
  revalidatePath("/galleria");
}
