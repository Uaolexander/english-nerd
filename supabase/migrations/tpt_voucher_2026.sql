-- ─────────────────────────────────────────────────────────────────────────────
-- TPT voucher 2026-2027: Teacher Plus, one-time per account
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add one_time_only flag to teacher_vouchers
ALTER TABLE public.teacher_vouchers
  ADD COLUMN IF NOT EXISTS one_time_only boolean NOT NULL DEFAULT false;

-- 2. Insert the TPT Teacher Plus voucher
INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until, one_time_only)
VALUES
  (
    'NERD-PLUS-2026',
    NULL,            -- any account can use it
    'plus',
    40,              -- Teacher Plus: up to 40 students
    30,              -- 1 month
    true,
    '2026-01-01 00:00:00+00',
    '2027-12-31 23:59:59+00'
  )
ON CONFLICT (code) DO UPDATE
  SET plan          = EXCLUDED.plan,
      student_limit = EXCLUDED.student_limit,
      duration_days = EXCLUDED.duration_days,
      is_active     = EXCLUDED.is_active,
      valid_from    = EXCLUDED.valid_from,
      valid_until   = EXCLUDED.valid_until,
      one_time_only = EXCLUDED.one_time_only;
