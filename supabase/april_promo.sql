-- ─────────────────────────────────────────────────────────────────────────────
-- April 2026 promotional code
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Add date validity columns to promo_codes
ALTER TABLE public.promo_codes
  ADD COLUMN IF NOT EXISTS valid_from  timestamptz,
  ADD COLUMN IF NOT EXISTS valid_until timestamptz;

-- Step 2: Insert the April promo code
-- Valid: April 1–30 2026 only | 1000 uses max | 30 days PRO
INSERT INTO public.promo_codes (code, campaign, duration_days, max_uses, valid_from, valid_until)
VALUES (
  'NERD-APRIL',
  'april2026',
  30,
  1000,
  '2026-04-01 00:00:00+00',
  '2026-04-30 23:59:59+00'
)
ON CONFLICT (code) DO NOTHING;
