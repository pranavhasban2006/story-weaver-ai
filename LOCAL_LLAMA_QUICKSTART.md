# 🚀 Quick Start: Using Local Llama Instead of API Keys

Your project has been updated to support **local Llama LLM** and other local services!

## ✅ What's Been Changed

I've updated these Edge Functions to support local services:

1. ✅ **`generate-scenes`** - Now supports local Llama (Ollama) instead of Gemini API
2. ✅ **`generate-image`** - Now supports local Stable Diffusion instead of OpenAI DALL-E  
3. ✅ **`text-to-speech`** - Now supports local TTS (Piper) instead of OpenAI TTS

All functions will **automatically fall back** to cloud APIs if local services aren't available or fail.

---

## 📋 Step-by-Step Setup

### Step 1: Install Ollama (Local Llama)

**Windows:**
1. Download: https://ollama.ai/download
2. Install and run Ollama
3. Open terminal and run:
   ```bash
   ollama pull llama3.2
   ```

**Mac/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
```

**Start Ollama:**
```bash
ollama serve
```

By default runs on: `http://localhost:11434`

---

### Step 2: Install Stable Diffusion (Optional - for images)

**Option A: Automatic1111 (Recommended)**
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
./webui.sh  # Linux/Mac
webui.bat   # Windows
```

Runs on: `http://localhost:7860`

**Enable API:**
- In web UI, go to Settings → API
- Enable "Enable API"

---

### Step 3: Install Piper TTS (Optional - for speech)

**Using Docker (Easiest):**
```bash
docker run -d -p 5000:5000 rhasspy/piper-tts:latest
```

Or **Python:**
```bash
pip install piper-tts
python -m piper_http.server
```

Runs on: `http://localhost:5000`

---

### Step 4: Expose Services (Important!)

**Supabase Edge Functions can't access localhost directly!**

You need to expose your local services. Options:

#### Option A: Use ngrok (Quick & Easy for Testing)

1. Download ngrok: https://ngrok.com/download
2. Get your free auth token from ngrok.com
3. Expose services:

```bash
# Terminal 1: Expose Ollama
ngrok http 11434

# Terminal 2: Expose Stable Diffusion  
ngrok http 7860

# Terminal 3: Expose TTS
ngrok http 5000
```

You'll get URLs like:
- `https://abc123.ngrok.io` (for Ollama)
- `https://def456.ngrok.io` (for Stable Diffusion)
- `https://ghi789.ngrok.io` (for TTS)

#### Option B: Deploy on a Server/VPS

Deploy services on a server with a public IP address.

---

### Step 5: Configure Supabase Secrets

Go to **Supabase Dashboard → Edge Functions → Secrets** and add:

#### For Local Llama (Ollama):
```
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=https://your-ngrok-url.ngrok.io
LLAMA_MODEL=llama3.2
```

#### For Local Stable Diffusion:
```
USE_LOCAL_SD=true
LOCAL_SD_URL=https://your-ngrok-url.ngrok.io
```

#### For Local TTS:
```
USE_LOCAL_TTS=true
LOCAL_TTS_URL=https://your-ngrok-url.ngrok.io
```

---

## 🎯 Quick Configuration Examples

### Use All Local Services:
```bash
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=https://abc123.ngrok.io
LLAMA_MODEL=llama3.2

USE_LOCAL_SD=true
LOCAL_SD_URL=https://def456.ngrok.io

USE_LOCAL_TTS=true
LOCAL_TTS_URL=https://ghi789.ngrok.io
```

### Use Local Llama Only (keep cloud for images/TTS):
```bash
USE_LOCAL_LLAMA=true
LOCAL_LLAMA_URL=https://abc123.ngrok.io
LLAMA_MODEL=llama3.2

OPENAI_API_KEY=your_key_here  # For images and TTS
```

### Use Cloud APIs (Original Setup):
```bash
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

---

## 🧪 Testing

### Test Ollama:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### Test Stable Diffusion:
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

## ⚠️ Important Notes

1. **Performance**: Local models are slower than cloud APIs but offer:
   - ✅ No API costs
   - ✅ Complete privacy
   - ✅ No rate limits

2. **Hardware Requirements**:
   - **Llama 3.2**: ~2GB RAM (works on CPU, faster with GPU)
   - **Stable Diffusion**: ~4GB VRAM (GPU highly recommended)
   - **TTS**: Minimal resources

3. **Fallback Behavior**: If local services fail, the functions will automatically try cloud APIs (if keys are configured).

4. **ngrok Free Tier**: Limited connections and URLs change on restart. For production, use a proper server or VPS.

---

## 📚 More Documentation

- **`LOCAL_LLAMA_SETUP.md`** - Detailed setup guide for each service
- **`LOCAL_SETUP_CONFIG.md`** - Complete configuration reference
- **`QUICK_FIX_VIDEO_ERROR.md`** - Video rendering setup (still needs Shotstack API key)

---

## 🆘 Troubleshooting

### "Connection refused" errors:
- ✅ Make sure services are running
- ✅ Use ngrok/public server (not localhost)
- ✅ Check firewall settings

### Slow performance:
- Use GPU acceleration if available
- Consider smaller models (llama3.2:1b instead of llama3.2)
- For production, cloud APIs are faster

### Out of memory:
- Close other applications
- Use CPU-only modes (slower)
- Reduce model sizes

---

**Need help?** Check the detailed guides or test each service individually!
