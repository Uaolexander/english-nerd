-- Live collaborative exercise sessions
CREATE TABLE live_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_path TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '4 hours'
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Teacher or student can read their own sessions
CREATE POLICY "live_sessions_select"
  ON live_sessions FOR SELECT
  USING (auth.uid() = teacher_id OR auth.uid() = student_id);

-- Only teacher can create a session
CREATE POLICY "live_sessions_insert"
  ON live_sessions FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);
