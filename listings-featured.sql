-- Featured (مميز) listings: admins set featured_until; the app shows a
-- «مميز» tag and puts live featured cars first (home and "newest" sort).
alter table public.listings add column if not exists featured_until timestamptz;

create or replace function public.listings_check_featured() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- Only admins (or the service role / SQL editor, where auth.uid() is null) may feature a listing.
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.featured_until := null;
    elsif new.featured_until is distinct from old.featured_until then
      new.featured_until := old.featured_until;
    end if;
  end if;
  return new;
end $$;

create trigger listings_check_featured
before insert or update on public.listings
for each row execute function public.listings_check_featured();
