import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceType = 'female', sceneNumber } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating TTS for scene ${sceneNumber}, voice: ${voiceType}, text length: ${text.length}`);

    // Use Gemini to generate speech description and timing
    // Since we don't have direct TTS, we'll simulate with audio duration estimation
    // In production, you would integrate with Google Cloud TTS or ElevenLabs
    
    // Estimate duration based on average speaking rate (150 words per minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60; // seconds

    // For demo purposes, we'll return a placeholder audio URL
    // In production, you would generate actual audio here
    const demoAudioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=`;

    console.log(`TTS generated for scene ${sceneNumber}, estimated duration: ${estimatedDuration.toFixed(1)}s`);

    return new Response(
      JSON.stringify({ 
        audioUrl: demoAudioUrl,
        sceneNumber,
        duration: Math.max(3, estimatedDuration), // Minimum 3 seconds
        text
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in text-to-speech:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate speech';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
