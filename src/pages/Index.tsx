import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/home/Hero";
import { StoryInput } from "@/components/home/StoryInput";
import { ConfigSelector } from "@/components/home/ConfigSelector";
import { GenerateButton } from "@/components/home/GenerateButton";
import { VideoStyle, VoiceType, AspectRatio } from "@/lib/types";
import { generateScenes } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState("");
  const [style, setStyle] = useState<VideoStyle>("cinematic");
  const [voiceType, setVoiceType] = useState<VoiceType>("female");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isLoading, setIsLoading] = useState(false);

  const wordCount = story.trim() ? story.trim().split(/\s+/).length : 0;
  const isValidStory = wordCount >= 50 && wordCount <= 2000;

  const handleGenerate = async () => {
    if (!isValidStory) {
      toast({
        title: "Invalid Story",
        description: wordCount < 50 
          ? "Please write at least 50 words for better scene generation."
          : "Story must be under 2000 words.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await generateScenes(story, style);
      
      // Store scenes and config in sessionStorage
      sessionStorage.setItem('visionforge_scenes', JSON.stringify(response.scenes));
      sessionStorage.setItem('visionforge_config', JSON.stringify({
        story, style, voiceType, aspectRatio
      }));
      
      toast({
        title: "Scenes Generated!",
        description: `Created ${response.scenes.length} scenes from your story using AI.`,
      });
      
      navigate("/scenes");
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-50" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-secondary/5 to-transparent opacity-50" />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Hero section */}
        <Hero />

        {/* Main input card */}
        <Card 
          variant="elevated" 
          className="mt-12 p-6 md:p-8 space-y-6 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          {/* Story input */}
          <StoryInput
            value={story}
            onChange={setStory}
            maxWords={2000}
          />

          {/* Configuration selectors */}
          <ConfigSelector
            style={style}
            voiceType={voiceType}
            aspectRatio={aspectRatio}
            onStyleChange={setStyle}
            onVoiceChange={setVoiceType}
            onAspectRatioChange={setAspectRatio}
          />

          {/* Generate button */}
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!isValidStory}
          />
        </Card>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>
            Powered by Lovable AI • Gemini Vision • Neural Voice Synthesis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
