-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run
-- This replaces the old single-blob kv_store approach with a proper table
-- where each listing is tied to the account that created it.

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) on delete cascade,
  make text not null,
  model text not null,
  body_type text,
  year int,
  price numeric,
  mileage numeric,
  city text,
  fuel text,
  trans text,
  condition text,
  description text,
  phone text,
  seller_name text,
  image text,
  created_at timestamptz default now()
);

alter table listings enable row level security;

-- Anyone (including logged-out visitors) can browse listings.
create policy "Public can read listings"
  on listings for select
  using (true);

-- Only a logged-in user can create a listing, and only under their own account.
create policy "Users can insert their own listings"
  on listings for insert
  with check (auth.uid() = seller_id);

-- A user can only edit their own listings.
create policy "Users can update their own listings"
  on listings for update
  using (auth.uid() = seller_id);

-- A user can only delete their own listings.
create policy "Users can delete their own listings"
  on listings for delete
  using (auth.uid() = seller_id);

-- (Optional cleanup: the old kv_store table is no longer used by the app
-- once you deploy the updated index.html. You can drop it later with:
-- drop table if exists kv_store;)
