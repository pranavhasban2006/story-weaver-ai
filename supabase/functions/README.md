# Story Weaver AI - Backend Functions

This directory contains Supabase Edge Functions that power the Story Weaver AI application.

## Functions Overview

### 1. `generate-scenes`
Generates cinematic scene breakdowns from user stories using AI.

**Input:**
- `story`: The user's story text (50-2000 words)
- `style`: Video style (`cinematic`, `cartoon`, `minimalist`, `fantasy`, `realistic`)

**Output:**
- `scenes`: Array of scene objects with sceneNumber, title, description, imagePrompt, and narrationText

**Environment Variables:**
- `GEMINI_API_KEY`: API key for Google Gemini API (required)

---

### 2. `generate-image`
Generates high-quality images for each scene using AI image generation.

**Input:**
- `prompt`: Detailed image generation prompt
- `aspectRatio`: `16:9`, `9:16`, or `1:1`
- `sceneNumber`: Scene number for tracking

**Output:**
- `imageUrl`: URL of the generated image
- `sceneNumber`: Scene number

**Environment Variables:**
- `OPENAI_API_KEY` (required): For OpenAI DALL-E 3 image generation
- `GEMINI_API_KEY` (optional): For prompt enhancement (Gemini doesn't generate images directly)

**Note:** Gemini API does not support direct image generation. OpenAI DALL-E 3 is used for actual image generation. If you need an alternative, consider integrating with Google's Imagen API or other image generation services.

---

### 3. `text-to-speech`
Converts narration text to speech audio.

**Input:**
- `text`: Narration text to convert
- `voiceType`: `male` or `female`
- `sceneNumber`: Scene number for tracking

**Output:**
- `audioUrl`: Base64-encoded audio data URI (MP3 format)
- `sceneNumber`: Scene number
- `duration`: Audio duration in seconds

**Environment Variables:**
- `OPENAI_API_KEY` (recommended): For OpenAI TTS-1-HD (best quality)
- `ELEVENLABS_API_KEY` (alternative): For ElevenLabs TTS
- `GOOGLE_TTS_API_KEY` (alternative): For Google Cloud Text-to-Speech

**Priority:** OpenAI TTS-1-HD → ElevenLabs → Google Cloud TTS → Placeholder

**Note:** Gemini API does not support text-to-speech. Use one of the TTS services above.

---

### 4. `compose-video`
Composes final video from all scenes using Shotstack video rendering API.

**Input:**
- `scenes`: Array of scene objects with images, audio, and metadata
- `aspectRatio`: `16:9`, `9:16`, or `1:1`
- `style`: Video style
- `includeMusic`: Boolean to include background music

**Output:**
- `success`: Boolean indicating success
- `videoUrl`: URL of the rendered video
- `metadata`: Video metadata (duration, sceneCount, resolution, fileSize, format)

**Environment Variables:**
- `SHOTSTACK_API_KEY`: API key for Shotstack video rendering service

**Features:**
- Ken Burns effect (zoom) on images
- Fade transitions between scenes
- Title overlays
- Narration audio tracks
- Optional background music
- Supports multiple aspect ratios

---

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

### 4. Set Environment Variables

Set the following secrets in your Supabase project:

```bash
# Required: Gemini API for scene generation
supabase secrets set GEMINI_API_KEY=your_gemini_api_key

# Required: OpenAI API for image generation
supabase secrets set OPENAI_API_KEY=your_openai_api_key

# Text-to-Speech (choose at least one)
supabase secrets set OPENAI_API_KEY=your_openai_api_key
# OR
supabase secrets set ELEVENLABS_API_KEY=your_elevenlabs_api_key
# OR
supabase secrets set GOOGLE_TTS_API_KEY=your_google_tts_api_key

# Required: Video Rendering
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_api_key
```

### 5. Deploy Functions

```bash
supabase functions deploy generate-scenes
supabase functions deploy generate-image
supabase functions deploy text-to-speech
supabase functions deploy compose-video
```

Or deploy all at once:

```bash
supabase functions deploy
```

---

## API Service Setup

### Google Gemini API (Required for Scene Generation)
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the API key and set it as `GEMINI_API_KEY`
4. Supports text generation for scene breakdown

### OpenAI (Required for Images, Recommended for TTS)
1. Sign up at https://platform.openai.com
2. Create an API key
3. Supports both image generation (DALL-E 3) and TTS (TTS-1-HD)
4. Set as `OPENAI_API_KEY`

### ElevenLabs (Alternative TTS)
1. Sign up at https://elevenlabs.io
2. Get your API key from the dashboard
3. High-quality multilingual TTS
4. Set as `ELEVENLABS_API_KEY`

### Google Cloud TTS (Alternative TTS)
1. Enable Cloud Text-to-Speech API
2. Create a service account and download JSON key
3. Extract API key from credentials
4. Set as `GOOGLE_TTS_API_KEY`

### Shotstack (Video Rendering)
1. Sign up at https://shotstack.io
2. Get your API key from the dashboard
3. Free tier available for testing
4. Set as `SHOTSTACK_API_KEY`

---

## Local Development

### Run Functions Locally

```bash
supabase functions serve
```

Functions will be available at:
- `http://localhost:54321/functions/v1/generate-scenes`
- `http://localhost:54321/functions/v1/generate-image`
- `http://localhost:54321/functions/v1/text-to-speech`
- `http://localhost:54321/functions/v1/compose-video`

### Test Functions

```bash
# Test generate-scenes
curl -X POST http://localhost:54321/functions/v1/generate-scenes \
  -H "Content-Type: application/json" \
  -d '{"story": "Your story here...", "style": "cinematic"}'
```

---

## Error Handling

All functions include comprehensive error handling:
- Input validation
- API rate limit handling
- Fallback mechanisms
- Detailed error messages
- CORS support for web clients

---

## Notes

- **Audio URLs**: The TTS function returns base64-encoded audio data URIs. For production video composition, you may want to upload these to Supabase Storage first to get HTTP URLs that Shotstack can use.

- **Rate Limits**: Be aware of API rate limits for each service. The functions include retry logic and proper error messages.

- **Costs**: Each API service has different pricing. Monitor your usage:
  - OpenAI: Pay-per-use
  - ElevenLabs: Subscription-based
  - Shotstack: Pay-per-render
  - Lovable: Based on credits

---

## Troubleshooting

### Function not deploying
- Check that you're logged in: `supabase login`
- Verify project link: `supabase status`
- Check function syntax: `deno check supabase/functions/[function-name]/index.ts`

### API errors
- Verify environment variables are set: `supabase secrets list`
- Check API key validity
- Review API service status pages

### CORS errors
- Functions include CORS headers by default
- If issues persist, check Supabase project CORS settings

