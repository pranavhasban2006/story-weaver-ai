# 🔧 Quick Fix: Video Composition Error

## ❌ Error You're Seeing

When clicking "Compose Video", you're getting an error like:
- `"SHOTSTACK_API_KEY is not configured"`
- `"Composition Failed"`
- `"Failed to compose video"`

## ✅ Solution: Add Shotstack API Key

The video composition requires a **Shotstack API key** to render videos. Here's how to fix it:

### Step 1: Get Shotstack API Key (FREE)

1. **Go to:** https://shotstack.io
2. **Sign up** for a free account (takes 2 minutes)
3. After signing up, go to **Dashboard → API Keys**
4. **Copy** your API key (it looks like: `abc123xyz...`)

### Step 2: Add Key to Supabase

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Secrets:**
   - Click **"Edge Functions"** in left sidebar
   - Click **"Secrets"** tab at the top
   - OR: **Settings → Edge Functions → Secrets**

3. **Add the Secret:**
   - Click **"New secret"** or **"Add secret"** button
   - **Name:** `SHOTSTACK_API_KEY` (must be exactly this)
   - **Value:** Paste your Shotstack API key
   - Click **"Save"**

### Step 3: Verify It Works

1. Go back to your app
2. Try composing a video again
3. It should now work! 🎉

---

## 🆓 Why Shotstack?

Shotstack is a **cloud video rendering service** that:
- ✅ Has a **FREE tier** for testing
- ✅ Renders professional videos from images + audio
- ✅ Handles all the complex video encoding
- ✅ Is much faster than local rendering

Your images are generated (that's why you see them), but **video composition happens on Shotstack's servers**, which requires the API key.

---

## 🔍 Still Not Working?

If you still get errors after adding the key:

1. **Check the key name is exactly:** `SHOTSTACK_API_KEY` (case-sensitive)
2. **Wait 1-2 minutes** after adding the secret (may need to redeploy functions)
3. **Check your Shotstack account** is active and has credits
4. **Check browser console** (F12) for detailed error messages

---

## 💡 Alternative: Use Command Line

If you prefer using the command line:

```bash
# Make sure you're in the project directory
cd story-weaver-ai

# Set the secret (replace with your actual key)
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here
```

---

**Need more help?** Check the full setup guide in `SETUP_GUIDE.md` or `WHERE_TO_PASTE_KEYS.md`
