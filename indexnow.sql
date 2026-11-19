-- IndexNow (Bing, Yandex, Seznam…): tells search engines about new pages
-- straight from Supabase, no computer needed. Added 2026-11-19.
-- Key file: public/27f263a090f418336e799365678c8097.txt (public by design).
-- Google does not take IndexNow; Google indexing requests stay manual in
-- Search Console.
--
-- indexnow_submit(hours): sends live car pages created in the last <hours>
-- hours plus published news from the same window. hours => 0 sends every
-- live car page and the main pages (one-off full submission).
-- Results are logged in public.ops_runs (task 'indexnow'); the HTTP reply
-- lands in net._http_response.

create or replace function public.indexnow_submit(hours int default 26)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  urls text[];
  n int;
begin
  select array_agg(u) into urls from (select u from (
    select 'https://carsuae.net/car/' || id as u
      from listings
     where coalesce(sold, false) = false
       and coalesce(duplicate, false) = false
       and (expires_at is null or expires_at > now())
       and (hours = 0 or created_at > now() - make_interval(hours => hours))
    union all
    select 'https://carsuae.net/news/' || slug
      from news
     where published
       and (hours = 0 or coalesce(published_at, created_at) > now() - make_interval(hours => hours))
    union all
    select unnest(array[
      'https://carsuae.net/', 'https://carsuae.net/used-cars',
      'https://carsuae.net/news', 'https://carsuae.net/blog'])
     where hours = 0
  ) x limit 10000) s;

  n := coalesce(array_length(urls, 1), 0);
  if n > 0 then
    perform net.http_post(
      url := 'https://api.indexnow.org/indexnow',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'host', 'carsuae.net',
        'key', '27f263a090f418336e799365678c8097',
        'keyLocation', 'https://carsuae.net/27f263a090f418336e799365678c8097.txt',
        'urlList', to_jsonb(urls)),
      timeout_milliseconds := 20000);
  end if;

  insert into ops_runs (task, ok, note)
  values ('indexnow', true, n || ' urls sent (window ' || hours || 'h)');
  return n;
end $$;

revoke all on function public.indexnow_submit(int) from public, anon, authenticated;

-- Every day 03:17 Dubai (23:17 UTC).
select cron.schedule('indexnow-daily', '17 23 * * *', $$select public.indexnow_submit(26)$$);

-- First run on 2026-11-19 got 403 SiteVerificationNotCompleted (normal on
-- first use while IndexNow fetches the key file); a one-off job
-- 'indexnow-full-retry' re-sent the full list and removed itself.
