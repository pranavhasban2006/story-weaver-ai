import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExportSuccess } from "@/components/export/ExportSuccess";
import { VideoMetadata } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const Export = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<{
    url: string;
    metadata: VideoMetadata;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('visionforge_video');
    if (!stored) {
      navigate('/');
      return;
    }
    setVideoData(JSON.parse(stored));
  }, [navigate]);

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your video is being prepared for download...",
    });
    // In production, this would trigger actual file download
  };

  const handleDownloadScenes = () => {
    toast({
      title: "Scenes Download",
      description: "Preparing scene images as ZIP...",
    });
  };

  const handleDownloadSubtitles = () => {
    toast({
      title: "Subtitles Download",
      description: "Generating SRT file...",
    });
  };

  const handleCreateAnother = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (!videoData) {
    return null;
  }

  return (
    <ExportSuccess
      videoUrl={videoData.url}
      metadata={videoData.metadata}
      onDownload={handleDownload}
      onDownloadScenes={handleDownloadScenes}
      onDownloadSubtitles={handleDownloadSubtitles}
      onCreateAnother={handleCreateAnother}
    />
  );
};

export default Export;
