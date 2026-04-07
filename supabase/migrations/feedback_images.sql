-- Add image_url to feedback_messages
ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create feedback-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'feedback-images',
  'feedback-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload feedback images" ON storage.objects;
CREATE POLICY "Authenticated users can upload feedback images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-images');

-- Allow public to view
DROP POLICY IF EXISTS "Public can view feedback images" ON storage.objects;
CREATE POLICY "Public can view feedback images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'feedback-images');
