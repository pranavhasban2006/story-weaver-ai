# 🎯 Setup Guide - Using Supabase Dashboard (No CLI Required!)

This is the **easiest method** for Windows users. No command line needed!

---

## Step 1: Create Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `story-weaver-ai` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait ~2 minutes for project creation

---

## Step 2: Get Your API Keys

### 2.1 Gemini API Key (FREE)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. **Copy and save** the key (starts with `AIzaSy...`)

### 2.2 OpenAI API Key ($5 free credit)
1. Go to: https://platform.openai.com/api-keys
2. Sign in/up
3. Click "Create new secret key"
4. **Copy and save** the key (starts with `sk-...`)

### 2.3 Shotstack API Key (FREE tier)
1. Go to: https://shotstack.io
2. Sign up for free account
3. Dashboard → API Keys
4. **Copy and save** your API key

---

## Step 3: Set Secrets in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **"Edge Functions"** in left sidebar
3. Click **"Secrets"** tab at the top
4. Click **"New secret"** button
5. Add each secret one by one:

   **Secret 1:**
   - Name: `GEMINI_API_KEY`
   - Value: (paste your Gemini key)
   - Click "Save"

   **Secret 2:**
   - Name: `OPENAI_API_KEY`
   - Value: (paste your OpenAI key)
   - Click "Save"

   **Secret 3:**
   - Name: `SHOTSTACK_API_KEY`
   - Value: (paste your Shotstack key)
   - Click "Save"

✅ All 3 secrets should now be listed!

---

## Step 4: Run Database Migrations

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**

### Migration 1: Initial Schema
1. Open file: `supabase/migrations/20241214000000_initial_schema.sql`
2. Copy ALL the SQL code
3. Paste into SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for "Success" message

### Migration 2: Storage Setup
1. Open file: `supabase/migrations/20241214000001_storage_setup.sql`
2. Copy ALL the SQL code
3. Click "New query" again
4. Paste and click **"Run"**

### Migration 3: Indexes
1. Open file: `supabase/migrations/20241214000002_add_indexes_optimization.sql`
2. Copy ALL the SQL code
3. Click "New query"
4. Paste and click **"Run"**

✅ Database is now set up!

---

## Step 5: Deploy Edge Functions

### Function 1: generate-scenes

1. Go to Supabase Dashboard → **Edge Functions**
2. Click **"Create a new function"** (or "New Function")
3. Function name: `generate-scenes`
4. Copy ALL code from: `supabase/functions/generate-scenes/index.ts`
5. Paste into the code editor
6. Click **"Deploy"** (or "Save")

### Function 2: generate-image

1. Click **"Create a new function"** again
2. Function name: `generate-image`
3. Copy ALL code from: `supabase/functions/generate-image/index.ts`
4. Paste and click **"Deploy"**

### Function 3: text-to-speech

1. Click **"Create a new function"** again
2. Function name: `text-to-speech`
3. Copy ALL code from: `supabase/functions/text-to-speech/index.ts`
4. Paste and click **"Deploy"**

### Function 4: compose-video

1. Click **"Create a new function"** again
2. Function name: `compose-video`
3. Copy ALL code from: `supabase/functions/compose-video/index.ts`
4. Paste and click **"Deploy"**

✅ All 4 functions are now deployed!

---

## Step 6: Get Supabase Credentials for Frontend

1. Go to Supabase Dashboard → **Settings** (gear icon) → **API**
2. Copy these two values:

   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **anon public** key: (long string starting with `eyJ...`)

**Save these - you'll need them next!**

---

## Step 7: Create Frontend Environment File

1. In your project folder, create a new file named: `.env.local`
   - Location: `C:\Users\Lenovo\Downloads\story-weaver-ai\.env.local`

2. Open the file in a text editor and paste:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

3. Replace:
   - `https://your-project-id.supabase.co` with your **Project URL** from Step 6
   - `your_anon_key_here` with your **anon public key** from Step 6

4. **Save the file**

---

## Step 8: Start the App! 🚀

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

---

## ✅ Test It!

1. Open http://localhost:5173 in your browser
2. Write a story (50+ words)
3. Select style, voice, aspect ratio
4. Click "Generate Scenes"
5. Wait for scenes to generate
6. Wait for images to generate (30-60 sec per image)
7. Wait for audio to generate
8. Click "Compose Video"
9. Wait for video (1-2 minutes)
10. Download your video! 🎉

---

## 🆘 Troubleshooting

### "Failed to generate scenes"
- Check GEMINI_API_KEY is set correctly in Secrets
- Check function `generate-scenes` is deployed

### "Failed to generate image"
- Check OPENAI_API_KEY is set correctly in Secrets
- Check OpenAI account has credits

### "Composition Failed"
- Check SHOTSTACK_API_KEY is set correctly in Secrets
- Check Shotstack account is active

### Frontend can't connect
- Check `.env.local` file exists
- Check URLs and keys are correct (no extra spaces)
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

---

## 🎉 You're All Set!

Your Story Weaver AI is now ready to use!
