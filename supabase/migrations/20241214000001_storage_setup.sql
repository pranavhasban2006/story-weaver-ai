-- Story Weaver AI - Storage Setup
-- Creates storage buckets for images and audio assets

-- Create storage buckets for assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'story-images',
    'story-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'story-audio',
    'story-audio',
    true,
    52428800, -- 50MB limit
    ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
  ),
  (
    'story-videos',
    'story-videos',
    true,
    524288000, -- 500MB limit
    ARRAY['video/mp4', 'video/webm']
  )
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for story-images bucket
CREATE POLICY "Users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'story-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-images');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'story-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'story-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policies for story-audio bucket
CREATE POLICY "Users can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'story-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-audio');

CREATE POLICY "Users can update own audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'story-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'story-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policies for story-videos bucket
CREATE POLICY "Users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'story-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-videos');

CREATE POLICY "Users can update own videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'story-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'story-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON TABLE storage.buckets IS 'Storage buckets for story assets (images, audio, videos)';

