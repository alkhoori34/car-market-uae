-- Paid featuring (تمييز الإعلان بالدفع) through Ziina; applied as migration
-- feature_payments on 2026-11-17. Rows are written only by the edge function
-- feature-pay (service role); RLS on with no policies.
create table if not exists public.feature_payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  plan text not null,
  days int not null,
  amount_fils int not null,
  ziina_id text unique,
  status text not null default 'created',
  test boolean not null default false,
  applied boolean not null default false,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.feature_payments enable row level security;
create index if not exists feature_payments_listing_idx on public.feature_payments(listing_id);

-- Marks a payment as paid and features its listing, once only. The paid
-- period is added after any featured time the listing still has, and the
-- listing does not expire before the paid period ends.
create or replace function public.apply_feature_payment(p_ziina_id text)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v_listing uuid; v_days int; v_until timestamptz;
begin
  update public.feature_payments set applied = true, status = 'completed', paid_at = now()
   where ziina_id = p_ziina_id and applied = false
   returning listing_id, days into v_listing, v_days;
  if v_listing is null then
    select l.featured_until into v_until from public.feature_payments p join public.listings l on l.id = p.listing_id where p.ziina_id = p_ziina_id;
    return v_until;
  end if;
  update public.listings
     set featured_until = greatest(coalesce(featured_until, now()), now()) + make_interval(days => v_days),
         expires_at = greatest(expires_at, greatest(coalesce(featured_until, now()), now()) + make_interval(days => v_days))
   where id = v_listing
   returning featured_until into v_until;
  return v_until;
end $$;
revoke all on function public.apply_feature_payment(text) from public, anon, authenticated;
grant execute on function public.apply_feature_payment(text) to service_role;
