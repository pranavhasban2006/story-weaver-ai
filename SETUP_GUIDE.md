# Story Weaver AI - Quick Setup Guide

## ✅ Required API Keys

### 1. **GEMINI_API_KEY** - ✅ REQUIRED
**Why:** Used for generating scenes from stories (scene breakdown)
**Get it:** https://makersuite.google.com/app/apikey
**Free tier:** 250,000 tokens/month (very generous!)

### 2. **OPENAI_API_KEY** - ⚠️ REQUIRED (But Costs Money)
**Why:** Used for:
- Image generation (DALL-E 3) - **$0.04 per image**
- Text-to-speech (TTS-1-HD) - **$15 per 1M characters**
**Get it:** https://platform.openai.com/api-keys
**Cost:** $5 free credit initially, then pay-as-you-go
**Note:** This is the only paid service. See free alternatives below!

### 3. **SHOTSTACK_API_KEY** - ✅ REQUIRED
**Why:** Used for video rendering/composition
**Get it:** https://shotstack.io (sign up for free account)
**Free tier:** Limited free renders for testing

---

## 💰 Cost Breakdown

**Free Services:**
- ✅ Gemini API - **FREE** (250K tokens/month)
- ✅ Shotstack - **FREE** (limited free tier)

**Paid Services:**
- ⚠️ OpenAI - **$0.04 per image** + **$15 per 1M TTS characters**
- 💡 **Estimated cost per video:** ~$0.20-0.50 (depending on scenes)

**Free Alternatives Available:** See below!

---

## 🆓 Free Alternatives (To Avoid OpenAI Costs)

### Option 1: Use Free Image Generation APIs

You can modify the code to use free alternatives:

1. **Stability AI** (Free tier available)
   - Sign up: https://platform.stability.ai
   - Free tier: Limited but available

2. **Hugging Face** (Free)
   - Many free image models available
   - Sign up: https://huggingface.co

3. **Replicate** (Free tier)
   - Free tier available
   - Sign up: https://replicate.com

### Option 2: Skip Image Generation (Use Placeholders)

You can modify the app to:
- Use placeholder images
- Let users upload their own images
- Skip images entirely and just use text

### Option 3: Use Free TTS Only

For TTS, you can use:
- **Google Cloud TTS** - Free tier available (12 months)
- **ElevenLabs** - Free tier (limited)
- **Browser TTS** - Completely free (Web Speech API)

---

## ⚙️ Optional API Keys

### 4. **ELEVENLABS_API_KEY** - Optional
**Why:** Alternative text-to-speech (better quality, multilingual)
**When to use:** If you want better TTS than OpenAI
**Get it:** https://elevenlabs.io
**Note:** If not set, will use OpenAI TTS (which is already included)

### 5. **GOOGLE_TTS_API_KEY** - Optional
**Why:** Another alternative for text-to-speech
**When to use:** If you prefer Google Cloud TTS
**Get it:** Google Cloud Console
**Note:** If not set, will use OpenAI TTS (which is already included)

---

## 🚀 Quick Setup Steps

### Step 1: Get Your API Keys

1. **Gemini API Key** (Required)
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy the key

2. **OpenAI API Key** (Required)
   - Visit: https://platform.openai.com/api-keys
   - Sign up/Login
   - Create new secret key
   - Copy the key (starts with `sk-`)

3. **Shotstack API Key** (Required)
   - Visit: https://shotstack.io
   - Sign up for free account
   - Get API key from dashboard
   - Copy the key

### Step 2: Set Environment Variables

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Set required API keys
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
supabase secrets set OPENAI_API_KEY=your_openai_key_here
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here

# Optional: Set TTS alternative (if you want)
# supabase secrets set ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

### Step 3: Setup Database

```bash
# Run migrations to create database tables
supabase db push
```

### Step 4: Deploy Functions

```bash
# Deploy all Edge Functions
supabase functions deploy generate-scenes
supabase functions deploy generate-image
supabase functions deploy text-to-speech
supabase functions deploy compose-video

# Or deploy all at once
supabase functions deploy
```

### Step 5: Setup Frontend

Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

Get these from: Supabase Dashboard → Settings → API

### Step 6: Test It!

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

Then test the workflow:
1. Go to http://localhost:5173
2. Write a story (50-2000 words)
3. Select style, voice, aspect ratio
4. Click "Generate Scenes"
5. Wait for images/audio to generate
6. Click "Compose Video"
7. Download your video!

---

## 📊 API Key Summary

| API Key | Required? | Used For | Cost |
|---------|-----------|----------|------|
| **GEMINI_API_KEY** | ✅ **YES** | Scene generation | **FREE** (250K tokens/month) |
| **OPENAI_API_KEY** | ⚠️ **YES** | Images + TTS | **$0.04/image + $15/1M chars** |
| **SHOTSTACK_API_KEY** | ✅ **YES** | Video rendering | **FREE** (limited) |
| ELEVENLABS_API_KEY | ❌ Optional | Better TTS | Free tier available |
| GOOGLE_TTS_API_KEY | ❌ Optional | Alternative TTS | Free tier (12 months) |

---

## ⚠️ Important Notes

1. **Gemini API Key is REQUIRED** - The app won't work without it for scene generation (FREE)
2. **OpenAI API Key is REQUIRED** - Needed for image generation (DALL-E 3) - **COSTS MONEY** (~$0.04/image)
3. **Shotstack API Key is REQUIRED** - Needed for video composition (FREE tier available)
4. **TTS is optional** - You can use free alternatives (Google TTS, ElevenLabs free tier, or browser TTS)

## 💡 To Make It Completely Free

**Option 1: Use OpenAI's $5 free credit**
- Sign up for OpenAI
- Get $5 free credit
- That's enough for ~125 images (enough for testing)

**Option 2: Modify code to use free alternatives**
- Replace DALL-E with Stability AI (free tier)
- Use Google TTS (free tier) instead of OpenAI TTS
- This requires code changes

**Option 3: Skip paid features**
- Use placeholder images
- Use browser TTS (Web Speech API - completely free)
- Still generates scenes and composes videos

---

## 🆘 Troubleshooting

### "GEMINI_API_KEY is not configured"
- Make sure you set the secret: `supabase secrets set GEMINI_API_KEY=...`
- Verify the key is valid at https://makersuite.google.com/app/apikey

### "OPENAI_API_KEY is not configured"
- Set it: `supabase secrets set OPENAI_API_KEY=...`
- Make sure you have credits in your OpenAI account

### "SHOTSTACK_API_KEY is not configured"
- Set it: `supabase secrets set SHOTSTACK_API_KEY=...`
- Verify your Shotstack account is active

### Functions not deploying
- Make sure you're logged in: `supabase login`
- Check project link: `supabase status`
- Verify you have deployment permissions

---

## ✅ Checklist

Before testing, make sure you have:

- [ ] Gemini API key (REQUIRED)
- [ ] OpenAI API key (REQUIRED)
- [ ] Shotstack API key (REQUIRED)
- [ ] All secrets set in Supabase
- [ ] Database migrations run
- [ ] Functions deployed
- [ ] Frontend `.env.local` configured
- [ ] Dependencies installed (`npm install`)

Once all checked, you're ready to go! 🚀

