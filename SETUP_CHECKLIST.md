# 🚀 Setup Checklist - Let's Get You Running!

This is your step-by-step guide to get Story Weaver AI up and running.

---

## 📋 Quick Overview

You need to:
1. ✅ Get API keys (or set up local services)
2. ✅ Set up Supabase project
3. ✅ Configure environment variables
4. ✅ Deploy database migrations
5. ✅ Deploy Edge Functions
6. ✅ Install dependencies
7. ✅ Run the app!

**Estimated time: 30-60 minutes**

---

## Step 1: Get API Keys (Choose One Option)

### Option A: Cloud APIs (Recommended for Quick Start)

You'll need these 3 API keys:

1. **Gemini API Key** (FREE)
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy the key

2. **OpenAI API Key** (Paid, but $5 free credit)
   - Go to: https://platform.openai.com/api-keys
   - Sign up/Login
   - Click "Create new secret key"
   - Copy the key

3. **Shotstack API Key** (FREE tier)
   - Go to: https://shotstack.io
   - Sign up for free account
   - Go to Dashboard → API Keys
   - Copy your API key

### Option B: Local Services (No API Keys Needed!)

If you want to use local Llama instead, see `LOCAL_LLAMA_QUICKSTART.md` for detailed instructions.

---

## Step 2: Create Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** Story Weaver AI (or any name)
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

---

## Step 3: Get Supabase Credentials

1. In your Supabase project dashboard
2. Click **Settings** (gear icon) → **API**
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

**Save these - you'll need them for Step 5!**

---

## Step 4: Install Supabase CLI (If Not Installed)

### Windows (PowerShell):
```powershell
# Install via npm (requires Node.js)
npm install -g supabase

# Or install via winget
winget install Supabase.CLI
```

### Mac/Linux:
```bash
npm install -g supabase
```

### Verify Installation:
```bash
supabase --version
```

---

## Step 5: Link Supabase Project

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```
   - This will open your browser
   - Authorize the CLI

2. **Link your project:**
   ```bash
   cd "C:\Users\Lenovo\Downloads\story-weaver-ai"
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   **How to get project ref:**
   - It's in your Supabase project URL: `https://YOUR_PROJECT_REF.supabase.co`
   - Or go to Settings → General → Reference ID

---

## Step 6: Set API Keys in Supabase

### Using Supabase Dashboard (Easiest):

1. Go to your Supabase project dashboard
2. Click **"Edge Functions"** in left sidebar
3. Click **"Secrets"** tab at the top
4. Click **"New secret"** and add each:

   **Secret 1:**
   - Name: `GEMINI_API_KEY`
   - Value: [paste your Gemini key]
   - Click "Save"

   **Secret 2:**
   - Name: `OPENAI_API_KEY`
   - Value: [paste your OpenAI key]
   - Click "Save"

   **Secret 3:**
   - Name: `SHOTSTACK_API_KEY`
   - Value: [paste your Shotstack key]
   - Click "Save"

### Using CLI (Alternative):
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
supabase secrets set OPENAI_API_KEY=your_openai_key_here
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here
```

---

## Step 7: Deploy Database Migrations

You have two options:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open file: `supabase/migrations/20241214000000_initial_schema.sql`
4. Copy ALL content and paste in SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Wait for "Success" message
7. Repeat for:
   - `supabase/migrations/20241214000001_storage_setup.sql`
   - `supabase/migrations/20241214000002_add_indexes_optimization.sql`

### Option B: Using CLI

```bash
supabase db push
```

This will run all migrations automatically.

---

## Step 8: Deploy Edge Functions

You have two options:

### Option A: Using Supabase Dashboard

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, click **"Deploy function"** or **"New function"**:
   
   **Function 1: generate-scenes**
   - Name: `generate-scenes`
   - Copy content from: `supabase/functions/generate-scenes/index.ts`
   - Paste in editor
   - Click **"Deploy"**

   **Repeat for:**
   - `generate-image`
   - `text-to-speech`
   - `compose-video`

### Option B: Using CLI

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

## Step 9: Create Frontend Environment File

1. In your project root folder, create a file named: `.env.local`

2. Add this content (replace with YOUR values from Step 3):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_HERE
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.example_key
```

**Important:** Make sure this file is in the root folder: `C:\Users\Lenovo\Downloads\story-weaver-ai\.env.local`

---

## Step 10: Install Dependencies

```bash
cd "C:\Users\Lenovo\Downloads\story-weaver-ai"
npm install
```

This will install all required packages.

---

## Step 11: Run the App!

```bash
npm run dev
```

The app should start at: **http://localhost:5173**

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] All 3 API keys are set in Supabase Secrets
- [ ] Database migrations are deployed (check SQL Editor → "Table Editor" should show: stories, scenes, videos tables)
- [ ] All 4 Edge Functions are deployed (check Edge Functions page)
- [ ] `.env.local` file exists with correct values
- [ ] Dependencies are installed (`npm install` completed)
- [ ] App is running (`npm run dev` started)

---

## 🧪 Test the App

1. Go to http://localhost:5173
2. Write a story (50-2000 words)
3. Select style, voice, aspect ratio
4. Click **"Generate Scenes"**
5. Wait for images/audio to generate
6. Click **"Compose Video"**
7. Download your video!

---

## 🆘 Troubleshooting

### "supabase: command not found"
- Install Supabase CLI: `npm install -g supabase`
- Restart terminal
- Try again

### "Project not found" when linking
- Make sure you're logged in: `supabase login`
- Check project ref is correct

### "Secret not set"
- Verify keys are in Supabase Dashboard → Edge Functions → Secrets
- Check key names are exactly: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `SHOTSTACK_API_KEY`

### "Failed to fetch" errors
- Check `.env.local` file exists and has correct values
- Restart dev server after changing `.env.local`
- Verify Supabase project URL is correct

### Video composition fails
- Make sure Shotstack API key is set
- Check you have credits/limits in Shotstack account

---

## 🎉 You're Done!

Once all steps are complete, your Story Weaver AI is ready to use!

If you encounter any issues, check the troubleshooting section or refer to the detailed guides:
- `SETUP_GUIDE.md` - Detailed setup guide
- `WHERE_TO_PASTE_KEYS.md` - Visual guide for API keys
- `QUICK_FIX_VIDEO_ERROR.md` - Video composition troubleshooting
