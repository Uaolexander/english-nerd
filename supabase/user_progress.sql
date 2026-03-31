-- Run this in your Supabase SQL editor
-- Tracks user exercise completions and scores

create table if not exists public.user_progress (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  category        text        not null check (category in ('grammar', 'tenses', 'test', 'vocabulary')),
  level           text,       -- 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | null
  slug            text        not null, -- e.g. 'past-continuous'
  exercise_no     integer,    -- 1-4 for lesson exercises, null = full test
  score           integer     not null check (score >= 0 and score <= 100),
  questions_total integer,
  completed_at    timestamptz not null default now()
);

create index if not exists user_progress_user_date_idx on public.user_progress (user_id, completed_at desc);
create index if not exists user_progress_topic_idx     on public.user_progress (user_id, category, level, slug);

alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);
