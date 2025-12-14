import { Loader2, Film, Sparkles } from "lucide-react";

interface LoadingOverlayProps {
  progress?: number;
  message?: string;
}

export const LoadingOverlay = ({ progress, message }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-hero-gradient opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-hero-gradient opacity-40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
            <Film className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-secondary animate-bounce" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-gradient">
            Composing Your Video
          </h2>
          <p className="text-muted-foreground">
            {message || "Combining scenes, audio, and effects..."}
          </p>
        </div>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-hero-gradient transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-primary font-mono">{progress}%</p>
          </div>
        )}

        {/* Loading spinner */}
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      </div>
    </div>
  );
};
