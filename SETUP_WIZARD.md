# 🚀 Step-by-Step Setup Wizard

Let's get your project running! Follow these steps in order.

---

## Step 1: Install Dependencies

First, install all npm packages:

```bash
npm install
```

---

## Step 2: Choose Your Setup Type

You have two options:

### Option A: Cloud APIs (Easier, requires API keys)
- ✅ Faster setup
- ✅ Better performance
- ⚠️ Requires API keys (some are FREE)

### Option B: Local LLM (More complex, no API costs)
- ✅ No API costs
- ✅ Complete privacy
- ⚠️ Requires installing local services
- ⚠️ Slower setup

**Recommendation:** Start with Option A for faster setup.

---

## Step 3A: Setup with Cloud APIs

### 3A.1: Get API Keys

You'll need these keys (FREE tiers available):

1. **Gemini API Key** (FREE)
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **OpenAI API Key** ($5 free credit)
   - Go to: https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key

3. **Shotstack API Key** (FREE tier)
   - Go to: https://shotstack.io
   - Sign up for free account
   - Dashboard → API Keys
   - Copy the key

### 3A.2: Create/Login to Supabase Project

1. Go to: https://supabase.com/dashboard
2. Create a new project (or use existing)
3. Note your:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Project Reference ID (found in project settings)

### 3A.3: Install Supabase CLI

```bash
npm install -g supabase
```

### 3A.4: Login to Supabase

```bash
supabase login
```

### 3A.5: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your project reference ID.

### 3A.6: Set API Keys in Supabase

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
supabase secrets set OPENAI_API_KEY=your_openai_key_here
supabase secrets set SHOTSTACK_API_KEY=your_shotstack_key_here
```

### 3A.7: Run Database Migrations

```bash
supabase db push
```

### 3A.8: Deploy Edge Functions

```bash
supabase functions deploy
```

This deploys all 4 functions: `generate-scenes`, `generate-image`, `text-to-speech`, `compose-video`

### 3A.9: Get Supabase Credentials for Frontend

1. Go to Supabase Dashboard → Settings → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### 3A.10: Create Frontend .env.local File

Create `.env.local` in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

Replace with your actual values from step 3A.9.

---

## Step 4: Run the Application

```bash
npm run dev
```

The app will start at: **http://localhost:5173**

---

## ✅ Testing Checklist

Once running, test:

1. [ ] Home page loads
2. [ ] Can input a story
3. [ ] Can generate scenes
4. [ ] Images generate (may take 30-60 seconds per image)
5. [ ] Audio generates
6. [ ] Video composes (may take 1-2 minutes)

---

## 🆘 Troubleshooting

### "supabase: command not found"
- Run: `npm install -g supabase`
- Restart terminal

### "Project not found" or "Link failed"
- Make sure you're logged in: `supabase login`
- Check project reference ID is correct

### "Secret not set"
- Make sure you used exact key names (case-sensitive)
- No spaces around the `=` sign

### "Functions deploy failed"
- Check you're logged in: `supabase login`
- Verify project is linked: `supabase link --project-ref YOUR_REF`

### Frontend can't connect to Supabase
- Check `.env.local` file exists
- Verify URLs and keys are correct
- Restart dev server after changing `.env.local`

---

## 🎉 Done!

Once all steps are complete, your project is ready to use!
