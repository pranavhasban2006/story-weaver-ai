# 🚀 Step-by-Step Setup - Where to Paste Your API Keys

Follow these steps in order to get your app running!

---

## Step 1: Get Your API Keys

### 🔑 Key #1: Gemini API Key (FREE)

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key"
4. **Copy** the key (looks like: `AIzaSy...`)
5. **Save it** - you'll need it in Step 3

### 🔑 Key #2: OpenAI API Key (Has $5 Free Credit)

1. **Go to:** https://platform.openai.com/api-keys
2. **Sign up/Login** (create account if needed)
3. **Click** "Create new secret key"
4. **Name it** (e.g., "Story Weaver")
5. **Copy** the key (starts with `sk-...`)
6. **Save it** - you'll need it in Step 3
7. **Note:** You get $5 free credit automatically!

### 🔑 Key #3: Shotstack API Key (FREE)

1. **Go to:** https://shotstack.io
2. **Click** "Sign Up" (free account)
3. **Verify** your email
4. **Go to** Dashboard → API Keys
5. **Copy** your API key
6. **Save it** - you'll need it in Step 3

---

## Step 2: Install Supabase CLI

Open PowerShell or Terminal and run:

```bash
npm install -g supabase
```

Wait for it to install...

---

## Step 3: Login to Supabase

```bash
supabase login
```

This will open your browser. Sign in with your GitHub account.

---

## Step 4: Link Your Project

Your project is already configured! Just link it:

```bash
supabase link --project-ref pqqicydufvgtcnojguee
```

---

## Step 5: Paste Your API Keys (IMPORTANT!)

### Where to Paste: Supabase Secrets

Run these commands one by one, replacing `YOUR_KEY_HERE` with the actual keys you copied:

```bash
# Paste Gemini API Key
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE

# Paste OpenAI API Key  
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE

# Paste Shotstack API Key
supabase secrets set SHOTSTACK_API_KEY=YOUR_SHOTSTACK_KEY_HERE
```

**Example:**
```bash
supabase secrets set GEMINI_API_KEY=AIzaSyAbc123xyz...
supabase secrets set OPENAI_API_KEY=sk-abc123xyz...
supabase secrets set SHOTSTACK_API_KEY=abc123xyz...
```

---

## Step 6: Setup Database

```bash
supabase db push
```

This creates all the database tables.

---

## Step 7: Deploy Functions

```bash
supabase functions deploy
```

This deploys all 4 functions to Supabase.

---

## Step 8: Get Supabase URL and Key (For Frontend)

1. **Go to:** https://supabase.com/dashboard/project/pqqicydufvgtcnojguee
2. **Click** Settings (gear icon) → API
3. **Copy** these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 9: Create Frontend Environment File

Create a file named `.env.local` in the project root:

**File location:** `C:\Users\Lenovo\Downloads\story-weaver-ai\.env.local`

**File content:**
```env
VITE_SUPABASE_URL=https://pqqicydufvgtcnojguee.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_HERE
```

Replace `YOUR_ANON_KEY_HERE` with the anon key you copied in Step 8.

---

## Step 10: Install Dependencies & Run

```bash
# Install packages
npm install

# Start the app
npm run dev
```

The app will open at: **http://localhost:5173**

---

## ✅ Quick Checklist

Before running, make sure you have:

- [ ] Gemini API Key (from Step 1)
- [ ] OpenAI API Key (from Step 1)
- [ ] Shotstack API Key (from Step 1)
- [ ] All 3 keys pasted in Supabase secrets (Step 5)
- [ ] Database pushed (Step 6)
- [ ] Functions deployed (Step 7)
- [ ] `.env.local` file created (Step 9)
- [ ] Dependencies installed (Step 10)

---

## 🆘 If Something Goes Wrong

### "supabase: command not found"
- Make sure you installed it: `npm install -g supabase`
- Restart your terminal

### "Project not found"
- Make sure you're logged in: `supabase login`
- Check the project ID matches

### "Secret not set"
- Make sure you pasted the full key (no spaces)
- Check for typos

### "Functions not deploying"
- Check you're logged in: `supabase status`
- Make sure database is set up first

---

## 🎯 Summary: Where Each Key Goes

| Key | Where to Get | Where to Paste |
|-----|--------------|----------------|
| **Gemini** | https://makersuite.google.com/app/apikey | `supabase secrets set GEMINI_API_KEY=...` |
| **OpenAI** | https://platform.openai.com/api-keys | `supabase secrets set OPENAI_API_KEY=...` |
| **Shotstack** | https://shotstack.io | `supabase secrets set SHOTSTACK_API_KEY=...` |
| **Supabase URL** | Supabase Dashboard → Settings → API | `.env.local` file |
| **Supabase Key** | Supabase Dashboard → Settings → API | `.env.local` file |

---

Ready? Let's start with Step 1! 🚀

