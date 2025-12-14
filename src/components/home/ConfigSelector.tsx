import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoStyle, VoiceType, AspectRatio } from "@/lib/types";
import { Palette, Mic2, Maximize } from "lucide-react";

interface ConfigSelectorProps {
  style: VideoStyle;
  voiceType: VoiceType;
  aspectRatio: AspectRatio;
  onStyleChange: (style: VideoStyle) => void;
  onVoiceChange: (voice: VoiceType) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const styles: { value: VideoStyle; label: string; description: string }[] = [
  { value: "cinematic", label: "Cinematic", description: "Epic, movie-like visuals" },
  { value: "fantasy", label: "Fantasy", description: "Magical, ethereal worlds" },
  { value: "realistic", label: "Realistic", description: "Photorealistic imagery" },
  { value: "cartoon", label: "Cartoon", description: "Vibrant, animated style" },
  { value: "minimalist", label: "Minimalist", description: "Clean, simple aesthetics" },
];

const voices: { value: VoiceType; label: string }[] = [
  { value: "female", label: "Female Voice" },
  { value: "male", label: "Male Voice" },
];

const aspectRatios: { value: AspectRatio; label: string; description: string }[] = [
  { value: "16:9", label: "16:9", description: "Landscape (YouTube, TV)" },
  { value: "9:16", label: "9:16", description: "Portrait (TikTok, Reels)" },
  { value: "1:1", label: "1:1", description: "Square (Instagram)" },
];

export const ConfigSelector = ({
  style,
  voiceType,
  aspectRatio,
  onStyleChange,
  onVoiceChange,
  onAspectRatioChange,
}: ConfigSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Style selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider font-display">
          <Palette className="w-4 h-4" />
          Visual Style
        </label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-primary/30">
            {styles.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider font-display">
          <Mic2 className="w-4 h-4" />
          Narrator Voice
        </label>
        <Select value={voiceType} onValueChange={onVoiceChange}>
          <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-primary/30">
            {voices.map((v) => (
              <SelectItem key={v.value} value={v.value}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aspect ratio selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider font-display">
          <Maximize className="w-4 h-4" />
          Aspect Ratio
        </label>
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="glass border-primary/20 hover:border-primary/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-primary/30">
            {aspectRatios.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                <div>
                  <div className="font-medium">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
