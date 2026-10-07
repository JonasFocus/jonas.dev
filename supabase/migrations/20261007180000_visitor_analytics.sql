-- First-party visit statistics. No raw IPs: visitor_key is an HMAC of IP, user agent and the UTC day,
-- so the same person gets a new key every day and keys cannot be reversed.
create table public.visitor_sessions (
  id uuid primary key,
  visitor_key text not null check (length(visitor_key) between 16 and 64),
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  engaged_seconds integer not null default 0 check (engaged_seconds >= 0),
  landing_path text not null check (length(landing_path) between 1 and 300),
  referrer text check (length(referrer) <= 200),
  utm_source text check (length(utm_source) <= 100),
  device text not null default 'unknown' check (device in ('desktop','mobile','tablet','unknown')),
  browser text check (length(browser) <= 40),
  os text check (length(os) <= 40),
  country text check (length(country) <= 2),
  pageviews integer not null default 0,
  events integer not null default 0
);
create index visitor_sessions_started_idx on public.visitor_sessions(started_at desc);
create index visitor_sessions_key_idx on public.visitor_sessions(visitor_key, started_at);
create table public.visitor_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.visitor_sessions(id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null check (type in ('pageview','click','outbound','scroll','form')),
  path text not null check (length(path) between 1 and 300),
  label text check (length(label) <= 160)
);
create index visitor_events_created_idx on public.visitor_events(created_at desc);
create index visitor_events_session_idx on public.visitor_events(session_id, created_at);

alter table public.visitor_sessions enable row level security;
alter table public.visitor_events enable row level security;
revoke all on public.visitor_sessions, public.visitor_events from public, anon, authenticated;
grant select on public.visitor_sessions, public.visitor_events to authenticated;
create policy owner_visitor_sessions on public.visitor_sessions for select to authenticated using ((select public.is_owner()));
create policy owner_visitor_events on public.visitor_events for select to authenticated using ((select public.is_owner()));

-- Called only by the server route with the secret key. A beat with no events just extends the session.
create function public.track_visit(p_session uuid, p_visitor_key text, p_meta jsonb, p_events jsonb, p_engaged integer)
returns void language plpgsql security definer set search_path='' as $$
declare s public.visitor_sessions; e jsonb; added integer := 0; views integer := 0;
begin
  if jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) > 30 then raise exception 'INVALID_EVENTS'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_session::text, 0));
  select * into s from public.visitor_sessions where id = p_session;
  if not found then
    -- Caps how many sessions one visitor can open per hour, so a script cannot flood the table.
    if (select count(*) from public.visitor_sessions where visitor_key = p_visitor_key and started_at > now() - interval '1 hour') >= 30 then
      return;
    end if;
    insert into public.visitor_sessions(id, visitor_key, landing_path, referrer, utm_source, device, browser, os, country)
    values (p_session, p_visitor_key, coalesce(nullif(p_meta->>'path',''), '/'), nullif(p_meta->>'referrer',''), nullif(p_meta->>'utmSource',''),
      coalesce(p_meta->>'device','unknown'), nullif(p_meta->>'browser',''), nullif(p_meta->>'os',''), nullif(p_meta->>'country',''))
    returning * into s;
    if random() < 0.02 then
      delete from public.visitor_sessions where started_at < now() - interval '180 days';
    end if;
  elsif s.visitor_key <> p_visitor_key or s.started_at < now() - interval '12 hours' or s.events >= 1000 then
    return;
  end if;
  for e in select value from jsonb_array_elements(p_events) loop
    exit when s.events + added >= 1000;
    insert into public.visitor_events(session_id, type, path, label)
    values (p_session, e->>'type', e->>'path', nullif(e->>'label',''));
    added := added + 1;
    if e->>'type' = 'pageview' then views := views + 1; end if;
  end loop;
  update public.visitor_sessions set
    last_seen_at = now(),
    -- Engaged time can never run ahead of wall-clock time since the session began.
    engaged_seconds = least(engaged_seconds + greatest(0, least(coalesce(p_engaged, 0), 60)), ceil(extract(epoch from now() - started_at))::integer + 1),
    pageviews = pageviews + views,
    events = events + added
  where id = p_session;
end;
$$;
revoke all on function public.track_visit(uuid,text,jsonb,jsonb,integer) from public, anon, authenticated;
grant execute on function public.track_visit(uuid,text,jsonb,jsonb,integer) to service_role;

-- Dashboard summary. Runs as the caller, so row-level security limits it to the owner.
create function public.visitor_stats(p_days integer) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 366)));
begin
  if not public.is_owner() then raise exception 'NOT_AUTHORIZED'; end if;
  return jsonb_build_object(
    'totals', (select jsonb_build_object(
        'sessions', count(*),
        'visitors', count(distinct visitor_key),
        'pageviews', coalesce(sum(pageviews), 0),
        'avgEngaged', coalesce(round(avg(engaged_seconds)), 0),
        'medianEngaged', coalesce(percentile_cont(0.5) within group (order by engaged_seconds), 0),
        'bounceRate', coalesce(round(100.0 * count(*) filter (where pageviews <= 1 and engaged_seconds < 10) / nullif(count(*), 0)), 0),
        'pagesPerSession', coalesce(round(avg(pageviews)::numeric, 1), 0)
      ) from public.visitor_sessions where started_at >= since),
    'live', (select count(*) from public.visitor_sessions where last_seen_at > now() - interval '5 minutes'),
    'daily', (select coalesce(jsonb_agg(d order by d.day), '[]') from (
        select to_char(date_trunc('day', started_at at time zone 'America/Chicago'), 'YYYY-MM-DD') as day,
          count(*) as sessions, count(distinct visitor_key) as visitors, sum(pageviews) as pageviews,
          round(avg(engaged_seconds)) as "avgEngaged"
        from public.visitor_sessions where started_at >= since group by 1) d),
    'pages', (select coalesce(jsonb_agg(p), '[]') from (
        select path as label, count(*) as count from public.visitor_events
        where type = 'pageview' and created_at >= since group by path order by count(*) desc, path limit 10) p),
    'referrers', (select coalesce(jsonb_agg(r), '[]') from (
        select coalesce(referrer, 'Direct') as label, count(*) as count from public.visitor_sessions
        where started_at >= since group by 1 order by count(*) desc, 1 limit 10) r),
    'clicks', (select coalesce(jsonb_agg(c), '[]') from (
        select label, count(*) as count from public.visitor_events
        where type in ('click','outbound','form') and label is not null and created_at >= since group by label order by count(*) desc, label limit 10) c),
    'devices', (select coalesce(jsonb_agg(v), '[]') from (
        select device as label, count(*) as count from public.visitor_sessions
        where started_at >= since group by device order by count(*) desc, device) v),
    'countries', (select coalesce(jsonb_agg(v), '[]') from (
        select coalesce(country, '??') as label, count(*) as count from public.visitor_sessions
        where started_at >= since group by 1 order by count(*) desc, 1 limit 10) v),
    'browsers', (select coalesce(jsonb_agg(v), '[]') from (
        select coalesce(browser, 'Other') as label, count(*) as count from public.visitor_sessions
        where started_at >= since group by 1 order by count(*) desc, 1 limit 10) v)
  );
end;
$$;
revoke all on function public.visitor_stats(integer) from public, anon;
grant execute on function public.visitor_stats(integer) to authenticated;
