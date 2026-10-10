-- Run once in Supabase: SQL Editor → New query → paste → Run
-- Adds the "negotiable" flag and the earlier asking price used for the discount badge.

alter table listings add column if not exists negotiable boolean not null default false;
alter table listings add column if not exists previous_price numeric;
