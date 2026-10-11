-- Views counter, visitor stats and dealer pages (applied 2026-10-11).
alter table public.listings add column if not exists views integer not null default 0, add column if not exists dealer_id uuid;

create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  instagram text,
  phone text,
  city text,
  verified boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.dealers enable row level security;
create policy "public read dealers" on public.dealers for select using (true);
create policy "admins insert dealers" on public.dealers for insert with check (public.is_admin());
create policy "admins update dealers" on public.dealers for update using (public.is_admin());
create policy "admins delete dealers" on public.dealers for delete using (public.is_admin());
alter table public.listings add constraint listings_dealer_fk foreign key (dealer_id) references public.dealers(id) on delete set null;

-- One row per page visit; only admins can read it. Written through track_visit().
create table if not exists public.visits (
  id bigserial primary key,
  path text,
  source text,
  listing_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists visits_created_idx on public.visits (created_at);
alter table public.visits enable row level security;
create policy "admins read visits" on public.visits for select using (public.is_admin());

create or replace function public.track_visit(p_path text, p_source text, p_listing uuid default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into visits (path, source, listing_id) values (left(coalesce(p_path, '/'), 200), left(coalesce(p_source, 'direct'), 40), p_listing);
  if p_listing is not null then
    update listings set views = views + 1 where id = p_listing;
  end if;
end $$;
grant execute on function public.track_visit(text, text, uuid) to anon, authenticated;

-- Aggregated numbers for the admin page (admins only).
create or replace function public.visit_stats(p_days integer default 30)
returns json language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  return json_build_object(
    'total', (select count(*) from visits where created_at >= since),
    'today', (select count(*) from visits where created_at >= date_trunc('day', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai'),
    'by_day', (select coalesce(json_agg(d order by d.day), '[]'::json) from (
        select to_char(created_at at time zone 'Asia/Dubai', 'YYYY-MM-DD') as day, count(*) as n
        from visits where created_at >= since group by 1) d),
    'by_source', (select coalesce(json_agg(s order by s.n desc), '[]'::json) from (
        select source, count(*) as n from visits where created_at >= since group by 1) s),
    'top_listings', (select coalesce(json_agg(t order by t.n desc), '[]'::json) from (
        select v.listing_id, count(*) as n, max(l.make || ' ' || l.model || ' ' || l.year) as title
        from visits v join listings l on l.id = v.listing_id
        where v.created_at >= since group by v.listing_id order by count(*) desc limit 10) t)
  );
end $$;
grant execute on function public.visit_stats(integer) to authenticated;
