"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optimizeImage } from "@/lib/image-processing";
import { uploadToMedia } from "@/lib/supabase/storage";
import { makeSlug } from "@/lib/utils";

export interface NewsActionState {
  error?: string;
}

const newsSchema = z.object({
  title: z.string().min(2, "Il titolo è obbligatorio"),
  excerpt: z.string().optional(),
  body: z.string().min(2, "Il testo della news è obbligatorio"),
  featured: z.string().optional(),
  published: z.string().optional(),
});

async function uniqueNewsSlug(title: string): Promise<string> {
  const supabase = await createClient();
  const base = makeSlug(title);
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabase
      .from("news")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    i += 1;
    slug = makeSlug(title, String(i));
  }
}

async function uploadCoverIfProvided(
  formData: FormData
): Promise<string | null> {
  const file = formData.get("cover_image") as File | null;
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const optimized = await optimizeImage(Buffer.from(arrayBuffer));
  const path = `images/${randomUUID()}.${optimized.extension}`;
  const { url } = await uploadToMedia(
    supabase,
    path,
    optimized.buffer,
    optimized.contentType
  );

  const { data, error } = await supabase
    .from("images")
    .insert({
      storage_path: path,
      url,
      width: optimized.width,
      height: optimized.height,
      size_bytes: optimized.buffer.byteLength,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function createNews(
  _prevState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
  }

  let coverImageId: string | null = null;
  try {
    coverImageId = await uploadCoverIfProvided(formData);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Errore caricamento immagine: ${err.message}`
          : "Errore caricamento immagine di copertina.",
    };
  }

  const supabase = await createClient();
  const slug = await uniqueNewsSlug(parsed.data.title);

  const { data, error } = await supabase
    .from("news")
    .insert({
      slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      cover_image_id: coverImageId,
      featured: parsed.data.featured === "on",
      published: parsed.data.published === "on",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect(`/admin/news/${data.id}`);
}

export async function updateNews(
  id: string,
  _prevState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi" };
  }

  let coverImageId: string | undefined;
  try {
    const uploaded = await uploadCoverIfProvided(formData);
    if (uploaded) coverImageId = uploaded;
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? `Errore caricamento immagine: ${err.message}`
          : "Errore caricamento immagine di copertina.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("news")
    .update({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      ...(coverImageId ? { cover_image_id: coverImageId } : {}),
      featured: parsed.data.featured === "on",
      published: parsed.data.published === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
  revalidatePath("/news");
  revalidatePath("/");
  return {};
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
}
