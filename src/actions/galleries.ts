"use server";

import { randomUUID } from "crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// Le foto vengono ridimensionate e convertite in WebP prima dell'upload:
// riduce drasticamente peso e tempo di caricamento delle pagine pubbliche.
async function uploadFilesToGallery(
  supabase: SupabaseClient,
  galleryId: string,
  files: File[],
) {
  const { count } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true })
    .eq("gallery_id", galleryId);
  let position = count ?? 0;

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const path = `${galleryId}/${randomUUID()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, optimized, { contentType: "image/webp" });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = supabase.storage.from("images").getPublicUrl(path);

    const { error: insertError } = await supabase.from("images").insert({
      gallery_id: galleryId,
      url: publicUrl.publicUrl,
      position: position++,
    });
    if (insertError) throw new Error(insertError.message);

    if (position === 1) {
      await supabase
        .from("galleries")
        .update({ cover_image_url: publicUrl.publicUrl })
        .eq("id", galleryId);
    }
  }
}

export async function createGallery(formData: FormData) {
  const supabase = await getServerSupabase();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const { data, error } = await supabase
    .from("galleries")
    .insert({ title, description })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (files.length > 0) {
    await uploadFilesToGallery(supabase, data.id, files);
  }

  revalidatePath("/galleria");
  redirect("/admin/galleries");
}

export async function deleteGallery(id: string) {
  const supabase = await getServerSupabase();

  const { data: images } = await supabase
    .from("images")
    .select("url")
    .eq("gallery_id", id);

  if (images && images.length > 0) {
    const paths = images.map((image) => new URL(image.url).pathname.split("/images/")[1]);
    await supabase.storage.from("images").remove(paths);
  }

  const { error } = await supabase.from("galleries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/galleria");
  redirect("/admin/galleries");
}

export async function updateGalleryCoverPosition(galleryId: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const position = String(formData.get("cover_image_position") ?? "") || null;

  const { error } = await supabase
    .from("galleries")
    .update({ cover_image_position: position })
    .eq("id", galleryId);
  if (error) throw new Error(error.message);

  revalidatePath("/galleria");
  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath("/");
}

export async function uploadImages(galleryId: string, formData: FormData) {
  const supabase = await getServerSupabase();
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  await uploadFilesToGallery(supabase, galleryId, files);

  revalidatePath("/galleria");
  revalidatePath(`/admin/galleries/${galleryId}`);
}

export async function deleteImage(galleryId: string, imageId: string, imageUrl: string) {
  const supabase = await getServerSupabase();
  const path = new URL(imageUrl).pathname.split("/images/")[1];

  await supabase.storage.from("images").remove([path]);
  const { error } = await supabase.from("images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);

  const { data: gallery } = await supabase
    .from("galleries")
    .select("cover_image_url")
    .eq("id", galleryId)
    .single();

  if (gallery?.cover_image_url === imageUrl) {
    const { data: nextImage } = await supabase
      .from("images")
      .select("url")
      .eq("gallery_id", galleryId)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    await supabase
      .from("galleries")
      .update({ cover_image_url: nextImage?.url ?? null })
      .eq("id", galleryId);
  }

  revalidatePath("/galleria");
  revalidatePath(`/admin/galleries/${galleryId}`);
}
