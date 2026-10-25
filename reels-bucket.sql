-- Public bucket for generated social reels (tools/reel.html). Admins upload.
insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
values ('reels','reels',true,array['video/mp4'],52428800) on conflict (id) do nothing;
create policy "admins upload reels" on storage.objects for insert to authenticated
  with check (bucket_id = 'reels' and public.is_admin());
