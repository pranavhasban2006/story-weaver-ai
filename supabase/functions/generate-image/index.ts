import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map aspect ratios to image generation dimensions
const aspectRatioMap: Record<string, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1024, height: 1024 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio = '16:9', sceneNumber } = await req.json();
    
    // Support local Stable Diffusion and OpenAI DALL-E
    const LOCAL_SD_URL = Deno.env.get('LOCAL_SD_URL') || 'http://localhost:7860';
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const USE_LOCAL_SD = Deno.env.get('USE_LOCAL_SD') === 'true' || !OPENAI_API_KEY;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Image prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating image for scene ${sceneNumber}, aspect ratio: ${aspectRatio}`);

    // Enhance the prompt for better image generation
    const dimensions = aspectRatioMap[aspectRatio] || aspectRatioMap['16:9'];
    const enhancedPrompt = `${prompt}. Ultra high resolution, professional photography, cinematic composition, dramatic lighting, 8k quality, highly detailed, masterpiece, award-winning photography.`;

    let imageUrl: string | null = null;

    // Try local Stable Diffusion first if configured
    if (USE_LOCAL_SD) {
      try {
        console.log(`Attempting image generation with local Stable Diffusion at ${LOCAL_SD_URL}...`);
        
        // Try Automatic1111 API format
        const sdResponse = await fetch(`${LOCAL_SD_URL}/sdapi/v1/txt2img`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            negative_prompt: 'blurry, low quality, distorted, watermark, text',
            width: dimensions.width,
            height: dimensions.height,
            steps: 20,
            cfg_scale: 7,
            sampler_index: 'DPM++ 2M Karras',
          }),
        });

        if (sdResponse.ok) {
          const sdData = await sdResponse.json();
          if (sdData.images && sdData.images.length > 0) {
            // Stable Diffusion returns base64 encoded image
            imageUrl = `data:image/png;base64,${sdData.images[0]}`;
            console.log(`Successfully generated image with local Stable Diffusion for scene ${sceneNumber}`);
          }
        } else {
          console.warn('Local Stable Diffusion failed, trying OpenAI...');
        }
      } catch (error) {
        console.warn('Local Stable Diffusion error:', error);
        if (!OPENAI_API_KEY) {
          throw new Error(`Local Stable Diffusion failed and no OpenAI API key configured: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    // Try OpenAI DALL-E if local SD not configured or failed
    if (!imageUrl && OPENAI_API_KEY) {
      try {
        console.log('Attempting image generation with OpenAI DALL-E...');
        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: enhancedPrompt,
            size: dimensions.width >= 1024 ? '1024x1024' : '1024x1024',
            quality: 'hd',
            n: 1,
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          imageUrl = openaiData.data?.[0]?.url;
          if (imageUrl) {
            console.log(`Successfully generated image with OpenAI for scene ${sceneNumber}`);
          }
        } else {
          console.warn('OpenAI image generation failed, trying Gemini...');
        }
      } catch (error) {
        console.warn('OpenAI image generation error:', error);
      }
    }

    if (!imageUrl) {
      console.error('All image generation methods failed');
      throw new Error('Failed to generate image. Please configure USE_LOCAL_SD=true with LOCAL_SD_URL, or configure OPENAI_API_KEY for image generation.');
    }

    console.log(`Successfully generated image for scene ${sceneNumber}`);

    return new Response(
      JSON.stringify({ 
        imageUrl,
        sceneNumber 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
