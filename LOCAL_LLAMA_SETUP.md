# 🦙 Local Llama LLM Setup Guide

This guide will help you replace API keys with local Llama LLM and other local services.

## Overview

You'll need to run these local services:
1. **Ollama** (or similar) - For Llama LLM (scene generation)
2. **Stable Diffusion** - For image generation (replaces DALL-E)
3. **Piper TTS** or **Coqui TTS** - For text-to-speech (replaces OpenAI TTS)
4. **Shotstack** (keep) or **FFmpeg** - For video rendering

---

## Step 1: Install Ollama (Local Llama)

### Windows:
1. Download from: https://ollama.ai/download
2. Install and run Ollama
3. Pull a Llama model:
   ```bash
   ollama pull llama3.2
   # or for larger model:
   ollama pull llama3.1
   ```

### Mac/Linux:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
```

### Start Ollama Server:
```bash
ollama serve
```

By default, Ollama runs on `http://localhost:11434`

---

## Step 2: Install Stable Diffusion (Local Image Generation)

### Option A: Automatic1111 WebUI (Recommended)
1. Install Python 3.10+
2. Install:
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
   cd stable-diffusion-webui
   ./webui.sh  # Linux/Mac
   webui.bat   # Windows
   ```
3. Access at: `http://localhost:7860`
4. Install API extension for REST API access

### Option B: ComfyUI with API
```bash
git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
pip install -r requirements.txt
python main.py --api
```

### Option C: InvokeAI
```bash
pip install invokeai
invokeai --web --host 0.0.0.0 --port 7860
```

---

## Step 3: Install Local TTS

### Option A: Piper TTS (Lightweight)
```bash
# Download pre-built binaries from:
# https://github.com/rhasspy/piper/releases

# Or use Docker:
docker run -d -p 5000:5000 rhasspy/piper-tts:latest
```

### Option B: Coqui TTS (Better Quality)
```bash
pip install TTS
tts-server --port 5002
```

### Option C: Piper HTTP Server (Recommended)
```bash
# Clone and run Piper HTTP server
git clone https://github.com/rhasspy/piper-tts
cd piper-tts
python -m piper_http.server
# Runs on http://localhost:5000
```

---

## Step 4: Configure Edge Functions

After setting up local services, you'll need to:

1. **Set environment variables** in Supabase (or use local config):
   - `LOCAL_LLAMA_URL=http://localhost:11434` (Ollama)
   - `LOCAL_SD_URL=http://localhost:7860` (Stable Diffusion)
   - `LOCAL_TTS_URL=http://localhost:5000` (Piper TTS)

2. **Update Edge Functions** to call local endpoints instead of APIs

3. **For local development**, use ngrok or similar to expose local services:
   ```bash
   ngrok http 11434  # For Ollama
   ngrok http 7860   # For Stable Diffusion
   ngrok http 5000   # For TTS
   ```

---

## Testing Local Services

### Test Ollama:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### Test Stable Diffusion (if API enabled):
```bash
curl http://localhost:7860/sdapi/v1/txt2img -d '{
  "prompt": "a beautiful landscape",
  "width": 512,
  "height": 512
}'
```

### Test Piper TTS:
```bash
curl http://localhost:5000/api/tts -d '{
  "text": "Hello world",
  "voice": "en_US-lessac-medium"
}'
```

---

## Important Notes

1. **Performance**: Local models run slower than cloud APIs but offer:
   - ✅ No API costs
   - ✅ Complete privacy
   - ✅ No rate limits

2. **Hardware Requirements**:
   - **Llama 3.2**: ~2GB VRAM (GPU recommended)
   - **Stable Diffusion**: ~4GB VRAM (GPU highly recommended)
   - **TTS**: Minimal resources

3. **Supabase Edge Functions**: Can't directly access localhost. Options:
   - Use ngrok/tunneling for local development
   - Deploy services on a server/VM
   - Use Supabase Edge Functions with external IPs

---

## Next Steps

After setting up local services, we'll modify the Edge Functions to use them instead of API keys.
