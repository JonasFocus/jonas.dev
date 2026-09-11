-- Membership reads are already scoped by RLS; this helper needs no elevation.
alter function public.is_owner() security invoker;
revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;
