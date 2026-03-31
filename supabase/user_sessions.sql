-- Run this in your Supabase SQL editor
-- Creates the user_sessions table for single-session enforcement

create table if not exists public.user_sessions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  session_token text        not null unique,
  device_hint   text,
  ip_address    text,
  created_at    timestamptz not null default now(),
  last_active   timestamptz not null default now(),
  is_active     boolean     not null default true
);

create index if not exists user_sessions_user_idx   on public.user_sessions (user_id, is_active);
create index if not exists user_sessions_token_idx  on public.user_sessions (session_token);

-- RLS: all writes go through service role (API routes), no user-facing policies needed
alter table public.user_sessions enable row level security;
