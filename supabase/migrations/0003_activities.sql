-- Attivita' dell'associazione, mostrate come schede nella pagina pubblica.
-- Da eseguire una sola volta nell'SQL Editor del progetto Supabase.

create table activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on activities
  for each row execute function set_updated_at();

alter table activities enable row level security;

create policy "activities_select_published" on activities
  for select using (published or is_admin());

create policy "activities_write_admin" on activities
  for all using (is_admin()) with check (is_admin());
