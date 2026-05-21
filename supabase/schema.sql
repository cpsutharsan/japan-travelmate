-- Japan TravelMate — Supabase schema
-- Run this in the SQL editor of your Supabase project. RLS lets any authenticated
-- user in the project see all the rows — the project is private to the two of you.

create extension if not exists "pgcrypto";

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  date date not null,
  amount_jpy numeric not null,
  amount_aed numeric not null,
  category text not null,
  location text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  date date not null,
  adira text,
  divya text,
  best_meal text,
  remember text,
  mood text,
  created_at timestamptz default now()
);

create table if not exists public.happy (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  mood int not null,
  sleep int not null,
  meals jsonb not null,
  water text not null,
  meltdown text not null,
  meltdown_note text,
  happy_note text,
  created_at timestamptz default now()
);

create table if not exists public.souvenirs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  item text not null,
  bought_at text,
  cost numeric,
  category text,
  bought boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  "group" text not null,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id text primary key,    -- 'sutharsan' | 'divya' | 'adira'
  data jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.bookings (
  id text primary key,
  done boolean not null,
  updated_at timestamptz default now()
);

-- Buckets (run as one-off via Storage UI or `supabase storage` CLI):
--   bookings  (private)   — PDFs / e-tickets
--   photos    (private)   — daily log photos
--   voice     (private)   — voice memos
--   profiles  (private)   — passport scans, family avatars

-- Storage RLS policies. Without these the anon key sees "Object not found" for
-- every file in every bucket — RLS hides rows it isn't allowed to read.
-- Allow any signed-in user to read all family-scoped buckets, and to upload to
-- the buckets the app writes into from the browser.
do $$
declare b text;
begin
  for b in select unnest(array['documents', 'profiles', 'bookings', 'photos', 'voice']) loop
    execute format(
      'drop policy if exists "tm_storage_%s" on storage.objects', b
    );
    execute format(
      'create policy "tm_storage_%s" on storage.objects for all to authenticated
        using (bucket_id = %L) with check (bucket_id = %L)',
       b, b, b
    );
  end loop;
end $$;

-- Row Level Security: enable, then allow any authenticated user (you + Divya)
do $$
declare t text;
begin
  for t in select unnest(array['expenses', 'logs', 'happy', 'souvenirs', 'contacts', 'profiles', 'bookings']) loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "tm_all_auth" on public.%I', t);
    execute format(
      'create policy "tm_all_auth" on public.%I for all
       using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
       t
    );
  end loop;
end $$;
