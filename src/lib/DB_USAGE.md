# Database Usage Guide

This guide shows how to use the database utility functions in `db.ts` for Story Weaver AI.

## Story Operations

### Create a Story

```typescript
import { createStory } from '@/lib/db';

const story = await createStory(
  'Your story text here...',
  'cinematic',
  'female',
  '16:9'
);
```

### Get User's Stories

```typescript
import { getUserStories } from '@/lib/db';

const stories = await getUserStories();
```

### Get Story with Scenes

```typescript
import { getStoryWithScenes } from '@/lib/db';

const storyData = await getStoryWithScenes(storyId);
// Returns: { story: {...}, scenes: [...] }
```

### Update Story

```typescript
import { updateStory } from '@/lib/db';

const updated = await updateStory(storyId, {
  story_text: 'Updated story...',
  style: 'fantasy',
});
```

### Delete Story (Soft Delete)

```typescript
import { deleteStory } from '@/lib/db';

await deleteStory(storyId);
```

## Scene Operations

### Create Scenes

```typescript
import { createScenes } from '@/lib/db';

const scenes = await createScenes(storyId, [
  {
    sceneNumber: 1,
    title: 'Scene 1',
    description: 'Description...',
    imagePrompt: 'Prompt...',
    narrationText: 'Narration...',
  },
  // ... more scenes
]);
```

### Get Story Scenes

```typescript
import { getStoryScenes } from '@/lib/db';

const scenes = await getStoryScenes(storyId);
```

### Update Scene (by ID)

```typescript
import { updateScene } from '@/lib/db';

const updated = await updateScene(sceneId, {
  image_url: 'https://...',
  status: 'ready',
});
```

### Update Scene (by Story ID and Scene Number)

```typescript
import { updateSceneByNumber } from '@/lib/db';

const updated = await updateSceneByNumber(storyId, 1, {
  image_url: 'https://...',
  audio_url: 'data:audio/mp3;base64,...',
  duration: 5.5,
  status: 'ready',
});
```

## Video Operations

### Create Video

```typescript
import { createVideo } from '@/lib/db';

const video = await createVideo(
  storyId,
  'https://video-url.com/video.mp4',
  {
    duration: 120,
    sceneCount: 5,
    resolution: '1920x1080',
    fileSize: 15000000,
    format: 'mp4',
  },
  true, // includeMusic
  'shotstack-render-id' // optional
);
```

### Create Video Render (Before Rendering)

```typescript
import { createVideoRender } from '@/lib/db';

const video = await createVideoRender(
  storyId,
  'shotstack-render-id',
  true // includeMusic
);
```

### Update Video Status

```typescript
import { updateVideo } from '@/lib/db';

// When render completes
await updateVideo(videoId, {
  video_url: 'https://video-url.com/video.mp4',
  metadata: { /* metadata */ },
  status: 'completed',
  completed_at: new Date().toISOString(),
});

// If render fails
await updateVideo(videoId, {
  status: 'failed',
  error_message: 'Render failed: ...',
});
```

### Get Story Videos

```typescript
import { getStoryVideos } from '@/lib/db';

const videos = await getStoryVideos(storyId);
```

## Helper Functions

### Get Story Statistics

```typescript
import { getStoryStatistics } from '@/lib/db';

const stats = await getStoryStatistics(storyId);
// Returns: {
//   story_id, total_scenes, ready_scenes, pending_scenes,
//   generating_scenes, error_scenes, total_videos,
//   completed_videos, word_count, created_at, updated_at
// }
```

### Get User Stories Summary

```typescript
import { getUserStoriesSummary } from '@/lib/db';

const summary = await getUserStoriesSummary();
// Returns array of stories with scene and video counts
```

## Storage Operations

### Upload Image

```typescript
import { uploadImage } from '@/lib/db';

const imageUrl = await uploadImage(imageFile, storyId, sceneNumber);
```

### Upload Audio

```typescript
import { uploadAudio } from '@/lib/db';

const audioUrl = await uploadAudio(audioFile, storyId, sceneNumber);
```

### Upload Video

```typescript
import { uploadVideo } from '@/lib/db';

const videoUrl = await uploadVideo(videoFile, storyId, videoId);
```

## Integration Example

Here's a complete example of creating a story, generating scenes, and saving them:

```typescript
import { 
  createStory, 
  createScenes, 
  updateSceneByNumber,
  createVideo 
} from '@/lib/db';
import { generateScenes, generateImage, generateSpeech } from '@/lib/api';

// 1. Create story
const story = await createStory(
  storyText,
  style,
  voiceType,
  aspectRatio
);

// 2. Generate scenes using AI
const { scenes } = await generateScenes(storyText, style);

// 3. Save scenes to database
const savedScenes = await createScenes(story.id, scenes);

// 4. Generate images and audio for each scene
for (const scene of savedScenes) {
  // Generate image
  const { imageUrl } = await generateImage(
    scene.image_prompt,
    aspectRatio,
    scene.scene_number
  );
  
  // Generate audio
  const { audioUrl, duration } = await generateSpeech(
    scene.narration_text,
    voiceType,
    scene.scene_number
  );
  
  // Update scene with generated assets
  await updateSceneByNumber(story.id, scene.scene_number, {
    image_url: imageUrl,
    audio_url: audioUrl,
    duration,
    status: 'ready',
  });
}

// 5. Compose video and save
const { videoUrl, metadata } = await composeVideo(
  savedScenes,
  aspectRatio,
  style,
  true
);

await createVideo(story.id, videoUrl, metadata, true);
```

## Error Handling

All database functions throw errors that should be caught:

```typescript
try {
  const story = await createStory(...);
} catch (error) {
  console.error('Failed to create story:', error);
  // Handle error (show toast, etc.)
}
```

## TypeScript Types

All functions are fully typed. Import types as needed:

```typescript
import type { Story, SceneRow, VideoRow } from '@/lib/db';
```

