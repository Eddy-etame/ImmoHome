-- ============================================================================
-- 0002 — Prospect accounts ('client' role) + per-user favorites.
-- Apply in the Supabase SQL editor after 0001. Idempotent.
-- ============================================================================

-- 1) Allow a third role: 'client' (prospects who sign in to save favorites).
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('client', 'agent', 'owner'));

-- New self-service signups are prospects by default (agents/owners are seeded
-- explicitly). Existing agent/owner rows are unaffected.
alter table public.profiles alter column role set default 'client';

-- Keep the signup trigger in sync: honor a role passed in user metadata,
-- otherwise default to 'client'.
create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2) Favorites: one row per (user, property). Saving requires an account.
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, property_id)
);
create index if not exists favorites_user_idx on public.favorites (user_id);

alter table public.favorites enable row level security;

-- A signed-in user may only see and manage their own favorites.
drop policy if exists favorites_own on public.favorites;
create policy favorites_own on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- Notes:
-- - Agents/owners can also read a client's favorites for advisory purposes via
--   the service-role client in a server route (bypasses RLS) if needed later.
-- - Promote a staff account:  update public.profiles set role='owner' where email='...';
-- ============================================================================
