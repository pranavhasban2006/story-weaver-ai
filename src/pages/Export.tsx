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
    if (!videoData?.url) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = videoData.url;
    link.download = `visionforge-video-${Date.now()}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your video is being downloaded.",
    });
  };

  const handleDownloadScenes = () => {
    toast({
      title: "Scenes Download",
      description: "Preparing scene images... (Coming soon)",
    });
  };

  const handleDownloadSubtitles = () => {
    // Generate SRT file from stored scenes
    const storedScenes = sessionStorage.getItem('visionforge_scenes');
    if (!storedScenes) {
      toast({
        title: "No Subtitles Available",
        description: "Scene data not found.",
        variant: "destructive",
      });
      return;
    }

    const scenes = JSON.parse(storedScenes);
    let srtContent = '';
    let currentTime = 0;

    scenes.forEach((scene: any, index: number) => {
      const duration = scene.duration || 4;
      const startTime = formatSrtTime(currentTime);
      const endTime = formatSrtTime(currentTime + duration);
      
      srtContent += `${index + 1}\n`;
      srtContent += `${startTime} --> ${endTime}\n`;
      srtContent += `${scene.narrationText}\n\n`;
      
      currentTime += duration;
    });

    // Create and download SRT file
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visionforge-subtitles-${Date.now()}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Subtitles Downloaded",
      description: "SRT file has been saved.",
    });
  };

  const formatSrtTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
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
