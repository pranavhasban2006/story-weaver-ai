import { Button } from "@/components/ui/button";
import { ArrowLeft, Film, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScenePreviewHeaderProps {
  sceneCount: number;
  readyCount: number;
  onCompose: () => void;
  isComposing: boolean;
}

export const ScenePreviewHeader = ({
  sceneCount,
  readyCount,
  onCompose,
  isComposing,
}: ScenePreviewHeaderProps) => {
  const navigate = useNavigate();
  const allReady = readyCount === sceneCount && sceneCount > 0;

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/20">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Scene Preview
            </h1>
            <p className="text-xs text-muted-foreground">
              {readyCount} of {sceneCount} scenes ready
            </p>
          </div>
        </div>

        <Button
          variant="hero"
          size="lg"
          onClick={onCompose}
          disabled={!allReady || isComposing}
          className={allReady && !isComposing ? "animate-glow-pulse" : ""}
        >
          {isComposing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Composing Video...</span>
            </>
          ) : (
            <>
              <Film className="w-5 h-5" />
              <span>Compose Final Video</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
};
