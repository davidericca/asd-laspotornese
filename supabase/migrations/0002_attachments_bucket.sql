-- Bucket storage per i PDF allegati a eventi/news (locandine, regolamenti).
-- Da eseguire una sola volta nell'SQL Editor del progetto Supabase.

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

create policy "attachments_bucket_select_public" on storage.objects
  for select using (bucket_id = 'attachments');

create policy "attachments_bucket_write_admin" on storage.objects
  for all using (bucket_id = 'attachments' and is_admin())
  with check (bucket_id = 'attachments' and is_admin());
