import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScenePreviewHeader } from "@/components/scenes/ScenePreviewHeader";
import { SceneCard } from "@/components/scenes/SceneCard";
import { LoadingOverlay } from "@/components/scenes/LoadingOverlay";
import { Scene } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

// Demo image URLs for prototype
const demoImages = [
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=450&fit=crop",
];

const Scenes = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [composingProgress, setComposingProgress] = useState(0);

  useEffect(() => {
    const storedScenes = sessionStorage.getItem('visionforge_scenes');
    if (!storedScenes) {
      navigate('/');
      return;
    }
    
    const parsedScenes: Scene[] = JSON.parse(storedScenes);
    setScenes(parsedScenes);
    
    // Simulate image generation for each scene
    parsedScenes.forEach((scene, index) => {
      setTimeout(() => {
        setScenes(prev => prev.map(s => 
          s.sceneNumber === scene.sceneNumber
            ? { 
                ...s, 
                status: 'generating' as const,
              }
            : s
        ));
        
        // Complete after delay
        setTimeout(() => {
          setScenes(prev => prev.map(s => 
            s.sceneNumber === scene.sceneNumber
              ? { 
                  ...s, 
                  status: 'ready' as const,
                  imageUrl: demoImages[index % demoImages.length],
                  audioUrl: 'demo-audio',
                  duration: 3 + Math.random() * 4,
                }
              : s
          ));
        }, 1500 + Math.random() * 1000);
      }, index * 800);
    });
  }, [navigate]);

  const readyCount = scenes.filter(s => s.status === 'ready').length;

  const handleRegenerateImage = (sceneNumber: number) => {
    setScenes(prev => prev.map(s => 
      s.sceneNumber === sceneNumber
        ? { ...s, status: 'generating' as const }
        : s
    ));
    
    setTimeout(() => {
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setScenes(prev => prev.map(s => 
        s.sceneNumber === sceneNumber
          ? { ...s, status: 'ready' as const, imageUrl: randomImage }
          : s
      ));
      toast({
        title: "Image Regenerated",
        description: `Scene ${sceneNumber} has a new image.`,
      });
    }, 2000);
  };

  const handlePreviewAudio = (sceneNumber: number) => {
    toast({
      title: "Audio Preview",
      description: `Playing audio for Scene ${sceneNumber}...`,
    });
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
              isGeneratingImage={scene.status === 'generating'}
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
