import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const GenerateButton = ({ onClick, isLoading, disabled }: GenerateButtonProps) => {
  return (
    <Button
      variant="hero"
      size="xl"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "w-full relative group",
        isLoading && "animate-pulse"
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-100 group-hover:opacity-90 transition-opacity rounded-xl" />
      
      {/* Shimmer effect */}
      {!isLoading && (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
      
      {/* Button content */}
      <span className="relative flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Scenes...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Video</span>
          </>
        )}
      </span>
    </Button>
  );
};
