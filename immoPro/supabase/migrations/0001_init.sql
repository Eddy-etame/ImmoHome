-- ============================================================================
-- ImmoPro — initial schema, roles, triggers, and Row Level Security.
-- Apply in the Supabase SQL editor (or `supabase db push`).
-- Idempotent enough to re-run during setup.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

-- User profile + role. One row per auth user (created by trigger on signup).
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'agent' check (role in ('agent','owner')),
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique,
  title           text not null,
  title_en        text,
  city            text not null,
  price           bigint not null default 0,
  surface         integer not null default 0,
  type            text not null check (type in ('VILLA','APPARTEMENT','TERRAIN')),
  status          text not null default 'available'
                    check (status in ('available','sold','rented','negotiating')),
  rooms           integer,
  bathrooms       integer,
  description     text,
  description_en  text,
  features        text[] not null default '{}',
  features_en     text[] not null default '{}',
  neighborhood    text,
  neighborhood_en text,
  lat             double precision,
  lng             double precision,
  cover_image     text,
  published       boolean not null default true,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists properties_city_idx   on public.properties (city);
create index if not exists properties_type_idx   on public.properties (type);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_price_idx  on public.properties (price);

create table if not exists public.property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url         text not null,
  alt         text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists property_images_property_idx on public.property_images (property_id);

create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  source     text,
  notes      text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.client_interactions (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  type       text not null default 'note',
  note       text,
  remind_at  timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists client_interactions_client_idx on public.client_interactions (client_id);

create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid references public.clients(id) on delete set null,
  property_id  uuid references public.properties(id) on delete set null,
  scheduled_at timestamptz not null,
  status       text not null default 'pending'
                 check (status in ('pending','confirmed','cancelled','completed')),
  notes        text,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists appointments_scheduled_idx on public.appointments (scheduled_at);

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  locale     text not null default 'fr',
  status     text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  locale     text not null default 'fr',
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid references public.clients(id) on delete cascade,
  subject    text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender          text not null check (sender in ('agent','client')),
  body            text not null,
  created_at      timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages (conversation_id);

create table if not exists public.audit_log (
  id         bigint generated always as identity primary key,
  actor      uuid references public.profiles(id) on delete set null,
  action     text not null,
  reason     text,
  target     text,
  created_at timestamptz not null default now()
);

create table if not exists public.page_events (
  id         bigint generated always as identity primary key,
  path       text not null,
  referrer   text,
  created_at timestamptz not null default now()
);
create index if not exists page_events_created_idx on public.page_events (created_at);

-- ----------------------------------------------------------------------------
-- Role helpers (SECURITY DEFINER so RLS policies can read profiles safely)
-- ----------------------------------------------------------------------------

create or replace function public.is_staff()
  returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('agent','owner')
  );
$$;

create or replace function public.is_owner()
  returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.jwt_role()
  returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'anon');
$$;

-- ----------------------------------------------------------------------------
-- Triggers: auto-create profile on signup; maintain properties.updated_at
-- ----------------------------------------------------------------------------

create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.properties          enable row level security;
alter table public.property_images     enable row level security;
alter table public.clients             enable row level security;
alter table public.client_interactions enable row level security;
alter table public.appointments        enable row level security;
alter table public.leads               enable row level security;
alter table public.subscribers         enable row level security;
alter table public.conversations       enable row level security;
alter table public.messages            enable row level security;
alter table public.audit_log           enable row level security;
alter table public.page_events         enable row level security;

-- profiles: read own (owner reads all); update own (role changes via SQL/service role)
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select using (id = auth.uid() or public.is_owner());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- properties: public reads published rows; staff full control
drop policy if exists properties_public_read on public.properties;
create policy properties_public_read on public.properties
  for select using (published = true or public.is_staff());
drop policy if exists properties_staff_write on public.properties;
create policy properties_staff_write on public.properties
  for all using (public.is_staff()) with check (public.is_staff());

-- property_images: public reads images of published properties; staff full control
drop policy if exists property_images_public_read on public.property_images;
create policy property_images_public_read on public.property_images
  for select using (
    public.is_staff()
    or exists (select 1 from public.properties p where p.id = property_id and p.published)
  );
drop policy if exists property_images_staff_write on public.property_images;
create policy property_images_staff_write on public.property_images
  for all using (public.is_staff()) with check (public.is_staff());

-- staff-only tables
drop policy if exists clients_staff on public.clients;
create policy clients_staff on public.clients
  for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists client_interactions_staff on public.client_interactions;
create policy client_interactions_staff on public.client_interactions
  for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists appointments_staff on public.appointments;
create policy appointments_staff on public.appointments
  for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists conversations_staff on public.conversations;
create policy conversations_staff on public.conversations
  for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists messages_staff on public.messages;
create policy messages_staff on public.messages
  for all using (public.is_staff()) with check (public.is_staff());

-- leads: anyone may submit (contact form); staff read/manage
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert with check (true);
drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads
  for select using (public.is_staff());
drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads
  for update using (public.is_staff()) with check (public.is_staff());

-- subscribers: anyone may subscribe; staff read
drop policy if exists subscribers_public_insert on public.subscribers;
create policy subscribers_public_insert on public.subscribers
  for insert with check (true);
drop policy if exists subscribers_staff_read on public.subscribers;
create policy subscribers_staff_read on public.subscribers
  for select using (public.is_staff());

-- page_events: anyone may record a view; staff read
drop policy if exists page_events_public_insert on public.page_events;
create policy page_events_public_insert on public.page_events
  for insert with check (true);
drop policy if exists page_events_staff_read on public.page_events;
create policy page_events_staff_read on public.page_events
  for select using (public.is_staff());

-- audit_log: owner reads; writes happen via the service-role client (bypasses RLS)
drop policy if exists audit_owner_read on public.audit_log;
create policy audit_owner_read on public.audit_log
  for select using (public.is_owner());

-- ----------------------------------------------------------------------------
-- Storage: bucket for property photos
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists property_images_read on storage.objects;
create policy property_images_read on storage.objects
  for select using (bucket_id = 'property-images');
drop policy if exists property_images_insert on storage.objects;
create policy property_images_insert on storage.objects
  for insert with check (bucket_id = 'property-images' and public.is_staff());
drop policy if exists property_images_update on storage.objects;
create policy property_images_update on storage.objects
  for update using (bucket_id = 'property-images' and public.is_staff());
drop policy if exists property_images_delete on storage.objects;
create policy property_images_delete on storage.objects
  for delete using (bucket_id = 'property-images' and public.is_staff());

-- ============================================================================
-- After creating your account (sign up in the app), promote it to owner:
--   update public.profiles set role = 'owner' where email = 'you@example.com';
-- ============================================================================
