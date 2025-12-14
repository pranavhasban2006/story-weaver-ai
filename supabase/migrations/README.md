# Database Migrations

This directory contains SQL migration files for the Story Weaver AI database schema.

## Migration Files

### `20241214000000_initial_schema.sql`
Creates the core database schema:
- **Enums**: `video_style`, `voice_type`, `aspect_ratio`, `scene_status`
- **Tables**:
  - `stories` - User stories and configuration
  - `scenes` - Generated scenes for each story
  - `videos` - Final composed videos
- **Indexes**: Performance indexes on key columns
- **RLS Policies**: Row-level security for data access
- **Helper Functions**: Utility functions for common operations
- **Triggers**: Automatic `updated_at` timestamp updates

### `20241214000001_storage_setup.sql`
Sets up Supabase Storage buckets:
- `story-images` - For scene images (10MB limit)
- `story-audio` - For narration audio (50MB limit)
- `story-videos` - For final videos (500MB limit)
- Storage policies for secure access

## Running Migrations

### Using Supabase CLI

```bash
# Apply all migrations
supabase db reset

# Or apply migrations to remote
supabase db push
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order

## Database Schema Overview

### Stories Table
Stores user stories with generation settings.

**Columns:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `story_text` (TEXT) - The story content (50-10000 chars)
- `style` (video_style) - Video style enum
- `voice_type` (voice_type) - Voice type enum
- `aspect_ratio` (aspect_ratio) - Aspect ratio enum
- `word_count` (INTEGER) - Auto-calculated word count
- `created_at`, `updated_at`, `deleted_at` - Timestamps

### Scenes Table
Stores AI-generated scenes for each story.

**Columns:**
- `id` (UUID) - Primary key
- `story_id` (UUID) - Foreign key to stories
- `scene_number` (INTEGER) - Scene sequence number
- `title` (TEXT) - Scene title
- `description` (TEXT) - Scene description
- `image_prompt` (TEXT) - Image generation prompt
- `narration_text` (TEXT) - Narration text
- `image_url` (TEXT) - Generated image URL
- `audio_url` (TEXT) - Generated audio URL
- `duration` (DECIMAL) - Audio duration in seconds
- `status` (scene_status) - Scene status enum
- `created_at`, `updated_at` - Timestamps

### Videos Table
Stores final composed videos.

**Columns:**
- `id` (UUID) - Primary key
- `story_id` (UUID) - Foreign key to stories
- `video_url` (TEXT) - Final video URL
- `metadata` (JSONB) - Video metadata (duration, resolution, etc.)
- `include_music` (BOOLEAN) - Whether background music was included
- `render_id` (TEXT) - Shotstack render job ID
- `status` (TEXT) - Render status
- `error_message` (TEXT) - Error message if failed
- `created_at`, `completed_at` - Timestamps

## Helper Functions

### `get_story_with_scenes(story_uuid UUID)`
Returns a story with all its scenes as JSON.

**Usage:**
```sql
SELECT get_story_with_scenes('story-uuid-here');
```

### `get_user_stories_summary()`
Returns a summary of all user's stories with scene and video counts.

**Usage:**
```sql
SELECT * FROM get_user_stories_summary();
```

### `soft_delete_story(story_uuid UUID)`
Soft deletes a story (sets deleted_at timestamp).

**Usage:**
```sql
SELECT soft_delete_story('story-uuid-here');
```

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to view only their own data
- Allow users to insert/update/delete only their own data
- Automatically filter deleted stories (soft delete)

## Storage Buckets

Three public storage buckets are created:
1. **story-images** - For scene images (10MB max)
2. **story-audio** - For narration audio (50MB max)
3. **story-videos** - For final videos (500MB max)

All buckets have policies that:
- Allow public read access
- Allow users to upload/update/delete only in their own folder (`{user_id}/...`)

## TypeScript Types

After running migrations, regenerate TypeScript types:

```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

Or for remote:

```bash
supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

## Notes

- All tables use UUID primary keys
- Soft delete is implemented for stories (deleted_at column)
- Automatic timestamps via triggers
- Word count is auto-calculated
- Foreign keys cascade on delete
- Indexes optimize common queries

