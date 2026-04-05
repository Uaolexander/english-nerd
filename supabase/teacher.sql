-- ─────────────────────────────────────────────────────────────────────────────
-- Teacher Feature — Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Teacher profiles ────────────────────────────────────────────────────
-- Set manually (or via webhook) when a teacher subscription is activated.

CREATE TABLE IF NOT EXISTS public.teacher_profiles (
  user_id               uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                  text        NOT NULL DEFAULT 'solo' CHECK (plan IN ('starter', 'solo', 'plus')),
  student_limit         int         NOT NULL DEFAULT 10,
  is_active             boolean     NOT NULL DEFAULT true,
  -- Subscription expiry: when subscription lapses, is_active = false
  -- but ALL data (students, classes, assignments) is preserved.
  -- Reactivating simply sets is_active = true again — no data loss.
  subscription_expires_at timestamptz,
  -- Grace period is computed in application code as subscription_expires_at + 7 days.
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can read own profile"
  ON public.teacher_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read/write (for webhook & admin)
-- (No user-facing insert/update — managed by service-role API routes)


-- ── 2. Teacher ↔ Student connections ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.teacher_students (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_email   text        NOT NULL,
  invite_token   text        UNIQUE DEFAULT gen_random_uuid()::text,
  status         text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'removed')),
  invited_at     timestamptz NOT NULL DEFAULT now(),
  joined_at      timestamptz
);

CREATE INDEX IF NOT EXISTS teacher_students_teacher_idx ON public.teacher_students (teacher_id);
CREATE INDEX IF NOT EXISTS teacher_students_student_idx ON public.teacher_students (student_id);
CREATE INDEX IF NOT EXISTS teacher_students_token_idx   ON public.teacher_students (invite_token);

ALTER TABLE public.teacher_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own students"
  ON public.teacher_students FOR ALL
  USING (auth.uid() = teacher_id);

CREATE POLICY "Students can read own teacher links"
  ON public.teacher_students FOR SELECT
  USING (auth.uid() = student_id);


-- ── 3. Classes / Groups ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           text        NOT NULL,
  description    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teacher_classes_teacher_idx ON public.teacher_classes (teacher_id);

ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own classes"
  ON public.teacher_classes FOR ALL
  USING (auth.uid() = teacher_id);


-- ── 4. Class Members ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.class_members (
  class_id       uuid        NOT NULL REFERENCES public.teacher_classes(id) ON DELETE CASCADE,
  student_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage class members"
  ON public.class_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.teacher_classes tc
      WHERE tc.id = class_id AND tc.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can read own class memberships"
  ON public.class_members FOR SELECT
  USING (auth.uid() = student_id);


-- ── 5. Assignments ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          text        NOT NULL,
  category       text        NOT NULL,
  level          text,
  slug           text        NOT NULL,
  exercise_no    int,        -- null = all exercises for this topic
  due_date       date,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assignments_teacher_idx ON public.teacher_assignments (teacher_id);

ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own assignments"
  ON public.teacher_assignments FOR ALL
  USING (auth.uid() = teacher_id);


-- ── 6. Assignment Targets (who gets the assignment) ────────────────────────

CREATE TABLE IF NOT EXISTS public.assignment_targets (
  assignment_id  uuid        NOT NULL REFERENCES public.teacher_assignments(id) ON DELETE CASCADE,
  student_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id       uuid        REFERENCES public.teacher_classes(id) ON DELETE CASCADE,
  assigned_at    timestamptz NOT NULL DEFAULT now(),
  -- exactly one of student_id or class_id must be set
  CONSTRAINT target_has_one_recipient CHECK (
    (student_id IS NOT NULL AND class_id IS NULL) OR
    (student_id IS NULL AND class_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS assignment_targets_assignment_idx ON public.assignment_targets (assignment_id);
CREATE INDEX IF NOT EXISTS assignment_targets_student_idx    ON public.assignment_targets (student_id);
CREATE INDEX IF NOT EXISTS assignment_targets_class_idx      ON public.assignment_targets (class_id);

ALTER TABLE public.assignment_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage assignment targets"
  ON public.assignment_targets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.teacher_assignments ta
      WHERE ta.id = assignment_id AND ta.teacher_id = auth.uid()
    )
  );

-- Students can see assignments directed to them individually or via a class
CREATE POLICY "Students can read own assignment targets"
  ON public.assignment_targets FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = assignment_targets.class_id AND cm.student_id = auth.uid()
    )
  );


-- ── 7. Exercise Answers (detailed per-question tracking) ────────────────────
-- Saved alongside user_progress when an exercise is submitted.
-- Allows teachers to see exactly which questions a student got wrong.

CREATE TABLE IF NOT EXISTS public.exercise_answers (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id      uuid        REFERENCES public.user_progress(id) ON DELETE CASCADE,
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category         text        NOT NULL,
  level            text,
  slug             text        NOT NULL,
  exercise_no      int,
  question_index   int         NOT NULL,
  question_text    text,
  user_answer      text,
  correct_answer   text,
  is_correct       boolean     NOT NULL,
  answered_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercise_answers_user_idx     ON public.exercise_answers (user_id, answered_at DESC);
CREATE INDEX IF NOT EXISTS exercise_answers_progress_idx ON public.exercise_answers (progress_id);
CREATE INDEX IF NOT EXISTS exercise_answers_topic_idx    ON public.exercise_answers (user_id, category, level, slug);

ALTER TABLE public.exercise_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own answers"
  ON public.exercise_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON public.exercise_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Teachers can read answers of their active students
CREATE POLICY "Teachers can read student answers"
  ON public.exercise_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teacher_students ts
      WHERE ts.teacher_id = auth.uid()
        AND ts.student_id = exercise_answers.user_id
        AND ts.status = 'active'
    )
  );


-- ── 8. RLS additions to existing tables ────────────────────────────────────
-- Allow teachers to read their students' progress rows.

CREATE POLICY "Teachers can read student progress"
  ON public.user_progress FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.teacher_students ts
      WHERE ts.teacher_id = auth.uid()
        AND ts.student_id = user_progress.user_id
        AND ts.status = 'active'
    )
  );
