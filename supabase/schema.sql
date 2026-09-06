-- =============================================================================
-- Supabase Schema for NorthStar Canadian Newcomer Settlement Engine
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USER PROFILES TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  target_city text default 'Waterloo Region, ON',
  institution text default 'University of Waterloo (UW)',
  visa_type text default 'Standard Study Permit',
  arrival_date date default '2026-09-01',
  intake_month text default 'September 2026 (Fall Term)',
  has_gic text default 'no',
  gic_tier text default '20635',
  has_housing text default 'searching',
  has_sim text default 'no',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on user_profiles
alter table public.user_profiles enable row level security;

-- RLS Policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. USER TASKS (Checklist state) TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.user_tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  status boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, task_id)
);

-- Enable RLS on user_tasks
alter table public.user_tasks enable row level security;

-- RLS Policies for user_tasks
create policy "Users can view their own tasks"
  on public.user_tasks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own tasks"
  on public.user_tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. ANALYTICS & TELEMETRY EVENTS TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  partner_id text,
  category text,
  destination_url text,
  session_id text,
  user_id uuid references auth.users(id) on delete set null,
  payload jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on analytics_events
alter table public.analytics_events enable row level security;

-- Allow authenticated and anonymous users to insert telemetry events
create policy "Anyone can insert analytics events"
  on public.analytics_events
  for insert
  with check (true);

create policy "Users can view their own analytics events"
  on public.analytics_events
  for select
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for lightning fast queries
create index if not exists idx_user_tasks_user_id on public.user_tasks(user_id);
create index if not exists idx_analytics_events_user_id on public.analytics_events(user_id);
create index if not exists idx_analytics_events_session_id on public.analytics_events(session_id);
