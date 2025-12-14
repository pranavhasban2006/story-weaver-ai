import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ScenePreviewHeader } from "@/components/scenes/ScenePreviewHeader";
import { SceneCard } from "@/components/scenes/SceneCard";
import { LoadingOverlay } from "@/components/scenes/LoadingOverlay";
import { Scene, AspectRatio, VoiceType } from "@/lib/types";
import { generateImage, generateSpeech } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Scenes = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [config, setConfig] = useState<{ aspectRatio: AspectRatio; voiceType: VoiceType } | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composingProgress, setComposingProgress] = useState(0);
  const [generatingImages, setGeneratingImages] = useState<Set<number>>(new Set());
  const [generatingAudio, setGeneratingAudio] = useState<Set<number>>(new Set());

  const generateImageForScene = useCallback(async (scene: Scene, aspectRatio: AspectRatio) => {
    setGeneratingImages(prev => new Set(prev).add(scene.sceneNumber));
    setScenes(prev => prev.map(s => 
      s.sceneNumber === scene.sceneNumber ? { ...s, status: 'generating' as const } : s
    ));

    try {
      const response = await generateImage(scene.imagePrompt, aspectRatio, scene.sceneNumber);
      
      setScenes(prev => prev.map(s => 
        s.sceneNumber === scene.sceneNumber
          ? { ...s, imageUrl: response.imageUrl, status: 'ready' as const }
          : s
      ));
      
      toast({
        title: "Image Generated",
        description: `Scene ${scene.sceneNumber} image is ready.`,
      });
    } catch (error) {
      console.error(`Failed to generate image for scene ${scene.sceneNumber}:`, error);
      setScenes(prev => prev.map(s => 
        s.sceneNumber === scene.sceneNumber ? { ...s, status: 'error' as const } : s
      ));
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Please try regenerating.",
        variant: "destructive",
      });
    } finally {
      setGeneratingImages(prev => {
        const next = new Set(prev);
        next.delete(scene.sceneNumber);
        return next;
      });
    }
  }, []);

  const generateAudioForScene = useCallback(async (scene: Scene, voiceType: VoiceType) => {
    setGeneratingAudio(prev => new Set(prev).add(scene.sceneNumber));

    try {
      const response = await generateSpeech(scene.narrationText, voiceType, scene.sceneNumber);
      
      setScenes(prev => prev.map(s => 
        s.sceneNumber === scene.sceneNumber
          ? { ...s, audioUrl: response.audioUrl, duration: response.duration }
          : s
      ));
    } catch (error) {
      console.error(`Failed to generate audio for scene ${scene.sceneNumber}:`, error);
    } finally {
      setGeneratingAudio(prev => {
        const next = new Set(prev);
        next.delete(scene.sceneNumber);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    const storedScenes = sessionStorage.getItem('visionforge_scenes');
    const storedConfig = sessionStorage.getItem('visionforge_config');
    
    if (!storedScenes) {
      navigate('/');
      return;
    }
    
    const parsedScenes: Scene[] = JSON.parse(storedScenes);
    const parsedConfig = storedConfig ? JSON.parse(storedConfig) : { aspectRatio: '16:9', voiceType: 'female' };
    
    setScenes(parsedScenes);
    setConfig(parsedConfig);
    
    // Generate images and audio for each scene with staggered delays
    parsedScenes.forEach((scene, index) => {
      setTimeout(() => {
        generateImageForScene(scene, parsedConfig.aspectRatio);
        generateAudioForScene(scene, parsedConfig.voiceType);
      }, index * 2000); // 2 second delay between each scene to avoid rate limits
    });
  }, [navigate, generateImageForScene, generateAudioForScene]);

  const readyCount = scenes.filter(s => s.status === 'ready').length;

  const handleRegenerateImage = async (sceneNumber: number) => {
    const scene = scenes.find(s => s.sceneNumber === sceneNumber);
    if (scene && config) {
      await generateImageForScene(scene, config.aspectRatio);
    }
  };

  const handlePreviewAudio = (sceneNumber: number) => {
    const scene = scenes.find(s => s.sceneNumber === sceneNumber);
    if (scene?.audioUrl && scene.audioUrl !== 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=') {
      const audio = new Audio(scene.audioUrl);
      audio.play();
    } else {
      toast({
        title: "Audio Preview",
        description: `Playing narration for Scene ${sceneNumber}... (demo mode)`,
      });
    }
  };

  const handleCompose = async () => {
    setIsComposing(true);
    setComposingProgress(0);
    
    // Simulate video composition progress
    const interval = setInterval(() => {
      setComposingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate composition time
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    clearInterval(interval);
    setComposingProgress(100);
    
    // Store video metadata
    sessionStorage.setItem('visionforge_video', JSON.stringify({
      url: 'demo-video-url',
      metadata: {
        duration: scenes.reduce((acc, s) => acc + (s.duration || 4), 0),
        sceneCount: scenes.length,
        resolution: '1080p',
        fileSize: 15 * 1024 * 1024, // 15MB
        format: 'mp4',
      }
    }));
    
    setTimeout(() => {
      setIsComposing(false);
      navigate('/export');
    }, 500);
  };

  if (scenes.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen pb-12">
      <ScenePreviewHeader
        sceneCount={scenes.length}
        readyCount={readyCount}
        onCompose={handleCompose}
        isComposing={isComposing}
      />

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {scenes.map((scene, index) => (
          <div
            key={scene.sceneNumber}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <SceneCard
              scene={scene}
              onRegenerateImage={() => handleRegenerateImage(scene.sceneNumber)}
              onPreviewAudio={() => handlePreviewAudio(scene.sceneNumber)}
              onEditTitle={() => {}}
              isGeneratingImage={generatingImages.has(scene.sceneNumber)}
              isGeneratingAudio={generatingAudio.has(scene.sceneNumber)}
            />
          </div>
        ))}
      </div>

      {isComposing && (
        <LoadingOverlay
          progress={Math.min(Math.round(composingProgress), 100)}
          message="Combining scenes with transitions and audio..."
        />
      )}
    </div>
  );
};

export default Scenes;
