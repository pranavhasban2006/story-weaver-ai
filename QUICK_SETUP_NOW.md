# ⚡ Quick Setup - Let's Get You Running!

## ✅ Step 1: Install Supabase CLI

Run this command:

```bash
npm install -g supabase
```

After installing, verify it works:
```bash
supabase --version
```

---

## ✅ Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to login. After logging in, come back to the terminal.

---

## ✅ Step 3: Create or Get Your Supabase Project

### Option A: Create New Project
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: story-weaver-ai (or any name)
   - **Database Password**: (choose a strong password, save it!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Option B: Use Existing Project
1. Go to: https://supabase.com/dashboard
2. Select your project

**Then get these from your project:**
- **Project URL**: Settings → API → Project URL (e.g., `https://xxxxx.supabase.co`)
- **Project Reference**: Settings → General → Reference ID (looks like: `abcdefghijklmnop`)

---

## ✅ Step 4: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the Reference ID from Step 3.

---

## ✅ Step 5: Get Your API Keys

You need 3 API keys:

### 5.1 Gemini API Key (FREE)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

### 5.2 OpenAI API Key ($5 free credit)
1. Go to: https://platform.openai.com/api-keys
2. Sign in/up
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### 5.3 Shotstack API Key (FREE tier)
1. Go to: https://shotstack.io
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key

---

## ✅ Step 6: Set API Keys in Supabase

Run these commands (replace with your actual keys):

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
supabase secrets set OPENAI_API_KEY=your_openai_key_here
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here
```

**Important:** No spaces around the `=` sign!

---

## ✅ Step 7: Run Database Migrations

```bash
supabase db push
```

This creates all the database tables needed.

---

## ✅ Step 8: Deploy Edge Functions

```bash
supabase functions deploy
```

This deploys all 4 functions. It may take a minute or two.

---

## ✅ Step 9: Create Frontend Environment File

1. **Get your Supabase credentials:**
   - Go to: Supabase Dashboard → Settings → API
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

2. **Create `.env.local` file:**
   - In the project root folder
   - Create a new file named exactly: `.env.local`
   - Add this content:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

Replace with your actual values from step 9.1.

---

## ✅ Step 10: Start the App!

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

---

## 🎉 Test It!

1. Go to http://localhost:5173
2. Write a short story (50+ words)
3. Select style, voice, aspect ratio
4. Click "Generate Scenes"
5. Wait for images/audio to generate
6. Click "Compose Video"
7. Download your video!

---

## 🆘 Need Help?

If you get errors, check:
- All API keys are set correctly (no spaces)
- Project is linked: `supabase link --project-ref YOUR_REF`
- `.env.local` file exists and has correct values
- You're logged in: `supabase login`

---

**Ready? Let's start with Step 1!** 🚀
