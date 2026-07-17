-- ════════════════════════════════════════════════════════════════
--  LEARN X COMMUNITY — SUPABASE SCHEMA
--  Run this whole block in Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════════════════

-- Profiles (mirrors auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  provider text default 'email',
  created_at timestamptz default now()
);

-- Founding members (signup form)
create table if not exists public.founding_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text, email text, phone text, provider text default 'email',
  created_at timestamptz default now()
);

-- Join Community popup form
create table if not exists public.join_community (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text, email text, college text, branch text, year text,
  linkedin text, github text, goal text, why_join text,
  created_at timestamptz default now()
);

-- Startup popup form
create table if not exists public.startup_form (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text, email text, phone text, idea text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles        enable row level security;
alter table public.founding_members enable row level security;
alter table public.join_community   enable row level security;
alter table public.startup_form     enable row level security;

-- Profiles: a user can only read/update their own row
create policy "profiles own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Public lead-capture forms: ANYONE can insert (logged-in or not),
-- but only the owner can read their own submissions.
create policy "fm insert public" on public.founding_members for insert with check (true);
create policy "fm select own"    on public.founding_members for select using (auth.uid() = user_id);

create policy "jc insert public" on public.join_community for insert with check (true);
create policy "jc select own"    on public.join_community for select using (auth.uid() = user_id);

create policy "sf insert public" on public.startup_form for insert with check (true);
create policy "sf select own"    on public.startup_form for select using (auth.uid() = user_id);

-- NOTE: To browse ALL submissions, use the Supabase dashboard → Table Editor.
-- (Admins don't need a policy because the dashboard uses the service role key.)
