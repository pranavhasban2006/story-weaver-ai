import { Progress } from "@/components/ui/progress";
import { Loader2, Check, ImageIcon, Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  totalScenes: number;
  currentScene: number;
  completedScenes: number;
  currentTask: 'image' | 'audio' | 'idle';
  isComplete: boolean;
}

export const GenerationProgress = ({
  totalScenes,
  currentScene,
  completedScenes,
  currentTask,
  isComplete,
}: GenerationProgressProps) => {
  const progress = (completedScenes / totalScenes) * 100;

  if (isComplete) {
    return null;
  }

  return (
    <div className="glass border-glow rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {currentTask === 'image' ? (
            <div className="flex items-center gap-2 text-primary">
              <ImageIcon className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Generating image for Scene {currentScene}</span>
            </div>
          ) : currentTask === 'audio' ? (
            <div className="flex items-center gap-2 text-secondary">
              <Mic2 className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Generating audio for Scene {currentScene}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Preparing scenes...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {completedScenes} / {totalScenes} complete
          </span>
          {completedScenes === totalScenes && (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Scene indicators */}
      <div className="flex items-center gap-2 mt-3">
        {Array.from({ length: totalScenes }).map((_, index) => {
          const sceneNum = index + 1;
          const isCompleted = sceneNum < currentScene || (sceneNum === currentScene && completedScenes >= sceneNum);
          const isCurrent = sceneNum === currentScene && !isCompleted;
          
          return (
            <div
              key={sceneNum}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-all duration-300",
                isCompleted && "bg-primary/20 text-primary border border-primary/30",
                isCurrent && "bg-primary text-primary-foreground animate-pulse",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                sceneNum
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
