-- 2026-10-22: broker accounts. A dealer row can be linked to a site user
-- (dealers.user_id); that user's new listings get the dealer_id automatically
-- (App.jsx myDealer). The trigger stops anyone else from posting as a dealer.
alter table public.dealers add column if not exists user_id uuid references auth.users(id) on delete set null;
create unique index if not exists dealers_user_id_key on public.dealers(user_id) where user_id is not null;
create or replace function public.check_listing_dealer() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.dealer_id is not null
     and (tg_op = 'INSERT' or new.dealer_id is distinct from old.dealer_id)
     and auth.uid() is not null
     and not public.is_admin()
     and not exists (select 1 from public.dealers d where d.id = new.dealer_id and d.user_id = auth.uid()) then
    raise exception 'not allowed to post as this dealer';
  end if;
  return new;
end $$;
create trigger listings_check_dealer before insert or update of dealer_id on public.listings
for each row execute function public.check_listing_dealer();
