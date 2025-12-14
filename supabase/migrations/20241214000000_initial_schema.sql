-- Story Weaver AI - Initial Database Schema
-- This migration creates all necessary tables, enums, and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE video_style AS ENUM ('cinematic', 'cartoon', 'minimalist', 'fantasy', 'realistic');
CREATE TYPE voice_type AS ENUM ('male', 'female');
CREATE TYPE aspect_ratio AS ENUM ('16:9', '9:16', '1:1');
CREATE TYPE scene_status AS ENUM ('pending', 'generating', 'ready', 'error');

-- Stories Table
-- Stores user stories and their configuration
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_text TEXT NOT NULL CHECK (char_length(story_text) >= 50 AND char_length(story_text) <= 10000),
  style video_style NOT NULL DEFAULT 'cinematic',
  voice_type voice_type NOT NULL DEFAULT 'female',
  aspect_ratio aspect_ratio NOT NULL DEFAULT '16:9',
  word_count INTEGER GENERATED ALWAYS AS (array_length(string_to_array(story_text, ' '), 1)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Scenes Table
-- Stores generated scenes for each story
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL CHECK (scene_number > 0),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  narration_text TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  duration DECIMAL(10, 2), -- Duration in seconds
  status scene_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(story_id, scene_number)
);

-- Videos Table
-- Stores final composed videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  -- Metadata includes: duration, sceneCount, resolution, fileSize, format
  include_music BOOLEAN NOT NULL DEFAULT false,
  render_id TEXT, -- Shotstack render ID for tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rendering', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create Indexes for Performance
CREATE INDEX idx_stories_user_id ON stories(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_stories_created_at ON stories(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_scenes_story_id ON scenes(story_id);
CREATE INDEX idx_scenes_status ON scenes(status);
CREATE INDEX idx_scenes_story_scene_number ON scenes(story_id, scene_number);
CREATE INDEX idx_videos_story_id ON videos(story_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Stories Policies
-- Users can view their own stories
CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can insert their own stories
CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stories
CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stories (soft delete)
CREATE POLICY "Users can delete own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Scenes Policies
-- Users can view scenes of their own stories
CREATE POLICY "Users can view scenes of own stories"
  ON scenes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = scenes.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can insert scenes for their own stories
CREATE POLICY "Users can insert scenes for own stories"
  ON scenes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = scenes.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can update scenes of their own stories
CREATE POLICY "Users can update scenes of own stories"
  ON scenes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = scenes.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = scenes.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can delete scenes of their own stories
CREATE POLICY "Users can delete scenes of own stories"
  ON scenes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = scenes.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Videos Policies
-- Users can view videos of their own stories
CREATE POLICY "Users can view videos of own stories"
  ON videos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = videos.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can insert videos for their own stories
CREATE POLICY "Users can insert videos for own stories"
  ON videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = videos.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can update videos of their own stories
CREATE POLICY "Users can update videos of own stories"
  ON videos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = videos.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = videos.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Users can delete videos of their own stories
CREATE POLICY "Users can delete videos of own stories"
  ON videos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = videos.story_id
      AND stories.user_id = auth.uid()
      AND stories.deleted_at IS NULL
    )
  );

-- Helper Functions

-- Function to get story with all scenes
CREATE OR REPLACE FUNCTION get_story_with_scenes(story_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'story', row_to_json(s.*),
    'scenes', (
      SELECT json_agg(row_to_json(sc.*))
      FROM scenes sc
      WHERE sc.story_id = s.id
      ORDER BY sc.scene_number
    )
  )
  INTO result
  FROM stories s
  WHERE s.id = story_uuid
  AND s.deleted_at IS NULL;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's stories summary
CREATE OR REPLACE FUNCTION get_user_stories_summary()
RETURNS TABLE (
  id UUID,
  story_text_preview TEXT,
  style video_style,
  scene_count BIGINT,
  video_count BIGINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    LEFT(s.story_text, 100) as story_text_preview,
    s.style,
    COUNT(DISTINCT sc.id) as scene_count,
    COUNT(DISTINCT v.id) as video_count,
    s.created_at,
    s.updated_at
  FROM stories s
  LEFT JOIN scenes sc ON sc.story_id = s.id
  LEFT JOIN videos v ON v.story_id = s.id
  WHERE s.user_id = auth.uid()
  AND s.deleted_at IS NULL
  GROUP BY s.id, s.story_text, s.style, s.created_at, s.updated_at
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete a story and cascade
CREATE OR REPLACE FUNCTION soft_delete_story(story_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  story_owner UUID;
BEGIN
  -- Check ownership
  SELECT user_id INTO story_owner
  FROM stories
  WHERE id = story_uuid;
  
  IF story_owner IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF story_owner != auth.uid() THEN
    RETURN FALSE;
  END IF;
  
  -- Soft delete the story
  UPDATE stories
  SET deleted_at = NOW()
  WHERE id = story_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE stories IS 'Stores user stories and their generation configuration';
COMMENT ON TABLE scenes IS 'Stores AI-generated scenes for each story';
COMMENT ON TABLE videos IS 'Stores final composed videos from scenes';
COMMENT ON COLUMN stories.word_count IS 'Automatically calculated word count';
COMMENT ON COLUMN videos.metadata IS 'JSON object containing video metadata (duration, sceneCount, resolution, fileSize, format)';
COMMENT ON COLUMN videos.render_id IS 'Shotstack render job ID for tracking';

