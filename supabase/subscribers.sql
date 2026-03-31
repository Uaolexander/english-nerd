-- ─────────────────────────────────────────────────────────────────────────────
-- subscribers.sql
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Таблиця підписників
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscribers (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text        NOT NULL UNIQUE,
  source            text        NOT NULL DEFAULT 'registration',  -- 'registration' | 'google_oauth' | 'manual'
  subscribed_at     timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at   timestamptz,                                  -- NULL = підписаний, NOT NULL = відписався
  CONSTRAINT email_format CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

-- Індекс для швидкого пошуку активних підписників
CREATE INDEX IF NOT EXISTS subscribers_active_idx
  ON public.subscribers (email)
  WHERE unsubscribed_at IS NULL;

-- RLS: тільки service_role може читати/писати (захист персональних даних)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.subscribers
  USING (false)
  WITH CHECK (false);


-- 2. Тригер: автоматично додає email при кожній новій реєстрації
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscribers (email, source)
  VALUES (
    NEW.email,
    CASE
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google_oauth'
      ELSE 'registration'
    END
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_subscriber ON auth.users;

CREATE TRIGGER on_auth_user_created_subscriber
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_subscriber();


-- 3. Бекфіл: заповнюємо вже існуючими користувачами
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.subscribers (email, source, subscribed_at)
SELECT
  au.email,
  CASE
    WHEN au.raw_app_meta_data->>'provider' = 'google' THEN 'google_oauth'
    ELSE 'registration'
  END,
  au.created_at
FROM auth.users au
WHERE au.email IS NOT NULL
ON CONFLICT (email) DO NOTHING;


-- 4. Корисні запити для роботи з розсилками
-- ─────────────────────────────────────────────────────────────────────────────

-- Всі активні підписники (для імпорту в Mailchimp / Brevo / Resend):
-- SELECT email, subscribed_at FROM public.subscribers
-- WHERE unsubscribed_at IS NULL
-- ORDER BY subscribed_at DESC;

-- Кількість підписників:
-- SELECT COUNT(*) FROM public.subscribers WHERE unsubscribed_at IS NULL;

-- Відписати користувача (якщо попросить):
-- UPDATE public.subscribers
-- SET unsubscribed_at = now()
-- WHERE email = 'user@example.com';
