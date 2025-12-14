import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scene } from "@/lib/types";
import { RefreshCw, Play, Edit3, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SceneCardProps {
  scene: Scene;
  onRegenerateImage: () => void;
  onPreviewAudio: () => void;
  onEditTitle: (newTitle: string) => void;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

export const SceneCard = ({
  scene,
  onRegenerateImage,
  onPreviewAudio,
  isGeneratingImage,
  isGeneratingAudio,
}: SceneCardProps) => {
  const statusConfig = {
    pending: { icon: Loader2, label: "Pending", color: "text-muted-foreground", animate: true },
    generating: { icon: Loader2, label: "Generating", color: "text-primary", animate: true },
    ready: { icon: Check, label: "Ready", color: "text-green-500", animate: false },
    error: { icon: AlertCircle, label: "Error", color: "text-destructive", animate: false },
  };

  const status = statusConfig[scene.status];
  const StatusIcon = status.icon;

  return (
    <Card variant="glass" className="overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row">
        {/* Image preview */}
        <div className="relative w-full md:w-80 aspect-video md:aspect-auto md:h-48 bg-muted/30 flex-shrink-0">
          {scene.imageUrl ? (
            <img
              src={scene.imageUrl}
              alt={scene.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isGeneratingImage ? (
                <div className="text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Generating image...</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mx-auto">
                    <span className="text-2xl text-muted-foreground">🎬</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Scene {scene.sceneNumber}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Scene number badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 text-xs font-display font-semibold text-primary uppercase tracking-wider">
            Scene {scene.sceneNumber}
          </div>
        </div>

        {/* Scene content */}
        <div className="flex-1 p-5 space-y-4">
          {/* Header with title and status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                {scene.title}
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {scene.description}
              </p>
            </div>
            
            {/* Status badge */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
              scene.status === 'ready' && "bg-green-500/10 border-green-500/30",
              scene.status === 'generating' && "bg-primary/10 border-primary/30",
              scene.status === 'pending' && "bg-muted border-muted-foreground/30",
              scene.status === 'error' && "bg-destructive/10 border-destructive/30"
            )}>
              <StatusIcon className={cn("w-3 h-3", status.color, status.animate && "animate-spin")} />
              <span className={status.color}>{status.label}</span>
            </div>
          </div>

          {/* Narration text */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{scene.narrationText}"
            </p>
            {scene.duration && (
              <p className="text-xs text-primary mt-2">
                Duration: {scene.duration.toFixed(1)}s
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateImage}
              disabled={isGeneratingImage}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isGeneratingImage && "animate-spin")} />
              Regenerate Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviewAudio}
              disabled={!scene.audioUrl || isGeneratingAudio}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Preview Audio
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
