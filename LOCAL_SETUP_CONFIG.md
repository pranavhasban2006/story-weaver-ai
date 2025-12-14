# 🔧 Local Setup Configuration Guide

After setting up your local services (Llama, Stable Diffusion, TTS), configure them in Supabase.

## Environment Variables for Supabase Edge Functions

Set these in **Supabase Dashboard → Edge Functions → Secrets**:

### For Local Llama (Ollama):
```
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=http://your-server:11434
LLAMA_MODEL=llama3.2
```

**OR** if you want to use Gemini API instead:
```
GEMINI_API_KEY=your_gemini_key_here
```

### For Local Stable Diffusion:
```
USE_LOCAL_SD=true
LOCAL_SD_URL=http://your-server:7860
```

**OR** if you want to use OpenAI DALL-E instead:
```
OPENAI_API_KEY=your_openai_key_here
```

### For Local TTS (Piper):
```
USE_LOCAL_TTS=true
LOCAL_TTS_URL=http://your-server:5000
```

**OR** if you want to use cloud TTS:
```
OPENAI_API_KEY=your_openai_key_here
# or
ELEVENLABS_API_KEY=your_elevenlabs_key
# or
GOOGLE_TTS_API_KEY=your_google_tts_key
```

---

## Important: Supabase Edge Functions Can't Access localhost

Since Supabase Edge Functions run on Supabase's servers (not your local machine), they **cannot directly access `http://localhost`**.

### Solutions:

#### Option 1: Use ngrok (for testing/development)
```bash
# Install ngrok: https://ngrok.com/download

# Expose Ollama
ngrok http 11434
# Use the ngrok URL: https://abc123.ngrok.io

# Expose Stable Diffusion
ngrok http 7860

# Expose TTS
ngrok http 5000
```

Then set in Supabase:
```
LOCAL_LLAMA_URL=https://abc123.ngrok.io
LOCAL_SD_URL=https://def456.ngrok.io
LOCAL_TTS_URL=https://ghi789.ngrok.io
```

#### Option 2: Deploy on a Server/VPS
- Deploy Ollama on a server with public IP
- Deploy Stable Diffusion on a server
- Deploy TTS service on a server
- Set URLs to your server IPs in Supabase secrets

#### Option 3: Use Cloud Services (Simpler)
- Keep using Gemini API for scene generation
- Keep using OpenAI DALL-E for images
- Keep using OpenAI TTS for speech

---

## Hybrid Setup (Recommended for Development)

You can mix local and cloud services:

```bash
# Use local Llama for scene generation
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=http://your-ngrok-url:11434

# Use OpenAI for images (faster/more reliable)
OPENAI_API_KEY=your_key

# Use local TTS
USE_LOCAL_TTS=true
LOCAL_TTS_URL=http://your-ngrok-url:5000
```

---

## Testing Your Setup

### Test Local Llama:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello",
  "stream": false
}'
```

### Test Local Stable Diffusion:
```bash
curl http://localhost:7860/sdapi/v1/txt2img -d '{
  "prompt": "a beautiful landscape",
  "width": 512,
  "height": 512
}'
```

### Test Local TTS:
```bash
curl http://localhost:5000/api/tts -d '{
  "text": "Hello world"
}'
```

---

## Complete Local Setup (All Services)

If you want to use **all** services locally:

1. Set up Ollama, Stable Diffusion, and Piper TTS locally
2. Use ngrok to expose them (or deploy on a server)
3. Set these secrets in Supabase:

```
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=https://your-ollama-url.ngrok.io
LLAMA_MODEL=llama3.2

USE_LOCAL_SD=true
LOCAL_SD_URL=https://your-sd-url.ngrok.io

USE_LOCAL_TTS=true
LOCAL_TTS_URL=https://your-tts-url.ngrok.io
```

---

## Troubleshooting

### "Connection refused" errors:
- ✅ Make sure your local services are running
- ✅ Make sure you're using ngrok or a public server (not localhost)
- ✅ Check firewall settings allow connections

### Slow performance:
- Local models are slower than cloud APIs
- Consider using GPU acceleration for faster inference
- For production, cloud APIs are recommended

### Out of memory errors:
- Reduce model sizes (use smaller Llama models)
- Use CPU-only Stable Diffusion (slower but less memory)
- Close other applications
