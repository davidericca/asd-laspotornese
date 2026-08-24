-- Foto di copertina opzionale per le attività, usata nell'indice fotografico
-- della homepage. Da eseguire una sola volta nell'SQL Editor del progetto Supabase.

alter table activities add column cover_image_url text;
