-- Funzione "anti-pausa" per il piano gratuito Supabase. Il risveglio
-- automatico (GitHub Actions) la chiama ogni giorno: scrive davvero nel
-- database, cosi' il progetto risulta attivo e non va in pausa.
-- La tabella ha una sola riga, quindi non cresce mai. Nessuno puo' leggerla
-- o modificarla direttamente (RLS attivo e nessuna policy): si puo' solo
-- chiamare la funzione. Da eseguire una sola volta nell'SQL Editor del
-- progetto Supabase.

create table if not exists keepalive (
  id int primary key default 1 check (id = 1),
  pings bigint not null default 0,
  last_ping timestamptz not null default now()
);

alter table keepalive enable row level security;

-- Il corpo e' scritto tra apici (senza il doppio dollaro) per evitare
-- problemi di copia-incolla nell'SQL Editor.
create or replace function keepalive_ping() returns timestamptz language sql security definer set search_path = public as 'insert into keepalive (id, pings, last_ping) values (1, 1, now()) on conflict (id) do update set pings = keepalive.pings + 1, last_ping = now() returning last_ping';

revoke all on function keepalive_ping() from public;
grant execute on function keepalive_ping() to anon, authenticated;
