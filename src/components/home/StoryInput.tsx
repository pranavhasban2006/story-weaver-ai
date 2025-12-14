import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface StoryInputProps {
  value: string;
  onChange: (value: string) => void;
  maxWords?: number;
}

export const StoryInput = ({ value, onChange, maxWords = 2000 }: StoryInputProps) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > maxWords;
  const isNearLimit = wordCount > maxWords * 0.9;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary uppercase tracking-wider font-display">
        Your Story
      </label>
      <div className="relative">
        <Textarea
          variant="glass"
          placeholder="Once upon a time, in a land far away, there lived a young adventurer who dreamed of exploring the unknown..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-none text-foreground leading-relaxed"
        />
        
        {/* Word count indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-mono transition-colors",
              isOverLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-yellow-500"
                : "text-muted-foreground"
            )}
          >
            {wordCount.toLocaleString()} / {maxWords.toLocaleString()} words
          </span>
        </div>
      </div>
      
      {isOverLimit && (
        <p className="text-xs text-destructive animate-fade-in">
          Story exceeds maximum word limit. Please shorten your story.
        </p>
      )}
      
      {wordCount > 0 && wordCount < 50 && (
        <p className="text-xs text-yellow-500 animate-fade-in">
          Tip: Add more detail for better scene generation (minimum 50 words recommended).
        </p>
      )}
    </div>
  );
};
