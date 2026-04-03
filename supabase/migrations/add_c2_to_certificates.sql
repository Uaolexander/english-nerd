-- Migration: allow C2 level in certificates (for Vocabulary Size Test)
-- Run this in Supabase SQL Editor

ALTER TABLE public.certificates
  DROP CONSTRAINT IF EXISTS certificates_level_check;

ALTER TABLE public.certificates
  ADD CONSTRAINT certificates_level_check
  CHECK (level IN ('A1','A2','B1','B2','C1','C2'));
