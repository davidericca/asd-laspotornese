-- =========================================================================
-- Dati dimostrativi (placeholder) — facoltativo.
-- Utile per vedere subito il sito popolato in fase di sviluppo/collaudo.
-- Sostituisci/elimina questi contenuti dal pannello admin con quelli reali.
-- =========================================================================

insert into public.site_content (key, value) values
  ('home_hero_title', '"ASD La Spotornese"'),
  ('home_hero_subtitle', '"[INSERIRE BREVE PRESENTAZIONE DELLA SOCIETÀ]"'),
  ('about_text', '"[INSERIRE STORIA DELLA SOCIETÀ]"')
on conflict (key) do nothing;

insert into public.news (slug, title, excerpt, body, featured, published, published_at) values
  (
    'benvenuti-nuovo-sito',
    'Benvenuti nel nuovo sito della Spotornese',
    'La nostra associazione ha finalmente un nuovo punto di riferimento online.',
    '[INSERIRE TESTO DELLA COMUNICAZIONE] — Da oggi tutte le informazioni su eventi, gare e attività della ASD La Spotornese saranno disponibili su questo sito.',
    true,
    true,
    now()
  )
on conflict (slug) do nothing;

insert into public.events (slug, title, description, event_date, event_time, location, status, published) values
  (
    'gara-sociale-esempio',
    'Gara Sociale di Pesca [ESEMPIO]',
    '[INSERIRE DESCRIZIONE DELL''EVENTO] — Dettagli su modalità di partecipazione, categorie e premi.',
    (current_date + interval '30 days')::date,
    '08:00',
    '[INSERIRE LUOGO]',
    'prossimo',
    true
  )
on conflict (slug) do nothing;
