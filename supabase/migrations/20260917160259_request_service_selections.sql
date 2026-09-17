alter table public.requests add column services text[];
alter table public.requests add constraint requests_services_check check (
  services is null or (
    cardinality(services) between 1 and 4
    and services <@ array['website','saas','web-app','other']::text[]
    and array_position(services, null) is null
    and service = services[1]
  )
);
update public.requests set services = array[service];

create or replace function public.submit_request(p_input jsonb,p_fingerprint text,p_ip_key text,p_email_key text)
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
  insert into public.requests(id,fingerprint,name,email,company,service,services,description,budget,timeline,case_study)
  values(rid,p_fingerprint,p_input->>'name',p_input->>'email',nullif(p_input->>'company',''),p_input->>'service',case when p_input ? 'services' then array(select jsonb_array_elements_text(p_input->'services')) else array[p_input->>'service'] end,p_input->>'description',nullif(p_input->>'budget',''),nullif(p_input->>'timeline',''),p_input->>'caseStudy');
  insert into public.activity_events(request_id,action) values(rid,'Request received');
  return rid;
end;
$$;
revoke all on function public.submit_request(jsonb,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_request(jsonb,text,text,text) to service_role;
