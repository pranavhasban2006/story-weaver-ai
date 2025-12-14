import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ScenePreviewHeader } from "@/components/scenes/ScenePreviewHeader";
import { SceneCard } from "@/components/scenes/SceneCard";
import { LoadingOverlay } from "@/components/scenes/LoadingOverlay";
import { GenerationProgress } from "@/components/scenes/GenerationProgress";
import { Scene, AspectRatio, VoiceType, VideoStyle } from "@/lib/types";
import { generateImage, generateSpeech, composeVideo } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Scenes = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [config, setConfig] = useState<{ aspectRatio: AspectRatio; voiceType: VoiceType; style: VideoStyle } | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composingMessage, setComposingMessage] = useState("Preparing video composition...");
  const [generatingImages, setGeneratingImages] = useState<Set<number>>(new Set());
  const [generatingAudio, setGeneratingAudio] = useState<Set<number>>(new Set());
  
  // Progress tracking
  const [currentGeneratingScene, setCurrentGeneratingScene] = useState(0);
  const [currentTask, setCurrentTask] = useState<'image' | 'audio' | 'idle'>('idle');
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  const generateImageForScene = useCallback(async (scene: Scene, aspectRatio: AspectRatio) => {
    setGeneratingImages(prev => new Set(prev).add(scene.sceneNumber));
    setCurrentGeneratingScene(scene.sceneNumber);
    setCurrentTask('image');
    
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
    setCurrentTask('audio');

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

  const generateAllAssets = useCallback(async (scenesToProcess: Scene[], parsedConfig: { aspectRatio: AspectRatio; voiceType: VoiceType }) => {
    for (let i = 0; i < scenesToProcess.length; i++) {
      const scene = scenesToProcess[i];
      setCurrentGeneratingScene(scene.sceneNumber);
      
      // Generate image first
      await generateImageForScene(scene, parsedConfig.aspectRatio);
      
      // Then generate audio
      await generateAudioForScene(scene, parsedConfig.voiceType);
      
      // Small delay between scenes to avoid rate limits
      if (i < scenesToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setCurrentTask('idle');
    setIsGenerationComplete(true);
    
    toast({
      title: "All Assets Generated",
      description: "Your scenes are ready for video composition!",
    });
  }, [generateImageForScene, generateAudioForScene]);

  useEffect(() => {
    const storedScenes = sessionStorage.getItem('visionforge_scenes');
    const storedConfig = sessionStorage.getItem('visionforge_config');
    
    if (!storedScenes) {
      navigate('/');
      return;
    }
    
    const parsedScenes: Scene[] = JSON.parse(storedScenes);
    const parsedConfig = storedConfig ? JSON.parse(storedConfig) : { aspectRatio: '16:9', voiceType: 'female', style: 'cinematic' };
    
    setScenes(parsedScenes);
    setConfig(parsedConfig);
    
    // Start sequential generation
    generateAllAssets(parsedScenes, parsedConfig);
  }, [navigate, generateAllAssets]);

  const readyCount = scenes.filter(s => s.status === 'ready').length;

  const handleRegenerateImage = async (sceneNumber: number) => {
    const scene = scenes.find(s => s.sceneNumber === sceneNumber);
    if (scene && config) {
      setIsGenerationComplete(false);
      await generateImageForScene(scene, config.aspectRatio);
      setIsGenerationComplete(true);
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
    if (!config) return;
    
    setIsComposing(true);
    setComposingMessage("Submitting video to render pipeline...");

    try {
      // Filter scenes with valid images
      const validScenes = scenes.filter(s => s.imageUrl && s.status === 'ready');
      
      if (validScenes.length === 0) {
        throw new Error('No scenes with images ready for composition');
      }

      setComposingMessage("Rendering video with Shotstack (this may take 1-2 minutes)...");

      const response = await composeVideo(
        validScenes,
        config.aspectRatio,
        config.style,
        true // Include background music
      );

      if (response.success && response.videoUrl) {
        // Store video metadata
        sessionStorage.setItem('visionforge_video', JSON.stringify({
          url: response.videoUrl,
          metadata: response.metadata,
        }));

        toast({
          title: "Video Ready!",
          description: "Your video has been rendered successfully.",
        });

        navigate('/export');
      } else {
        throw new Error('Video composition failed');
      }
    } catch (error) {
      console.error('Video composition error:', error);
      toast({
        title: "Composition Failed",
        description: error instanceof Error ? error.message : "Failed to compose video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsComposing(false);
    }
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

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Generation Progress */}
        <GenerationProgress
          totalScenes={scenes.length}
          currentScene={currentGeneratingScene}
          completedScenes={readyCount}
          currentTask={currentTask}
          isComplete={isGenerationComplete}
        />

        {/* Scene Cards */}
        <div className="space-y-6">
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
      </div>

      {isComposing && (
        <LoadingOverlay
          message={composingMessage}
        />
      )}
    </div>
  );
};

export default Scenes;
