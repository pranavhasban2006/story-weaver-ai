-- Story Weaver AI - Seed Data (Optional)
-- This file contains sample data for testing and development
-- Only run this in development/staging environments

-- Note: This seed file requires authentication to be set up first
-- You may need to create test users manually or use Supabase Auth

-- Example: Create a test story (uncomment and modify as needed)
-- This assumes you have a test user with a known UUID

/*
-- Example story data
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with actual test user ID
  test_story_id UUID;
BEGIN
  -- Insert a test story
  INSERT INTO stories (user_id, story_text, style, voice_type, aspect_ratio)
  VALUES (
    test_user_id,
    'Once upon a time, in a magical kingdom far away, there lived a brave knight who embarked on an epic quest to save the princess from an ancient dragon. The journey was long and perilous, filled with challenges and adventures that tested the knight''s courage and determination. Through dark forests and across treacherous mountains, the knight pressed on, never losing hope. Finally, after many trials, the knight reached the dragon''s lair and, with skill and bravery, defeated the beast and rescued the princess. The kingdom celebrated their hero, and peace was restored to the land.',
    'fantasy',
    'male',
    '16:9'
  )
  RETURNING id INTO test_story_id;

  -- You can add test scenes here if needed
  -- INSERT INTO scenes (story_id, scene_number, title, description, image_prompt, narration_text, status)
  -- VALUES (...);

  RAISE NOTICE 'Test story created with ID: %', test_story_id;
END $$;
*/

-- This seed file is intentionally minimal
-- In production, you should populate data through the application
-- or use Supabase's built-in seeding mechanisms

