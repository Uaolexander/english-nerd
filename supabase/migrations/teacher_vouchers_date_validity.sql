-- ─────────────────────────────────────────────────────────────────────────────
-- Add date validity to teacher_vouchers + April 2026 Teacher Starter voucher
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add valid_from / valid_until columns
ALTER TABLE public.teacher_vouchers
  ADD COLUMN IF NOT EXISTS valid_from  timestamptz,
  ADD COLUMN IF NOT EXISTS valid_until timestamptz;

-- 2. April 2026 Teacher Starter (multi-use, 3 months)
INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until)
VALUES
  (
    'STARTER-APRIL26',
    NULL,
    'starter',
    5,
    90,                 -- 3 months
    true,
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00'
  )
ON CONFLICT (code) DO UPDATE
  SET duration_days = EXCLUDED.duration_days,
      valid_from    = EXCLUDED.valid_from,
      valid_until   = EXCLUDED.valid_until,
      is_active     = EXCLUDED.is_active;

-- 3. April 2026 Teacher Solo (multi-use, 3 months)
INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until)
VALUES
  (
    'SOLO-APRIL26',
    NULL,
    'solo',
    15,
    90,                 -- 3 months
    true,
    '2026-04-01 00:00:00+00',
    '2026-04-30 23:59:59+00'
  )
ON CONFLICT (code) DO UPDATE
  SET duration_days = EXCLUDED.duration_days,
      valid_from    = EXCLUDED.valid_from,
      valid_until   = EXCLUDED.valid_until,
      is_active     = EXCLUDED.is_active;

-- 4. Test voucher: Teacher Starter, 24 hours, no date restriction
INSERT INTO public.teacher_vouchers
  (code, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until)
VALUES
  (
    'TEST-STARTER-24H',
    NULL,
    'starter',
    5,
    1,                  -- 24 hours
    true,
    NULL,
    NULL
  )
ON CONFLICT (code) DO UPDATE
  SET duration_days = EXCLUDED.duration_days,
      is_active     = EXCLUDED.is_active;
