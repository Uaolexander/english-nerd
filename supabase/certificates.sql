-- Run this in Supabase SQL Editor
-- Stores grammar placement test certificates per user

CREATE TABLE IF NOT EXISTS public.certificates (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level        text        NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1')),
  score_percent integer    NOT NULL,
  score_correct integer    NOT NULL,
  score_total  integer     NOT NULL,
  holder_name  text        NOT NULL,
  issued_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS certificates_user_idx ON public.certificates (user_id, issued_at DESC);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certificates"
  ON public.certificates FOR DELETE
  USING (auth.uid() = user_id);
