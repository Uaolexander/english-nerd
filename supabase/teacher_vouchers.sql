-- ─────────────────────────────────────────────────────────────────────────────
-- Teacher Vouchers — personal monthly-renewable teacher access codes
-- Run this in Supabase SQL Editor AFTER teacher.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Voucher definitions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.teacher_vouchers (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text        NOT NULL UNIQUE,
  -- If set, only this user (by email) can use the voucher
  allowed_email   text,
  plan            text        NOT NULL DEFAULT 'solo' CHECK (plan IN ('starter', 'solo', 'plus')),
  student_limit   int         NOT NULL DEFAULT 30,
  duration_days   int         NOT NULL DEFAULT 30,
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Only service role can read/write voucher definitions
ALTER TABLE public.teacher_vouchers ENABLE ROW LEVEL SECURITY;
-- No public policies — service role bypasses RLS

-- ── 2. Redemption log ──────────────────────────────────────────────────────
-- Multiple redemptions allowed per user+voucher, but enforced once per period
-- by checking last redemption date in application code.

CREATE TABLE IF NOT EXISTS public.teacher_voucher_redemptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id  uuid        NOT NULL REFERENCES public.teacher_vouchers(id),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS tvr_voucher_user_idx ON public.teacher_voucher_redemptions (voucher_id, user_id, redeemed_at DESC);
CREATE INDEX IF NOT EXISTS tvr_user_idx         ON public.teacher_voucher_redemptions (user_id);

ALTER TABLE public.teacher_voucher_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own voucher redemptions"
  ON public.teacher_voucher_redemptions FOR SELECT
  USING (auth.uid() = user_id);

-- ── 3. Seed: personal teacher vouchers ────────────────────────────────────
-- Replace allowed_email values with real emails before running.
-- Codes are intentionally simple — change them to anything you want.

INSERT INTO public.teacher_vouchers (code, allowed_email, plan, student_limit, duration_days)
VALUES
  ('TCH-ALEX-PLUS',  'YOUR_EMAIL_HERE',  'plus', 30, 30),
  ('TCH-KATYA-PLUS', 'KATYA_EMAIL_HERE', 'plus', 30, 30)
ON CONFLICT (code) DO NOTHING;
