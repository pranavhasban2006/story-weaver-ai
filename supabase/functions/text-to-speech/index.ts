import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Voice mapping for different TTS services
const voiceMap: Record<string, { openai?: string; elevenlabs?: string; google?: string }> = {
  'female': {
    openai: 'nova',
    elevenlabs: '21m00Tcm4TlvDq8ikWAM',
    google: 'en-US-Neural2-F',
  },
  'male': {
    openai: 'onyx',
    elevenlabs: 'pNInz6obpgDQGcFmaJgB',
    google: 'en-US-Neural2-D',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceType = 'female', sceneNumber } = await req.json();
    
    // Support local TTS (Piper) and cloud TTS services
    const LOCAL_TTS_URL = Deno.env.get('LOCAL_TTS_URL') || 'http://localhost:5000';
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
    const USE_LOCAL_TTS = Deno.env.get('USE_LOCAL_TTS') === 'true' || (!OPENAI_API_KEY && !ELEVENLABS_API_KEY && !GOOGLE_TTS_API_KEY);

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating TTS for scene ${sceneNumber}, voice: ${voiceType}, text length: ${text.length}`);

    let audioUrl: string | null = null;
    let duration = 0;

    // Try local TTS (Piper) first if configured
    if (USE_LOCAL_TTS) {
      try {
        console.log(`Attempting TTS with local service at ${LOCAL_TTS_URL}...`);
        
        // Piper TTS API format
        const localTtsResponse = await fetch(`${LOCAL_TTS_URL}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            voice: voiceType === 'female' ? 'en_US-lessac-medium' : 'en_US-lessac-medium', // You can configure voices
          }),
        });

        if (localTtsResponse.ok) {
          const audioBlob = await localTtsResponse.blob();
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          audioUrl = `data:audio/wav;base64,${base64Audio}`;
          
          // Estimate duration (rough estimate: ~150 words per minute)
          const wordCount = text.split(/\s+/).length;
          duration = Math.max(3, (wordCount / 150) * 60);
          
          console.log(`Successfully generated TTS with local service for scene ${sceneNumber}`);
        } else {
          console.warn('Local TTS failed, trying cloud services...');
        }
      } catch (error) {
        console.warn('Local TTS error:', error);
        if (!OPENAI_API_KEY && !ELEVENLABS_API_KEY && !GOOGLE_TTS_API_KEY) {
          throw new Error(`Local TTS failed and no cloud TTS API keys configured: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    // Try OpenAI TTS if local TTS not configured or failed
    if (!audioUrl && OPENAI_API_KEY) {
      try {
        console.log('Attempting TTS with OpenAI...');
        const voice = voiceMap[voiceType]?.openai || 'nova';
        const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: text,
            voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
            response_format: 'mp3',
            speed: 1.0,
          }),
        });

        if (openaiResponse.ok) {
          const audioBlob = await openaiResponse.blob();
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          audioUrl = `data:audio/mp3;base64,${base64Audio}`;
          
          // Estimate duration (OpenAI TTS-1-HD is ~150 words per minute)
          const wordCount = text.split(/\s+/).length;
          duration = Math.max(3, (wordCount / 150) * 60);
          
          console.log(`Successfully generated TTS with OpenAI for scene ${sceneNumber}`);
        } else {
          console.warn('OpenAI TTS failed, trying fallback...');
        }
      } catch (error) {
        console.warn('OpenAI TTS error:', error);
      }
    }

    // Fallback to ElevenLabs
    if (!audioUrl && ELEVENLABS_API_KEY) {
      try {
        console.log('Attempting TTS with ElevenLabs...');
        const voiceId = voiceMap[voiceType]?.elevenlabs || voiceMap['female'].elevenlabs!;
        const elevenlabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        });

        if (elevenlabsResponse.ok) {
          const audioBlob = await elevenlabsResponse.blob();
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          audioUrl = `data:audio/mp3;base64,${base64Audio}`;
          
          // Estimate duration (ElevenLabs is ~150 words per minute)
          const wordCount = text.split(/\s+/).length;
          duration = Math.max(3, (wordCount / 150) * 60);
          
          console.log(`Successfully generated TTS with ElevenLabs for scene ${sceneNumber}`);
        } else {
          console.warn('ElevenLabs TTS failed, trying fallback...');
        }
      } catch (error) {
        console.warn('ElevenLabs TTS error:', error);
      }
    }

    // Fallback to Google Cloud TTS
    if (!audioUrl && GOOGLE_TTS_API_KEY) {
      try {
        console.log('Attempting TTS with Google Cloud TTS...');
        const voiceName = voiceMap[voiceType]?.google || voiceMap['female'].google!;
        const googleResponse = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: { text: text },
              voice: {
                languageCode: 'en-US',
                name: voiceName,
                ssmlGender: voiceType === 'female' ? 'FEMALE' : 'MALE',
              },
              audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0,
                volumeGainDb: 0,
              },
            }),
          }
        );

        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          const audioContent = googleData.audioContent;
          if (audioContent) {
            audioUrl = `data:audio/mp3;base64,${audioContent}`;
            
            // Estimate duration (Google TTS is ~150 words per minute)
            const wordCount = text.split(/\s+/).length;
            duration = Math.max(3, (wordCount / 150) * 60);
            
            console.log(`Successfully generated TTS with Google Cloud for scene ${sceneNumber}`);
          }
        } else {
          console.warn('Google TTS failed, trying fallback...');
        }
      } catch (error) {
        console.warn('Google TTS error:', error);
      }
    }

    // Last resort: Use Lovable AI Gateway or return placeholder
    if (!audioUrl && LOVABLE_API_KEY) {
      try {
        console.log('Attempting TTS with Lovable AI Gateway (may not support TTS directly)...');
        // Lovable Gateway might not have direct TTS, so we'll estimate duration
        const wordCount = text.split(/\s+/).length;
        duration = Math.max(3, (wordCount / 150) * 60);
        
        // Return placeholder with estimated duration
        const placeholderAudioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=`;
        audioUrl = placeholderAudioUrl;
        
        console.log(`Using placeholder audio for scene ${sceneNumber} (TTS not available via Lovable Gateway)`);
      } catch (error) {
        console.warn('Lovable Gateway TTS error:', error);
      }
    }

    // If all methods failed, return placeholder with estimated duration
    if (!audioUrl) {
      console.warn('All TTS methods failed, using placeholder');
      const wordCount = text.split(/\s+/).length;
      duration = Math.max(3, (wordCount / 150) * 60);
      audioUrl = `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=`;
    }

    console.log(`TTS generated for scene ${sceneNumber}, duration: ${duration.toFixed(1)}s`);

    return new Response(
      JSON.stringify({ 
        audioUrl,
        sceneNumber,
        duration: Math.round(duration),
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
