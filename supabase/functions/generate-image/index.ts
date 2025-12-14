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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      throw new Error('GEMINI_API_KEY or OPENAI_API_KEY must be configured');
    }

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

    // Try OpenAI DALL-E first if API key is available (better image quality)
    if (OPENAI_API_KEY) {
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

    // Fallback to Gemini for image generation using Imagen API
    // Note: Gemini doesn't have direct image generation, but we can use it to enhance prompts
    // For actual image generation, we'll use a different approach
    // Gemini can be used with Google's Imagen API if available, or we can use other services
    
    // Alternative: Use Gemini to generate a better prompt, then use another service
    // For now, if OpenAI fails and only Gemini is available, we'll return an error
    // suggesting to use OpenAI or another image generation service
    
    if (!imageUrl && GEMINI_API_KEY && !OPENAI_API_KEY) {
      // Gemini doesn't directly generate images, but we can use it to create better prompts
      // For production, you might want to integrate with Google's Imagen API
      // or use another image generation service
      console.warn('Gemini API does not support direct image generation. Please configure OPENAI_API_KEY for image generation.');
      throw new Error('Image generation requires OPENAI_API_KEY. Gemini API does not support direct image generation. Please configure OpenAI API key or use another image generation service.');
    }

    if (!imageUrl) {
      console.error('All image generation methods failed');
      throw new Error('Failed to generate image. Please ensure OPENAI_API_KEY is configured for image generation.');
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
