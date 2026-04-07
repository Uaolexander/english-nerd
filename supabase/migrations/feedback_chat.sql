-- Feedback chat system: threads + messages
-- One thread per user, two-way via Telegram webhook

CREATE TABLE IF NOT EXISTS feedback_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_plan TEXT NOT NULL DEFAULT 'Free',
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES feedback_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_owner_reply BOOLEAN NOT NULL DEFAULT FALSE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_threads_user_id ON feedback_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_messages_thread_id ON feedback_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_feedback_messages_unread
  ON feedback_messages(thread_id, is_owner_reply, is_read)
  WHERE is_owner_reply = TRUE AND is_read = FALSE;

ALTER TABLE feedback_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_messages ENABLE ROW LEVEL SECURITY;

-- Thread: users manage only their own
CREATE POLICY "users_own_feedback_thread" ON feedback_threads
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Messages: users can read all messages in their thread
CREATE POLICY "users_read_own_messages" ON feedback_messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT id FROM feedback_threads WHERE user_id = auth.uid()));

-- Messages: users can only insert non-owner messages
CREATE POLICY "users_insert_own_messages" ON feedback_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    thread_id IN (SELECT id FROM feedback_threads WHERE user_id = auth.uid())
    AND is_owner_reply = FALSE
  );

-- Messages: users can update read status
CREATE POLICY "users_update_read_status" ON feedback_messages
  FOR UPDATE TO authenticated
  USING (thread_id IN (SELECT id FROM feedback_threads WHERE user_id = auth.uid()))
  WITH CHECK (thread_id IN (SELECT id FROM feedback_threads WHERE user_id = auth.uid()));
