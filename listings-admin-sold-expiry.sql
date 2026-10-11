-- Admin role, sold flag and 30-day expiry for listings (applied 2026-10-11).

-- Who is an admin. Rows are added by hand in SQL; nobody can add themselves.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Add an admin by hand:
--   insert into public.admins (user_id) select id from auth.users where email = '<owner email>';

-- Sold and expiry. Existing rows expire 30 days after this migration.
alter table public.listings
  add column if not exists sold boolean not null default false,
  add column if not exists sold_at timestamptz,
  add column if not exists expires_at timestamptz default (now() + interval '30 days');
update public.listings set expires_at = now() + interval '30 days' where expires_at is null;

-- Admins can edit and delete any listing, and read / clear reports.
drop policy if exists "admins update listings" on public.listings;
create policy "admins update listings" on public.listings for update using (public.is_admin());
drop policy if exists "admins delete listings" on public.listings;
create policy "admins delete listings" on public.listings for delete using (public.is_admin());
drop policy if exists "admins read reports" on public.reports;
create policy "admins read reports" on public.reports for select using (public.is_admin());
drop policy if exists "admins delete reports" on public.reports;
create policy "admins delete reports" on public.reports for delete using (public.is_admin());
drop policy if exists "admins delete car images" on storage.objects;
create policy "admins delete car images" on storage.objects for delete
  using (bucket_id = 'car-images' and public.is_admin());
