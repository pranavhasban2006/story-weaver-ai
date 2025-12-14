-- Story Weaver AI - Additional Indexes and Optimizations
-- Adds composite indexes for common query patterns

-- Composite index for filtering stories by user and creation date
CREATE INDEX IF NOT EXISTS idx_stories_user_created 
  ON stories(user_id, created_at DESC) 
  WHERE deleted_at IS NULL;

-- Composite index for scenes by story and status (for filtering ready scenes)
CREATE INDEX IF NOT EXISTS idx_scenes_story_status 
  ON scenes(story_id, status) 
  WHERE status = 'ready';

-- Index for videos by story and status
CREATE INDEX IF NOT EXISTS idx_videos_story_status 
  ON videos(story_id, status);

-- Index for full-text search on story text (if needed in future)
-- CREATE INDEX IF NOT EXISTS idx_stories_text_search 
--   ON stories USING gin(to_tsvector('english', story_text))
--   WHERE deleted_at IS NULL;

-- Function to get story statistics
CREATE OR REPLACE FUNCTION get_story_statistics(story_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'story_id', s.id,
    'total_scenes', COUNT(DISTINCT sc.id),
    'ready_scenes', COUNT(DISTINCT sc.id) FILTER (WHERE sc.status = 'ready'),
    'pending_scenes', COUNT(DISTINCT sc.id) FILTER (WHERE sc.status = 'pending'),
    'generating_scenes', COUNT(DISTINCT sc.id) FILTER (WHERE sc.status = 'generating'),
    'error_scenes', COUNT(DISTINCT sc.id) FILTER (WHERE sc.status = 'error'),
    'total_videos', COUNT(DISTINCT v.id),
    'completed_videos', COUNT(DISTINCT v.id) FILTER (WHERE v.status = 'completed'),
    'word_count', s.word_count,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  )
  INTO result
  FROM stories s
  LEFT JOIN scenes sc ON sc.story_id = s.id
  LEFT JOIN videos v ON v.story_id = s.id
  WHERE s.id = story_uuid
  AND s.deleted_at IS NULL
  GROUP BY s.id, s.word_count, s.created_at, s.updated_at;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old soft-deleted stories (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_deleted_stories(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Hard delete stories that were soft-deleted more than X days ago
  WITH deleted AS (
    DELETE FROM stories
    WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - (days_old || ' days')::INTERVAL
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_story_statistics IS 'Returns comprehensive statistics for a story including scene and video counts';
COMMENT ON FUNCTION cleanup_old_deleted_stories IS 'Hard deletes stories that were soft-deleted more than specified days ago (default 30 days)';

