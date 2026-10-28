-- Buyer contact clicks (WhatsApp / call / "show number") per listing (applied 2026-10-28).
-- Shows how many buyers each listing and each broker brings; admins read only.
create table if not exists public.contacts (
  id bigserial primary key,
  listing_id uuid references public.listings(id) on delete cascade,
  dealer_id uuid,
  kind text not null check (kind in ('whatsapp', 'call', 'show_number')),
  source text,
  created_at timestamptz not null default now()
);
create index if not exists contacts_created_idx on public.contacts (created_at);
create index if not exists contacts_listing_idx on public.contacts (listing_id);
alter table public.contacts enable row level security;
create policy "admins read contacts" on public.contacts for select using (public.is_admin());

create or replace function public.track_contact(p_listing uuid, p_kind text, p_source text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_kind not in ('whatsapp', 'call', 'show_number') then return; end if;
  insert into contacts (listing_id, dealer_id, kind, source)
  select l.id, l.dealer_id, p_kind, left(coalesce(p_source, 'direct'), 40)
  from listings l where l.id = p_listing;
end $$;
grant execute on function public.track_contact(uuid, text, text) to anon, authenticated;

-- Aggregated contact numbers for the admin page (admins only).
create or replace function public.contact_stats(p_days integer default 30)
returns json language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  return json_build_object(
    'total', (select count(*) from contacts where created_at >= since and kind <> 'show_number'),
    'today', (select count(*) from contacts where kind <> 'show_number' and created_at >= date_trunc('day', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai'),
    'by_kind', (select coalesce(json_object_agg(kind, n), '{}'::json) from (
        select kind, count(*) as n from contacts where created_at >= since group by 1) k),
    'by_dealer', (select coalesce(json_agg(d order by d.n desc), '[]'::json) from (
        select coalesce(dl.name, 'بدون وسيط') as name, count(*) as n
        from contacts c left join dealers dl on dl.id = c.dealer_id
        where c.created_at >= since and c.kind <> 'show_number' group by 1) d),
    'top_listings', (select coalesce(json_agg(t order by t.n desc), '[]'::json) from (
        select c.listing_id, count(*) as n, max(l.make || ' ' || l.model || ' ' || l.year) as title
        from contacts c join listings l on l.id = c.listing_id
        where c.created_at >= since and c.kind <> 'show_number'
        group by c.listing_id order by count(*) desc limit 10) t)
  );
end $$;
grant execute on function public.contact_stats(integer) to authenticated;
