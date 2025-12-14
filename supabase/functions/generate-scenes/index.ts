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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
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

    const systemPrompt = `You are a professional cinematic scene breakdown AI for video generation. Your task is to analyze stories and break them into distinct visual scenes optimized for AI video creation.

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
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this story and break it into cinematic scenes:\n\n${story}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing scenes...');

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    
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
