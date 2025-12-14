import { supabase } from "@/integrations/supabase/client";
import { Scene, VideoStyle, VoiceType, AspectRatio, VideoMetadata } from "./types";

export interface GenerateScenesResponse {
  scenes: Scene[];
  error?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  sceneNumber: number;
  error?: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  sceneNumber: number;
  duration: number;
  error?: string;
}

export interface ComposeVideoResponse {
  success: boolean;
  videoUrl: string;
  metadata: VideoMetadata;
  error?: string;
}

export async function generateScenes(
  story: string,
  style: VideoStyle
): Promise<GenerateScenesResponse> {
  const { data, error } = await supabase.functions.invoke('generate-scenes', {
    body: { story, style }
  });

  if (error) {
    console.error('Error generating scenes:', error);
    throw new Error(error.message || 'Failed to generate scenes');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function generateImage(
  prompt: string,
  aspectRatio: AspectRatio,
  sceneNumber: number
): Promise<GenerateImageResponse> {
  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: { prompt, aspectRatio, sceneNumber }
  });

  if (error) {
    console.error('Error generating image:', error);
    throw new Error(error.message || 'Failed to generate image');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function generateSpeech(
  text: string,
  voiceType: VoiceType,
  sceneNumber: number
): Promise<TextToSpeechResponse> {
  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: { text, voiceType, sceneNumber }
  });

  if (error) {
    console.error('Error generating speech:', error);
    throw new Error(error.message || 'Failed to generate speech');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function composeVideo(
  scenes: Scene[],
  aspectRatio: AspectRatio,
  style: VideoStyle,
  includeMusic: boolean = false
): Promise<ComposeVideoResponse> {
  const { data, error } = await supabase.functions.invoke('compose-video', {
    body: { scenes, aspectRatio, style, includeMusic }
  });

  if (error) {
    console.error('Error composing video:', error);
    throw new Error(error.message || 'Failed to compose video');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
