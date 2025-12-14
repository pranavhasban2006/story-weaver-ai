export interface Scene {
  sceneNumber: number;
  title: string;
  description: string;
  imagePrompt: string;
  narrationText: string;
  imageUrl?: string;
  audioUrl?: string;
  duration?: number;
  status: 'pending' | 'generating' | 'ready' | 'error';
}

export type VideoStyle = 'cinematic' | 'cartoon' | 'minimalist' | 'fantasy' | 'realistic';
export type VoiceType = 'male' | 'female';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface VideoConfig {
  story: string;
  style: VideoStyle;
  voiceType: VoiceType;
  aspectRatio: AspectRatio;
}

export interface VideoMetadata {
  duration: number;
  sceneCount: number;
  resolution: string;
  fileSize: number;
  format: string;
}
