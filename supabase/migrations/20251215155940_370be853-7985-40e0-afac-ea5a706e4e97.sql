-- Create stories table
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  story_text TEXT NOT NULL,
  style TEXT NOT NULL DEFAULT 'cinematic',
  voice_type TEXT NOT NULL DEFAULT 'female',
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  word_count INTEGER GENERATED ALWAYS AS (array_length(regexp_split_to_array(trim(story_text), '\s+'), 1)) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create scenes table
CREATE TABLE public.scenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  narration_text TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  duration INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, scene_number)
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}',
  include_music BOOLEAN NOT NULL DEFAULT false,
  render_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for stories (allow all operations for now - public access)
CREATE POLICY "Allow all access to stories" ON public.stories FOR ALL USING (true) WITH CHECK (true);

-- Create policies for scenes (allow all operations for now - public access)
CREATE POLICY "Allow all access to scenes" ON public.scenes FOR ALL USING (true) WITH CHECK (true);

-- Create policies for videos (allow all operations for now - public access)
CREATE POLICY "Allow all access to videos" ON public.videos FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON public.scenes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create soft delete function
CREATE OR REPLACE FUNCTION public.soft_delete_story(story_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.stories SET deleted_at = now() WHERE id = story_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create helper function to get story with scenes
CREATE OR REPLACE FUNCTION public.get_story_with_scenes(story_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'story', row_to_json(s),
    'scenes', COALESCE((SELECT json_agg(row_to_json(sc) ORDER BY sc.scene_number) FROM public.scenes sc WHERE sc.story_id = story_uuid), '[]'::json)
  ) INTO result
  FROM public.stories s
  WHERE s.id = story_uuid AND s.deleted_at IS NULL;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create story statistics function
CREATE OR REPLACE FUNCTION public.get_story_statistics(story_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'scene_count', (SELECT COUNT(*) FROM public.scenes WHERE story_id = story_uuid),
    'ready_scenes', (SELECT COUNT(*) FROM public.scenes WHERE story_id = story_uuid AND status = 'ready'),
    'video_count', (SELECT COUNT(*) FROM public.videos WHERE story_id = story_uuid),
    'completed_videos', (SELECT COUNT(*) FROM public.videos WHERE story_id = story_uuid AND status = 'completed')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create user stories summary function
CREATE OR REPLACE FUNCTION public.get_user_stories_summary()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_stories', (SELECT COUNT(*) FROM public.stories WHERE deleted_at IS NULL),
    'total_scenes', (SELECT COUNT(*) FROM public.scenes),
    'total_videos', (SELECT COUNT(*) FROM public.videos WHERE status = 'completed')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('story-images', 'story-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('story-audio', 'story-audio', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('story-videos', 'story-videos', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for story-images" ON storage.objects FOR SELECT USING (bucket_id = 'story-images');
CREATE POLICY "Public insert access for story-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-images');
CREATE POLICY "Public update access for story-images" ON storage.objects FOR UPDATE USING (bucket_id = 'story-images');

CREATE POLICY "Public read access for story-audio" ON storage.objects FOR SELECT USING (bucket_id = 'story-audio');
CREATE POLICY "Public insert access for story-audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-audio');
CREATE POLICY "Public update access for story-audio" ON storage.objects FOR UPDATE USING (bucket_id = 'story-audio');

CREATE POLICY "Public read access for story-videos" ON storage.objects FOR SELECT USING (bucket_id = 'story-videos');
CREATE POLICY "Public insert access for story-videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-videos');
CREATE POLICY "Public update access for story-videos" ON storage.objects FOR UPDATE USING (bucket_id = 'story-videos');