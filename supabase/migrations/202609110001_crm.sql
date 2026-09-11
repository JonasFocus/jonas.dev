create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  singleton boolean not null default true unique check (singleton)
);
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) between 3 and 254),
  company text check (length(company)<=160),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);
create table public.requests (
  id uuid primary key,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) between 3 and 254),
  company text check (length(company)<=160),
  service text not null check(service in ('website','saas','web-app','other')),
  description text not null check(length(description) between 20 and 5000),
  budget text check(length(budget)<=120), timeline text check(length(timeline)<=120),
  case_study text check(case_study in ('emerald','violet','amber')),
  status text not null default 'new' check(status in ('new','contacted','qualified','closed','spam')),
  read_at timestamptz, customer_id uuid references public.customers(id),
  privacy_version text not null default '2026-09-11'
);
create index requests_created_idx on public.requests(created_at desc);
create index requests_status_idx on public.requests(status,created_at desc);
create index requests_customer_idx on public.requests(customer_id);
create table public.request_notes (
  id uuid primary key default gen_random_uuid(), request_id uuid not null references public.requests(id) on delete cascade,
  body text not null check(length(body) between 1 and 5000), created_at timestamptz not null default now()
);
create index request_notes_request_idx on public.request_notes(request_id,created_at);
create table public.follow_ups (
  id uuid primary key default gen_random_uuid(), request_id uuid not null references public.requests(id) on delete cascade,
  title text not null check(length(title) between 1 and 200), due_at timestamptz not null,
  completed_at timestamptz, created_at timestamptz not null default now()
);
create index follow_ups_due_idx on public.follow_ups(due_at) where completed_at is null;
create index follow_ups_request_idx on public.follow_ups(request_id);
create table public.activity_events (
  id uuid primary key default gen_random_uuid(), request_id uuid not null references public.requests(id) on delete cascade,
  action text not null, created_at timestamptz not null default now()
);
create index activity_events_request_idx on public.activity_events(request_id,created_at);
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.intake_limits (key text not null, window_start timestamptz not null, count int not null, primary key(key,window_start));

alter table public.admin_users enable row level security;
alter table public.customers enable row level security;
alter table public.requests enable row level security;
alter table public.request_notes enable row level security;
alter table public.follow_ups enable row level security;
alter table public.activity_events enable row level security;
revoke all on public.admin_users,public.customers,public.requests,public.request_notes,public.follow_ups,public.activity_events from anon,authenticated;
grant select on public.admin_users to authenticated;
create policy owner_membership on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
create function public.is_owner() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.admin_users where user_id=(select auth.uid()));
$$;
revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;
grant select,insert,update,delete on public.customers,public.requests,public.request_notes,public.follow_ups to authenticated;
grant select on public.activity_events to authenticated;
create policy owner_customers on public.customers to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_requests on public.requests to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_notes on public.request_notes to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_followups on public.follow_ups to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy owner_activity on public.activity_events for select to authenticated using ((select public.is_owner()));

create function public.submit_request(p_input jsonb,p_fingerprint text,p_ip_key text,p_email_key text)
returns uuid language plpgsql security definer set search_path='' as $$
declare found_fingerprint text; rid uuid := (p_input->>'submissionId')::uuid; bucket timestamptz := date_trunc('hour',now()); n integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(rid::text,0));
  select fingerprint into found_fingerprint from public.requests where id=rid;
  if found then
    if found_fingerprint<>p_fingerprint then raise exception 'SUBMISSION_CONFLICT'; end if;
    return rid;
  end if;
  insert into private.intake_limits(key,window_start,count) values(p_ip_key,bucket,1)
    on conflict(key,window_start) do update set count=private.intake_limits.count+1 returning count into n;
  if n>10 then raise exception 'RATE_LIMIT'; end if;
  insert into private.intake_limits(key,window_start,count) values(p_email_key,bucket,1)
    on conflict(key,window_start) do update set count=private.intake_limits.count+1 returning count into n;
  if n>3 then raise exception 'RATE_LIMIT'; end if;
  delete from private.intake_limits where window_start<now()-interval '2 days';
  insert into public.requests(id,fingerprint,name,email,company,service,description,budget,timeline,case_study)
  values(rid,p_fingerprint,p_input->>'name',p_input->>'email',nullif(p_input->>'company',''),p_input->>'service',p_input->>'description',nullif(p_input->>'budget',''),nullif(p_input->>'timeline',''),p_input->>'caseStudy');
  insert into public.activity_events(request_id,action) values(rid,'Request received');
  return rid;
end;
$$;
revoke all on function public.submit_request(jsonb,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_request(jsonb,text,text,text) to service_role;

create function public.convert_request(p_request_id uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare r public.requests; cid uuid;
begin
  if not public.is_owner() then raise exception 'NOT_AUTHORIZED'; end if;
  select * into r from public.requests where id=p_request_id for update;
  if not found then raise exception 'REQUEST_NOT_FOUND'; end if;
  if r.customer_id is not null then return r.customer_id; end if;
  if r.status='spam' then raise exception 'SPAM_REQUEST'; end if;
  insert into public.customers(name,email,company) values(r.name,r.email,r.company) returning id into cid;
  update public.requests set customer_id=cid where id=p_request_id;
  insert into public.activity_events(request_id,action) values(p_request_id,'Converted to customer');
  return cid;
end;
$$;
revoke all on function public.convert_request(uuid) from public,anon;
grant execute on function public.convert_request(uuid) to authenticated;

create function private.record_request_activity() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='requests' then
    if old.status is distinct from new.status then
      insert into public.activity_events(request_id,action) values(new.id,'Status changed to '||new.status);
    end if;
  elsif tg_table_name='request_notes' then
    insert into public.activity_events(request_id,action) values(new.request_id,'Internal note added');
  elsif tg_table_name='follow_ups' then
    if tg_op='INSERT' then
      insert into public.activity_events(request_id,action) values(new.request_id,'Follow-up scheduled');
    elsif old.completed_at is null and new.completed_at is not null then
      insert into public.activity_events(request_id,action) values(new.request_id,'Follow-up completed');
    end if;
  end if;
  return new;
end;
$$;
create trigger requests_activity after update on public.requests for each row execute function private.record_request_activity();
create trigger notes_activity after insert on public.request_notes for each row execute function private.record_request_activity();
create trigger followups_activity after insert or update on public.follow_ups for each row execute function private.record_request_activity();

-- Trusted setup and intake client only; this role never reaches the browser.
grant select, insert, delete on public.admin_users to service_role;
