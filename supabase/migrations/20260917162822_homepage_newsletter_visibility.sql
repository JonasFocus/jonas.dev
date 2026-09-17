create table public.homepage_settings (
  id boolean primary key default true check (id),
  newsletter_enabled boolean not null default false
);
insert into public.homepage_settings (id, newsletter_enabled) values (true, false);
alter table public.homepage_settings enable row level security;
revoke all on public.homepage_settings from public, anon, authenticated;
grant select on public.homepage_settings to anon, authenticated;
grant update (newsletter_enabled) on public.homepage_settings to authenticated;
create policy homepage_settings_read on public.homepage_settings for select to anon, authenticated using (true);
create policy homepage_settings_owner_update on public.homepage_settings for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));
