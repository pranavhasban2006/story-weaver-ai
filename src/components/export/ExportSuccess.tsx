import { CheckCircle2, Sparkles, Download, Film, FileText, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoMetadata } from "@/lib/types";

interface ExportSuccessProps {
  videoUrl: string;
  metadata: VideoMetadata;
  onDownload: () => void;
  onDownloadScenes?: () => void;
  onDownloadSubtitles?: () => void;
  onCreateAnother: () => void;
}

export const ExportSuccess = ({
  videoUrl,
  metadata,
  onDownload,
  onDownloadScenes,
  onDownloadSubtitles,
  onCreateAnother,
}: ExportSuccessProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        {/* Success header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
          </div>
          
          <h1 className="font-display text-4xl font-bold">
            <span className="text-gradient">Video Ready!</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI-generated video has been created successfully.
          </p>
        </div>

        {/* Video preview */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="aspect-video bg-muted/30 relative">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={undefined}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </Card>

        {/* Download buttons */}
        <div className="space-y-3">
          <Button
            variant="hero"
            size="xl"
            onClick={onDownload}
            className="w-full"
          >
            <Download className="w-5 h-5" />
            Download MP4 (1080p)
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onDownloadScenes}
              className="gap-2"
            >
              <Images className="w-4 h-4" />
              Download Scenes
            </Button>
            <Button
              variant="outline"
              onClick={onDownloadSubtitles}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Download Subtitles
            </Button>
          </div>
        </div>

        {/* Video stats */}
        <Card variant="glass" className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {metadata.sceneCount}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Scenes</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {formatDuration(metadata.duration)}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {metadata.resolution}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Quality</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {formatFileSize(metadata.fileSize)}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Size</p>
            </div>
          </div>
        </Card>

        {/* Create another */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onCreateAnother}
            className="text-muted-foreground hover:text-primary"
          >
            ← Create Another Video
          </Button>
        </div>
      </div>
    </div>
  );
};
