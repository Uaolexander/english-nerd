-- Email opt-outs: stores emails that have unsubscribed from notifications
CREATE TABLE IF NOT EXISTS email_opt_outs (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Allow service role to insert/select
ALTER TABLE email_opt_outs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role full access" ON email_opt_outs
  USING (true) WITH CHECK (true);
