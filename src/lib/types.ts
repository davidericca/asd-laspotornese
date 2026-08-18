/**
 * Tipi TypeScript che rispecchiano lo schema del database (vedi
 * supabase/migrations/0001_init.sql). Tenerli allineati manualmente allo
 * schema è sufficiente per un progetto di queste dimensioni; in futuro si
 * possono generare automaticamente con `supabase gen types typescript`.
 */

export type EventStatus = "prossimo" | "concluso" | "annullato";

export interface ImageRow {
  id: string;
  gallery_id: string | null;
  storage_path: string;
  url: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  title: string | null;
  description: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  event_id: string | null;
  cover_image_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryWithImages extends GalleryRow {
  images: ImageRow[];
  cover_image: ImageRow | null;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  event_date: string; // YYYY-MM-DD
  event_time: string | null; // HH:MM:SS
  end_date: string | null;
  location: string | null;
  status: EventStatus;
  extra_info: string | null;
  cover_image_id: string | null;
  gallery_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventWithRelations extends EventRow {
  cover_image: ImageRow | null;
  gallery: GalleryWithImages | null;
  attachments: AttachmentRow[];
}

export interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_id: string | null;
  featured: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface NewsWithRelations extends NewsRow {
  cover_image: ImageRow | null;
  attachments: AttachmentRow[];
}

export interface AttachmentRow {
  id: string;
  related_type: "event" | "news";
  related_id: string;
  file_name: string;
  storage_path: string;
  url: string;
  created_at: string;
}

export interface AdminRow {
  user_id: string;
  full_name: string | null;
  created_at: string;
}

export interface SiteContentRow {
  key: string;
  value: unknown;
  updated_at: string;
}
