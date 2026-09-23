-- Merge customers that share an email into the oldest record before enforcing uniqueness.
update public.requests r set customer_id = m.keep_id
from (
  select id, first_value(id) over (partition by lower(email) order by created_at, id) as keep_id
  from public.customers
) m
where r.customer_id = m.id and m.id <> m.keep_id;

delete from public.customers c
where exists (
  select 1 from public.customers o
  where lower(o.email) = lower(c.email) and (o.created_at, o.id) < (c.created_at, c.id)
);

create unique index customers_email_lower_key on public.customers (lower(email));

create or replace function public.convert_request(p_request_id uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare r public.requests; cid uuid;
begin
  if not public.is_owner() then raise exception 'NOT_AUTHORIZED'; end if;
  select * into r from public.requests where id=p_request_id for update;
  if not found then raise exception 'REQUEST_NOT_FOUND'; end if;
  if r.customer_id is not null then return r.customer_id; end if;
  if r.status='spam' then raise exception 'SPAM_REQUEST'; end if;
  insert into public.customers(name,email,company) values(r.name,r.email,r.company)
    on conflict (lower(email)) do nothing returning id into cid;
  if cid is null then
    select id into strict cid from public.customers where lower(email)=lower(r.email);
  end if;
  update public.requests set customer_id=cid where id=p_request_id;
  insert into public.activity_events(request_id,action) values(p_request_id,'Converted to customer');
  return cid;
end;
$$;
revoke all on function public.convert_request(uuid) from public,anon;
grant execute on function public.convert_request(uuid) to authenticated;
