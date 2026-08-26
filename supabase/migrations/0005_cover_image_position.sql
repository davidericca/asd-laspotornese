-- Punto di inquadratura (object-position) per le foto di copertina che
-- vengono ritagliate nel sito pubblico, cosi' l'admin puo' scegliere quale
-- parte della foto restare sempre visibile (come il riposizionamento della
-- foto profilo su Instagram). Da eseguire una sola volta nell'SQL Editor
-- del progetto Supabase.

alter table events add column cover_image_position text;
alter table news add column cover_image_position text;
alter table galleries add column cover_image_position text;
