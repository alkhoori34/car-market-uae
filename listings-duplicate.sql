-- Hidden duplicate listings (applied 2026-10-28). The nightly import hides the
-- NEW copy of a car already on the site with duplicate = true and
-- expires_at = now(); the admin panel lists them under «مكرر», not «منتهية».
alter table public.listings add column if not exists duplicate boolean not null default false;
