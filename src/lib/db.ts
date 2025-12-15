// Database utility functions for Story Weaver AI
import { supabase } from "@/integrations/supabase/client";
import { Scene, VideoStyle, VoiceType, AspectRatio } from "./types";

export interface Story {
  id: string;
  user_id: string;
  story_text: string;
  style: VideoStyle;
  voice_type: VoiceType;
  aspect_ratio: AspectRatio;
  word_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface SceneRow {
  id: string;
  story_id: string;
  scene_number: number;
  title: string;
  description: string;
  image_prompt: string;
  narration_text: string;
  image_url?: string;
  audio_url?: string;
  duration?: number;
  status: 'pending' | 'generating' | 'ready' | 'error';
  created_at: string;
  updated_at: string;
}

export interface VideoRow {
  id: string;
  story_id: string;
  video_url: string;
  metadata: {
    duration: number;
    sceneCount: number;
    resolution: string;
    fileSize: number;
    format: string;
  };
  include_music: boolean;
  render_id?: string;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// Type-safe wrapper for supabase operations (tables may not be in auto-generated types yet)
const db = {
  stories: () => supabase.from('stories' as any),
  scenes: () => supabase.from('scenes' as any),
  videos: () => supabase.from('videos' as any),
};

// Story operations
export async function createStory(
  storyText: string,
  style: VideoStyle,
  voiceType: VoiceType,
  aspectRatio: AspectRatio
): Promise<Story> {
  const { data, error } = await db.stories()
    .insert({
      story_text: storyText,
      style,
      voice_type: voiceType,
      aspect_ratio: aspectRatio,
    })
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Story;
}

export async function getStory(storyId: string): Promise<Story | null> {
  const { data, error } = await db.stories()
    .select('*')
    .eq('id', storyId)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data as unknown as Story;
}

export async function getUserStories(): Promise<Story[]> {
  const { data, error } = await db.stories()
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Story[];
}

export async function updateStory(
  storyId: string,
  updates: Partial<Pick<Story, 'story_text' | 'style' | 'voice_type' | 'aspect_ratio'>>
): Promise<Story> {
  const { data, error } = await db.stories()
    .update(updates)
    .eq('id', storyId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Story;
}

export async function deleteStory(storyId: string): Promise<boolean> {
  const { error } = await supabase.rpc('soft_delete_story' as any, {
    story_uuid: storyId,
  });

  if (error) throw error;
  return true;
}

// Scene operations
export async function createScenes(
  storyId: string,
  scenes: Omit<Scene, 'imageUrl' | 'audioUrl' | 'duration' | 'status'>[]
): Promise<SceneRow[]> {
  const sceneRows = scenes.map((scene) => ({
    story_id: storyId,
    scene_number: scene.sceneNumber,
    title: scene.title,
    description: scene.description,
    image_prompt: scene.imagePrompt,
    narration_text: scene.narrationText,
    status: 'pending' as const,
  }));

  const { data, error } = await db.scenes()
    .insert(sceneRows)
    .select();

  if (error) throw error;
  return (data || []) as unknown as SceneRow[];
}

export async function getStoryScenes(storyId: string): Promise<SceneRow[]> {
  const { data, error } = await db.scenes()
    .select('*')
    .eq('story_id', storyId)
    .order('scene_number', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as SceneRow[];
}

export async function updateScene(
  sceneId: string,
  updates: Partial<Pick<SceneRow, 'image_url' | 'audio_url' | 'duration' | 'status'>>
): Promise<SceneRow> {
  const { data, error } = await db.scenes()
    .update(updates)
    .eq('id', sceneId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as SceneRow;
}

export async function updateSceneByNumber(
  storyId: string,
  sceneNumber: number,
  updates: Partial<Pick<SceneRow, 'image_url' | 'audio_url' | 'duration' | 'status'>>
): Promise<SceneRow> {
  const { data, error } = await db.scenes()
    .update(updates)
    .eq('story_id', storyId)
    .eq('scene_number', sceneNumber)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as SceneRow;
}

// Video operations
export async function createVideo(
  storyId: string,
  videoUrl: string,
  metadata: VideoRow['metadata'],
  includeMusic: boolean,
  renderId?: string
): Promise<VideoRow> {
  const { data, error } = await db.videos()
    .insert({
      story_id: storyId,
      video_url: videoUrl,
      metadata,
      include_music: includeMusic,
      render_id: renderId,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as unknown as VideoRow;
}

export async function createVideoRender(
  storyId: string,
  renderId: string,
  includeMusic: boolean
): Promise<VideoRow> {
  const { data, error } = await db.videos()
    .insert({
      story_id: storyId,
      video_url: '', // Will be updated when render completes
      metadata: {},
      include_music: includeMusic,
      render_id: renderId,
      status: 'rendering',
    })
    .select()
    .single();

  if (error) throw error;
  return data as unknown as VideoRow;
}

export async function updateVideo(
  videoId: string,
  updates: Partial<Pick<VideoRow, 'video_url' | 'metadata' | 'status' | 'error_message' | 'completed_at'>>
): Promise<VideoRow> {
  const { data, error } = await db.videos()
    .update(updates)
    .eq('id', videoId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as VideoRow;
}

export async function getStoryVideos(storyId: string): Promise<VideoRow[]> {
  const { data, error } = await db.videos()
    .select('*')
    .eq('story_id', storyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as VideoRow[];
}

// Helper functions
export async function getStoryWithScenes(storyId: string) {
  const { data, error } = await supabase.rpc('get_story_with_scenes' as any, {
    story_uuid: storyId,
  });

  if (error) throw error;
  return data;
}

export async function getStoryStatistics(storyId: string) {
  const { data, error } = await supabase.rpc('get_story_statistics' as any, {
    story_uuid: storyId,
  });

  if (error) throw error;
  return data;
}

export async function getUserStoriesSummary() {
  const { data, error } = await supabase.rpc('get_user_stories_summary' as any);

  if (error) throw error;
  return data;
}

// Storage helpers
export async function uploadImage(file: File, storyId: string, sceneNumber: number): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storyId}/${sceneNumber}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('story-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('story-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadAudio(file: File, storyId: string, sceneNumber: number): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storyId}/${sceneNumber}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('story-audio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('story-audio')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadVideo(file: File, storyId: string, videoId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storyId}/${videoId}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('story-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('story-videos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
