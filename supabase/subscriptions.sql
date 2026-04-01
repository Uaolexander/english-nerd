-- ─────────────────────────────────────────────────────────────────────────────
-- subscriptions
-- Run this in Supabase SQL Editor.
-- All writes happen via service-role API route — no user RLS inserts needed.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id                uuid        primary key default gen_random_uuid(),

  -- link to auth user (resolved from buyer email; null if user not registered yet)
  user_id           uuid        references auth.users(id) on delete set null,

  -- LemonSqueezy identifiers
  customer_id       text        not null,
  subscription_id   text        unique,          -- null for one-time orders
  order_id          text,
  product_id        text,
  variant_id        text,

  -- buyer email (used to match with auth.users)
  customer_email    text        not null,

  -- subscription state
  status            text        not null,
  is_pro            boolean     not null default false,

  -- billing dates
  renews_at         timestamptz,
  ends_at           timestamptz,
  trial_ends_at     timestamptz,

  -- event tracking
  last_event_name   text,
  webhook_id        text        unique,          -- unique for idempotency dedup

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- indexes
create index if not exists subscriptions_user_idx       on public.subscriptions (user_id);
create index if not exists subscriptions_customer_idx   on public.subscriptions (customer_id);
create index if not exists subscriptions_email_idx      on public.subscriptions (customer_email);
-- subscription_id and webhook_id are already unique → implicit unique indexes

-- RLS: reads by owner only; all writes go through service-role route
alter table public.subscriptions enable row level security;

drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: look up auth.users.id by email
-- Called from the webhook route via supabase.rpc('get_user_id_by_email', ...)
-- security definer so it can read auth.users without exposing the table via RLS.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.get_user_id_by_email(lookup_email text)
returns uuid
language sql
security definer
stable
set search_path = public, auth
as $$
  select id
  from auth.users
  where lower(email) = lower(lookup_email)
  limit 1;
$$;

-- Only the service role and postgres superuser should call this
revoke execute on function public.get_user_id_by_email(text) from public, anon, authenticated;
grant  execute on function public.get_user_id_by_email(text) to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: auto-link subscription to user when they sign up
-- Scenario: user buys before creating an account → user_id = null in DB.
-- When they later register, this trigger fills in user_id and syncs is_pro
-- to their user_metadata automatically.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.link_subscription_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_is_pro boolean;
begin
  -- Find any unlinked subscription for this email
  update public.subscriptions
  set
    user_id    = new.id,
    updated_at = now()
  where
    lower(customer_email) = lower(new.email)
    and user_id is null
  returning is_pro into v_is_pro;

  -- If a subscription was linked, sync is_pro into user_metadata
  if found and v_is_pro is not null then
    update auth.users
    set raw_user_meta_data =
      coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('is_pro', v_is_pro)
    where id = new.id;
  end if;

  return new;
end;
$$;

-- Drop and recreate so re-running this file is safe
drop trigger if exists on_auth_user_created_link_subscription on auth.users;

create trigger on_auth_user_created_link_subscription
  after insert on auth.users
  for each row
  execute function public.link_subscription_on_signup();
