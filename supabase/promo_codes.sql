-- ─────────────────────────────────────────────────────────────────────────────
-- promo_codes + promo_redemptions
-- Run this in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Promo code definitions
create table if not exists public.promo_codes (
  id            uuid        primary key default gen_random_uuid(),
  code          text        not null unique,          -- e.g. 'YKO-PLUS'
  campaign      text        not null,                 -- 'yko' | 'nerd' | 'student'
  duration_days int         not null,                 -- 30 = 1 month, 365 = 1 year
  max_uses      int         not null default 1,       -- 1 = one-time
  used_count    int         not null default 0,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now()
);

-- Only service role can read/write promo_codes
alter table public.promo_codes enable row level security;
-- No public policies — service role bypasses RLS

-- 2. Redemption log — one row per user per code
create table if not exists public.promo_redemptions (
  id           uuid        primary key default gen_random_uuid(),
  code_id      uuid        not null references public.promo_codes(id),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  redeemed_at  timestamptz not null default now(),
  expires_at   timestamptz not null,
  unique(code_id, user_id)
);

alter table public.promo_redemptions enable row level security;
create policy "Users can read own promo redemptions"
  on public.promo_redemptions for select
  using (auth.uid() = user_id);

-- Indexes
create index if not exists promo_redemptions_user_idx    on public.promo_redemptions (user_id);
create index if not exists promo_redemptions_expires_idx on public.promo_redemptions (expires_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: all promo codes
-- ─────────────────────────────────────────────────────────────────────────────

-- YKO campaign — 20 codes — 30 days PRO (for YKO company meeting)
insert into public.promo_codes (code, campaign, duration_days, max_uses) values
  ('YKO-PLUS',  'yko', 30, 1),
  ('YKO-STAR',  'yko', 30, 1),
  ('YKO-GOLD',  'yko', 30, 1),
  ('YKO-FAST',  'yko', 30, 1),
  ('YKO-BEST',  'yko', 30, 1),
  ('YKO-RISE',  'yko', 30, 1),
  ('YKO-GROW',  'yko', 30, 1),
  ('YKO-FLOW',  'yko', 30, 1),
  ('YKO-PEAK',  'yko', 30, 1),
  ('YKO-ZONE',  'yko', 30, 1),
  ('YKO-FIRE',  'yko', 30, 1),
  ('YKO-GLOW',  'yko', 30, 1),
  ('YKO-BOLD',  'yko', 30, 1),
  ('YKO-KEEN',  'yko', 30, 1),
  ('YKO-WISE',  'yko', 30, 1),
  ('YKO-LIFT',  'yko', 30, 1),
  ('YKO-BUZZ',  'yko', 30, 1),
  ('YKO-VIBE',  'yko', 30, 1),
  ('YKO-NOVA',  'yko', 30, 1),
  ('YKO-EDGE',  'yko', 30, 1)
on conflict (code) do nothing;

-- NERD general campaign — 30 codes — 30 days PRO
insert into public.promo_codes (code, campaign, duration_days, max_uses) values
  ('NERD-FREE', 'nerd', 30, 1),
  ('NERD-COOL', 'nerd', 30, 1),
  ('NERD-STAR', 'nerd', 30, 1),
  ('NERD-GOLD', 'nerd', 30, 1),
  ('NERD-PLUS', 'nerd', 30, 1),
  ('NERD-FAST', 'nerd', 30, 1),
  ('NERD-BEST', 'nerd', 30, 1),
  ('NERD-RISE', 'nerd', 30, 1),
  ('NERD-GROW', 'nerd', 30, 1),
  ('NERD-FLOW', 'nerd', 30, 1),
  ('NERD-PEAK', 'nerd', 30, 1),
  ('NERD-ZONE', 'nerd', 30, 1),
  ('NERD-FIRE', 'nerd', 30, 1),
  ('NERD-GLOW', 'nerd', 30, 1),
  ('NERD-BOLD', 'nerd', 30, 1),
  ('NERD-KEEN', 'nerd', 30, 1),
  ('NERD-WISE', 'nerd', 30, 1),
  ('NERD-LIFT', 'nerd', 30, 1),
  ('NERD-BUZZ', 'nerd', 30, 1),
  ('NERD-VIBE', 'nerd', 30, 1),
  ('NERD-LINK', 'nerd', 30, 1),
  ('NERD-NEXT', 'nerd', 30, 1),
  ('NERD-NOVA', 'nerd', 30, 1),
  ('NERD-EDGE', 'nerd', 30, 1),
  ('NERD-JUMP', 'nerd', 30, 1),
  ('NERD-MOVE', 'nerd', 30, 1),
  ('NERD-OPEN', 'nerd', 30, 1),
  ('NERD-PASS', 'nerd', 30, 1),
  ('NERD-RUSH', 'nerd', 30, 1),
  ('NERD-SKIP', 'nerd', 30, 1)
on conflict (code) do nothing;

-- Student campaign — 20 codes — 365 days PRO (1 year)
insert into public.promo_codes (code, campaign, duration_days, max_uses) values
  ('STU-LEARN',  'student', 365, 1),
  ('STU-DREAM',  'student', 365, 1),
  ('STU-STUDY',  'student', 365, 1),
  ('STU-SMART',  'student', 365, 1),
  ('STU-BRAIN',  'student', 365, 1),
  ('STU-THINK',  'student', 365, 1),
  ('STU-FOCUS',  'student', 365, 1),
  ('STU-POWER',  'student', 365, 1),
  ('STU-SHINE',  'student', 365, 1),
  ('STU-QUEST',  'student', 365, 1),
  ('STU-CLIMB',  'student', 365, 1),
  ('STU-SPARK',  'student', 365, 1),
  ('STU-CLEAR',  'student', 365, 1),
  ('STU-REACH',  'student', 365, 1),
  ('STU-EXCEL',  'student', 365, 1),
  ('STU-SHARP',  'student', 365, 1),
  ('STU-SWIFT',  'student', 365, 1),
  ('STU-FRESH',  'student', 365, 1),
  ('STU-BLOOM',  'student', 365, 1),
  ('STU-THRIVE', 'student', 365, 1)
on conflict (code) do nothing;
