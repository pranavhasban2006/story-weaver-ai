# 🆓 Completely Free Setup Guide

Want to use Story Weaver AI **100% FREE**? Here's how:

## ✅ Free Services (No Cost)

1. **Gemini API** - ✅ FREE
   - 250,000 tokens/month free
   - Used for scene generation
   - Get it: https://makersuite.google.com/app/apikey

2. **Shotstack** - ✅ FREE
   - Free tier for video rendering
   - Get it: https://shotstack.io

3. **Google Cloud TTS** - ✅ FREE
   - 12 months free tier
   - Used for text-to-speech
   - Get it: https://cloud.google.com/text-to-speech

## ⚠️ The Only Paid Service

**OpenAI** - Costs money after $5 free credit
- DALL-E 3: $0.04 per image
- TTS: $15 per 1M characters

## 🎯 Free Alternatives

### For Image Generation (Replace OpenAI)

**Option 1: Stability AI (Free Tier)**
```typescript
// Modify supabase/functions/generate-image/index.ts
// Add Stability AI support
const STABILITY_API_KEY = Deno.env.get('STABILITY_API_KEY');
// Use Stability AI API instead of OpenAI
```

**Option 2: Hugging Face (Free)**
- Many free image models
- No API key needed for some models

**Option 3: Use Placeholder Images**
- Skip image generation
- Use default/placeholder images
- Users can upload their own

### For Text-to-Speech (Replace OpenAI)

**Option 1: Google Cloud TTS (Free Tier)**
- 12 months free
- 4 million characters/month free
- Set: `GOOGLE_TTS_API_KEY`

**Option 2: Browser TTS (100% Free)**
- Use Web Speech API
- No API key needed
- Works in browser

**Option 3: ElevenLabs Free Tier**
- Limited but free
- Set: `ELEVENLABS_API_KEY`

## 🚀 Quick Free Setup

### Minimum Free Setup:

```bash
# 1. Free API keys
supabase secrets set GEMINI_API_KEY=your_gemini_key        # FREE
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key  # FREE
supabase secrets set GOOGLE_TTS_API_KEY=your_google_key    # FREE (12 months)

# 2. For images - use OpenAI's $5 free credit (enough for testing)
supabase secrets set OPENAI_API_KEY=your_openai_key        # $5 free credit

# OR skip images entirely and modify code to use placeholders
```

### Cost Breakdown (Free Setup):

- **Scene Generation:** FREE (Gemini)
- **Video Rendering:** FREE (Shotstack)
- **Text-to-Speech:** FREE (Google TTS)
- **Image Generation:** $5 free credit → then $0.04/image

**Total cost for testing:** $0 (using free credits)
**Total cost per video:** ~$0.20-0.50 (after free credits)

## 💡 Making It 100% Free Forever

To make it completely free, you need to:

1. **Replace OpenAI DALL-E** with:
   - Stability AI (free tier)
   - Hugging Face (free)
   - Or use placeholder images

2. **Use Free TTS:**
   - Google Cloud TTS (free tier)
   - Browser TTS (Web Speech API)
   - ElevenLabs free tier

3. **Code Changes Needed:**
   - Modify `generate-image/index.ts` to use free API
   - Modify `text-to-speech/index.ts` to prioritize free services

## 📝 Current Setup (With OpenAI)

**What you need:**
- ✅ Gemini API Key (FREE)
- ✅ OpenAI API Key ($5 free credit, then paid)
- ✅ Shotstack API Key (FREE)
- ⚠️ Optional: Google TTS (FREE) to avoid OpenAI TTS costs

**Cost per video:**
- With $5 free credit: **FREE** (for ~125 images)
- After free credit: **~$0.20-0.50 per video**

## 🎯 Recommendation

**For Testing/Development:**
- Use OpenAI's $5 free credit
- That's enough for ~125 images (plenty for testing)
- Total cost: **$0**

**For Production:**
- Consider switching to Stability AI or Hugging Face for images
- Use Google TTS (free tier) for speech
- Total cost: **$0** (if within free tiers)

---

**Bottom Line:** You can test the app completely free using the free credits. For production, you'll need to either pay for OpenAI or switch to free alternatives (which requires code changes).

