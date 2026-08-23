-- Schema iniziale ASD La Spotornese
-- Da eseguire una sola volta nell'SQL Editor del progetto Supabase.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabelle
-- ---------------------------------------------------------------------

create table admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries (id) on delete cascade,
  url text not null,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  event_date date not null,
  event_time time,
  location text,
  status text not null default 'programmato'
    check (status in ('programmato', 'in corso', 'concluso', 'annullato')),
  description text,
  cover_image_url text,
  gallery_id uuid references galleries (id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,
  cover_image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table attachments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events (id) on delete cascade,
  news_id uuid references news (id) on delete cascade,
  file_url text not null,
  file_name text not null,
  created_at timestamptz not null default now(),
  constraint attachments_single_parent check (
    (event_id is not null and news_id is null) or
    (event_id is null and news_id is not null)
  )
);

create table site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at automatico
-- ---------------------------------------------------------------------

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on galleries
  for each row execute function set_updated_at();
create trigger set_updated_at before update on events
  for each row execute function set_updated_at();
create trigger set_updated_at before update on news
  for each row execute function set_updated_at();
create trigger set_updated_at before update on site_content
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- is_admin(): usata da tutte le policy di scrittura.
-- SECURITY DEFINER perche' un admin comune non avrebbe altrimenti i
-- permessi per leggere la tabella "admins" e verificare se stesso.
-- ---------------------------------------------------------------------

create function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admins where id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table admins enable row level security;
alter table galleries enable row level security;
alter table images enable row level security;
alter table events enable row level security;
alter table news enable row level security;
alter table attachments enable row level security;
alter table site_content enable row level security;

-- admins: solo un admin puo' vedere l'elenco admin; nessuna scrittura
-- da client, va gestita a mano dall'SQL Editor.
create policy "admins_select_admin" on admins
  for select using (is_admin());

-- galleries / images: lettura pubblica, scrittura solo admin.
create policy "galleries_select_public" on galleries
  for select using (true);
create policy "galleries_write_admin" on galleries
  for all using (is_admin()) with check (is_admin());

create policy "images_select_public" on images
  for select using (true);
create policy "images_write_admin" on images
  for all using (is_admin()) with check (is_admin());

-- events / news: lettura pubblica dei soli pubblicati, admin vede/scrive tutto.
create policy "events_select_published" on events
  for select using (published or is_admin());
create policy "events_write_admin" on events
  for all using (is_admin()) with check (is_admin());

create policy "news_select_published" on news
  for select using (published or is_admin());
create policy "news_write_admin" on news
  for all using (is_admin()) with check (is_admin());

-- attachments: lettura pubblica, scrittura solo admin.
create policy "attachments_select_public" on attachments
  for select using (true);
create policy "attachments_write_admin" on attachments
  for all using (is_admin()) with check (is_admin());

-- site_content: lettura pubblica, scrittura solo admin.
create policy "site_content_select_public" on site_content
  for select using (true);
create policy "site_content_write_admin" on site_content
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- Storage: bucket immagini pubblico in lettura, upload solo admin.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_bucket_select_public" on storage.objects
  for select using (bucket_id = 'images');

create policy "images_bucket_write_admin" on storage.objects
  for all using (bucket_id = 'images' and is_admin())
  with check (bucket_id = 'images' and is_admin());
