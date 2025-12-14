# 🚀 Quick Start - Where to Paste Your API Keys

## Step-by-Step Setup Guide

### Step 1: Get Your API Keys

#### 1.1 Gemini API Key (FREE) - REQUIRED
1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSy...`)
5. **Save it somewhere** - you'll paste it in Step 2

#### 1.2 OpenAI API Key (Has $5 Free Credit) - REQUIRED
1. Go to: **https://platform.openai.com/api-keys**
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with: `sk-...`)
5. **Save it somewhere** - you'll paste it in Step 2

#### 1.3 Shotstack API Key (FREE) - REQUIRED
1. Go to: **https://shotstack.io**
2. Sign up for a free account
3. Go to Dashboard → API Keys
4. Copy your API key
5. **Save it somewhere** - you'll paste it in Step 2

---

### Step 2: Paste Keys in Supabase Dashboard

#### Option A: Using Supabase Dashboard (Easiest - Recommended)

1. **Go to your Supabase project:**
   - Visit: **https://supabase.com/dashboard**
   - Select your project (or create one if you don't have one)

2. **Navigate to Edge Functions Secrets:**
   - Click **"Edge Functions"** in the left sidebar
   - Click **"Secrets"** tab
   - Or go directly to: **Settings → Edge Functions → Secrets**

3. **Add each secret:**
   - Click **"Add new secret"** or **"New secret"**
   - For each key, enter:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** (paste your Gemini key)
     - Click **"Save"**
   
   Repeat for:
   - **Name:** `OPENAI_API_KEY` → **Value:** (paste your OpenAI key)
   - **Name:** `SHOTSTACK_API_KEY` → **Value:** (paste your Shotstack key)

#### Option B: Using Supabase CLI (If you have it installed)

```bash
# Install Supabase CLI first (if not installed)
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref pqqicydufvgtcnojguee

# Set secrets
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
supabase secrets set OPENAI_API_KEY=your_openai_key_here
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here
```

---

### Step 3: Setup Frontend Environment Variables

1. **Get your Supabase credentials:**
   - Go to: **https://supabase.com/dashboard**
   - Select your project
   - Go to **Settings → API**
   - Copy:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)

2. **Create `.env.local` file in project root:**
   - Create a new file named `.env.local` in the root folder
   - Paste this content:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

   Replace with your actual values from Step 3.1

---

### Step 4: Run Database Migrations

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**
5. Open and copy the content from: `supabase/migrations/20241214000000_initial_schema.sql`
6. Paste it in the SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. Repeat for:
   - `supabase/migrations/20241214000001_storage_setup.sql`
   - `supabase/migrations/20241214000002_add_indexes_optimization.sql`

#### Option B: Using Supabase CLI

```bash
supabase db push
```

---

### Step 5: Deploy Edge Functions

#### Option A: Using Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **"Edge Functions"** in left sidebar
4. For each function:
   - Click **"Deploy function"** or **"New function"**
   - Function name: `generate-scenes`
   - Copy content from: `supabase/functions/generate-scenes/index.ts`
   - Paste and click **"Deploy"**
   - Repeat for: `generate-image`, `text-to-speech`, `compose-video`

#### Option B: Using Supabase CLI

```bash
supabase functions deploy generate-scenes
supabase functions deploy generate-image
supabase functions deploy text-to-speech
supabase functions deploy compose-video
```

---

### Step 6: Install Dependencies & Run

```bash
# Install npm packages
npm install

# Start development server
npm run dev
```

The app will open at: **http://localhost:5173**

---

## 📋 Quick Checklist

Before running, make sure you have:

- [ ] Gemini API key (from https://makersuite.google.com/app/apikey)
- [ ] OpenAI API key (from https://platform.openai.com/api-keys)
- [ ] Shotstack API key (from https://shotstack.io)
- [ ] All 3 keys pasted in Supabase Dashboard → Edge Functions → Secrets
- [ ] `.env.local` file created with Supabase URL and key
- [ ] Database migrations run (SQL Editor in Supabase Dashboard)
- [ ] Edge Functions deployed (in Supabase Dashboard)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)

---

## 🎯 Where to Paste Each Key - Summary

| Key | Where to Get | Where to Paste |
|-----|--------------|----------------|
| **GEMINI_API_KEY** | https://makersuite.google.com/app/apikey | Supabase Dashboard → Edge Functions → Secrets |
| **OPENAI_API_KEY** | https://platform.openai.com/api-keys | Supabase Dashboard → Edge Functions → Secrets |
| **SHOTSTACK_API_KEY** | https://shotstack.io | Supabase Dashboard → Edge Functions → Secrets |
| **Supabase URL** | Supabase Dashboard → Settings → API | `.env.local` file (VITE_SUPABASE_URL) |
| **Supabase Key** | Supabase Dashboard → Settings → API | `.env.local` file (VITE_SUPABASE_PUBLISHABLE_KEY) |

---

## 🆘 Troubleshooting

### "Function not found" error
- Make sure you deployed all 4 Edge Functions in Supabase Dashboard

### "API key not configured" error
- Check that you pasted the keys in: Supabase Dashboard → Edge Functions → Secrets
- Make sure the key names are exactly: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `SHOTSTACK_API_KEY`

### "Cannot connect to Supabase" error
- Check your `.env.local` file exists and has correct values
- Get values from: Supabase Dashboard → Settings → API

### Functions not working
- Make sure migrations are run (database tables exist)
- Check function logs in: Supabase Dashboard → Edge Functions → Logs

---

## ✅ You're Ready!

Once all steps are done, open **http://localhost:5173** and test:
1. Write a story (50-2000 words)
2. Select style, voice, aspect ratio
3. Click "Generate Scenes"
4. Wait for images/audio to generate
5. Click "Compose Video"
6. Download your video!

🎉 **Happy creating!**

