-- ─────────────────────────────────────────────────────────────────────────────
-- Add date validity to teacher_vouchers + April 2026 Teacher Starter voucher
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add valid_from / valid_until columns
ALTER TABLE public.teacher_vouchers
  ADD COLUMN IF NOT EXISTS valid_from  timestamptz,
  ADD COLUMN IF NOT EXISTS valid_until timestamptz;

-- 2. Insert the April 2026 Teacher Starter multi-use voucher
INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until)
VALUES
  (
    'STARTER-APRIL26',  -- code
    NULL,               -- no email restriction = multi-use
    'starter',
    5,                  -- Teacher Starter: up to 5 students
    90,                 -- 3 months
    true,
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00'
  )
ON CONFLICT (code) DO UPDATE
  SET valid_from  = EXCLUDED.valid_from,
      valid_until = EXCLUDED.valid_until,
      is_active   = EXCLUDED.is_active;

INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until)
VALUES
  (
    'SOLO-APRIL26',     -- code
    NULL,               -- no email restriction = multi-use
    'solo',
    15,                 -- Teacher Solo: up to 15 students
    90,                 -- 3 months
    true,
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00'
  )
ON CONFLICT (code) DO UPDATE
  SET valid_from  = EXCLUDED.valid_from,
      valid_until = EXCLUDED.valid_until,
      is_active   = EXCLUDED.is_active;
