# 📍 Where to Paste Your API Keys - Visual Guide

## 🎯 Quick Answer

**All API keys go here:**
👉 **Supabase Dashboard → Edge Functions → Secrets**

**Frontend keys go here:**
👉 **`.env.local` file in project root**

---

## Step-by-Step with Screenshots Guide

### Part 1: Get Your API Keys

#### 🔑 Key #1: Gemini API Key (FREE)
1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with Google
3. **Click:** "Create API Key"
4. **Copy** the key (starts with `AIzaSy...`)
5. **Name it:** `GEMINI_API_KEY`

#### 🔑 Key #2: OpenAI API Key ($5 Free Credit)
1. **Go to:** https://platform.openai.com/api-keys
2. **Sign up/Login**
3. **Click:** "Create new secret key"
4. **Copy** the key (starts with `sk-...`)
5. **Name it:** `OPENAI_API_KEY`

#### 🔑 Key #3: Shotstack API Key (FREE)
1. **Go to:** https://shotstack.io
2. **Sign up** for free account
3. **Dashboard → API Keys**
4. **Copy** your API key
5. **Name it:** `SHOTSTACK_API_KEY`

---

### Part 2: Paste Keys in Supabase

#### 📍 Location: Supabase Dashboard → Edge Functions → Secrets

**Step-by-step:**

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project (or create one)

2. **Navigate to Secrets:**
   - Click **"Edge Functions"** in left sidebar
   - Click **"Secrets"** tab at the top
   - OR go to: **Settings → Edge Functions → Secrets**

3. **Add Secret #1 - Gemini:**
   ```
   Click "New secret" or "Add secret"
   Name:  GEMINI_API_KEY
   Value: [Paste your Gemini key here]
   Click "Save"
   ```

4. **Add Secret #2 - OpenAI:**
   ```
   Click "New secret"
   Name:  OPENAI_API_KEY
   Value: [Paste your OpenAI key here]
   Click "Save"
   ```

5. **Add Secret #3 - Shotstack:**
   ```
   Click "New secret"
   Name:  SHOTSTACK_API_KEY
   Value: [Paste your Shotstack key here]
   Click "Save"
   ```

**✅ Done!** All 3 keys should now be listed in the Secrets section.

---

### Part 3: Setup Frontend (.env.local file)

#### 📍 Location: Project root folder → `.env.local` file

**Step-by-step:**

1. **Get Supabase credentials:**
   - Go to: Supabase Dashboard → **Settings → API**
   - Copy:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public key** (long string)

2. **Create `.env.local` file:**
   - In your project root folder (`story-weaver-ai`)
   - Create a new file named: `.env.local`
   - Paste this:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

3. **Replace with your actual values:**
   - Replace `https://your-project-id.supabase.co` with your Project URL
   - Replace `your_anon_key_here` with your anon public key

**✅ Done!** Save the file.

---

## 📋 Complete Checklist

### API Keys in Supabase (Edge Functions → Secrets):
- [ ] `GEMINI_API_KEY` = [Your Gemini key]
- [ ] `OPENAI_API_KEY` = [Your OpenAI key]
- [ ] `SHOTSTACK_API_KEY` = [Your Shotstack key]

### Frontend Config (.env.local file):
- [ ] `VITE_SUPABASE_URL` = [Your Supabase project URL]
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = [Your Supabase anon key]

---

## 🎯 Summary Table

| What | Where to Get | Where to Paste | File/Location |
|------|--------------|----------------|---------------|
| **Gemini Key** | https://makersuite.google.com/app/apikey | Supabase → Edge Functions → Secrets | Name: `GEMINI_API_KEY` |
| **OpenAI Key** | https://platform.openai.com/api-keys | Supabase → Edge Functions → Secrets | Name: `OPENAI_API_KEY` |
| **Shotstack Key** | https://shotstack.io | Supabase → Edge Functions → Secrets | Name: `SHOTSTACK_API_KEY` |
| **Supabase URL** | Supabase Dashboard → Settings → API | `.env.local` file | Variable: `VITE_SUPABASE_URL` |
| **Supabase Key** | Supabase Dashboard → Settings → API | `.env.local` file | Variable: `VITE_SUPABASE_PUBLISHABLE_KEY` |

---

## 🚀 After Pasting Keys

Once all keys are pasted:

1. **Run database migrations** (in Supabase Dashboard → SQL Editor)
2. **Deploy Edge Functions** (in Supabase Dashboard → Edge Functions)
3. **Start the app:**
   ```bash
   npm run dev
   ```

---

## 🆘 Need Help?

**Can't find Edge Functions Secrets?**
- Try: Settings → Edge Functions → Secrets
- Or: Project → Edge Functions → Secrets tab

**Can't find .env.local?**
- Create it in the root folder (same folder as `package.json`)
- Make sure it's named exactly: `.env.local` (not `.env`)

**Keys not working?**
- Make sure names are EXACT: `GEMINI_API_KEY` (case-sensitive)
- Check for extra spaces when pasting
- Verify keys are valid (test them at their respective websites)

---

**✅ Once all keys are pasted, you're ready to run the app!**

