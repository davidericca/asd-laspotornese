-- =========================================================================
-- ASD La Spotornese — schema iniziale del database
-- =========================================================================
-- Questo file va eseguito UNA VOLTA nel progetto Supabase (SQL Editor
-- oppure con la Supabase CLI: `supabase db push`). Vedi README.md per la
-- guida passo-passo.
--
-- Contiene:
--   1. estensioni necessarie
--   2. tabelle (admins, site_content, galleries, images, events, news,
--      attachments)
--   3. funzione helper is_admin()
--   4. Row Level Security: lettura pubblica dei contenuti pubblicati,
--      scrittura riservata solo agli amministratori
--   5. bucket di storage per immagini e documenti + relative policy
-- =========================================================================

-- 1. Estensioni ----------------------------------------------------------
create extension if not exists "pgcrypto"; -- per gen_random_uuid()

-- 2. Tabelle ---------------------------------------------------------------

-- Elenco degli utenti autorizzati ad amministrare il sito.
-- L'utente deve prima essere creato in Supabase Auth (Authentication > Users),
-- poi il suo id va aggiunto qui per abilitarlo come amministratore.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Contenuti testuali modificabili delle pagine statiche (Home, La Società,
-- Attività, Contatti). Ogni riga è un "blocco" identificato da una chiave.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Gallerie fotografiche
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  event_id uuid, -- collegata opzionalmente a un evento (FK aggiunta dopo la tabella events)
  cover_image_id uuid, -- FK aggiunta dopo la tabella images
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Immagini caricate dall'amministratore
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references public.galleries (id) on delete set null,
  storage_path text not null, -- percorso nel bucket "media"
  url text not null, -- url pubblico calcolato al momento dell'upload
  width int,
  height int,
  size_bytes int,
  title text,
  description text,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.galleries
  add constraint galleries_cover_image_fk
  foreign key (cover_image_id) references public.images (id) on delete set null;

-- Eventi e gare
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  event_date date not null,
  event_time time,
  end_date date,
  location text,
  status text not null default 'prossimo' check (status in ('prossimo', 'concluso', 'annullato')),
  extra_info text,
  cover_image_id uuid references public.images (id) on delete set null,
  gallery_id uuid references public.galleries (id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.galleries
  add constraint galleries_event_fk
  foreign key (event_id) references public.events (id) on delete set null;

-- News e comunicazioni
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null,
  cover_image_id uuid references public.images (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Allegati (regolamenti, documenti) collegati a eventi o news
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  related_type text not null check (related_type in ('event', 'news')),
  related_id uuid not null,
  file_name text not null,
  storage_path text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_images_gallery on public.images (gallery_id);
create index if not exists idx_events_date on public.events (event_date desc);
create index if not exists idx_events_status on public.events (status);
create index if not exists idx_news_published_at on public.news (published_at desc);
create index if not exists idx_attachments_related on public.attachments (related_type, related_id);

-- 3. Funzione helper: l'utente corrente è un amministratore? --------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- 4. Row Level Security -----------------------------------------------------

alter table public.admins enable row level security;
alter table public.site_content enable row level security;
alter table public.galleries enable row level security;
alter table public.images enable row level security;
alter table public.events enable row level security;
alter table public.news enable row level security;
alter table public.attachments enable row level security;

-- admins: solo un amministratore può leggere/gestire la lista admin
drop policy if exists "admins_select" on public.admins;
create policy "admins_select" on public.admins for select using (public.is_admin());
drop policy if exists "admins_all" on public.admins;
create policy "admins_all" on public.admins for all using (public.is_admin()) with check (public.is_admin());

-- site_content: lettura pubblica, scrittura solo admin
drop policy if exists "site_content_select" on public.site_content;
create policy "site_content_select" on public.site_content for select using (true);
drop policy if exists "site_content_write" on public.site_content;
create policy "site_content_write" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

-- galleries: lettura pubblica, scrittura solo admin
drop policy if exists "galleries_select" on public.galleries;
create policy "galleries_select" on public.galleries for select using (true);
drop policy if exists "galleries_write" on public.galleries;
create policy "galleries_write" on public.galleries for all using (public.is_admin()) with check (public.is_admin());

-- images: lettura pubblica, scrittura solo admin
drop policy if exists "images_select" on public.images;
create policy "images_select" on public.images for select using (true);
drop policy if exists "images_write" on public.images;
create policy "images_write" on public.images for all using (public.is_admin()) with check (public.is_admin());

-- events: lettura pubblica dei pubblicati, admin vede/gestisce tutto
drop policy if exists "events_select_public" on public.events;
create policy "events_select_public" on public.events for select using (published = true or public.is_admin());
drop policy if exists "events_write" on public.events;
create policy "events_write" on public.events for all using (public.is_admin()) with check (public.is_admin());

-- news: lettura pubblica dei pubblicati, admin vede/gestisce tutto
drop policy if exists "news_select_public" on public.news;
create policy "news_select_public" on public.news for select using (published = true or public.is_admin());
drop policy if exists "news_write" on public.news;
create policy "news_write" on public.news for all using (public.is_admin()) with check (public.is_admin());

-- attachments: lettura pubblica, scrittura solo admin
drop policy if exists "attachments_select" on public.attachments;
create policy "attachments_select" on public.attachments for select using (true);
drop policy if exists "attachments_write" on public.attachments;
create policy "attachments_write" on public.attachments for all using (public.is_admin()) with check (public.is_admin());

-- 5. Storage: bucket pubblico per media (immagini + documenti) ------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  15728640, -- 15 MB max per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- =========================================================================
-- Fine schema iniziale.
-- Dopo aver eseguito questo file, ricordati di:
--  1. Creare il tuo utente amministratore in Authentication > Users
--  2. Inserire il suo id nella tabella admins, es.:
--     insert into public.admins (user_id, full_name)
--     values ('INCOLLA-QUI-USER-ID', 'Nome Cognome');
-- Vedi README.md per la guida completa.
-- =========================================================================
