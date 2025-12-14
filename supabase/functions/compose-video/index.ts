import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Scene {
  sceneNumber: number;
  title: string;
  imageUrl: string;
  narrationText: string;
  duration: number;
}

interface ComposeRequest {
  scenes: Scene[];
  aspectRatio: string;
  style: string;
  includeMusic?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenes, aspectRatio, style, includeMusic = false }: ComposeRequest = await req.json();
    const SHOTSTACK_API_KEY = Deno.env.get('SHOTSTACK_API_KEY');

    if (!SHOTSTACK_API_KEY) {
      throw new Error('SHOTSTACK_API_KEY is not configured');
    }

    if (!scenes || scenes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one scene is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Composing video with ${scenes.length} scenes, aspect ratio: ${aspectRatio}`);

    // Map aspect ratio to Shotstack resolution
    const resolutionMap: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 },
    };

    const resolution = resolutionMap[aspectRatio] || resolutionMap['16:9'];

    // Build Shotstack timeline clips from scenes
    let startTime = 0;
    const clips = scenes.map((scene, index) => {
      const duration = scene.duration || 4;
      const clip = {
        asset: {
          type: 'image',
          src: scene.imageUrl,
        },
        start: startTime,
        length: duration,
        effect: 'zoomIn', // Ken Burns effect
        transition: {
          in: 'fade',
          out: 'fade',
        },
        fit: 'cover',
      };
      startTime += duration - 0.5; // Overlap for smooth transitions
      return clip;
    });

    // Add title overlays for each scene
    let titleStart = 0;
    const titleClips = scenes.map((scene, index) => {
      const duration = scene.duration || 4;
      const titleClip = {
        asset: {
          type: 'title',
          text: scene.title,
          style: 'minimal',
          color: '#ffffff',
          size: 'medium',
          position: 'bottomLeft',
          offset: {
            x: 0.05,
            y: 0.1,
          },
        },
        start: titleStart + 0.5,
        length: duration - 1,
        transition: {
          in: 'fade',
          out: 'fade',
        },
      };
      titleStart += duration - 0.5;
      return titleClip;
    });

    // Calculate total duration
    const totalDuration = scenes.reduce((acc, s, i) => {
      if (i === 0) return s.duration || 4;
      return acc + (s.duration || 4) - 0.5;
    }, 0);

    // Build the timeline
    const timeline = {
      soundtrack: includeMusic ? {
        src: 'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/unminus/ambisax.mp3',
        effect: 'fadeOut',
        volume: 0.3,
      } : undefined,
      background: '#000000',
      tracks: [
        { clips: titleClips },
        { clips },
      ],
    };

    // Build the output configuration
    const output = {
      format: 'mp4',
      resolution: 'hd', // 1080p
      aspectRatio: aspectRatio.replace(':', ':'),
      fps: 30,
      quality: 'high',
    };

    // Create the render request
    const renderPayload = {
      timeline,
      output,
    };

    console.log('Sending render request to Shotstack...');

    // Submit render job to Shotstack
    const renderResponse = await fetch('https://api.shotstack.io/stage/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SHOTSTACK_API_KEY,
      },
      body: JSON.stringify(renderPayload),
    });

    if (!renderResponse.ok) {
      const errorText = await renderResponse.text();
      console.error('Shotstack render error:', renderResponse.status, errorText);
      throw new Error(`Video render failed: ${renderResponse.status}`);
    }

    const renderData = await renderResponse.json();
    const renderId = renderData.response?.id;

    if (!renderId) {
      throw new Error('No render ID returned from Shotstack');
    }

    console.log(`Render job submitted: ${renderId}`);

    // Poll for render completion (max 2 minutes)
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 24; // 24 * 5 seconds = 2 minutes

    while (!videoUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.shotstack.io/stage/render/${renderId}`, {
        headers: {
          'x-api-key': SHOTSTACK_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check render status');
      }

      const statusData = await statusResponse.json();
      const status = statusData.response?.status;

      console.log(`Render status: ${status} (attempt ${attempts + 1})`);

      if (status === 'done') {
        videoUrl = statusData.response?.url;
      } else if (status === 'failed') {
        throw new Error('Video render failed on Shotstack');
      }

      attempts++;
    }

    if (!videoUrl) {
      throw new Error('Video render timed out. Please try again.');
    }

    console.log(`Video ready: ${videoUrl}`);

    // Calculate file size estimate (rough estimate based on duration and quality)
    const estimatedFileSize = Math.round(totalDuration * 1.5 * 1024 * 1024); // ~1.5MB per second

    return new Response(
      JSON.stringify({
        success: true,
        videoUrl,
        metadata: {
          duration: totalDuration,
          sceneCount: scenes.length,
          resolution: `${resolution.width}x${resolution.height}`,
          fileSize: estimatedFileSize,
          format: 'mp4',
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in compose-video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to compose video';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
