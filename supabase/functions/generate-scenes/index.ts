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
    const { story, style } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    if (!story || story.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Story must be at least 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const wordCount = story.trim().split(/\s+/).length;
    if (wordCount > 2000) {
      return new Response(
        JSON.stringify({ error: 'Story must be under 2000 words' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating scenes for story with ${wordCount} words, style: ${style}`);

    const prompt = `You are a professional cinematic scene breakdown AI for video generation. Your task is to analyze stories and break them into distinct visual scenes optimized for AI video creation.

For each scene, you must provide:
1. sceneNumber: Sequential number starting from 1
2. title: A compelling 3-5 word title
3. description: 1-2 sentences describing the visual content
4. imagePrompt: A detailed prompt optimized for ${style} style AI image generation. Include specific visual details, lighting, mood, composition, and artistic style keywords.
5. narrationText: The exact story text that will be narrated for this scene

Guidelines:
- Create 3-7 scenes depending on story length
- Each scene should be visually distinct and memorable
- Image prompts should be detailed and specific (50-150 words)
- Narration text should flow naturally when read aloud
- Maintain narrative continuity across scenes

Respond ONLY with valid JSON in this exact format:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene Title Here",
      "description": "Visual description of the scene",
      "imagePrompt": "Detailed image generation prompt for ${style} style...",
      "narrationText": "The narration text for this scene..."
    }
  ]
}

Analyze this story and break it into cinematic scenes:

${story}`;

    // Use Gemini API directly
    const model = 'gemini-1.5-flash'; // or 'gemini-1.5-pro' for better quality
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          return new Response(
            JSON.stringify({ error: errorData.error?.message || 'Invalid request to Gemini API' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch {
          return new Response(
            JSON.stringify({ error: 'Invalid request to Gemini API' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text content from Gemini response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('No content in Gemini response:', JSON.stringify(data));
      throw new Error('No content in AI response');
    }

    console.log('Gemini response received, parsing scenes...');

    // Parse JSON response (Gemini should return JSON directly with responseMimeType)
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error('Failed to parse JSON from response');
      }
    }
    
    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
      throw new Error('Invalid response format: missing scenes array');
    }

    // Add status to each scene
    const scenes = parsed.scenes.map((scene: any) => ({
      ...scene,
      status: 'pending'
    }));

    console.log(`Successfully generated ${scenes.length} scenes`);

    return new Response(
      JSON.stringify({ scenes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-scenes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate scenes';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
